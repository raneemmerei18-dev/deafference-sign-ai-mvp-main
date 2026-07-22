// controllers/sentenceController.ts
import { Response } from 'express';
import { ValidatedSentenceRequest } from '../middleware/validators';
import { translateGlossesToSentence } from '../services/grammarTranslationService';
import { SentenceErrorResponse, SentenceSuccessResponse } from '../types/sentence';

export const createSentence = async (
  req: ValidatedSentenceRequest,
  res: Response<SentenceSuccessResponse | SentenceErrorResponse>
): Promise<void> => {
  const glosses = req.validatedGlosses ?? [];

  try {
    const { sentence, source } = await translateGlossesToSentence(glosses);

    res.status(200).json({
      sentence,
      glosses,
      source,
    });
  } catch (error) {
    console.error('Sentence translation error:', error);

    res.status(500).json({
      success: false,
      error: {
        code: 'TRANSLATION_ERROR',
        message: 'Failed to translate glosses into a sentence. Please try again later.',
      },
    });
  }
};
