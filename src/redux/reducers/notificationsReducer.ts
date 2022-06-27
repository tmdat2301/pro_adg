import actionTypes from '../actionTypes';

export interface IUserReducer {
  type: string;
  notificationCount: number;
}
const initialState: IUserReducer = {
  type: '',
  notificationCount: 0,
};

export default (state = initialState, action: any) => {
  state.type = action.type;
  switch (action.type) {
    case actionTypes.SET_UNREAD_NOTIFICATION:
      const count: number = action.count;
      return {
        ...state,
        type: action.type,
        notificationCount: count,
      };
    default:
      return state;
  }
};
