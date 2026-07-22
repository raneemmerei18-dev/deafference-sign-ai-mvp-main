// services/grammarTranslationService.ts
//
// BE-10: turns a stabilized array of sign-language glosses (e.g.
// ["hello", "hungry"]) into a natural English sentence. Tries a
// configured LLM provider first (grammar_eval); if none is configured, it
// errors, or it doesn't respond within the timeout, falls back to a
// deterministic rule-based translator so the endpoint never hard-fails.
import { SentenceSource } from '../types/sentence';

// ---------------------------------------------------------------------
// grammar_eval system prompt — the anti-fabrication contract every AI
// provider call is bound to. Function words needed for fluent English
// (articles, the implied ASL null-subject "I", copulas, punctuation) are
// allowed; anything that isn't already present in the glosses is not.
// ---------------------------------------------------------------------
export const GRAMMAR_EVAL_SYSTEM_PROMPT = `You are "grammar_eval", a sign-language gloss-to-English grammar translator for an assistive communication tool. You are given an ordered list of glosses: individual signed words/concepts, in the order they were signed.

Your ONLY job is to rewrite these glosses as natural, grammatically correct English that a fluent speaker would use to express the same meaning.

STRICT ANTI-FABRICATION RULES:
- Do NOT invent, assume, or add any fact, name, number, object, place, time, or detail that is not directly present in the given glosses.
- You MAY add grammatical function words needed for fluency: articles (a, an, the), pronouns implied by ASL's null-subject grammar (typically "I" when no subject is signed), copulas/auxiliary "to be" verbs (am, is, are), prepositions, and punctuation.
- You MAY reorder glosses to fix English word order (e.g. ASL time-topic-comment structure into English subject-verb-object), but every content word from the glosses must still be represented in your output. Do not drop any of them.
- If the glosses are ambiguous or incomplete, translate them as literally and conservatively as possible rather than guessing at missing context.
- Never respond with anything other than the translated sentence(s) — no preamble, no explanation, no markdown, no quotes around the output.

Return ONLY the translated sentence text.`;

interface TranslationResult {
  sentence: string;
  source: SentenceSource;
}

type Provider = 'openai' | 'anthropic' | 'gemini';

// ---------------------------------------------------------------------
// Deterministic rule-based fallback
//
// Not true NLG — a small, explainable heuristic: greetings/interjections
// become their own exclamation, and any remaining run of glosses gets an
// implied first-person subject + "to be" copula when it doesn't already
// start with a pronoun (mirroring ASL's null-subject grammar, the same
// structural allowance the AI prompt above grants itself). It never adds
// content words, so it satisfies the same anti-fabrication contract.
// ---------------------------------------------------------------------
const GREETINGS = new Set(['hello', 'hi', 'hey', 'goodbye', 'bye', 'thanks', 'please', 'sorry']);
const PRONOUNS = new Set(['i', 'you', 'he', 'she', 'we', 'they', 'it']);
const BE_VERB: Record<string, string> = {
  i: 'am',
  you: 'are',
  he: 'is',
  she: 'is',
  it: 'is',
  we: 'are',
  they: 'are',
};

function capitalize(text: string): string {
  return text.length ? text[0].toUpperCase() + text.slice(1) : text;
}

export function translateGlossesWithRules(glosses: string[]): string {
  const words = glosses.map((g) => g.trim().toLowerCase()).filter(Boolean);
  if (words.length === 0) return '';

  const segments: string[][] = [];
  let current: string[] = [];
  for (const word of words) {
    if (GREETINGS.has(word)) {
      if (current.length) {
        segments.push(current);
        current = [];
      }
      segments.push([word]);
    } else {
      current.push(word);
    }
  }
  if (current.length) segments.push(current);

  const sentences = segments.map((segment) => {
    if (segment.length === 1 && GREETINGS.has(segment[0])) {
      return `${capitalize(segment[0])}!`;
    }

    const hasPronoun = PRONOUNS.has(segment[0]);
    const pronoun = hasPronoun ? segment[0] : 'i';
    const rest = hasPronoun ? segment.slice(1) : segment;
    const beVerb = BE_VERB[pronoun] ?? 'is';
    const sentenceWords = rest.length > 0 ? [pronoun, beVerb, ...rest] : [pronoun];

    return `${capitalize(sentenceWords.join(' '))}.`;
  });

  return sentences.join(' ');
}

// ---------------------------------------------------------------------
// AI provider dispatch
// ---------------------------------------------------------------------
const AI_TIMEOUT_MS = Number(process.env.SENTENCE_AI_TIMEOUT_MS) || 6000;

function getConfiguredProvider(): Provider | 'none' {
  const explicit = process.env.LLM_PROVIDER?.toLowerCase();
  if (explicit === 'openai' || explicit === 'anthropic' || explicit === 'gemini') {
    return explicit;
  }
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.GEMINI_API_KEY) return 'gemini';
  return 'none';
}

async function callOpenAI(glosses: string[], signal: AbortSignal): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      messages: [
        { role: 'system', content: GRAMMAR_EVAL_SYSTEM_PROMPT },
        { role: 'user', content: JSON.stringify(glosses) },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI request failed with status ${res.status}`);
  }

  const body = await res.json();
  const text = body?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('OpenAI response did not contain a sentence');
  return text;
}

async function callAnthropic(glosses: string[], signal: AbortSignal): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured');
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 300,
      temperature: 0,
      system: GRAMMAR_EVAL_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: JSON.stringify(glosses) }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Anthropic request failed with status ${res.status}`);
  }

  const body = await res.json();
  const text = body?.content?.[0]?.text?.trim();
  if (!text) throw new Error('Anthropic response did not contain a sentence');
  return text;
}

async function callGemini(glosses: string[], signal: AbortSignal): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: GRAMMAR_EVAL_SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: JSON.stringify(glosses) }] }],
        generationConfig: { temperature: 0 },
      }),
    },
  );

  if (!res.ok) {
    throw new Error(`Gemini request failed with status ${res.status}`);
  }

  const body = await res.json();
  const text = body?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error('Gemini response did not contain a sentence');
  return text;
}

const PROVIDER_CALLERS: Record<Provider, (glosses: string[], signal: AbortSignal) => Promise<string>> = {
  openai: callOpenAI,
  anthropic: callAnthropic,
  gemini: callGemini,
};

/**
 * Translates an ordered gloss array into a sentence. Tries the configured
 * AI provider first (bounded by AI_TIMEOUT_MS); any missing config,
 * non-2xx response, timeout, or empty completion falls back to the
 * deterministic rule-based translator, which never throws.
 */
export async function translateGlossesToSentence(glosses: string[]): Promise<TranslationResult> {
  const cleaned = glosses.map((g) => (typeof g === 'string' ? g.trim() : '')).filter(Boolean);
  if (cleaned.length === 0) {
    return { sentence: '', source: 'rules' };
  }

  const provider = getConfiguredProvider();
  if (provider !== 'none') {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
    try {
      const sentence = await PROVIDER_CALLERS[provider](cleaned, controller.signal);
      if (sentence) {
        return { sentence, source: 'ai' };
      }
    } catch (err) {
      console.warn(`[sentence] AI provider "${provider}" failed, falling back to rules.`, err);
    } finally {
      clearTimeout(timeout);
    }
  }

  return { sentence: translateGlossesWithRules(cleaned), source: 'rules' };
}
