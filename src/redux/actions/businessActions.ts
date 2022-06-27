import {
  DataChart,
  DealSummaryModel,
  ItemCountTask,
  ItemListTask,
  ItemReportTask,
  KPIModel,
  LeadSummaryModel,
  StaffRankItem,
  TaskSummaryModel,
} from '@interfaces/dashboard.interface';
import { Body2MethodPostModel, BodyMethodPostModel } from '@interfaces/params.interface';
import actionTypes from '../actionTypes';

export const kpiOverviewRequest = (body: BodyMethodPostModel) => {
  return {
    type: actionTypes.KPI_OVERVIEW_REQUEST,
    body,
  };
};

export const kpiOverviewSuccess = (
  arrThisPeriod: DataChart[],
  arrPreviousPeriod: DataChart[],
  objKPIOverview: KPIModel,
) => {
  return {
    type: actionTypes.KPI_OVERVIEW_SUCCESS,
    arrThisPeriod,
    arrPreviousPeriod,
    objKPIOverview,
  };
};

export const kpiOverviewFailed = () => {
  return {
    type: actionTypes.KPI_OVERVIEW_FAILED,
  };
};

export const leadSummaryRequest = (body: BodyMethodPostModel) => {
  return {
    type: actionTypes.LEAD_SUMMARY_REQUEST,
    body,
  };
};

export const leadSummarySuccess = (objLeadSummary: LeadSummaryModel) => {
  return {
    type: actionTypes.LEAD_SUMMARY_SUCCESS,
    objLeadSummary,
  };
};

export const leadSummaryFailed = (error?: string) => {
  return {
    type: actionTypes.LEAD_SUMMARY_FAILED,
    error,
  };
};

export const dealSummaryRequest = (body: BodyMethodPostModel) => {
  return {
    type: actionTypes.DEAL_SUMMARY_REQUEST,
    body,
  };
};

export const dealSummarySuccess = (objDealSummary: DealSummaryModel) => {
  return {
    type: actionTypes.DEAL_SUMMARY_SUCCESS,
    objDealSummary,
  };
};

export const dealSummaryFailed = (error?: string) => {
  return {
    type: actionTypes.DEAL_SUMMARY_FAILED,
    error,
  };
};

export const staffRankRequest = (body: BodyMethodPostModel) => {
  return {
    type: actionTypes.STAFF_RANK_REQUEST,
    body,
  };
};

export const staffRankSuccess = (arrRank: StaffRankItem[]) => {
  return {
    type: actionTypes.STAFF_RANK_SUCCESS,
    arrRank,
  };
};

export const staffRankFailed = (error?: string) => {
  return {
    type: actionTypes.STAFF_RANK_FAILED,
    error,
  };
};

export const setRefreshing = (refreshing: boolean) => {
  return {
    type: actionTypes.BUSINESS_REFRESHING,
    refreshing,
  };
};

// REPORT_TASK_REQUEST: 'REPORT_TASK_REQUEST',
// REPORT_TASK_SUCCESS: 'REPORT_TASK_SUCCESS',
// REPORT_TASK_FAILED: 'REPORT_TASK_FAILED',
// COUNT_TASK_REQUEST: 'COUNT_TASK_REQUEST',
// COUNT_TASK_SUCCESS: 'COUNT_TASK_SUCCESS',
// COUNT_TASK_FAILED: 'COUNT_TASK_FAILED',
// LIST_TASK_DATE_REQUEST: 'LIST_TASK_DATE_REQUEST',
// LIST_TASK_DATE_SUCCESS: 'LIST_TASK_DATE_SUCCESS',
// LIST_TASK_DATE_FAILED: 'LIST_TASK_DATE_FAILED',
// ACTIVITY_REFRESHING: 'BUSINESS_REFRESHING',

export const reportTaskRequest = (body: Body2MethodPostModel) => {
  return {
    type: actionTypes.REPORT_TASK_REQUEST,
    body,
  };
};

export const reportTaskSuccess = (reportTask: ItemReportTask[]) => {
  return {
    type: actionTypes.REPORT_TASK_SUCCESS,
    reportTask,
  };
};

export const reportTaskFail = () => {
  return {
    type: actionTypes.REPORT_TASK_FAILED,
  };
};

export const countTaskRequest = (body: Body2MethodPostModel) => {
  return {
    type: actionTypes.COUNT_TASK_REQUEST,
    body,
  };
};

export const countTaskSuccess = (countTask: ItemCountTask[]) => {
  return {
    type: actionTypes.COUNT_TASK_SUCCESS,
    countTask,
  };
};

export const countTaskFail = () => {
  return {
    type: actionTypes.COUNT_TASK_FAILED,
  };
};

export const taskSummaryRequest = (body: Body2MethodPostModel) => {
  return {
    type: actionTypes.TASK_SUMMARY_REQUEST,
    body,
  };
};

export const taskSummarySuccess = (summaryTask: TaskSummaryModel) => {
  return {
    type: actionTypes.TASK_SUMMARY_SUCCESS,
    summaryTask,
  };
};

export const taskSummaryFailed = () => {
  return {
    type: actionTypes.TASK_SUMMARY_FAILED,
  };
};

export const getListTaskRequest = (body: {
  userId: string | null;
  organizationUnitId: string | null;
  filterType: 1 | 2;
  date: string;
  type: 0;
  page: number;
  pageSize: number;
}) => {
  return {
    type: actionTypes.LIST_TASK_DATE_REQUEST,
    body,
  };
};

export const getListTaskSuccess = (list: ItemListTask[], page: number, totalCount: number) => {
  return {
    type: actionTypes.LIST_TASK_DATE_SUCCESS,
    list,
    page,
    totalCount,
  };
};

export const getListTaskFail = () => {
  return {
    type: actionTypes.LIST_TASK_DATE_FAILED,
  };
};
