import { AxiosResponse } from 'axios';
import { createService } from '@/service/axios';
import {
  BrowserSignatureResponse,
  SettingsResponse,
  ContactData,
  MockTestResponse,
  SessionStartRequest,
  SessionHistoryRequest,
  SessionStopRequest,
  ExamStartRequest,
  ExamContinueRequest,
  ExamSaveData,
  ExamSubmitData,
  ExamHistoryRequest,
  SendEmailResultRequest,
  ApiResponse,
} from '@/types';

const BASE_URL = process.env.BASE_URL;

const instance = createService(BASE_URL);

// Browser Signature
export const getBrowserSignatureApi = async (): Promise<AxiosResponse<ApiResponse<BrowserSignatureResponse>>> => {
  const response = await instance.get('api/v1/test-site/signature');
  return response;
};

// Get Settings
export const getSettingsApi = async (): Promise<AxiosResponse<ApiResponse<SettingsResponse>>> => {
  const response = await instance.get('api/v1/test-site/settings');
  return response;
};

// Submit Contact
export const submitContactApi = async (data: ContactData): Promise<AxiosResponse<ApiResponse>> => {
  const response = await instance.post(`api/v1/test-site/contact/submit`, data);
  return response;
};

// get mocktest
export const getMocktestApi = async (studentId: string): Promise<AxiosResponse<ApiResponse<MockTestResponse>>> => {
  const response = await instance.get(
    `api/v1/test-site/mockcontest?student_id=${studentId}`,
  );
  return response;
};

// session start
export const sessionStartApi = async (
  studentId: string,
  idMockContest: string | null
): Promise<AxiosResponse<ApiResponse>> => {
  const response = await instance.post(
    `api/v1/test-site/mockcontest/session/start?student_id=${studentId}`,
    {
      idMockContest: idMockContest,
    },
  );
  return response;
};

// session history
export const sessionHistoryApi = async (
  studentId: string,
  idMockContest: string | null,
  idHistoryContest: string,
): Promise<AxiosResponse<ApiResponse>> => {
  const response = await instance.post(
    `api/v1/test-site/mockcontest/session/history?student_id=${studentId}`,
    {
      idMockContest: idMockContest,
      idHistoryContest: idHistoryContest,
    },
  );
  return response;
};

// session stop
export const sessionStopApi = async (
  studentId: string,
  idHistoryContest: string
): Promise<AxiosResponse<ApiResponse>> => {
  const response = await instance.post(
    `api/v1/test-site/mockcontest/session/stop?student_id=${studentId}`,
    {
      idHistoryContest: idHistoryContest,
    },
  );
  return response;
};

// exam start
export const examStartApi = async (
  studentId: string,
  idHistoryContest: string,
  idBaikiemtra: string | null,
): Promise<AxiosResponse<ApiResponse>> => {
  const response = await instance.post(
    `api/v1/test-site/exam/start?student_id=${studentId}`,
    {
      idHistoryContest: idHistoryContest,
      idBaikiemtra: idBaikiemtra,
    },
  );
  return response;
};

// exam continue
export const examContinueApi = async (
  studentId: string,
  idHistory: string
): Promise<AxiosResponse<ApiResponse>> => {
  const response = await instance.post(
    `api/v1/test-site/exam/continue?student_id=${studentId}`,
    {
      idHistory: idHistory,
    },
  );
  return response;
};

// exam save
export const examSaveApi = async (
  studentId: string,
  data: ExamSaveData
): Promise<AxiosResponse<ApiResponse>> => {
  const response = await instance.post(
    `api/v1/test-site/exam/save?student_id=${studentId}`,
    data,
  );
  return response;
};

// exam submit
export const examSubmitApi = async (
  studentId: string,
  data: ExamSubmitData
): Promise<AxiosResponse<ApiResponse>> => {
  const response = await instance.post(
    `api/v1/test-site/exam/submit?student_id=${studentId}`,
    data,
  );
  return response;
};

// exam history
export const examHistoryApi = async (
  studentId: string,
  idHistory: string
): Promise<AxiosResponse<ApiResponse>> => {
  const response = await instance.post(
    `api/v1/test-site/exam/history?student_id=${studentId}`,
    {
      idHistory: idHistory,
    },
  );
  return response;
};

//send Email
export const sendEmailResultApi = async (
  studentId: string,
  idHistory: string,
  idMockContest: string | null,
  historyContestId: string,
): Promise<AxiosResponse<ApiResponse>> => {
  const response = await instance.post(
    `api/v1/test-site/exam/sendmail?student_id=${studentId}`,
    {
      idHistory,
      idMockContest,
      historyContestId,
    },
  );
  return response;
};

