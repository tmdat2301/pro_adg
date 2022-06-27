import { ItemLocates } from './lead.interface';

export interface KPIModel {
  kpiTypeId: number | null;
  kpiType: string | null;
  currentPeriodValue: number;
  recentPeriodValue: number;
  grownthPercent: number;
  grownthPercentAbsolute: number;
  grownUp: boolean;
  decrease: boolean;
  equal: boolean;
  hasKPIPlan: boolean;
  estimateValue: number;
  completionPercent: number;
  chartItems: ChartItems[];
}

export interface ChartItems {
  lable: string;
  description: string;
  value: number;
  type: string;
}

export interface RankItems {
  email: string;
  fullName: string;
  index: number;
  sumDeal: number;
  timeDeal: string;
  totalDeal: number;
  userId: string;
}
export interface DealSummaryModel {
  averageLifeCircleInfo: { days: number; endDealCount: number };
  averageValueInfo: { averageDealValue: number; totalDeal: number };
  potentialDealInfo: { potentialDealValue: number; potentialDealCount: number; hotDealCount: number };
}

export interface LeadSummaryModel {
  newLead: number;
  conversionLead: number;
  potentialLead: number;
  newPercent: number;
  conversionPercent: number;
}

export interface RateCompletedMission {
  percentRate: number;
  onTime: number;
  outOfDate: number;
  total: number;
  completed: number;
  inProcess: number;
}

export interface DataChart {
  x: string;
  y: number;
}

export interface ItemOrganization {
  children: ItemOrganization[] | null;
  code: string;
  id: string;
  isVirtualNode: boolean;
  label: string;
  parentId: string;
  typeId: string | null;
  typeName: string | null;
}

export interface ItemOrganizationList {
  id: string;
  parentId: string;
  label: string;
  typeId: string | null;
  typeName: string | null;
}

export interface OrganizationUnitType {
  point: number;
  name: string;
  code: string;
  order: number;
  isDeleted: boolean;
  isExtension: boolean;
}
export interface ItemOrganizationUnitList {
  id: string;
  displayName: string;
  code: string;
  retailerCode?: any;
  organizationUnitType: OrganizationUnitType;
  organizationUnitTypeId: number;
  parentId: string;
}
export interface ItemActivityType {
  id: number;
  name: string;
  icon: string;
  order: number;
}

export interface StaffRankItem {
  index: number;
  fullName: string;
  email: string;
  sumDeal: number;
  totalDeal: number;
  timeDeal: string;
  userId: string;
}

export interface DataListTask {
  totalCount: number;
  items: ItemListTask[];
}

export interface ItemListTask {
  beginTime: string;
  classify: number;
  collaborators: any[];
  completed: boolean;
  description: string;
  duration: string | null;
  endTime: string;
  id: string;
  isCheckIn: boolean;
  isCheckOut: boolean;
  latitude: string | null;
  longtitude: string | null;
  locates: ItemLocates[];
  name: string;
  ownerId: string;
  ownerName: string;
  place: string;
  placeId: string | null;
  recordId: number;
  root: number;
  statusName: string;
  title: string;
  totalCost: number;
  type: number;
  typeName: string;
}

export interface ItemReportTask {
  id: number;
  name: string;
  unfinished: number;
  complete: number;
}

export interface ItemCountTask {
  date: string;
  total: number;
}

export interface TaskSummaryModel {
  totalAppointment: number;
  totalTime: {
    day: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    totalHours: number;
  };
  averageTime: {
    day: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    totalHours: number;
  };
}
