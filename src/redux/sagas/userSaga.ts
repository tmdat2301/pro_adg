import { put, call } from 'redux-saga/effects';
import { apiGet, setTenantName } from '@services/serviceHandle';
import * as userActions from '../actions/userActions';
import _ from 'lodash';
import serviceUrls from '@services/serviceUrls';
import { ResponseReturn } from '@interfaces/response.interface';
import { ProfileModel } from '@interfaces/profile.interface';

export function* login(payload: { type: string; body: { code: string }; keepLogin: boolean }) {
  try {
    const response: ResponseReturn<ProfileModel> = yield call(apiGet, serviceUrls.path.validatedToken, {});
    if (response.error && !_.isEmpty(response.errorMessage)) {
      yield put(userActions.loginFailed(response?.errorMessage));
    } else {
      yield put(
        userActions.loginSuccess({ access_token: payload.body.code, data: response.response?.data }, payload.keepLogin),
      );
    }
  } catch (error) {
    yield put(userActions.loginFailed(error));
  }
}

export function* getTenantName(payload: { type: string; body: { tenantName: string } }) {
  const url = `${serviceUrls.path.tennatsByName}${payload.body.tenantName}`;
  try {
    const response = yield call(apiGet, url, {});
    if ((response.error && !_.isEmpty(response.detail)) || response.response.success !== true) {
      yield put(userActions.getTenantByNameFailed(response.detail));
    } else {
      setTenantName(response.response.name);
      yield put(userActions.getTenantByNameSuccess(response.response, payload.body));
    }
  } catch (error) {
    yield put(userActions.getTenantByNameFailed(error));
  }
}

export function* getProfileUser(payload?: any) {
  // export function* getProfileUser(payload: { type: string; body: { tenantName: string } }) {
  const url = serviceUrls.path.getProfileUser.replace('{id}', payload.body.id);
  try {
    const response = yield call(apiGet, url, {});
    if (response.error && !_.isEmpty(response.detail)) {
      yield put(userActions.getProfileUserFailed(response.detail));
    } else {
      yield put(userActions.getProfileUserSuccess(response.response, payload.body));
    }
  } catch (error) {
    yield put(userActions.getProfileUserFailed(error));
  }
}

export function* getMapKey() {
  const url = serviceUrls.path.settingGoogle;
  try {
    const response = yield call(apiGet, url, {});
    if (response.error && !_.isEmpty(response.detail)) {
      yield put(userActions.getMapKeyFailed(response.detail));
    } else {
      yield put(userActions.getMapKeySuccess(response.response, {}));
    }
  } catch (error) {
    yield put(userActions.getMapKeyFailed(error));
  }
}