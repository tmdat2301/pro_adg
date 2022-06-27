import { ItemOrganizationList } from '@interfaces/dashboard.interface';
import { Filter } from '@interfaces/filter.interface';
import { ItemOrganization, LeadItem } from '@interfaces/lead.interface';
import actionTypes from '../actionTypes';

export const changeBodyFilter = (body: {
  filterType: number;
  organizationItem: ItemOrganization | ItemOrganizationList | null;
  filter?: any;
}) => {
  return {
    type: actionTypes.FILTER_lIST_LEAD,
    body: body,
  };
};

export const getListLeadRequest = (body: {
  maxResultCount: number;
  skipCount: number;
  organizationUnitId: string;
  filterType: number;
  filter?: any;
}) => {
  return {
    type: actionTypes.GET_DATA_LIST_LEAD_REQUEST,
    body: body,
  };
};

export const getListLeadFailed = (error: string) => {
  return {
    type: actionTypes.GET_DATA_LIST_LEAD_FAILED,
    error,
  };
};

export const getListLeadSuccess = (response: { total: number; listData: LeadItem[] }) => {
  return {
    type: actionTypes.GET_DATA_LIST_LEAD_SUCCESS,
    response,
  };
};

export const setOrganizationFilter = (organizationItem: ItemOrganization) => {
  return {
    type: actionTypes.SET_ORGANIZATION_FILTER,
    organizationItem,
  };
};
export const setLeadId = (leadId: number | string) => {
  return {
    type: actionTypes.SET_LEAD_ID,
    leadId,
  };
};
export const getFilterList = (params: string, filterType: string) => {
  return {
    type: actionTypes.GET_FILTER_LIST,
    payload: params,
    filterType,
  };
};
export const getFilterListSuccess = (response: Filter, filterType: string) => {
  return {
    type: actionTypes.GET_FILTER_LIST_SUCCESS,
    response,
    filterType,
  };
};
export const getFilterListFailed = (error: string) => {
  return {
    type: actionTypes.GET_FILTER_LIST_FAILED,
    error,
  };
};

export const getConditionFilter = (params: string, filterType: string) => {
  return {
    type: actionTypes.GET_CONDITION_FILTER,
    payload: params,
    filterType,
  };
};
export const getConditionFilterSuccess = (response: any, filterType: string) => {
  return {
    type: actionTypes.GET_CONDITION_FILTER_SUCCESS,
    response,
    filterType,
  };
};
export const getConditionFilterFailed = (error: string) => {
  return {
    type: actionTypes.GET_CONDITION_FILTER_FAILED,
    error,
  };
};

export const confirmLeadConvert = () => {
  return {
    type: actionTypes.CONFIRM_LEAD_CONVERT_SUCCESS,
  };
};
