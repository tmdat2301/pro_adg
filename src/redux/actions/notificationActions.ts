import actionTypes from '@redux/actionTypes';

export const setNotificationUnread = (count: number) => {
  return {
    type: actionTypes.SET_UNREAD_NOTIFICATION,
    count,
  };
};
