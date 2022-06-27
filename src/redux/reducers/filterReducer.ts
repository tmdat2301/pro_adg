import { DATE_FORMAT_EN } from '@helpers/constants';
import { ItemOrganization, ItemActivityType, ItemOrganizationUnitList } from '@interfaces/dashboard.interface';
import { Body2MethodPostModel, BodyMethodPostModel } from '@interfaces/params.interface';
import { UserDetailModel } from '@interfaces/profile.interface';
import dayjs from 'dayjs';
import actionTypes from '../actionTypes';

export interface IFilterReducer {
  filterBusiness: BodyMethodPostModel;
  filterActivity: Body2MethodPostModel;
  arrOrganizationDropDown: ItemOrganization[];
  arrOrganizationDropDownDashboard: ItemOrganization[];
  currentOrganization: ItemOrganization | null;
  organizationList: ItemOrganizationUnitList[] | null;
  type: string;
  arrTypeActivity: ItemActivityType[];
  arrTypeActivityNumber: number[];
  filterUser: UserDetailModel | null;
  organizationActivity: ItemOrganization | null;
}

export interface IFilterProps {
  type: string;
  filterBusiness: BodyMethodPostModel;
  filterActivity: Body2MethodPostModel;
  list: ItemOrganization[];
  listDashboard: ItemOrganization[];
  listType: ItemActivityType[];
  payload?: any;
  organizationItem: ItemOrganization | null;
  organizationList: ItemOrganizationUnitList[] | null;
  filterUser: UserDetailModel | null;
  organizationActivity: ItemOrganization | null;
}

const initialState: IFilterReducer = {
  filterBusiness: {
    organizationUnitId: null,
    FilterTimeType: 2,
    criteriaRank: 5,
    startDate: dayjs().startOf('weeks').format(DATE_FORMAT_EN).toString(),
    endDate: dayjs().endOf('weeks').format(DATE_FORMAT_EN).toString(),
    idTime: 2,
    kpiType: 1,
  },
  filterActivity: {
    startTime: dayjs().startOf('weeks').format(DATE_FORMAT_EN).toString(),
    endTime: dayjs().endOf('weeks').format(DATE_FORMAT_EN).toString(),
    filterType: 2,
    organizationUnitId: null,
    userId: null,
    FilterTimeType: 2,
    idTime: 2,
  },
  arrOrganizationDropDown: [],
  arrOrganizationDropDownDashboard: [],
  organizationList: null,
  currentOrganization: null,
  type: '',
  arrTypeActivity: [],
  filterUser: null,
  organizationActivity: null,
  arrTypeActivityNumber: [],
};

export default (state = initialState, action: IFilterProps) => {
  state.type = action.type;
  switch (action.type) {
    case actionTypes.ORGANIZATION_DROPDOWN_SUCCESS:
      if (action.list && action.list.length > 0) {
        state.arrOrganizationDropDown = action.list;
        // state.filterBusiness.organizationUnitId = action.list[0].id;
        // state.currentOrganization = action.list[0];
        // state.filterActivity.organizationUnitId = action.list[0].id;
        // state.organizationActivity = action.list[0];
      }
      if (action.listDashboard && action.listDashboard.length > 0) {
        state.arrOrganizationDropDownDashboard = action.listDashboard;
        state.filterBusiness.organizationUnitId = action.listDashboard[0].id;
        state.filterActivity.organizationUnitId = action.listDashboard[0].id;
        state.currentOrganization = action.listDashboard[0];
        state.organizationActivity = action.listDashboard[0];
      }
      return { ...state };
    case actionTypes.GET_ORGANIZATION_SUCCESS:
      return { ...state, organizationList: action.organizationList };
    case actionTypes.SET_ORGANIZATION_FILTER:
      if (action.organizationItem?.id) {
        state.filterBusiness.organizationUnitId = action.organizationItem?.id;
        state.currentOrganization = action.organizationItem;
      }
      return { ...state };
    case actionTypes.ORGANIZATION_DROPDOWN_FAILED:
      return state;
    case actionTypes.ACTIVITY_TYPE_SUCCESS:
      if (action.listType) {
        state.arrTypeActivity = action.listType;
        const arrNumber: number[] = [];
        for (let index = 0; index < action.listType.length; index++) {
          const element = action.listType[index];
          arrNumber.push(element.id);
        }
        state.arrTypeActivityNumber = arrNumber;
      }
      return { ...state };
    case actionTypes.ACTIVITY_TYPE_FAILED:
      return state;
    case actionTypes.SET_FILTER_BUSINESS:
      if (action.filterBusiness) {
        state.filterBusiness = { ...state.filterBusiness, ...action.filterBusiness };
      }
      return { ...state };
    case actionTypes.SET_FILTER_ACTIVITY:
      if (action.filterActivity) {
        state.filterActivity = { ...state.filterActivity, ...action.filterActivity };
      }
      return { ...state };
    case actionTypes.SET_USER_FILTER:
      state.filterActivity = {
        ...state.filterActivity,
        userId: action.filterUser?.id ?? null,
        organizationUnitId: action.organizationActivity?.id ?? null,
        filterType: action.filterUser?.id ? 1 : 2,
      };
      return { ...state, filterUser: action.filterUser, organizationActivity: action.organizationActivity };
    default:
      return state;
  }
};
