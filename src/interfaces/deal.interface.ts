import { fieldExtensionChild, onsFieldExtension, PipeLinesDetails } from './lead.interface';

export interface ListDealPhoneNumber {
  phoneNumber: string;
  isMain: boolean;
}
export interface DealItem {
  listContactPhoneNumber: { isMain: boolean; phoneNumber: string }[];
  contactName: string;
  pipelinePositionId: number;
  dealTextStatus: number;
  name: string;
  expectationValue: string;
  expectationEndDate?: any;
  actualEndDate?: any;
  productName: string;
  sourceName: string;
  note?: any;
  pipelineName: string;
  ownerName: string;
  failureReason: string;
  lastActivities?: any;
  dealCode: string;
  createdName: string;
  creationTime: string;
  updatedName?: any;
  lastModificationTime?: any;
  utmsource?: any;
  utmcampaign?: any;
  utmcontent?: any;
  utmmedium?: any;
  utmterm?: any;
  corporateName: string;
  dealName: string;
  companyPipelineName: string;
  tags: string;
  expectationValueCurency?: any;
  abpOwnerEmail: string;
  abpOwnerId: string;
  // statusCurrentPipeline: boolean;
  // dealStatus: number;
  // lastNote: string;
  // isDealKeyAccount: boolean;
  // isDealKeyAccountPotential: boolean;
  // isCustomerKeyAccount: boolean;
  // isCustomerKeyAccountPotential: boolean;
  // lastStatusChangeCreateTime: Date;
  lastStatusChangeModifyTime?: any;
  lastDealTime?: any;
  // listDealPhoneNumber: ListDealPhoneNumber[];
  // allowRevokeToBrachPool: boolean;
  fieldExtensionText?: fieldExtensionChild[] | null;
  fieldExtensionNumber?: fieldExtensionChild[] | null;
  fieldExtensionDate?: fieldExtensionChild[] | null;
  fieldExtensionChoice?: fieldExtensionChild[] | null;
  fieldExtensionMultiSelect?: any;
  id: number;
}
export interface DealDetailsModel {
  abpOwnerEmail: string;
  accountId: string | null;
  actualEndDate: string | null;
  allowRevokeToBrachPool: boolean;
  choiceExtension: string | null;
  companyPipelineId: number;
  companyPipelineName: string;
  contacts: ItemChild[];
  corporateName: string;
  createdName: string | null;
  creationTime: string;
  currentPipelineId: number;
  customerId: string | null;
  dateTimeExtension: string | null;
  dealCode: string;
  dealStatus: number;
  dealStatusName: string;
  expectationEndDate: string | null;
  expectationValue: number;
  failureReason: string;
  failureReasonId: number | string | null;
  fieldExtensionChoice: fieldExtensionChild[];
  fieldExtensionDate: fieldExtensionChild[];
  fieldExtensionMultiSelect: fieldExtensionChild[];
  fieldExtensionNumber: fieldExtensionChild[];
  fieldExtensionText: fieldExtensionChild[];
  fields: string | null;
  hiddenInfo: boolean;
  id: number;
  isDealReturn: boolean;
  itemCode: string;
  itemType: string;
  lastActivities: string | null;
  lastActivitiesTime: string | null;
  lastModificationTime: string | null;
  multiSelectExtension: string | null;
  name: string;
  note: string | null;
  numberExtension: string | null;
  orders: any[];
  ownerId: string;
  ownerName: string;
  pipelinePositionId: number;
  pipelinePositionName: string;
  pipelines: PipeLinesDetails[];
  productName: string;
  products: ItemChild[];
  projectId: number | string | null;
  projectName: string;
  retailerId: number | string | null;
  retailerName: string;
  sourceId: number;
  sourceName: string;
  tags: string[];
  textExtension: onsFieldExtension;
  updatedName: string | null;
  utmcampaign: string | null;
  utmcontent: string | null;
  utmmedium: string | null;
  utmsource: string | null;
  utmterm: string | null;
}

export interface ItemChild {
  id: number;
  name: string;
}

export interface ItemDealDetails {
  abpOwnerId: string;
  expectationEndDate: string;
  hiddenInfo: boolean;
  id: number;
  name: string;
  ouName: string;
  ownerName: string;
  pipelinePositionId: number;
  price: number;
  products: string;
  statusName: string;
}

export interface DealDetails {
  dealFailure: number;
  dealNormal: number;
  dealSuccess: number;
  deals: ItemDealDetails[];
  sumValueDealFailure: number;
  sumValueDealNormal: number;
  sumValueDealSuccess: number;
}

export interface PipeLineStatusDeal {
  label: number;
  pipelinePositionId: number;
  value: string;
}

export interface BodyDeal {
  accountId: string | null;
  choiceExtension: {};
  companyName: string;
  companyPipelineId: number;
  contactIds: number[];
  customerId: string | null;
  dateTimeExtension: {};
  expectationValue: number;
  id: number | null;
  multiSelectExtension: {};
  name: string;
  numberExtension: {};
  ownerName: string;
  pipelineId: number;
  productIds: number[];
  sourceId: number;
  textExtension: {};
  failureReason?: number;
}

export interface Mobile {
  isMain: boolean;
  code: string;
  phoneNational: number;
  phoneNumber: string;
  countryCode: number;
  phoneE164: string;
}

export interface DataContactByDeal {
  name: string;
  id: number;
  emails: string[];
  mobiles: Mobile[];
}
