// routes/sentenceRoutes.ts
import { Router } from 'express';
import { validateSentencePayload } from '../middleware/validators';
import { createSentence } from '../controllers/sentenceController';

const router = Router();

/**
 * POST /api/sentence
 * Translate an ordered array of sign-language glosses into a natural
 * English sentence via the configured LLM provider, with a deterministic
 * rule-based fallback (source: "rules") if no provider is configured, it
 * errors, or it times out.
 * @param {string[]} glosses - Ordered gloss words, e.g. ["hello", "hungry"]
 */
router.post('/', validateSentencePayload, createSentence);

export default router;
