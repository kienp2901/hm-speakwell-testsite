// Question-related type definitions

export interface SelectOption {
  answer_id: string | number;
  answer_content: string;
  answer_image?: string;
  [key: string]: any;
}

export interface ChildQuestion {
  idChildQuestion: string | number;
  quiz_type?: number;
  text?: string;
  image?: string;
  audio?: string;
  listSelectOptions?: SelectOption[];
  answer?: any;
  [key: string]: any;
}

export interface QuestionData {
  idQuestion: string | number;
  idChildQuestion?: string | number;
  quiz_type: number;
  text?: string;
  image?: string;
  audio?: string;
  listSelectOptions?: SelectOption[];
  listChildQuestion?: ChildQuestion[];
  answer?: any;
  [key: string]: any;
}

export interface UserAnswerChild {
  idChildQuestion: string | number;
  answer: any;
}

export interface UserAnswerData {
  idQuestion: string | number;
  quiz_type: number;
  answer: any[] | any;
}

