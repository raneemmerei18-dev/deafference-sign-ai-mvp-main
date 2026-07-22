// types/sentence.ts
export type SentenceSource = 'ai' | 'rules';

export interface SentenceRequest {
  glosses: string[];
}

export interface SentenceSuccessResponse {
  sentence: string;
  glosses: string[];
  source: SentenceSource;
}

export interface SentenceErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
