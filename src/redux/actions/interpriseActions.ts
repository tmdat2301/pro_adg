import actionTypes from '../actionTypes';
import { InterpriseItem } from '@interfaces/interprise.interface';
import { ItemOrganization, ItemOrganizationList } from '@interfaces/dashboard.interface';

export const changeBodyFilter = (body: {
  organizationItem: ItemOrganization | ItemOrganizationList | null;
  filterType: number;
  filter?: any;
}) => {
  return {
    type: actionTypes.FILTER_lIST_INTERPRISE,
    body: body,
  };
};

export const getListInterpriseRequest = (body: {
  maxResultCount: number;
  skipCount: number;
  organizationUnitId: string;
  filterType: number;
  filter?: any;
}) => {
  return {
    type: actionTypes.GET_DATA_LIST_INTERPRISE_REQUEST,
    body: body,
  };
};

export const getListInterpriseFailed = (error: string) => {
  return {
    type: actionTypes.GET_DATA_LIST_INTERPRISE_FAILED,
    error,
  };
};

export const getListInterpriseSuccess = (response: { total: number; listData: InterpriseItem[] }) => {
  return {
    type: actionTypes.GET_DATA_LIST_INTERPRISE_SUCCESS,
    response,
  };
};

export const setCorporateId = (corporateId: number | string) => {
  return {
    type: actionTypes.SET_CORPORATE_ID,
    corporateId,
  };
};
