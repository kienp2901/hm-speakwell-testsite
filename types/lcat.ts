export type Result = {
  pronunciation: LcatResult;
  fluency: FluencyResult;
  metadata: MetadataResult;
  overall: {
    english_proficiency_scores: EnglishProficiencyScores | any;
  };
};

export type LcatResult = {
  pronunciation: {
    words: LcatWord[];
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
    content_relevance: number;
    content_relevance_feedback: string;
  };
  warnings: any;
};

export type LcatWord = {
  word_text: string;
  phonemes: LcatPhonemes[];
  word_score: number;
};

export type LcatPhonemes = {
  ipa_label: string;
  phoneme_score: number;
};

export type FluencyResult = {
  overall_score: number;
  english_proficiency_scores: EnglishProficiencyScores | any;
  metrics: {
    speech_rate: number;
    pauses: number;
    filler_words: number;
    filler_words_per_min: number;
    speech_rate_over_time: number[];
  };
  feedback: Feedback;
  warnings: any;
};

export type OverallResult = {
  english_proficiency_scores: EnglishProficiencyScores | any;
};

export type EnglishProficiencyScores = {
  mock_ielts: {
    prediction: number;
  };
  mock_cefr: {
    prediction: string;
  };
  mock_pte: {
    prediction: number;
  };
};

export type SkillResult = {
  fluency?: number;
  vocabulary?: number;
  grammar?: number;
  pronunciation?: number;
};

export type MetadataResult = {
  predicted_text: string;
};

export type LowestPhonemes = {
  ipa_label: string;
  phoneme_score: number;
};

export type Feedback = {
  speech_rate: FeedbackContent;
  pauses: FeedbackContent;
  filler_words: FeedbackContent;
  filler_words_per_min: FeedbackContent;
  tagged_transcript: string;
};

export type FeedbackContent = {
  feedback_code: string;
  feedback_text: string;
};

export type TestResult = {
  text: string;
  pronunciation: number;
  fluency: number;
  overall: number;
};

