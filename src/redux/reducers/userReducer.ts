import { ProfileModel, userInfo } from '@interfaces/profile.interface';
import { setTenantName, setToken } from '@services/serviceHandle';
import actionTypes from '../actionTypes';

export interface IUserReducer {
  accessToken: string;
  data?: ProfileModel | null;
  tenantInfo: { tenantLogo: string; tenantName: string; tenantId: string };
  type: string;
  errorMessage: string;
  userInfo?: userInfo | null;
  mapInfo?: { url: string; key: string };
}
const initialState: IUserReducer = {
  accessToken: '',
  data: null,
  tenantInfo: { tenantLogo: '', tenantName: '', tenantId: '' },
  type: '',
  errorMessage: '',
  userInfo: null,
  mapInfo: { url: '', key: '' },
};

export default (state = initialState, action: any) => {
  state.type = action.type;
  if (
    action.type.includes('FAILED') &&
    action.type !== actionTypes.LOGIN_FAILED &&
    !!action?.error &&
    action?.error?.toLowerCase() === 'Invalid token'.toLowerCase()
  ) {
    setToken('');
    setTenantName('');
    return initialState;
  }
  switch (action.type) {
    case actionTypes.GET_TENANT_BY_NAME_FAILED:
      return {
        ...state,
        errorMessage: action.error,
      };
    case actionTypes.GET_TENANT_BY_NAME_SUCCESS:
      return {
        ...state,
        tenantInfo: {
          tenantLogo: '',
          tenantName: action.response?.name ?? '',
          tenantId: action.response?.tenantId ?? '',
        },
        errorMessage: '',
      };
    case actionTypes.LOGIN_FAILED:
      return {
        ...state,
        errorMessage: action.error,
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        data: action.response.data,
        accessToken: action.response.access_token,
        errorMessage: '',
      };
    case actionTypes.LOGOUT:
      setToken('');
      return {
        ...initialState,
      };
    case actionTypes.GET_PROFILE_USER_FAILED:
      return {
        ...state,
        errorMessage: action.error,
      };
    case actionTypes.GET_PROFILE_USER_SUCCESS:
      return {
        ...state,
        type: action.type,
        userInfo: action.response.data,
        errorMessage: '',
      };
    case actionTypes.GET_MAP_KEY_SUCCESS:
      return {
        ...state,
        errorMessage: '',
        mapInfo: { url: action.response?.data?.host, key: action.response?.data?.apiKey },
      };
    default:
      return state;
  }
};
