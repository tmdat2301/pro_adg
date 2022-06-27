import { CorporateDetailsModel } from './../../interfaces/interprise.interface';
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

export function* getInfoCorporate(payload: ReturnType<typeof detailsActions.detailsCorporateInfoRequest>) {
  const url = serviceUrls.path.corporateDetailsInfo + payload.corporateId.toString();
  try {
    const response: ResponseReturn<CorporateDetailsModel> = yield call(apiGet, url, {
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
      yield put(detailsActions.detailsCorporateInfoFailed());
      return;
    }
    if (response.error || !response.response?.data) {
      yield put(detailsActions.detailsCorporateInfoFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }

    yield put(detailsActions.detailsCorporateInfoSuccess(response.response?.data));
  } catch (error) {
    yield put(detailsActions.detailsCorporateInfoFailed());
  }
}

export function* getNoteCorporate(payload: ReturnType<typeof detailsActions.detailsCorporateNoteRequest>) {
  const url = serviceUrls.path.corporateDetailsNote + payload.corporateId.toString();
  try {
    const response: ResponseReturn<ItemDetailsNote[]> = yield call(apiGet, url, {});
    if (response.error) {
      yield put(detailsActions.detailsCorporateNoteFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    yield put(detailsActions.detailsCorporateNoteSuccess(response.response?.data || []));
  } catch (error) {
    yield put(detailsActions.detailsCorporateInfoFailed());
  }
}

export function* getInteractiveCorporate(
  payload: ReturnType<typeof detailsActions.detailsCorporateInteractiveRequest>,
) {
  const url = serviceUrls.path.corporateDetailsInteractive + payload.corporateId.toString();
  try {
    const response: ResponseReturn<ItemDetailsInteractive[]> = yield call(apiGet, url, {
      isDetail: false,
      date: payload.date.toString(),
    });
    if (response.error) {
      yield put(detailsActions.detailsCorporateInteractiveFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    yield put(detailsActions.detailsCorporateInteractiveSuccess(response.response?.data || []));
  } catch (error) {
    yield put(detailsActions.detailsCorporateInfoFailed());
  }
}

export function* getFileCorporate(payload: ReturnType<typeof detailsActions.detailsCorporateFileRequest>) {
  const url = serviceUrls.path.detailsFile;
  try {
    const response: ResponseReturn<DetailsAttachFilesModel> = yield call(apiGet, url, payload.params);
    if (response.error) {
      yield put(detailsActions.detailsCorporateFileFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    yield put(
      detailsActions.detailsCorporateFileSuccess(
        response.response?.data?.attachFiles || [],
        response.response?.data?.totalAttachFileRecord || 0,
        payload.params.SkipCount,
      ),
    );
  } catch (error) {
    yield put(detailsActions.detailsCorporateInfoFailed());
  }
}

export function* getActivityCorporate(payload: ReturnType<typeof detailsActions.detailsCorporateActivityRequest>) {
  const url = serviceUrls.path.corporateDetailsActivity + payload.corporateId.toString();
  try {
    const response: ResponseReturn<ItemDetailsActivity[]> = yield call(apiPost, url, {
      activityType: payload.arrActivity,
      limit: payload.limit || 20,
      startDate: payload.date.toString(),
      endDate: payload.date.toString(),
    });

    if (response.error) {
      yield put(detailsActions.detailsCorporateActivityFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    yield put(detailsActions.detailsCorporateActivitySuccess(response.response?.data || []));
  } catch (error) {
    yield put(detailsActions.detailsCorporateActivityFailed());
  }
}

export function* getMissionCorporate(payload: ReturnType<typeof detailsActions.detailsCorporateMissionRequest>) {
  const url = serviceUrls.path.corporateDetailsTask + payload.corporateId.toString();
  try {
    const response: ResponseReturn<ItemTask[]> = yield call(apiGet, url, {
      type: 1,
      date: payload.date.toString(),
      status: payload.status !== -99 ? payload.status : null,
    });
    if (response.error) {
      yield put(detailsActions.detailsCorporateMissionFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    yield put(detailsActions.detailsCorporateMissionSuccess(response.response?.data || []));
  } catch (error) {
    yield put(detailsActions.detailsCorporateMissionFailed());
  }
}

export function* getAppointmentCorporate(
  payload: ReturnType<typeof detailsActions.detailsCorporateAppointmentRequest>,
) {
  const url = serviceUrls.path.corporateDetailsTask + payload.corporateId.toString();
  try {
    const response: ResponseReturn<ItemTask[]> = yield call(apiGet, url, {
      type: 2,
      date: payload.date.toString(),
      status: payload.status !== -99 ? payload.status : null,
    });
    if (response.error) {
      yield put(detailsActions.detailsCorporateAppointmentFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    yield put(detailsActions.detailsCorporateAppointmentSuccess(response.response?.data || []));
  } catch (error) {
    yield put(detailsActions.detailsCorporateAppointmentFailed());
  }
}

export function* getDealCorporate(payload: ReturnType<typeof detailsActions.detailsCorporateDealRequest>) {
  try {
    const url = serviceUrls.path.corporateDetailsDeal;
    let params = {};
    if (payload.dealStatusPipeline === -99) {
      params = {
        corporateId: payload.corporateId.toString(),
      };
    } else {
      params = {
        corporateId: payload.corporateId.toString(),
        dealStatusPipeline: payload.dealStatusPipeline,
      };
    }
    const response: ResponseReturn<DealDetails> = yield call(apiGet, url, params);
    if (response.error) {
      yield put(detailsActions.detailsCorporateDealFailed());
      Toast.show({
        type: 'error',
        text1: response.errorMessage || response.detail || '',
      });
      return;
    }
    if (response.response) {
      yield put(
        detailsActions.detailsCorporateDealSuccess(
          response.response.data && response.response.data.deals ? response.response.data.deals : [],
        ),
      );
    }
  } catch (error) {
    yield put(detailsActions.detailsCorporateDealFailed());
  }
}
