import { TaskSummaryModel } from './../../interfaces/dashboard.interface';
import {
  DataChart,
  DealSummaryModel,
  ItemCountTask,
  ItemListTask,
  ItemReportTask,
  KPIModel,
  LeadSummaryModel,
  StaffRankItem,
} from '@interfaces/dashboard.interface';
import actionTypes from '../actionTypes';

export interface IBusinessReducer {
  arrRank: StaffRankItem[];
  arrPreviousPeriod: DataChart[];
  arrThisPeriod: DataChart[];
  arrReportTask: ItemReportTask[];
  arrCountTask: ItemCountTask[];
  arrListTask: ItemListTask[];
  objLeadSummary: LeadSummaryModel;
  objDealSummary: DealSummaryModel;
  objKPIOverview: KPIModel;
  objTaskSummary: TaskSummaryModel;
  isFirstLoading: boolean;
  isRefreshing: boolean;
  type: string;
  totalCountTask: number;
  pageListTask: number;
}

export interface IBusinessProps {
  type: string;
  arrRank?: StaffRankItem[];
  arrPreviousPeriod?: DataChart[];
  arrThisPeriod?: DataChart[];
  objLeadSummary?: LeadSummaryModel;
  objDealSummary?: DealSummaryModel;
  objKPIOverview?: KPIModel;
  refreshing?: boolean;
  list: any[];
  countTask: ItemCountTask[];
  reportTask: ItemReportTask[];
  summaryTask?: TaskSummaryModel;

}

const initialState: IBusinessReducer = {
  arrRank: [],
  arrPreviousPeriod: [],
  arrThisPeriod: [],
  isFirstLoading: true,
  isRefreshing: false,
  objDealSummary: {
    averageLifeCircleInfo: {
      days: 0,
      endDealCount: 0,
    },
    averageValueInfo: {
      averageDealValue: 0,
      totalDeal: 0,
    },
    potentialDealInfo: {
      hotDealCount: 0,
      potentialDealCount: 0,
      potentialDealValue: 0,
    },
  },
  objLeadSummary: {
    potentialLead: 0,
    conversionLead: 0,
    conversionPercent: 0,
    newLead: 0,
    newPercent: 0,
  },
  objKPIOverview: {
    chartItems: [],
    completionPercent: 0,
    currentPeriodValue: 0,
    decrease: false,
    equal: false,
    estimateValue: 0,
    grownthPercent: 0,
    grownthPercentAbsolute: 0,
    hasKPIPlan: false,
    kpiType: '',
    kpiTypeId: 0,
    recentPeriodValue: 0,
    grownUp: false,
  },
  type: '',
};

export default (state = initialState, action: IBusinessProps) => {
  state.type = action.type;
  switch (action.type) {
    case actionTypes.KPI_OVERVIEW_SUCCESS:
      state.arrThisPeriod = action.arrThisPeriod ? action.arrThisPeriod : [];
      state.arrPreviousPeriod = action.arrPreviousPeriod ? action.arrPreviousPeriod : [];
      if (action.objKPIOverview) {
        state.objKPIOverview = action.objKPIOverview;
      }
      state.isFirstLoading = false;
      state.isRefreshing = false;
      return {
        ...state,
      };
    case actionTypes.KPI_OVERVIEW_FAILED:
      state.isFirstLoading = false;
      state.isRefreshing = false;
      return {
        ...state,
      };
    case actionTypes.STAFF_RANK_SUCCESS:
      state.arrRank = action.arrRank ? action.arrRank : [];
      return {
        ...state,
      };
    case actionTypes.STAFF_RANK_FAILED:
      return state;
    case actionTypes.LEAD_SUMMARY_SUCCESS:
      if (action.objLeadSummary) {
        state.objLeadSummary = action.objLeadSummary;
      }
      return {
        ...state,
      };
    case actionTypes.LEAD_SUMMARY_FAILED:
      return state;
    case actionTypes.DEAL_SUMMARY_SUCCESS:
      if (action.objDealSummary) {
        state.objDealSummary = action.objDealSummary;
      }
      return {
        ...state,
      };
    case actionTypes.DEAL_SUMMARY_FAILED:
      return state;
    case actionTypes.BUSINESS_REFRESHING:
      state.isRefreshing = action.refreshing ? action.refreshing : false;
      return { ...state };
    default:
      return state;
  }
};
