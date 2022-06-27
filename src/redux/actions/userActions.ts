import actionTypes from '../actionTypes';

/*
 * Reducer actions related with login
 */

export const getTenantByNameRequest = (body: { tenantName: string }) => {
  return {
    type: actionTypes.GET_TENANT_BY_NAME_REQUEST,
    body,
  };
};

export const getTenantByNameFailed = (error: any) => {
  return {
    type: actionTypes.GET_TENANT_BY_NAME_FAILED,
    error,
  };
};

export const getTenantByNameSuccess = (response: any, body: any) => {
  return {
    type: actionTypes.GET_TENANT_BY_NAME_SUCCESS,
    response,
    body,
  };
};

export const loginRequest = (body: { code: string }, keepLogin: boolean) => {
  return {
    type: actionTypes.LOGIN_REQUEST,
    body: body,
    keepLogin,
  };
};

export const loginFailed = (error: any) => {
  return {
    type: actionTypes.LOGIN_FAILED,
    error,
  };
};

export const loginSuccess = (response: any, keepLogin: boolean) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    response,
    keepLogin,
  };
};

// logout
export const logout = () => {
  return {
    type: actionTypes.LOGOUT,
  };
};

// get profile user
export const getProfileUserRequest = (body: { id: string | number }) => {
  return {
    type: actionTypes.GET_PROFILE_USER_REQUEST,
    body,
  };
};

export const getProfileUserFailed = (error: any) => {
  return {
    type: actionTypes.GET_PROFILE_USER_FAILED,
    error,
  };
};

export const getProfileUserSuccess = (response: any, body: any) => {
  return {
    type: actionTypes.GET_PROFILE_USER_SUCCESS,
    response,
    body,
  };
};

// get map key
export const getMapKeyRequest = () => {
  return {
    type: actionTypes.GET_MAP_KEY_REQUEST,
  };
};

export const getMapKeyFailed = (error: any) => {
  return {
    type: actionTypes.GET_MAP_KEY_FAILED,
    error,
  };
};

export const getMapKeySuccess = (response: any, body: any) => {
  return {
    type: actionTypes.GET_MAP_KEY_SUCCESS,
    response,
    body,
  };
};