import { put, call } from 'redux-saga/effects';
import { apiGet, setTenantName, setToken } from '@services/serviceHandle';
import * as dealAction from '../actions/dealActions';
import _ from 'lodash';
import serviceUrls from '@services/serviceUrls';
import { ResponseReturn } from '@interfaces/response.interface';
import { DealItem } from '@interfaces/deal.interface';
import Toast from 'react-native-toast-message';
import { decimalOneInput, decimalOneInputOperator, filterType } from '@helpers/constants';
import { Alert } from 'react-native';

export function* getListDeal(payload: {
  type: string;
  body: { maxResultCount: number; skipCount: number; organizationUnitId: string; filterType: number; filter: string };
}) {
  try {
    const filter = JSON.parse(payload.body.filter);
    const filterTemp = filter.map((el: any) => {
      if (decimalOneInput.includes(el.Operator) && el.Type == 'decimal') {
        return {
          ...el,
          Value: el.Values[0],
        };
      } else {
        return {
          ...el,
        };
      }
    });
    filterTemp.forEach((el: any) => {
      if (!decimalOneInputOperator.includes(el.Operator)) {
        delete el.End;
        delete el.Start;
      }
      if (decimalOneInput.includes(el.Operator) && el.Type == 'decimal') {
        delete el.Values;
      }
    });
    const body = {
      MaxResultCount: payload.body.maxResultCount,
      SkipCount: payload.body.skipCount,
      organizationUnitId: payload.body.organizationUnitId,
      filterType: payload.body.filterType,
      filter: JSON.stringify(filterTemp),
    };
    const url = serviceUrls.path.getListDeal;
    const response: ResponseReturn<{ totalCount: number; items: DealItem[] }> = yield call(apiGet, url, body);
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
        dealAction.getListDealSuccess({
          listData: [],
          total: 0,
        }),
      );
      return;
    }
    if (response.error && !_.isEmpty(response.detail)) {
      yield put(dealAction.getListDealFailed(response.errorMessage || response.detail));
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
    } else {
      yield put(
        dealAction.getListDealSuccess({
          listData: response.response?.data.items ?? [],
          total: response.response?.data.totalCount ?? 0,
        }),
      );
    }
  } catch (error) {
    yield put(dealAction.getListDealFailed('error'));
  }
}
