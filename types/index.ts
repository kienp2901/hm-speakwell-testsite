export * from './Notify';

// Common types
export interface ApiResponse<T = any> {
  data?: T;
  status?: number;
  message?: string;
  success?: boolean;
  metadata?: T;
}

// Auth types
export interface AuthState {
  userToken: string;
  dataSignature: string;
  accessToken: string; // Bearer token from create-user API
  emsToken: string; // x-api-key from validate_token API
  emsRefreshToken: string; // x-api-key-refresh from validate_token API
}

// Exam Info types
export interface UserAnswer {
  questionId?: string | number;
  answer?: any; // TODO: refine type based on question type
  [key: string]: any;
}

export interface FormField {
  id: number;
  key: string;
  value: string;
  field_name: string;
  placeholder: string;
  input_type: string;
  is_required: boolean;
  required_message: string;
  deleted_at: string | null;
  [key: string]: any;
}

export interface ExamRound {
  test_format: number;
  name: string;
  id: number;
  round_id: number;
  [key: string]: any;
}

export interface ExamData {
  contest_type?: number;
  submitType?: number;
  rounds?: ExamRound[];
  quiz_id?: number;
  [key: string]: any;
}

export interface ExamInfoState {
  numberListen: number;
  isModalInfo: boolean;
  studentId: string;
  idMockContest: string | null;
  idHistoryContest: string;
  idBaikiemtraListening: string | null;
  idBaikiemtraRW: string | null;
  idHistory: string | null;
  listUserAnswer: UserAnswer[];
  listUserAnswerDraft: UserAnswer[];
  listUserAudio: any[];
  contestType?: number;
  formConfig?: FormField[];
  dataExam?: ExamData;
  idHistoryRoundExam?: string | number | null;
  cursorCustom?: number;
  fontSize?: number;
  userData?: any;
}

// API Request/Response types
export interface BrowserSignatureResponse {
  signature?: string;
  [key: string]: any;
}

export interface SettingsResponse {
  [key: string]: any;
}

export interface ContactData {
  name?: string;
  email?: string;
  message?: string;
  [key: string]: any;
}

export interface MockTestResponse {
  idMockContest?: string;
  [key: string]: any;
}

export interface SessionStartRequest {
  idMockContest: string | null;
}

export interface SessionHistoryRequest {
  idMockContest: string | null;
  idHistoryContest: string;
}

export interface SessionStopRequest {
  idHistoryContest: string;
}

export interface ExamStartRequest {
  idHistoryContest: string;
  idBaikiemtra: string | null;
}

export interface ExamContinueRequest {
  idHistory: string;
}

export interface ExamSaveData {
  idHistory?: string;
  answers?: UserAnswer[];
  [key: string]: any;
}

export interface ExamSubmitData {
  idHistory?: string;
  answers?: UserAnswer[];
  [key: string]: any;
}

export interface ExamHistoryRequest {
  idHistory: string;
}

export interface SendEmailResultRequest {
  idHistory: string;
  idMockContest: string | null;
  historyContestId: string;
}

// Question types
export interface Question {
  id?: string | number;
  type?: string;
  content?: string;
  options?: any[];
  correctAnswer?: any;
  [key: string]: any;
}

// Component Props types
export interface BaseComponentProps {
  children?: React.ReactNode;
  className?: string;
}

// Notification types
export interface NotifyOptions {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  autoClose?: number;
}

