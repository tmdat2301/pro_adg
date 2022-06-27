import { TaskSummaryModel } from './../../interfaces/dashboard.interface';
import { ItemCountTask, ItemListTask, ItemReportTask } from '@interfaces/dashboard.interface';
import actionTypes from '../actionTypes';

export interface IActivityReducer {
  arrReportTask: ItemReportTask[];
  arrCountTask: ItemCountTask[];
  arrListTask: ItemListTask[];
  objTaskSummary: TaskSummaryModel;
  isFirstLoading: boolean;
  isRefreshing: boolean;
  type: string;
  totalCountTask: number;
  pageListTask: number;
}

export interface IActivityProps {
  type: string;
  refreshing?: boolean;
  list: any[];
  countTask: ItemCountTask[];
  reportTask: ItemReportTask[];
  summaryTask?: TaskSummaryModel;
  page: number;
  totalCount: number;
}

const initialState: IActivityReducer = {
  arrCountTask: [],
  arrListTask: [],
  totalCountTask: 10,
  pageListTask: 0,
  arrReportTask: [],
  isFirstLoading: true,
  isRefreshing: false,
  objTaskSummary: {
    totalAppointment: 0,
    totalTime: {
      day: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      totalHours: 0,
    },
    averageTime: {
      day: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      totalHours: 0,
    },
  },
  type: '',
};

export default (state = initialState, action: IActivityProps) => {
  state.type = action.type;
  switch (action.type) {
    case actionTypes.REPORT_TASK_SUCCESS:
      if (action.reportTask) {
        state.arrReportTask = action.reportTask;
      }
      return {
        ...state,
      };
    case actionTypes.REPORT_TASK_FAILED:
      return state;
    case actionTypes.COUNT_TASK_SUCCESS:
      if (action.countTask) {
        state.arrCountTask = action.countTask;
        return {
          ...state,
        };
      }
      return state;
    case actionTypes.COUNT_TASK_FAILED:
      return state;
    case actionTypes.LIST_TASK_DATE_REQUEST:
      state.isRefreshing = true;
      return {
        ...state,
      };
    case actionTypes.LIST_TASK_DATE_SUCCESS:
      if (action.page === 1) {
        state.arrListTask = action.list;
      } else {
        state.arrListTask = [...state.arrListTask, ...action.list];
      }
      state.isRefreshing = false;
      return {
        ...state,
        pageListTask: action.page,
        totalCountTask: action.totalCount,
      };
    case actionTypes.LIST_TASK_DATE_FAILED:
      state.isRefreshing = false;
      return state;
    case actionTypes.TASK_SUMMARY_SUCCESS:
      if (action.summaryTask) {
        state.objTaskSummary = action.summaryTask;
      }
      state.isRefreshing = false;
      return {
        ...state,
      };
    case actionTypes.TASK_SUMMARY_FAILED:
      state.isRefreshing = false;
      return state;
    default:
      return state;
  }
};
