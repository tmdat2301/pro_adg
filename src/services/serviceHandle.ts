import { create } from 'apisauce';
import serviceUrls from './serviceUrls';
import _ from 'lodash';
import env from '@config/env';
const api = create({
  baseURL: 'https://adgstaging.api.oncrm.asia',
  timeout: 60000,
  headers: {
    'content-type': 'application/json',
    crm_application_tenant: 'adgstaging.oncrm.asia',
    'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
  },
});

/**
 * process return data
 * @param {*} response
 */
const returnData = (response: any) => {
  console.log('returnData', response);
  let errorMessage = '';
  if (serviceUrls.statusCode.success.includes(response.status)) {
    return {
      response: response.data,
      error: false,
    };
  }
  if (serviceUrls.statusCode.auth.includes(response.status)) {
    errorMessage = 'Invalid token';
  } else if (_.isNull(response.data)) {
    errorMessage = response.problem;
  } else if (serviceUrls.statusCode.notFound.includes(response.status)) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    errorMessage = `${response.data.message ? response.data.message : response.data}`;
  } else if (serviceUrls.statusCode.error.includes(response.status)) {
    errorMessage = response.problem;
  } else {
    errorMessage = response.data.problem;
  }
  if (response.data?.error?.message) {
    errorMessage = response.data?.error?.message;
  }
  if (response.data?.error && response.data?.error?.validationErrors) {
    if (response.data?.error?.validationErrors.length > 0) {
      errorMessage = response.data?.error?.validationErrors[0].message;
    }
  }

  return {
    errorMessage,
    detail: response.data?.error?.details,
    error: true,
    duplicates: response.data?.error?.data?.duplicates || response?.data?.error?.data?.data,
    code: response?.status,
  };
};
const setTenantName = (tenantName: string) => {
  api.setHeader('crm_application_tenant', tenantName);
};
/**
 * set token for authentication
 * @param {*} token
 */
const setToken = (token: string) => {
  api.setHeader('Authorization', `Bearer ${token}`);
};

/**
 *
 * @param {*url without host} url
 * @param {*param} params
 */
const apiGet = async (url: string, params: any) => {
  const dataResponse = await api.get(url, params);
  return returnData(dataResponse);
};

/**
 *
 * @param {*url without host} url
 * @param {*} body
 */
const apiPost = async (url: string, body: any) => {
  const dataResponse = await api.post(url, JSON.stringify(body));
  return returnData(dataResponse);
};

/**
 *
 * @param {*url without host} url
 * @param {*} body
 */
const apiPut = async (url: string, body: any) => {
  const dataResponse = await api.put(url, body);
  // logic handle dataResponse here
  return returnData(dataResponse);
};

/**
 *
 * @param {*url without host} url
 * @param {*} body
 */
const apiPatch = async (url: string, body: any) => {
  const response = await api.patch(url, body);
  return returnData(response);
};

/**
 *
 * @param {*url without host} url
 * @param {*} body
 */
const apiDelete = async (url: string, body: any) => {
  const response = await api.delete(url, body);
  return returnData(response);
};

const apiPostFormData = async (url: string, body: any) => {
  const response = await api.post(url, body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return returnData(response);
};

const apiPutFormData = async (url: string, body: any) => {
  const response = await api.put(url, body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return returnData(response);
};

const apiShowDownload = async (url: string, body: any) => {
  const response = await api.get(url, body, {
    responseType: 'blob',
  });
  return returnData(response);
};

export {
  apiGet,
  apiPost,
  setToken,
  apiPut,
  apiPatch,
  apiDelete,
  setTenantName,
  apiPostFormData,
  apiPutFormData,
  apiShowDownload,
};
