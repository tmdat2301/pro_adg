import { put, call } from 'redux-saga/effects';
import { apiPost } from '@services/serviceHandle';
import { ResponseReturn, ResponseReturnArray } from '@interfaces/response.interface';
import {
  DataChart,
  DataListTask,
  DealSummaryModel,
  ItemCountTask,
  ItemReportTask,
  KPIModel,
  LeadSummaryModel,
  StaffRankItem,
  TaskSummaryModel,
} from '@interfaces/dashboard.interface';
import * as businessActions from '@redux/actions/businessActions';
import serviceUrls from '@services/serviceUrls';
import { BodyMethodPostModel } from '@interfaces/params.interface';
import dayjs from 'dayjs';
import Toast from 'react-native-toast-message';

export function* getKpi(payload: ReturnType<typeof businessActions.kpiOverviewRequest>) {
  const url = serviceUrls.path.kpiOverview;
  try {
    const body: BodyMethodPostModel = {
      organizationUnitId: payload.body.organizationUnitId,
      startDate: payload.body.startDate,
      endDate: payload.body.endDate,
      FilterTimeType: payload.body.FilterTimeType,
      kpiType: payload.body.kpiType || 1,
    };
    const convertBodydate = `${dayjs(body.startDate).format('DD/MM')} - ${dayjs(body.endDate).format('DD/MM')}`;
    const response: ResponseReturn<KPIModel> = yield call(apiPost, url, body);

    if (response.error) {
      yield put(businessActions.kpiOverviewFailed());
      return;
    }
    if (response.response && response.response.data) {
      const arrType: string[] = [];
      const arrPre: DataChart[] = [];
      const arrNow: DataChart[] = [];

      for (let i = 0; i < response.response.data.chartItems.length; i++) {
        const ele = response.response.data.chartItems[i];
        if (!arrType.some((x) => x === ele.type)) {
          arrType.push(ele.type);
        }
      }

      for (let j = 0; j < arrType.length; j++) {
        const element = arrType[j];
        const arr = response.response.data.chartItems.filter((x) => x.type === element);
        for (let k = 0; k < arr.length; k++) {
          const obj = {
            x: arr[k].lable,
            y: arr[k].value,
          };
          if (element === convertBodydate) {
            arrNow.push(obj);
          } else {
            arrPre.push(obj);
          }
        }
      }

      yield put(businessActions.kpiOverviewSuccess(arrNow, arrPre, response.response.data));
    }
  } catch (error) {
    yield put(businessActions.kpiOverviewFailed());
  }
}

export function* getDealSummary(payload: ReturnType<typeof businessActions.dealSummaryRequest>) {
  const url = serviceUrls.path.dealSummary;
  try {
    const body: BodyMethodPostModel = {
      organizationUnitId: payload.body.organizationUnitId,
      startDate: payload.body.startDate,
      endDate: payload.body.endDate,
      FilterTimeType: payload.body.FilterTimeType,
    };
    const response: ResponseReturnArray<DealSummaryModel> = yield call(apiPost, url, body);    
    if (response.error) {
      yield put(businessActions.dealSummaryFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    if (response.response) {
      yield put(businessActions.dealSummarySuccess(response.response));
    }
  } catch (error) {
    yield put(businessActions.dealSummaryFailed());
  }
}

export function* getLeadSummary(payload: ReturnType<typeof businessActions.leadSummaryRequest>) {
  const url = serviceUrls.path.leadSummary;
  try {
    const body: BodyMethodPostModel = {
      organizationUnitId: payload.body.organizationUnitId,
      startDate: payload.body.startDate,
      endDate: payload.body.endDate,
      FilterTimeType: payload.body.FilterTimeType,
    };
    const response: ResponseReturnArray<LeadSummaryModel> = yield call(apiPost, url, body);
    if (response.error) {
      yield put(businessActions.leadSummaryFailed(response.errorMessage || response.detail));
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    if (response.response) {
      yield put(businessActions.leadSummarySuccess(response.response));
    }
  } catch (error) {
    yield put(businessActions.leadSummaryFailed());
  }
}

export function* getStaffRank(payload: ReturnType<typeof businessActions.staffRankRequest>) {
  const url = serviceUrls.path.rankStaff;
  try {
    const body: BodyMethodPostModel = {
      criteriaRank: payload.body.criteriaRank,
      organizationUnitId: payload.body.organizationUnitId,
      startDate: payload.body.startDate,
      endDate: payload.body.endDate,
    };
    const response: ResponseReturnArray<StaffRankItem[]> = yield call(apiPost, url, body);
    if (response.error) {
      yield put(businessActions.leadSummaryFailed(response.errorMessage || response.detail));
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    if (response.response) {
      yield put(businessActions.staffRankSuccess(response.response));
    }
  } catch (error) {
    yield put(businessActions.staffRankFailed());
  }
}

export function* getReportTask(payload: ReturnType<typeof businessActions.reportTaskRequest>) {
  const url = serviceUrls.path.reportTask;
  const body = { ...payload.body, filterType: payload.body.userId ? 1 : 2 };
  try {
    const response: ResponseReturn<ItemReportTask[]> = yield call(apiPost, url, body);

    if (response.error) {
      yield put(businessActions.reportTaskFail());
      return;
    }
    if (response.response && response.response.data) {
      yield put(businessActions.reportTaskSuccess(response.response.data));
    }
  } catch (error) {
    yield put(businessActions.reportTaskFail());
  }
}

export function* getCountTask(payload: ReturnType<typeof businessActions.countTaskRequest>) {
  const url = serviceUrls.path.countTask;
  const body = { ...payload.body, filterType: payload.body.userId ? 1 : 2 };
  try {
    const response: ResponseReturn<ItemCountTask[]> = yield call(apiPost, url, body);
    if (response.error) {
      yield put(businessActions.countTaskFail());
      return;
    }
    if (response.response && response.response.data) {
      yield put(businessActions.countTaskSuccess(response.response.data));
    }
  } catch (error) {
    yield put(businessActions.countTaskFail());
  }
}

export function* getListTask(payload: ReturnType<typeof businessActions.getListTaskRequest>) {
  const url = serviceUrls.path.listTask;
  const body = { ...payload.body, filterType: payload.body.userId ? 1 : 2 };
  try {
    const response: ResponseReturn<DataListTask> = yield call(apiPost, url, body);
    if (response.error) {
      yield put(businessActions.getListTaskFail());
      return;
    }
    if (response.response && response.response.data) {
      yield put(
        businessActions.getListTaskSuccess(
          response.response.data.items,
          payload.body.page,
          response.response.data.totalCount,
        ),
      );
    }
  } catch (error) {
    yield put(businessActions.getListTaskFail());
  }
}

export function* getSummaryTask(payload: ReturnType<typeof businessActions.taskSummaryRequest>) {
  const url = serviceUrls.path.summaryTask;
  const body = { ...payload.body, filterType: payload.body.userId ? 1 : 2 };
  try {
    const response: ResponseReturn<TaskSummaryModel> = yield call(apiPost, url, body);

    if (response.error) {
      yield put(businessActions.taskSummaryFailed());
      return;
    }
    if (response.response && response.response.data) {
      yield put(businessActions.taskSummarySuccess(response.response.data));
    }
  } catch (error) {
    yield put(businessActions.taskSummaryFailed());
  }
}
