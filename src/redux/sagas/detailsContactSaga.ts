import { ContactDetailsModel } from './../../interfaces/contact.interface';
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
import { DealDetails } from '@interfaces/deal.interface';
import { Alert } from 'react-native';

export function* getInfoContact(payload: ReturnType<typeof detailsActions.detailsContactInfoRequest>) {
  const url = serviceUrls.path.contactDetailsInfo + payload.contactId.toString();
  try {
    const response: ResponseReturn<ContactDetailsModel> = yield call(apiGet, url, {
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
      yield put(detailsActions.detailsContactInfoFailed());
      return;
    }
    if (response.error || !response.response?.data) {
      yield put(detailsActions.detailsContactInfoFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }

    yield put(detailsActions.detailsContactInfoSuccess(response.response?.data));
  } catch (error) {
    yield put(detailsActions.detailsContactInfoFailed());
  }
}

export function* getNoteContact(payload: ReturnType<typeof detailsActions.detailsContactNoteRequest>) {
  const url = serviceUrls.path.contactDetailsNote + payload.contactId.toString();
  try {
    const response: ResponseReturn<ItemDetailsNote[]> = yield call(apiGet, url, {});
    if (response.error) {
      yield put(detailsActions.detailsContactNoteFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });

      return;
    }
    yield put(detailsActions.detailsContactNoteSuccess(response.response?.data || []));
  } catch (error) {
    yield put(detailsActions.detailsContactInfoFailed());
  }
}

export function* getInteractiveContact(payload: ReturnType<typeof detailsActions.detailsContactInteractiveRequest>) {
  const url = serviceUrls.path.contactDetailsInteractive + payload.contactId.toString();
  try {
    const response: ResponseReturn<ItemDetailsInteractive[]> = yield call(apiGet, url, {
      isDetail: false,
      date: payload.date.toString(),
    });
    if (response.error) {
      yield put(detailsActions.detailsContactInteractiveFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });

      return;
    }
    yield put(detailsActions.detailsContactInteractiveSuccess(response.response?.data || []));
  } catch (error) {
    yield put(detailsActions.detailsContactInfoFailed());
  }
}

export function* getFileContact(payload: ReturnType<typeof detailsActions.detailsContactFileRequest>) {
  const url = serviceUrls.path.detailsFile;
  try {
    const response: ResponseReturn<DetailsAttachFilesModel> = yield call(apiGet, url, payload.params);
    if (response.error) {
      yield put(detailsActions.detailsContactFileFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    yield put(
      detailsActions.detailsContactFileSuccess(
        response.response?.data?.attachFiles || [],
        response.response?.data?.totalAttachFileRecord || 0,
        payload.params.SkipCount,
      ),
    );
  } catch (error) {
    yield put(detailsActions.detailsContactInfoFailed());
  }
}

export function* getActivityContact(payload: ReturnType<typeof detailsActions.detailsContactActivityRequest>) {
  const url = serviceUrls.path.contactDetailsActivity + payload.contactId.toString();
  try {
    const response: ResponseReturn<ItemDetailsActivity[]> = yield call(apiPost, url, {
      activityType: payload.arrActivity,
      limit: payload.limit || 20,
      startDate: payload.date.toString(),
      endDate: payload.date.toString(),
    });

    if (response.error) {
      yield put(detailsActions.detailsContactActivityFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    yield put(detailsActions.detailsContactActivitySuccess(response.response?.data || []));
  } catch (error) {
    yield put(detailsActions.detailsContactActivityFailed());
  }
}

export function* getMissionContact(payload: ReturnType<typeof detailsActions.detailsContactMissionRequest>) {
  const url = serviceUrls.path.contactDetailsTask + payload.contactId.toString();
  try {
    const response: ResponseReturn<ItemTask[]> = yield call(apiGet, url, {
      type: 1,
      date: payload.date.toString(),
      status: payload.status !== -99 ? payload.status : null,
    });
    if (response.error) {
      yield put(detailsActions.detailsContactMissionFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    yield put(detailsActions.detailsContactMissionSuccess(response.response?.data || []));
  } catch (error) {
    yield put(detailsActions.detailsContactMissionFailed());
  }
}

export function* getAppointmentContact(payload: ReturnType<typeof detailsActions.detailsContactAppointmentRequest>) {
  const url = serviceUrls.path.contactDetailsTask + payload.contactId.toString();
  try {
    const response: ResponseReturn<ItemTask[]> = yield call(apiGet, url, {
      type: 2,
      date: payload.date.toString(),
      status: payload.status !== -99 ? payload.status : null,
    });
    if (response.error) {
      yield put(detailsActions.detailsContactAppointmentFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    yield put(detailsActions.detailsContactAppointmentSuccess(response.response?.data || []));
  } catch (error) {
    yield put(detailsActions.detailsContactAppointmentFailed());
  }
}

export function* getDealContact(payload: ReturnType<typeof detailsActions.detailsContactDealRequest>) {
  try {
    const url = serviceUrls.path.contactDetailsDeal;
    let params = {};
    if (payload.dealStatusPipeline === -99) {
      params = {
        contactId: payload.contactId.toString(),
      };
    } else {
      params = {
        contactId: payload.contactId.toString(),
        dealStatusPipeline: payload.dealStatusPipeline,
      };
    }
    const response: ResponseReturn<DealDetails> = yield call(apiGet, url, params);
    if (response.error) {
      yield put(detailsActions.detailsContactDealFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    if (response.response) {
      yield put(
        detailsActions.detailsContactDealSuccess(
          response.response.data && response.response.data.deals ? response.response.data.deals : [],
        ),
      );
    }
  } catch (error) {
    yield put(detailsActions.detailsContactDealFailed());
  }
}
