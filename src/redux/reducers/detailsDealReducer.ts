import { DealDetailsModel } from '@interfaces/deal.interface';
import {
  ItemDetailsActivity,
  ItemAttachFiles,
  ItemDetailsInteractive,
  ItemDetailsNote,
  ItemTask,
} from '@interfaces/lead.interface';
import { LoadingReducer, ParamsFile } from '@interfaces/params.interface';
import actionTypes from '../actionTypes';

export interface IDetailsDealReducer {
  objInfo: DealDetailsModel | null;
  isInfoError: boolean;
  isInfoLoading: boolean;
  objInteractive: {
    load: LoadingReducer;
    arrInteractive: ItemDetailsInteractive[];
  };
  objActivity: {
    load: LoadingReducer;
    arrActivity: ItemDetailsActivity[];
  };
  objNote: {
    load: LoadingReducer;
    arrNote: ItemDetailsNote[];
  };
  objFile: {
    load: LoadingReducer;
    arrFile: ItemAttachFiles[];
    page: number;
    totalFile: number;
  };
  objMission: {
    load: LoadingReducer;
    arrMission: ItemTask[];
  };
  objAppointment: {
    load: LoadingReducer;
    arrAppointment: ItemTask[];
  };
  dealId: number | string | null;
}

export interface IDetailsDealProps {
  type: string;
  data: any;
  list: any[];
  filterFile: ParamsFile;
  dealId: string | number;
  page: number;
  total: number;
  filterActivity: any;
  id: number;
  isRefreshing: boolean;
}

const initialState: IDetailsDealReducer = {
  dealId: null,
  objActivity: {
    load: {
      isRefreshing: true,
      isError: false,
    },
    arrActivity: [],
  },
  objMission: {
    load: {
      isError: false,
      isRefreshing: true,
    },
    arrMission: [],
  },
  objAppointment: {
    load: {
      isError: false,
      isRefreshing: true,
    },
    arrAppointment: [],
  },
  objFile: {
    arrFile: [],
    page: 1,
    totalFile: 0,
    load: {
      isError: false,
      isRefreshing: true,
      isLoadMore: false,
    },
  },
  objInteractive: {
    load: {
      isRefreshing: true,
      isError: false,
    },
    arrInteractive: [],
  },
  objNote: {
    arrNote: [],
    load: {
      isRefreshing: true,
      isError: false,
    },
  },
  isInfoError: false,
  isInfoLoading: true,
  objInfo: null,
};

