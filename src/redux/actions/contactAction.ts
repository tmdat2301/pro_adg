import actionTypes from '../actionTypes';
import { ContactItem } from '@interfaces/contact.interface';
import { ItemOrganization, ItemOrganizationList } from '@interfaces/dashboard.interface';

export const changeBodyFilter = (body: {
  organizationItem: ItemOrganization | ItemOrganizationList | null;
  filterType: number;
  filter?: string;
}) => {
  return {
    type: actionTypes.FILTER_lIST_CONTACT,
    body: body,
  };
};

export const getListContactRequest = (body: {
  maxResultCount: number;
  skipCount: number;
  organizationUnitId: string;
  filterType: number;
  filter?: string;
}) => {
  return {
    type: actionTypes.GET_DATA_LIST_CONTACT_REQUEST,
    body: body,
  };
};

export const getListContactFailed = (error: string) => {
  return {
    type: actionTypes.GET_DATA_LIST_CONTACT_FAILED,
    error,
  };
};

export const getListContactSuccess = (response: { total: number; listData: ContactItem[] }) => {
  return {
    type: actionTypes.GET_DATA_LIST_CONTACT_SUCCESS,
    response,
  };
};

export const setContactId = (contactId: number | string) => {
  return {
    type: actionTypes.SET_CONTACT_ID,
    contactId,
  };
};
