import { DealDetailsModel } from './../../interfaces/deal.interface';
import { put, call } from 'redux-saga/effects';
import { apiGet, apiPost } from '@services/serviceHandle';
import { ResponseReturn } from '@interfaces/response.interface';
import * as detailsActions from '@redux/actions/detailsActions';
import serviceUrls from '@services/serviceUrls';
import {
  ItemDetailsActivity,
  ItemDetailsInteractive,
  ItemDetailsNote,
  ItemTask,
  DetailsAttachFilesModel,
} from '@interfaces/lead.interface';
import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';

export function* getInfoDeal(payload: ReturnType<typeof detailsActions.detailsDealInfoRequest>) {
  const url = serviceUrls.path.dealDetailsInfo + payload.dealId.toString();
  try {
    const response: ResponseReturn<DealDetailsModel> = yield call(apiGet, url, {
      hiddenSomeThing: payload.hiddenSth,
    });
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
      yield put(detailsActions.detailsDealInfoFailed());
      return;
    }
    if (response.error || !response.response?.data) {
      yield put(detailsActions.detailsDealInfoFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }

    yield put(detailsActions.detailsDealInfoSuccess(response.response?.data || {}));
  } catch (error) {
    yield put(detailsActions.detailsDealInfoFailed());
  }
}

export function* getNoteDeal(payload: ReturnType<typeof detailsActions.detailsDealNoteRequest>) {
  const url = serviceUrls.path.dealDetailsNote + payload.dealId.toString();
  try {
    const response: ResponseReturn<ItemDetailsNote[]> = yield call(apiGet, url, {});
    if (response.error) {
      yield put(detailsActions.detailsDealNoteFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    yield put(detailsActions.detailsDealNoteSuccess(response.response?.data || []));
  } catch (error) {
    yield put(detailsActions.detailsDealInfoFailed());
  }
}

export function* getInteractiveDeal(payload: ReturnType<typeof detailsActions.detailsDealInteractiveRequest>) {
  const url = serviceUrls.path.dealDetailsInteractive + payload.dealId.toString();
  try {
    const response: ResponseReturn<ItemDetailsInteractive[]> = yield call(apiGet, url, {
      isDetail: false,
      date: payload.date.toString(),
    });
    if (response.error && !response.errorMessage) {
      yield put(detailsActions.detailsDealInteractiveFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    yield put(detailsActions.detailsDealInteractiveSuccess(response.response?.data || []));
  } catch (error) {
    yield put(detailsActions.detailsDealInfoFailed());
  }
}

export function* getFileDeal(payload: ReturnType<typeof detailsActions.detailsDealFileRequest>) {
  const url = serviceUrls.path.detailsFile;
  try {
    const response: ResponseReturn<DetailsAttachFilesModel> = yield call(apiGet, url, payload.params);
    if (response.error) {
      yield put(detailsActions.detailsDealFileFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    yield put(
      detailsActions.detailsDealFileSuccess(
        response.response?.data?.attachFiles || [],
        response.response?.data?.totalAttachFileRecord || 0,
        payload.params.SkipCount,
      ),
    );
  } catch (error) {
    yield put(detailsActions.detailsDealInfoFailed());
  }
}

export function* getActivityDeal(payload: ReturnType<typeof detailsActions.detailsDealActivityRequest>) {
  const url = serviceUrls.path.dealDetailsActivity + payload.dealId.toString();
  try {
    const response: ResponseReturn<ItemDetailsActivity[]> = yield call(apiPost, url, {
      activityType: payload.arrActivity,
      limit: payload.limit || 20,
      startDate: payload.date.toString(),
      endDate: payload.date.toString(),
    });

    if (response.error) {
      yield put(detailsActions.detailsDealActivityFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    yield put(detailsActions.detailsDealActivitySuccess(response.response?.data || []));
  } catch (error) {
    yield put(detailsActions.detailsDealActivityFailed());
  }
}

export function* getMissionDeal(payload: ReturnType<typeof detailsActions.detailsDealMissionRequest>) {
  const url = serviceUrls.path.dealDetailsTask + payload.dealId.toString();
  try {
    const response: ResponseReturn<ItemTask[]> = yield call(apiGet, url, {
      type: 1,
      date: payload.date.toString(),
      status: payload.status !== -99 ? payload.status : null,
    });
    if (response.error) {
      yield put(detailsActions.detailsDealMissionFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    yield put(detailsActions.detailsDealMissionSuccess(response.response?.data || []));
  } catch (error) {
    yield put(detailsActions.detailsDealMissionFailed());
  }
}

export function* getAppointmentDeal(payload: ReturnType<typeof detailsActions.detailsDealAppointmentRequest>) {
  const url = serviceUrls.path.dealDetailsTask + payload.dealId.toString();
  try {
    const response: ResponseReturn<ItemTask[]> = yield call(apiGet, url, {
      type: 2,
      date: payload.date.toString(),
      status: payload.status !== -99 ? payload.status : null,
    });
    if (response.error) {
      yield put(detailsActions.detailsDealAppointmentFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    yield put(detailsActions.detailsDealAppointmentSuccess(response.response?.data || []));
  } catch (error) {
    yield put(detailsActions.detailsDealAppointmentFailed());
  }
}
