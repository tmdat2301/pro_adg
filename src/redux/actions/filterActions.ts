import {
  ItemActivityType,
  ItemOrganization,
  ItemOrganizationList,
  ItemOrganizationUnitList,
} from '@interfaces/dashboard.interface';
import { Body2MethodPostModel, BodyMethodPostModel } from '@interfaces/params.interface';
import { UserDetailModel } from '@interfaces/profile.interface';
import actionTypes from '../actionTypes';

export const organizationDropDownRequest = () => {
  return {
    type: actionTypes.ORGANIZATION_DROPDOWN_REQUEST,
  };
};

export const organizationDropDownSuccess = (list: ItemOrganization[], listDashboard: ItemOrganization[]) => {
  return {
    type: actionTypes.ORGANIZATION_DROPDOWN_SUCCESS,
    list,
    listDashboard,
  };
};

export const organizationDropDownFailed = (errorMessage: string) => {
  return {
    type: actionTypes.ORGANIZATION_DROPDOWN_FAILED,
    errorMessage: errorMessage,
  };
};

export const getOrganizationRequest = () => {
  return {
    type: actionTypes.GET_ORGANIZATION_REQUEST,
  };
};

export const getOrganizationSuccess = (organizationList: ItemOrganizationUnitList[]) => {
  return {
    type: actionTypes.GET_ORGANIZATION_SUCCESS,
    organizationList,
  };
};

export const getOrganizationFailed = (errorMessage: string) => {
  return {
    type: actionTypes.GET_ORGANIZATION_FAILED,
    errorMessage: errorMessage,
  };
};

export const setFilterBusiness = (filterBusiness: BodyMethodPostModel) => {
  return {
    type: actionTypes.SET_FILTER_BUSINESS,
    filterBusiness,
  };
};
export const setFilterActivity = (filterActivity: Body2MethodPostModel) => {
  return {
    type: actionTypes.SET_FILTER_ACTIVITY,
    filterActivity,
  };
};

export const setOrganizationFilter = (organizationItem: ItemOrganization) => {
  return {
    type: actionTypes.SET_ORGANIZATION_FILTER,
    organizationItem,
  };
};

export const setUserFilter = (
  filterUser: UserDetailModel | null,
  organizationActivity: ItemOrganization | ItemOrganizationList | null,
) => {
  return {
    type: actionTypes.SET_USER_FILTER,
    filterUser,
    organizationActivity,
  };
};

export const activityTypeRequest = () => {
  return {
    type: actionTypes.ACTIVITY_TYPE_REQUEST,
  };
};

export const activityTypeSuccess = (listType: ItemActivityType[]) => {
  return {
    type: actionTypes.ACTIVITY_TYPE_SUCCESS,
    listType,
  };
};

export const activityTypeFailed = () => {
  return {
    type: actionTypes.ACTIVITY_TYPE_FAILED,
  };
};
