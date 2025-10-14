import { EnglishProficiencyScores, FluencyResult, LowestPhonemes } from './lcat';

export type IeltsResult = {
  pronunciation: {
    words: IeltsWord[];
    overall_score: number;
    expected_text: string;
    english_proficiency_scores: EnglishProficiencyScores | any;
    warnings?: any;
    lowest_scoring_phonemes: LowestPhonemes[];
  };
  fluency: FluencyResult;
  overall: {
    english_proficiency_scores: EnglishProficiencyScores | any;
  };
  metadata: {
    predicted_text: string;
    content_relevance: string;
    content_relevance_feedback: string;
  };
  warnings: any;
  vocabulary: VocabularyResult;
  grammar: GrammarResult;
  nextQuestion?: string;
};

export type IeltsWord = {
  word_text: string;
  phonemes: IeltsPhonemes[];
  word_score: number;
};

export type IeltsPhonemes = {
  ipa_label: string;
  phoneme_score: number;
};

export type GrammarMetrics = {
  mistake_count: number;
  grammatical_complexity: string;
};

export type GrammarFeedback = {
  grammar_errors: Array<{
    mistake: string;
    correction: string;
    start_index: number;
    end_index: number;
  }>;
};

export type GrammarResult = {
  overall_score: number;
  english_proficiency_scores: EnglishProficiencyScores | any;
  metrics: GrammarMetrics;
  feedback: GrammarFeedback;
  warnings?: any;
};

export type VocabularyMetrics = {
  vocabulary_complexity: string;
};

export type VocabularyResult = {
  overall_score: number;
  english_proficiency_scores: EnglishProficiencyScores | any;
  metrics: VocabularyMetrics;
  warnings?: any;
};

export type Metrics = {
  speech_rate?: number;
};

