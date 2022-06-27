import { DealItem } from '@interfaces/deal.interface';
import { ParamsMethodGetListModel } from '@interfaces/params.interface';
import actionTypes from '../actionTypes';
import { ItemOrganization } from '@interfaces/dashboard.interface';

export interface DealReducers {
  arrDeal: DealItem[];
  type: string;
  filter: ParamsMethodGetListModel;
  errorMessage: string;
  totalCount: number;
  currentOrganization: ItemOrganization | null;
}

const initialState: DealReducers = {
  arrDeal: [],
  type: '',
  filter: {
    OrganizationUnitId: '641a808f-e24b-4241-a177-c3c7a6cc602f', //todo
    filterType: 0,
    filter: '[]',
  },
  errorMessage: '',
  totalCount: 0,
  currentOrganization: null,
};
export default (state = initialState, action: any) => {
  state.type = action.type;
  switch (action.type) {
    case actionTypes.GET_DATA_LIST_DEAL_FAILED:
      return {
        ...state,
        errorMessage: action.error,
      };
    case actionTypes.FILTER_lIST_DEAL:
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
    case actionTypes.GET_DATA_LIST_DEAL_SUCCESS:
      return {
        ...state,
        arrDeal: action.response.listData,
        errorMessage: '',
        totalCount: action.response.total,
      };
    default:
      return state;
  }
};
