import { put, call } from 'redux-saga/effects';
import { apiGet, setTenantName, setToken } from '@services/serviceHandle';
import * as leadAction from '../actions/leadAction';
import _ from 'lodash';
import serviceUrls from '@services/serviceUrls';
import { ResponseReturn } from '@interfaces/response.interface';
import { LeadItem } from '@interfaces/lead.interface';
import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';

export function* getListLead(payload: {
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
    const url = serviceUrls.path.getListLead;
    const response: ResponseReturn<{ totalCount: number; items: LeadItem[] }> = yield call(apiGet, url, body);
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
      yield put(
        leadAction.getListLeadSuccess({
          listData: [],
          total: 0,
        }),
      );
      return;
    }
    if (response.error || !_.isEmpty(response.detail)) {
      yield put(leadAction.getListLeadFailed(response.errorMessage || response.detail));
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
    } else {
      yield put(
        leadAction.getListLeadSuccess({
          listData: response.response?.data.items ?? [],
          total: response.response?.data.totalCount ?? 0,
        }),
      );
    }
  } catch (error) {
    yield put(leadAction.getListLeadFailed('error'));
  }
}

export function* getFilterList(actions: any) {
  try {
    const url = serviceUrls.path.filterList(actions.payload);
    const response: ResponseReturn<string> = yield call(apiGet, url, {});
    if (response.error && !_.isEmpty(response.detail)) {
      yield put(leadAction.getFilterListFailed(response.detail));
    } else {
      const data = JSON.parse(response.response?.data || '[]');

      yield put(leadAction.getFilterListSuccess(data, actions.filterType));
    }
  } catch (error) {
    yield put(leadAction.getFilterListFailed('error'));
  }
}

export function* getConditionFilter(actions: any) {
  try {
    const url = serviceUrls.path.conditionFilter(actions.payload);
    const response: ResponseReturn<any> = yield call(apiGet, url, {});
    if (response.error && !_.isEmpty(response.detail)) {
      yield put(leadAction.getConditionFilterFailed(response.detail));
    } else {
      const responseData = [...response.response?.data];
      const data = responseData?.map((el) => {
        return {
          alwaysUse: el.alwaysUse,
          isDefault: el.isDefault,
          order: el.order,
          id: el.id,
          title: el.label,
          key: el.name,
          isFieldExtension: !el.isDefault,
          type: el.fieldType,
          operator: '',
          values: [],
          catalog: el.catalog,
        };
      });
      yield put(leadAction.getConditionFilterSuccess(data, actions.filterType));
    }
  } catch (error) {
    yield put(leadAction.getConditionFilterFailed('error'));
  }
}
