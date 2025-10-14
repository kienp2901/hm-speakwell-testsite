export enum questionEnumType {
  ESSAY = 0,
  ONE_RIGHT = 1,
  MULTIPLE_RIGHT = 2,
  YES_NO = 3,
  SHORT = 4,
  PAIR = 5,
  READING = 6,
  FILL_BLANK = 7,
  SORT = 8,
  ELSASPEAKING = 9,
  MULTIPLE_YES_NO_ONE_RIGHT = 10,
  MULTIPLE_YES_NO_MULTIPLE_RIGHT = 11,
  DRAG_DROP = 12,
  SPEAKING = 13,
  DROPDOWN = 14,
  SPEAKING_SCRIPT = 16,
}

export enum AnswerType {
  TEXT = 0,
  IMAGE = 1,
  AUDIO = 2,
  VIDEO = 4,
}

export enum TypeReturnResult {
  returnPoint = 0,
  returnPointAnswer = 1,
  returnPointAnswerTrue = 2,
  returnGuide = 3,
}

export enum ExamType {
  Practice = 2,
  Exam = 3,
}

export enum TestType {
  Listening = 13,
  Reading = 14,
  Writing = 15,
  Speaking = 16,
}

export enum CursorType {
  Default = 0,
  Eraser = 1,
  BrushYellow = 2,
  BrushGreen = 3,
  BrushBlue = 4,
  Comment = 5,
}

export const FEEDBACK_TABS = [
  // {
  //   title: 'Content Relevance',
  //   key: 'content',
  // },
  {
    title: 'Fluency',
    key: 'fluency',
  },
  {
    title: 'Vocabulary',
    key: 'vocabulary',
  },
  {
    title: 'Grammar',
    key: 'grammar',
  },
  {
    title: 'Pronunciation',
    key: 'pronunciation',
  },
];

export const MODAL_ANSWER_TABS = [
  {
    title: 'Model Answer',
    key: 'modalAnswer',
  },
];

export const listTabAIWriting = [
  {
    title: 'Vocabulary & Grammar Correction',
    key: 'vocabulary',
  },
  {
    title: 'Task Response',
    key: 'task-response',
  },
  {
    title: 'Coherence & Cohesion',
    key: 'coherence',
  },
  {
    title: 'Lexical Resource',
    key: 'lexical',
  },
  {
    title: 'Grammatical Range & Accuracy',
    key: 'grammatical',
  },
  {
    title: 'Improved Essay',
    key: 'improved',
  },
  {
    title: 'Model Answer',
    key: 'model-answer',
  },
];

export const activityType = {
  QUIZ: 'quiz',
  ASSIGNMENT: 'assign',
  FORUM: 'forum',
  SCORM: 'scorm',
  PAGE: 'page',
  RESOURCE: 'resource',
  URL: 'url',
  LESSON: 'lesson',
  VIDEO: 'cmsvideo',
  H5P: 'cmsh5ptool',
};
