export const questionEnumType = {
  ESSAY: 0,
  ONE_RIGHT: 1,
  MULTIPLE_RIGHT: 2,
  YES_NO: 3,
  SHORT: 4,
  PAIR: 5,
  READING: 6,
  FILL_BLANK: 7,
  SORT: 8,
  ELSASPEAKING: 9,
  MULTIPLE_YES_NO_ONE_RIGHT: 10,
  MULTIPLE_YES_NO_MULTIPLE_RIGHT: 11,
  DRAG_DROP: 12,
  DROPDOWN: 14,
} as const;

export const AnswerType = {
  TEXT: 0,
  IMAGE: 1,
  AUDIO: 2,
  VIDEO: 4,
} as const;

export const testType = {
  STATIC: 0,
  DYNAMIC: 1,
  CONDITIONS: 2,
} as const;

export const TypeReturnResult = {
  returnPoint: 0,
  returnPointAnswer: 1,
  returnPointAnswerTrue: 2,
  returnGuide: 3,
} as const;

export type QuestionEnumType = typeof questionEnumType[keyof typeof questionEnumType];
export type AnswerTypeValue = typeof AnswerType[keyof typeof AnswerType];
export type TestType = typeof testType[keyof typeof testType];
export type TypeReturnResultValue = typeof TypeReturnResult[keyof typeof TypeReturnResult];

