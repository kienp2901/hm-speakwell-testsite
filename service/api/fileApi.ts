import { createService } from 'service/axios';

const API_URL_ADMIN = process.env.API_URL_ADMIN;

const instance = createService(API_URL_ADMIN, 'multipart/form-data');

export const apiUploadFile = async (params: { formData: any }) => {
  const response = await instance.post(
    '/upload/image/single/',
    params.formData,
  );
  return response.data;
};