export default (state = initialState, action: IDetailsDealProps) => {
  switch (action.type) {
    //info Deal
    case actionTypes.DETAILS_DEAL_INFO_SUCCESS:
      state.objInfo = action.data;
      state.isInfoLoading = false;
      state.isInfoError = false;
      return { ...state };
    case actionTypes.DETAILS_DEAL_INFO_FAILED:
      state.isInfoLoading = false;
      state.isInfoError = true;
      return { ...state };
    // note Deal
    case actionTypes.DETAILS_DEAL_NOTE_SUCCESS:
      state.objNote.arrNote = action.list;
      state.objNote.load.isRefreshing = false;
      state.objNote.load.isError = false;
      return { ...state };
    case actionTypes.DETAILS_DEAL_NOTE_FAILED:
      state.objNote.load.isRefreshing = false;
      state.objNote.load.isError = true;
      return { ...state };
    // task Deal
    case actionTypes.DETAILS_DEAL_MISSION_SUCCESS:
      state.objMission.arrMission = action.list;
      state.objMission.load.isRefreshing = false;
      state.objMission.load.isError = false;
      return { ...state };
    case actionTypes.DETAILS_DEAL_MISSION_FAILED:
      state.objMission.load.isRefreshing = false;
      state.objMission.load.isError = true;
      return { ...state };
    case actionTypes.DETAILS_DEAL_APPOINTMENT_SUCCESS:
      state.objAppointment.arrAppointment = action.list;
      state.objAppointment.load.isRefreshing = false;
      state.objAppointment.load.isError = false;
      return { ...state };
    case actionTypes.DETAILS_DEAL_APPOINTMENT_FAILED:
      state.objAppointment.load.isRefreshing = false;
      state.objAppointment.load.isError = true;
      return { ...state };
    // file Deal
    case actionTypes.DETAILS_DEAL_FILE_SUCCESS:
      state.objFile.page = action.page ? action.page : 1;
      state.objFile.totalFile = action.total ? action.total : 0;
      state.objFile.load.isRefreshing = false;
      state.objFile.load.isError = false;
      if (action.page) {
        if (action.page > 1) {
          state.objFile.arrFile = state.objFile.arrFile.concat(action.list);
        } else {
          state.objFile.arrFile = action.list;
        }
      } else {
        state.objFile.arrFile = action.list;
      }
      if (action.total === state.objFile.arrFile.length) {
        state.objFile.load.isLoadMore = false;
      } else {
        state.objFile.load.isLoadMore = true;
      }
      return { ...state };
    case actionTypes.DETAILS_DEAL_FILE_FAILED:
      state.objFile.load.isRefreshing = false;
      state.objFile.load.isLoadMore = false;
      state.objFile.load.isError = true;
      return { ...state };
    // interactive Deal
    case actionTypes.DETAILS_DEAL_INTERACTIVE_SUCCESS:
      state.objInteractive.arrInteractive = action.list;
      state.objInteractive.load.isRefreshing = false;
      state.objInteractive.load.isError = false;
      return { ...state };
    case actionTypes.DETAILS_DEAL_INTERACTIVE_FAILED:
      state.objInteractive.load.isRefreshing = false;
      state.objInteractive.load.isError = true;
      return { ...state };
    // activity Deal
    case actionTypes.DETAILS_DEAL_ACTIVITY_SUCCESS:
      state.objActivity.arrActivity = action.list;
      state.objActivity.load.isRefreshing = false;
      state.objActivity.load.isError = false;
      return { ...state };
    case actionTypes.DETAILS_DEAL_ACTIVITY_FAILED:
      state.objActivity.load.isRefreshing = false;
      state.objActivity.load.isError = true;
      return { ...state };
    // setRefreshingDeal
    case actionTypes.SET_LOADING_DETAILS_DEAL_INFO:
      state.isInfoLoading = action.isRefreshing || true;
      state.isInfoError = false;
      return { ...state };
    case actionTypes.SET_LOADING_DETAILS_DEAL_INTERACTIVE:
      state.objInteractive.load.isRefreshing = action.isRefreshing || true;
      state.objInteractive.load.isError = false;
      return { ...state };
    case actionTypes.SET_LOADING_DETAILS_DEAL_NOTE:
      state.objNote.load.isRefreshing = action.isRefreshing || true;
      state.objNote.load.isError = false;
      return { ...state };
    case actionTypes.SET_LOADING_DETAILS_DEAL_ACTIVITY:
      state.objActivity.load.isRefreshing = action.isRefreshing || true;
      state.objActivity.load.isError = false;
      return { ...state };
    case actionTypes.SET_LOADING_DETAILS_DEAL_FILE:
      state.objFile.load.isRefreshing = action.isRefreshing || true;
      state.objFile.load.isError = false;
      return { ...state };
    case actionTypes.SET_LOADING_DETAILS_DEAL_MISSION:
      state.objMission.load.isRefreshing = action.isRefreshing || true;
      state.objMission.load.isError = false;
      return { ...state };
    case actionTypes.SET_LOADING_DETAILS_DEAL_APPOINTMENT:
      state.objAppointment.load.isRefreshing = action.isRefreshing || true;
      state.objAppointment.load.isError = false;
      return { ...state };
    case actionTypes.SET_DEAL_ID:
      state.dealId = action.dealId;
      return { ...state };
    case actionTypes.SET_EMPTY_DEAL:
      state.objActivity.arrActivity = [];
      state.objFile.arrFile = [];
      state.objAppointment.arrAppointment = [];
      state.objInteractive.arrInteractive = [];
      state.objMission.arrMission = [];
      state.objNote.arrNote = [];
      state.objInfo = null;
      return { ...state };
    default:
      return state;
  }
};
