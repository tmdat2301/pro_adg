import {
  ItemDetailsActivity,
  ItemAttachFiles,
  ItemDetailsInteractive,
  ItemDetailsNote,
  ItemTask,
  LeadDetailsModel,
} from '@interfaces/lead.interface';
import { LoadingReducer, ParamsFile } from '@interfaces/params.interface';
import actionTypes from '../actionTypes';

export interface IDetailsLeadReducer {
  objInfo: LeadDetailsModel | null;
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
  leadId: number | string | null;
}

export interface IDetailsLeadProps {
  type: string;
  data: any;
  list: any[];
  filterFile: ParamsFile;
  leadId: string | number;
  page: number;
  total: number;
  filterActivity: any;
  isRefreshing: boolean;
  id: number;
}

const initialState: IDetailsLeadReducer = {
  leadId: null,
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

export default (state = initialState, action: IDetailsLeadProps) => {
  switch (action.type) {
    //info Lead
    case actionTypes.DETAILS_LEAD_INFO_SUCCESS:
      state.objInfo = action.data;
      state.isInfoLoading = false;
      state.isInfoError = false;
      return { ...state };
    case actionTypes.DETAILS_LEAD_INFO_FAILED:
      state.isInfoLoading = false;
      state.isInfoError = true;
      return { ...state };
    // note Lead
    case actionTypes.DETAILS_LEAD_NOTE_SUCCESS:
      state.objNote.arrNote = action.list;
      state.objNote.load.isRefreshing = false;
      state.objNote.load.isError = false;
      return { ...state };
    case actionTypes.DETAILS_LEAD_NOTE_FAILED:
      state.objNote.load.isRefreshing = false;
      state.objNote.load.isError = true;
      return { ...state };
    // task Lead
    case actionTypes.DETAILS_LEAD_MISSION_SUCCESS:
      state.objMission.arrMission = action.list;
      state.objMission.load.isRefreshing = false;
      state.objMission.load.isError = false;
      return { ...state };
    case actionTypes.DETAILS_LEAD_MISSION_FAILED:
      state.objMission.load.isRefreshing = false;
      state.objMission.load.isError = true;
      return { ...state };
    case actionTypes.DETAILS_LEAD_APPOINTMENT_SUCCESS:
      state.objAppointment.arrAppointment = action.list;
      state.objAppointment.load.isRefreshing = false;
      state.objAppointment.load.isError = false;
      return { ...state };
    case actionTypes.DETAILS_LEAD_APPOINTMENT_FAILED:
      state.objAppointment.load.isRefreshing = false;
      state.objAppointment.load.isError = true;
      return { ...state };
    // file Lead
    case actionTypes.DETAILS_LEAD_FILE_SUCCESS:
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
    case actionTypes.DETAILS_LEAD_FILE_FAILED:
      state.objFile.load.isRefreshing = false;
      state.objFile.load.isLoadMore = false;
      state.objFile.load.isError = true;
      return { ...state };
    // interactive Lead
    case actionTypes.DETAILS_LEAD_INTERACTIVE_SUCCESS:
      state.objInteractive.arrInteractive = action.list;
      state.objInteractive.load.isRefreshing = false;
      state.objInteractive.load.isError = false;
      return { ...state };
    case actionTypes.DETAILS_LEAD_INTERACTIVE_FAILED:
      state.objInteractive.load.isRefreshing = false;
      state.objInteractive.load.isError = true;
      return { ...state };
    // activity Lead
    case actionTypes.DETAILS_LEAD_ACTIVITY_SUCCESS:
      state.objActivity.arrActivity = action.list;
      state.objActivity.load.isRefreshing = false;
      state.objActivity.load.isError = false;
      return { ...state };
    case actionTypes.DETAILS_LEAD_ACTIVITY_FAILED:
      state.objActivity.load.isRefreshing = false;
      state.objActivity.load.isError = true;
      return { ...state };
    // setRefreshingLead
    case actionTypes.SET_LOADING_DETAILS_LEAD_INFO:
      state.isInfoLoading = action.isRefreshing || true;
      state.isInfoError = false;
      return { ...state };
    case actionTypes.SET_LOADING_DETAILS_LEAD_INTERACTIVE:
      state.objInteractive.load.isRefreshing = action.isRefreshing || true;
      state.objInteractive.load.isError = false;
      return { ...state };
    case actionTypes.SET_LOADING_DETAILS_LEAD_NOTE:
      state.objNote.load.isRefreshing = action.isRefreshing || true;
      state.objNote.load.isError = false;
      return { ...state };
    case actionTypes.SET_LOADING_DETAILS_LEAD_ACTIVITY:
      state.objActivity.load.isRefreshing = action.isRefreshing || true;
      state.objActivity.load.isError = false;
      return { ...state };
    case actionTypes.SET_LOADING_DETAILS_LEAD_FILE:
      state.objFile.load.isRefreshing = action.isRefreshing || true;
      state.objFile.load.isError = false;
      return { ...state };
    case actionTypes.SET_LOADING_DETAILS_LEAD_MISSION:
      state.objMission.load.isRefreshing = action.isRefreshing || true;
      state.objMission.load.isError = false;
      return { ...state };
    case actionTypes.SET_LOADING_DETAILS_LEAD_APPOINTMENT:
      state.objAppointment.load.isRefreshing = action.isRefreshing || true;
      state.objAppointment.load.isError = false;
      return { ...state };
    case actionTypes.SET_LEAD_ID:
      state.leadId = action.leadId;
      return { ...state };
    case actionTypes.SET_EMPTY_LEAD:
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
