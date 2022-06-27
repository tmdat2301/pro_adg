import { TaskList } from '@interfaces/TaskList';
import actionTypes from '../actionTypes';

export const getListTaskRequest = (body: {
  // userId: number | null; // tìm kiếm theo người dùng 
  // filterType: number; // 1 : tìm kiếm theo người dùng 2 : tìm kiếm theo phòng ban 
  startTime: Date | string; // ngày bắt đầu lọc
  endTime: Date | string; // ngày kết thúc lọc
  filter: string; // Text tìm kiếm
  type: number | null; // 0 or null là allnumber; 1 là nhiệm vụnumber; 2 là cuộc hẹn
  page: number;
  pageSize: number;
  userId: string;
}) => {
  return {
    type: actionTypes.TASK_REQUEST,
    body: body,
  };
};

export const getListTaskFailed = (error: string) => {
  return {
    type: actionTypes.TASK_FAILED,
    error,
  };
};

export const getListTaskSuccess = (response: { total: number; listData: TaskList[] }) => {
  return {
    type: actionTypes.TASK_SUCCESS,
    response,
  };
};

