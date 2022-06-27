import { TypeCriteria } from '@helpers/constants';

export interface BodyMethodPostModel {
  criteriaRank?: number;
  endDate?: string | null;
  organizationUnitId?: string | null;
  startDate?: string | null;
  FilterTimeType?: number | null; //1: Ngày, 2: Tuần, 3: Tháng, 4: Quý, 5: Năm, 99: Tùy chọn
  idTime?: number;
  kpiType?: number;
}

export interface Body2MethodPostModel {
  startTime: string;
  endTime: string;
  userId: string | null;
  organizationUnitId: string | null;
  filterType: 1 | 2;
  idTime?: number;
  FilterTimeType?: number | null; //1: Ngày, 2: Tuần, 3: Tháng, 4: Quý, 5: Năm, 99: Tùy chọn
}

export interface ParamsMethodGetLeadModel {
  MaxResultCount?: number;
  SkipCount?: number;
  OrganizationUnitId: string;
  filterType: number;
  filter?: string;
}

export interface ParamsMethodGetContactModel {
  skipCount?: number;
  maxResultCount?: number;
  OrganizationUnitId: string;
  filterType: number;
  filter?: string;
}

export interface ParamsMethodGetListModel {
  skipCount?: number;
  maxResultCount?: number;
  OrganizationUnitId: string;
  filterType: number;
  filter?: string;
}

export interface ParamsLeadModel {
  type?: 1 | 2;
  hiddenSomething?: boolean;
  isDetail?: boolean;
}

export interface LoadingReducer {
  isRefreshing: boolean;
  isError: boolean;
  isLoadMore?: boolean;
}

export interface ParamsFile {
  menuId: TypeCriteria;
  ObjectId: number | string;
  SkipCount: number;
  TakeResultCount: number;
  FileType?: number | null;
}

export interface BodyPipeLine {
  leadId?: number;
  dealId?: number;
  note?: string;
  pipelineId: number;
  failureReasonId?: number;
}

export interface BodyNote {
  content: string;
  leadId?: number | string;
  contactId?: number | string;
  customerId?: number | string;
  dealId?: number | string;
  id?: string | null;
}

export interface BodyTask {
  id: string;
  title?: string;
  type?: number;
  ownerId?: string;
  duration?: string;
  result?: number;
  description?: string;
  completed?: boolean;
  finishDay?: string;
  relatedObject?: string;
  collaborators?: string[] | null;
}

export interface NavigationDetails {
  navigation: any;
  route: {
    key: string;
    name: string;
    params: {
      key: number;
      page: number;
      isGoback: boolean;
    };
  };
}
