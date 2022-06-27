import { put, call } from 'redux-saga/effects';
import { apiGet, apiPost, setTenantName, setToken } from '@services/serviceHandle';
// import * as contactAction from '../actions/contactAction';
import * as taskAction from '../actions/taskAction';
import _ from 'lodash';
import serviceUrls from '@services/serviceUrls';
import { ResponseReturn } from '@interfaces/response.interface';
import { ContactItem } from '@interfaces/contact.interface';
import { TaskList } from '@interfaces/TaskList';

export function* getListTask(payload: {
  type: string;
  body: {
    // userId: string | null; // tìm kiếm theo người dùng
    // filterType: number; // 1 : tìm kiếm theo người dùng 2 : tìm kiếm theo phòng ban
    startTime: Date | string; // ngày bắt đầu lọc
    endTime: Date | string; // ngày kết thúc lọc
    filter: string; // Text tìm kiếm
    type: number | null; // 0 or null là allnumber; 1 là nhiệm vụnumber; 2 là cuộc hẹn
    page: number;
    pageSize: number;
  };
}) {
  try {
    const body = payload.body;
    const url = serviceUrls.path.taskList;
    const response: ResponseReturn<{ totalCount: number; items: any[] }> = yield call(apiPost, url, body);
    if (response.error && !_.isEmpty(response.detail)) {
      yield put(taskAction.getListTaskFailed(response.detail));
    } else {
      yield put(
        taskAction.getListTaskSuccess({
          listData: response.response?.data.items ?? [],
          total: response.response?.data.totalCount ?? 0,
        }),
      );
    }
  } catch (error) {
    yield put(taskAction.getListTaskFailed('error'));
  }
}
