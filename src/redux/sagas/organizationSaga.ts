import { put, call } from 'redux-saga/effects';
import { apiGet } from '@services/serviceHandle';
import { ResponseReturn } from '@interfaces/response.interface';
import { ItemActivityType, ItemOrganization, ItemOrganizationUnitList } from '@interfaces/dashboard.interface';
import * as filterActions from '@redux/actions/filterActions';
import serviceUrls from '@services/serviceUrls';

export function* getOrganizationDropDown() {
  const url = serviceUrls.path.organizationDropDown;
  const urlDashboard = serviceUrls.path.getOrganizationTree;
  try {
    const response: ResponseReturn<ItemOrganization[]> = yield call(apiGet, url, {});
    const responseDashboard: ResponseReturn<ItemOrganization[]> = yield call(apiGet, urlDashboard, {});
    if (response.error || responseDashboard.error) {
      yield put(
        filterActions.organizationDropDownFailed(response.errorMessage || responseDashboard.errorMessage || ''),
      );
      return;
    }
    yield put(
      filterActions.organizationDropDownSuccess(response.response?.data || [], responseDashboard.response?.data || []),
    );
  } catch (error) {
    yield put(filterActions.organizationDropDownFailed(JSON.stringify(error) || ''));
  }
}

export function* getOrganizationList() {
  const url = serviceUrls.path.currentOrganizationUnitList;
  try {
    const response: ResponseReturn<ItemOrganizationUnitList[]> = yield call(apiGet, url, {});
    if (response.error) {
      yield put(filterActions.getOrganizationFailed(response.errorMessage || ''));
    }
    yield put(filterActions.getOrganizationSuccess(response.response?.data || []));
  } catch (error) {
    yield put(filterActions.getOrganizationFailed(JSON.stringify(error) || ''));
  }
}

export function* getActivityType() {
  const url = serviceUrls.path.activityType;
  try {
    const response: ResponseReturn<ItemActivityType[]> = yield call(apiGet, url, {});
    if (response.error) {
      yield put(filterActions.activityTypeFailed());
      return;
    }
    if (response.response && response.response.data) {
      if (response.response.data.length > 0) {
        const arrNumber: number[] = [];
        for (let index = 0; index < response.response.data.length; index++) {
          const element = response.response.data[index];
          arrNumber.push(element.id);
        }
      }
      yield put(filterActions.activityTypeSuccess(response.response.data));
    }
  } catch (error) {
    yield put(filterActions.activityTypeFailed());
  }
}
