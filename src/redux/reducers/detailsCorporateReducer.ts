import { ItemDealDetails } from '@interfaces/deal.interface';
import { CorporateDetailsModel } from '@interfaces/interprise.interface';
import {
  ItemDetailsActivity,
  ItemAttachFiles,
  ItemDetailsInteractive,
  ItemDetailsNote,
  ItemTask,
} from '@interfaces/lead.interface';
import { LoadingReducer, ParamsFile } from '@interfaces/params.interface';
import actionTypes from '../actionTypes';

export interface IDetailsContactReducer {
  objInfo: CorporateDetailsModel | null;
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
  objDeal: {
    load: LoadingReducer;
    filter: {
      id: number;
    };
    arrDeal: ItemDealDetails[];
  };
  corporateId: number | string | null;
}

export interface IDetailsContactProps {
  type: string;
  data: any;
  list: any[];
  filterFile: ParamsFile;
  corporateId: string | number;
  page: number;
  total: number;
  filterActivity: any;
  isRefreshing: boolean;
  id: number;
}

const initialState: IDetailsContactReducer = {
  corporateId: null,
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
  objDeal: {
    load: {
      isError: false,
      isRefreshing: true,
    },
    arrDeal: [],
    filter: {
      id: -99,
    },
  },
};

export default (state = initialState, action: IDetailsContactProps) => {
  switch (action.type) {
    //info Contact
    case actionTypes.DETAILS_CORPORATE_INFO_SUCCESS:
      state.objInfo = action.data;
      state.isInfoLoading = false;
      state.isInfoError = false;
      return { ...state };
    case actionTypes.DETAILS_CORPORATE_INFO_FAILED:
      state.isInfoLoading = false;
      state.isInfoError = true;
      return { ...state };
    // note Contact
    case actionTypes.DETAILS_CORPORATE_NOTE_SUCCESS:
      state.objNote.arrNote = action.list;
      state.objNote.load.isRefreshing = false;
      state.objNote.load.isError = false;
      return { ...state };
    case actionTypes.DETAILS_CORPORATE_NOTE_FAILED:
      state.objNote.load.isRefreshing = false;
      state.objNote.load.isError = true;
      return { ...state };
    // task Contact
    case actionTypes.DETAILS_CORPORATE_MISSION_SUCCESS:
      state.objMission.arrMission = action.list;
      state.objMission.load.isRefreshing = false;
      state.objMission.load.isError = false;
      return { ...state };
    case actionTypes.DETAILS_CORPORATE_MISSION_FAILED:
      state.objMission.load.isRefreshing = false;
      state.objMission.load.isError = true;
      return { ...state };
    case actionTypes.DETAILS_CORPORATE_APPOINTMENT_SUCCESS:
      state.objAppointment.arrAppointment = action.list;
      state.objAppointment.load.isRefreshing = false;
      state.objAppointment.load.isError = false;
      return { ...state };
    case actionTypes.DETAILS_CORPORATE_APPOINTMENT_FAILED:
      state.objAppointment.load.isRefreshing = false;
      state.objAppointment.load.isError = true;
      return { ...state };
    // file Contact
    case actionTypes.DETAILS_CORPORATE_FILE_SUCCESS:
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
    case actionTypes.DETAILS_CORPORATE_FILE_FAILED:
      state.objFile.load.isRefreshing = false;
      state.objFile.load.isLoadMore = false;
      state.objFile.load.isError = true;
      return { ...state };
    // interactive Contact
    case actionTypes.DETAILS_CORPORATE_INTERACTIVE_SUCCESS:
      state.objInteractive.arrInteractive = action.list;
      state.objInteractive.load.isRefreshing = false;
      state.objInteractive.load.isError = false;
      return { ...state };
    case actionTypes.DETAILS_CORPORATE_INTERACTIVE_FAILED:
      state.objInteractive.load.isRefreshing = false;
      state.objInteractive.load.isError = true;
      return { ...state };
    // deal Contact
    case actionTypes.DETAILS_CORPORATE_DEAL_SUCCESS:
      state.objDeal.arrDeal = action.list;
      state.objDeal.load.isRefreshing = false;
      state.objDeal.load.isError = false;
      return { ...state };
    case actionTypes.DETAILS_CORPORATE_DEAL_FAILED:
      state.objDeal.load.isRefreshing = false;
      state.objDeal.load.isError = true;
      return { ...state };
    // activity Contact
    case actionTypes.DETAILS_CORPORATE_ACTIVITY_SUCCESS:
      state.objActivity.arrActivity = action.list;
      state.objActivity.load.isRefreshing = false;
      state.objActivity.load.isError = false;
      return { ...state };
    case actionTypes.DETAILS_CORPORATE_ACTIVITY_FAILED:
      state.objActivity.load.isRefreshing = false;
      state.objActivity.load.isError = true;
      return { ...state };
    // setRefreshingContact
    case actionTypes.SET_LOADING_DETAILS_CORPORATE_INFO:
      state.isInfoLoading = action.isRefreshing || true;
      state.isInfoError = false;
      return { ...state };
    case actionTypes.SET_LOADING_DETAILS_CORPORATE_DEAL:
      state.objDeal.load.isRefreshing = action.isRefreshing || true;
      state.objDeal.load.isError = false;
      return { ...state };
    case actionTypes.SET_LOADING_DETAILS_CORPORATE_INTERACTIVE:
      state.objInteractive.load.isRefreshing = action.isRefreshing || true;
      state.objInteractive.load.isError = false;
      return { ...state };
    case actionTypes.SET_LOADING_DETAILS_CORPORATE_NOTE:
      state.objNote.load.isRefreshing = action.isRefreshing || true;
      state.objNote.load.isError = false;
      return { ...state };
    case actionTypes.SET_LOADING_DETAILS_CORPORATE_ACTIVITY:
      state.objActivity.load.isRefreshing = action.isRefreshing || true;
      state.objActivity.load.isError = false;
      return { ...state };
    case actionTypes.SET_LOADING_DETAILS_CORPORATE_FILE:
      state.objFile.load.isRefreshing = action.isRefreshing || true;
      state.objFile.load.isError = false;
      return { ...state };
    case actionTypes.SET_LOADING_DETAILS_CORPORATE_MISSION:
      state.objMission.load.isRefreshing = action.isRefreshing || true;
      state.objMission.load.isError = false;
      return { ...state };
    case actionTypes.SET_LOADING_DETAILS_CORPORATE_APPOINTMENT:
      state.objAppointment.load.isRefreshing = action.isRefreshing || true;
      state.objAppointment.load.isError = false;
      return { ...state };
    case actionTypes.SET_CORPORATE_ID:
      state.corporateId = action.corporateId;
      return { ...state };
    case actionTypes.SET_EMPTY_CORPORATE:
      state.objActivity.arrActivity = [];
      state.objFile.arrFile = [];
      state.objAppointment.arrAppointment = [];
      state.objInteractive.arrInteractive = [];
      state.objMission.arrMission = [];
      state.objNote.arrNote = [];
      state.objDeal.arrDeal = [];
      state.objInfo = null;
      return { ...state };
    default:
      return state;
  }
};
