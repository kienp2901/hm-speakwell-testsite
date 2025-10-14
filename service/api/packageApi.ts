/* eslint-disable object-shorthand */
import { LocalStorageService } from '@/services';
import { createService } from '@/service/axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || '';
const instance = createService(API_BASE);

// old flow
export const getPackageOverviewApi = async (params: any) => {
  const response = await instance.get(`v1/packages/overview?${params}`);
  return response;
};

export const getPackageLibraryApi = async () => {
  const response = await instance.get(`v1/packages/library`);
  return response;
};

// new flow
export const getActivityInfoApi = async (params: any) => {
  const response = await instance.post(`fe/ems/get-data-mocktest`, params, {
    headers: {
      Authorization:
        'Bearer ' +
        LocalStorageService.get(LocalStorageService.ICAN_AUTH_TOKEN),
    },
  });
  return response;
};

export const getMockcontestInfoApi = async (
  idMockContest: any,
  contest_type: any,
) => {
  const response = await instance.get(
    `fe/ems/v1/lmsnew1/mockcontest?idMockContest=${idMockContest}&contest_type=${contest_type}`,
    {
      headers: {
        Accept: 'application/json, text/*, */*',
        'Content-Type': 'application/json',
        'x-api-key': LocalStorageService.get(LocalStorageService.EMS_TOKEN) as string,
      },
    },
  );
  return response;
};

export const getMockcontestHistoryApi = async (params: {
  contest_type?: string | number;
  idMockContest: number;
  idHistoryContest?: string;
}) => {
  const response = await instance.post(
    `fe/ems/v1/lmsnew1/mockcontest/session/history`,
    params,
    {
      headers: {
        Accept: 'application/json, text/*, */*',
        'Content-Type': 'application/json',
        'x-api-key': LocalStorageService.get(LocalStorageService.EMS_TOKEN) as string,
        Authorization:
          'Bearer ' +
          LocalStorageService.get(LocalStorageService.ICAN_AUTH_TOKEN),
      },
    },
  );
  return response;
};

export const getMockcontestScoreTopApi = async (quiz_id: number) => {
  const response = await instance.get(
    `fe/student/show_score?quiz_id=${quiz_id}`,
    {
      headers: {
        Authorization:
          'Bearer ' +
          LocalStorageService.get(LocalStorageService.ICAN_AUTH_TOKEN),
      },
    },
  );
  return response;
};

