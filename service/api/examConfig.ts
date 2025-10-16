import { createService } from 'service/axios';

const BASE_URL = process.env.API_BASE_URL;

const instance = createService(BASE_URL);

interface FormField {
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

interface CreateUserFormData {
  [key: string]: string | number | undefined;
}

interface CreateUserResponse {
  data: {
    student_id: number;
    access_token: string;
    contest_type: number;
    idMockContest: number;
  };
}

interface ValidateTokenResponse {
  data: {
    status: boolean;
    'x-api-key': string;
    'x-api-key-refresh': string;
  };
}

interface MockContestInfo {
  data: {
    data: any;
  };
}

interface MockContestHistory {
  data: {
    data: any[];
  };
}

interface StartMockContestParams {
  contest_type: number;
  idMockContest: number;
}

interface StartMockContestResponse {
  data: {
    data: {
      idHistoryContest: number;
      mockcontests: any;
    };
  };
}

interface ExamPartStartResponse {
  data: {
    status: boolean;
    data: {
      [x: string]: any;
      idHistory: number;
      listQuestion: any[];
      baikiemtra: any;
      timeAllow: number;
    };
  };
  status: number;
}

interface ExamPartContinueResponse {
  data: {
    status: boolean;
    data: {
      listQuestion: any[];
      listUserAnswer: any[];
      baikiemtra: any;
      timeAllow: number;
    };
  };
  status: number;
}

interface ExamPartSubmitParams {
  idHistory: string;
  idMockContest: number;
  idbaikiemtra: number;
  contest_type_id: number;
  skill?: number;
  task_number?: number;
  listUserAnswer: any[];
}

interface ExamPartSubmitResponse {
  data: {
    [x: string]: any;
    data: {
      history_id: number;
    };
  };
  status: number;
}

interface HistoryDetailResponse {
  data: {
    message: string;
    status: number;
    data?: any;
    metadata?: any;
  };
  status: number;
}

// Get Config Exam - Dynamic form fields
export const getConfigExamApi = async (
  campaignCode: string,
  slug: string
): Promise<{ data: FormField[] }> => {
  const response = await instance.post<FormField[]>(`get-config-exam`, {
    campaign_code: campaignCode,
    slug: slug,
  });
  return response;
};

// Create User - Submit form data with dynamic fields
export const createUserApi = async (
  formData: CreateUserFormData
): Promise<CreateUserResponse> => {
  const response = await instance.post<CreateUserResponse['data']>(`create-user`, formData);
  return response as CreateUserResponse;
};

// Validate Token - Get EMS API keys
export const validateTokenApi = async (
  accessToken: string
): Promise<ValidateTokenResponse> => {
  const response = await instance.get<ValidateTokenResponse['data']>(
    `fe/ems/v1/auth/sso/lmsnew_testsite/validate_token`
  );
  return response as ValidateTokenResponse;
};

export const getMockcontestInfoApi = async (
  idMockContest: number,
  contest_type: number
): Promise<MockContestInfo> => {
  const response = await instance.get(
    `fe/ems/v1/lmsnew1/mockcontest?idMockContest=${idMockContest}&contest_type=${contest_type}`
  );
  return response as MockContestInfo;
};

export const getMockcontestHistoryApi = async (
  params: { contest_type?: string | number; idMockContest: number; idHistoryContest?: string }
): Promise<MockContestHistory> => {
  const response = await instance.post(
    `fe/ems/v1/lmsnew_testsite/mockcontest/session/history`,
    params
  );
  return response as MockContestHistory;
};

export const startMockcontestApi = async (
  params: StartMockContestParams
): Promise<StartMockContestResponse> => {
  const response = await instance.post<StartMockContestResponse['data']>(
    `fe/ems/v1/lmsnew_testsite/mockcontest/session/start`,
    params
  );
  return response as StartMockContestResponse;
};

// Start exam part (round) - Get questions
export const postExamPartStartApi = async (
  idBaikiemtra: number,
  idHistoryContest: string,
  contest_type: number
): Promise<ExamPartStartResponse> => {
  const response = await instance.post(
    `fe/ems/v1/exam/start`,
    {
      idBaikiemtra,
      idHistoryContest,
      contest_type,
    }
  );
  return response as ExamPartStartResponse;
};

// Continue exam part - Get questions for resumed exam
export const postExamPartContinueApi = async (
  idHistory: string | number,
  contest_type: number
): Promise<ExamPartContinueResponse> => {
  const response = await instance.post(
    `fe/ems/v1/exam/continue`,
    { idHistory, contest_type }
  );
  return response as ExamPartContinueResponse;
};

// Submit exam part
export const postExamPartSubmit = async (
  params: ExamPartSubmitParams
): Promise<ExamPartSubmitResponse> => {
  const response = await instance.post(`fe/ems/v1/lmsnew_testsite/exam/submit`, params);
  return response as ExamPartSubmitResponse;
};

// Save exam progress
export const postExamPartSave = async (params: any): Promise<any> => {
  const response = await instance.post(`fe/ems/v1/exam/save`, params);
  return response;
};

// Pause exam
export const postExamPartPause = async (params: any): Promise<any> => {
  const response = await instance.post(`fe/ems/v1/exam/pause`, params);
  return response;
};

// Stop exam
export const postExamPartStopApi = async (idHistoryContest: string): Promise<any> => {
  const response = await instance.post(`fe/ems/v1/lmsnew1/mockcontest/session/stop`, {
    idHistoryContest,
  });
  return response;
};

// Upload audio file for Speaking questions
export const uploadAudioFileApi = async (params: any): Promise<any> => {
  const response = await instance.post(`fe/ems/v1/exam/save/audioLcat/base64`, params);
  return response;
};

// Get history detail
export const getHistoryDetail = async (idHistory: string | number): Promise<HistoryDetailResponse> => {
  const response = await instance.get(`fe/ems/v1/exam/history?idHistory=${idHistory}`);
  return response as HistoryDetailResponse;
};

// Get history part detail
export const getHistoryPartDetail = async (idHistory: string | number): Promise<HistoryDetailResponse> => {
  const response = await instance.get(`v1/exam/history/part/${idHistory}`);
  return response as HistoryDetailResponse;
};

// Send to examiner
export const sendToExaminerApi = async (idHistory: string | number): Promise<any> => {
  const response = await instance.post(`v1/exam/request-examiner/${idHistory}`, {});
  return response;
};

// Get exam history
export const getExamHistoryApi = async (params: any): Promise<any> => {
  const response = await instance.get(`v1/user/exam-history?${params}`);
  return response;
};

