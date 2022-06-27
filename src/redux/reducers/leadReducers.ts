import { ItemActivityType, ItemOrganizationList } from '@interfaces/dashboard.interface';
import { ItemOrganization, LeadItem } from '@interfaces/lead.interface';
import { ParamsMethodGetLeadModel } from '@interfaces/params.interface';
import actionTypes from '../actionTypes';

export interface LeadReducers {
  arrLead: LeadItem[];
  type: string;
  filter: ParamsMethodGetLeadModel;
  errorMessage: string;
  totalCount: number;
  currentOrganization: ItemOrganization | null;
  dataFilter: { [key: string]: any[] };
  listCondition: { [key: string]: any[] };
}

const initialState: LeadReducers = {
  arrLead: [],
  type: '',
  filter: {
    OrganizationUnitId: '',
    filterType: 0,
    filter: '[]',
  },
  errorMessage: '',
  totalCount: 0,
  currentOrganization: null,
  dataFilter: {},
  listCondition: {},
};
export default (state = initialState, action: any) => {
  const filterType = action.filterType;
  state.type = action.type;
  switch (action.type) {
    case actionTypes.GET_DATA_LIST_LEAD_FAILED:
      return {
        ...state,
        errorMessage: action.error,
      };
    case actionTypes.FILTER_lIST_LEAD:
      return {
        ...state,
        filter: {
          OrganizationUnitId: action.body.organizationItem.id,
          filterType: action.body.filterType,
          filter: action.body.filter,
        },
        currentOrganization: action.body.organizationItem,
        errorMessage: '',
      };
    case actionTypes.GET_DATA_LIST_LEAD_SUCCESS:
      return {
        ...state,
        arrLead: action.response.listData,
        errorMessage: '',
        totalCount: action.response.total,
      };
    case actionTypes.GET_FILTER_LIST_SUCCESS:
      const tempFilterData = state.dataFilter;
      tempFilterData[filterType] = action.response;
      return {
        ...state,
        dataFilter: tempFilterData,
      };
    case actionTypes.GET_FILTER_LIST_FAILED:
      return {
        ...state,
        errorMessage: '',
      };
    case actionTypes.GET_CONDITION_FILTER_SUCCESS:
      const tempConditionsData = state.listCondition;
      tempConditionsData[filterType] = action.response;
      return {
        ...state,
        listCondition: tempConditionsData,
      };
    case actionTypes.GET_CONDITION_FILTER_FAILED:
      return {
        ...state,
        errorMessage: '',
      };
    case actionTypes.CONFIRM_LEAD_CONVERT_SUCCESS:
      return {
        ...state,
      };
    default:
      return state;
  }
};
