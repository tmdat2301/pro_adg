import { detailsLeadMissionRequest } from './../actions/detailsActions';
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
  LeadDetailsModel,
} from '@interfaces/lead.interface';
import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';

export function* getInfoLead(payload: ReturnType<typeof detailsActions.detailsLeadInfoRequest>) {
  const url = serviceUrls.path.leadDetailsInfo + payload.leadId.toString();
  try {
    const response: ResponseReturn<LeadDetailsModel> = yield call(apiGet, url, {
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
      yield put(detailsActions.detailsLeadInfoFailed());
      return;
    }
    if (response.error) {
      yield put(detailsActions.detailsLeadInfoFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }

    if (response.response && response.response.data) {
      yield put(detailsActions.detailsLeadInfoSuccess(response.response.data));
    }
  } catch (error) {
    yield put(detailsActions.detailsLeadInfoFailed());
  }
}

export function* getNoteLead(payload: ReturnType<typeof detailsActions.detailsLeadNoteRequest>) {
  const url = serviceUrls.path.leadDetailsNote + payload.leadId.toString();
  try {
    const response: ResponseReturn<ItemDetailsNote[]> = yield call(apiGet, url, {});
    if (response.error) {
      yield put(detailsActions.detailsLeadNoteFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    if (response.response && response.response.data) {
      yield put(detailsActions.detailsLeadNoteSuccess(response.response.data));
    }
  } catch (error) {
    yield put(detailsActions.detailsLeadInfoFailed());
  }
}

export function* getInteractiveLead(payload: ReturnType<typeof detailsActions.detailsLeadInteractiveRequest>) {
  const url = serviceUrls.path.leadDetailsInteractive + payload.leadId.toString();
  try {
    const response: ResponseReturn<ItemDetailsInteractive[]> = yield call(apiGet, url, {
      isDetail: false,
      date: payload.date.toString(),
    });
    if (response.error) {
      yield put(detailsActions.detailsLeadInteractiveFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    yield put(detailsActions.detailsLeadInteractiveSuccess(response.response?.data || []));
  } catch (error) {
    yield put(detailsActions.detailsLeadInfoFailed());
  }
}

export function* getFileLead(payload: ReturnType<typeof detailsActions.detailsLeadFileRequest>) {
  const url = serviceUrls.path.detailsFile;
  try {
    const response: ResponseReturn<DetailsAttachFilesModel> = yield call(apiGet, url, payload.params);
    if (response.error) {
      yield put(detailsActions.detailsLeadFileFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    if (response.response && response.response.data) {
      yield put(
        detailsActions.detailsLeadFileSuccess(
          response.response.data.attachFiles,
          response.response.data.totalAttachFileRecord,
          payload.params.SkipCount,
        ),
      );
    }
  } catch (error) {
    yield put(detailsActions.detailsLeadInfoFailed());
  }
}

export function* getActivityLead(payload: ReturnType<typeof detailsActions.detailsLeadActivityRequest>) {
  const url = serviceUrls.path.leadDetailsActivity + payload.leadId.toString();
  try {
    const response: ResponseReturn<ItemDetailsActivity[]> = yield call(apiPost, url, {
      activityType: payload.arrActivity,
      limit: payload.limit || 20,
      startDate: payload.date.toString(),
      endDate: payload.date.toString(),
    });

    if (response.error) {
      yield put(detailsActions.detailsLeadActivityFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    if (response.response && response.response.data) {
      yield put(detailsActions.detailsLeadActivitySuccess(response.response.data));
    }
  } catch (error) {
    yield put(detailsActions.detailsLeadActivityFailed());
  }
}

export function* getMissionLead(payload: ReturnType<typeof detailsActions.detailsLeadMissionRequest>) {
  const url = serviceUrls.path.leadDetailsTask + payload.leadId.toString();
  try {
    const response: ResponseReturn<ItemTask[]> = yield call(apiGet, url, {
      type: 1,
      date: payload.date.toString(),
      status: payload.status !== -99 ? payload.status : null,
    });
    if (response.error) {
      yield put(detailsActions.detailsLeadMissionFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    if (response.response && response.response.data) {
      yield put(detailsActions.detailsLeadMissionSuccess(response.response.data));
    }
  } catch (error) {
    yield put(detailsActions.detailsLeadMissionFailed());
  }
}

export function* getAppointmentLead(payload: ReturnType<typeof detailsActions.detailsLeadAppointmentRequest>) {
  const url = serviceUrls.path.leadDetailsTask + payload.leadId.toString();
  try {
    const response: ResponseReturn<ItemTask[]> = yield call(apiGet, url, {
      type: 2,
      date: payload.date.toString(),
      status: payload.status !== -99 ? payload.status : null,
    });
    if (response.error) {
      yield put(detailsActions.detailsLeadAppointmentFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    if (response.response && response.response.data) {
      yield put(detailsActions.detailsLeadAppointmentSuccess(response.response.data));
    }
  } catch (error) {
    yield put(detailsActions.detailsLeadAppointmentFailed());
  }
}
