import { DealItem } from '@interfaces/deal.interface';
import actionTypes from '../actionTypes';
import { ItemOrganization, ItemOrganizationList } from '@interfaces/dashboard.interface';

export const changeBodyFilter = (body: {
  organizationItem: ItemOrganization | ItemOrganizationList | null;
  filterType: number;
  filter?: any;
}) => {
  return {
    type: actionTypes.FILTER_lIST_DEAL,
    body: body,
  };
};

export const getListDealRequest = (body: {
  maxResultCount: number;
  skipCount: number;
  organizationUnitId: string;
  filterType: number;
  filter?: any;
}) => {
  return {
    type: actionTypes.GET_DATA_LIST_DEAL_REQUEST,
    body: body,
  };
};

export const getListDealFailed = (error: string) => {
  return {
    type: actionTypes.GET_DATA_LIST_DEAL_FAILED,
    error,
  };
};

export const getListDealSuccess = (response: { total: number; listData: DealItem[] }) => {
  return {
    type: actionTypes.GET_DATA_LIST_DEAL_SUCCESS,
    response,
  };
};

export const setDealId = (dealId: number | string) => {
  return {
    type: actionTypes.SET_DEAL_ID,
    dealId,
  };
};
export const confirmDealConvert = () => {
  return {
    type: actionTypes.CONFIRM_DEAL_CONVERT_SUCCESS,
  };
};
