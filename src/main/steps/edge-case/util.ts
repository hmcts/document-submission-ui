import axios, { AxiosInstance } from 'axios';
import config from 'config';

import { getServiceAuthToken } from '../../app/auth/service/get-service-auth-token';
import { AppRequest } from '../../app/controller/AppRequest';
import { AnyObject } from '../../app/controller/PostController';

export const getUploadDocumentInstance = (req: AppRequest<AnyObject>): AxiosInstance => {
  return axios.create({
    baseURL: config.get('services.cos.url'),
    headers: {
      Authorization: `Bearer ${req.session.user['accessToken']}`,
      ServiceAuthorization: 'Bearer ' + getServiceAuthToken(),
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
};

export const  getEnumKeyByValue = (enumObj:any, value: string | undefined ) : string | undefined => {
  return Object.keys(enumObj).find(key => enumObj[key] === value);
}
