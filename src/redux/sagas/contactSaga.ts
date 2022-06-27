import { put, call } from 'redux-saga/effects';
import { apiGet, setTenantName, setToken } from '@services/serviceHandle';
import * as contactAction from '../actions/contactAction';
import _ from 'lodash';
import serviceUrls from '@services/serviceUrls';
import { ResponseReturn } from '@interfaces/response.interface';
import { ContactItem } from '@interfaces/contact.interface';
import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';

export function* getListContact(payload: {
  type: string;
  body: { maxResultCount: number; skipCount: number; organizationUnitId: string; filterType: number; filter: string };
}) {
  try {
    const body = {
      MaxResultCount: payload.body.maxResultCount,
      SkipCount: payload.body.skipCount,
      organizationUnitId: payload.body.organizationUnitId,
      filterType: payload.body.filterType,
      filter: payload.body.filter,
    };
    const url = serviceUrls.path.getListContact;
    const response: ResponseReturn<{ totalCount: number; items: ContactItem[] }> = yield call(apiGet, url, body);
    if (response.code && response.code === 403) {
      Alert.alert(
        'Không có quyền truy cập',
        'Bạn không có quyền truy cập tính năng này. Vui lòng liên hệ admin để được cấp quyền.',
        [
          {
            text: 'Tôi đã hiểu!',
            style: 'cancel',
          },
        ],
      );
      yield put(contactAction.getListContactFailed(response.errorMessage || response.detail));
      return;
    }
    if (response.error && !_.isEmpty(response.detail)) {
      yield put(contactAction.getListContactFailed(response.errorMessage || response.detail));
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
    } else {
      yield put(
        contactAction.getListContactSuccess({
          listData: response.response?.data.items ?? [],
          total: response.response?.data.totalCount ?? 0,
        }),
      );
    }
  } catch (error) {
    yield put(contactAction.getListContactFailed('error'));
  }
}
