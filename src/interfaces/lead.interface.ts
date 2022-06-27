import { CompanyPipeline } from '@components/ModalCompanyPipline';
import { FieldInputObject, LeadMobileItem, ItemVel, ContactMobilesUpper } from './contact.interface';

export interface LeadModel {
  totalCount: number;
  items: LeadItem[];
}

export interface LeadItem {
  pipelinePositionId: number;
  fullName: string | null;
  pipeLineName: string | null;
  leadCode: string | null;
  sourceName: string | null;
  productsAsString: string | null;
  ownerName: string | null;
  email: string | null;
  clasification: string | null;
  companyPipelineName: string | null;
  protectionStatus: string | null;
  failureReason: string | null;
  personalAddress: string | null;
  personalFacebook: string | null;
  tagsAsString: string | null;
  createdBy: string | null;
  createdTime: string | null;
  updatedBy: string | null;
  updatedTime: string | null;
  lastNote: string | null;
  isSharedWithCurrentUser: boolean;
  mobile: string | null;
  lastContact: string | null;
  companyName: string | null;
  companyPhoneNumber: string | null;
  companyEmail: string | null;
  website: string | null;
  fanpage: string | null;
  contactDepartment: string | null;
  contactJobTitle: string | null;
  headquarters: string | null;
  taxCode: string | null;
  invoiceAddress: string | null;
  estimateEndingTime: string | null;
  deal: string | null;
  dealValue: string | null;
  note: string | null;
  abpOwnerEmail: string | null;
  abpOwnerId: string | null;
  cdmarketing: string | null;
  utmsource: string | null;
  utmcampaign: string | null;
  utmcontent: string | null;
  utmmedium: string | null;
  utmterm: string | null;
  fieldExtensionText?: fieldExtensionChild[] | null;
  fieldExtensionNumber?: fieldExtensionChild[] | null;
  fieldExtensionDate?: fieldExtensionChild[] | null;
  fieldExtensionChoice?: fieldExtensionChild[] | null;
  fieldExtensionMultiSelect?: fieldExtensionChild[] | null;
  leadStatus: number;
  allowRevokeToBrachPool: boolean;
  id: number;
  leadTextStatus: number;
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

export interface fieldExtensionChild {
  value: string | number;
  onsFieldExtensionId: string;
  targetId: number;
  name: string;
  onsFieldExtensionCatalogId?: string;
  onsFieldExtensionCatalogIds?: string[];
}

export interface onsFieldExtension {
  additionalProp1: string | number | string[];
  additionalProp2: string | number | string[];
  additionalProp3: string | number | string[];
}

export interface ItemDetailsNote {
  content: string | null;
  creationName: string;
  creatorId: string;
  id: string;
  lastModificationTime: string;
}

export interface ItemLocates {
  creationTime: string;
  creatorId: string;
  creatorName: string;
  latitude: number;
  longtitude: number;
  placeId: string;
  type: number;
  place: string | null;
}
export interface ItemTask {
  beginTime: string;
  completed: boolean;
  createdName: string;
  createdTime: string;
  description: string;
  duration: string | null;
  endDate: string;
  endTime: string;
  finishDay: string | null;
  id: string;
  isCheckIn: boolean;
  isCheckOut: boolean;
  locates: ItemLocates[];
  latitude: number | null;
  longtitude: number | null;
  place: string;
  placeId: string | null;
  recordId: number;
  result: number | null;
  resultName: string | null;
  startDate: string;
  statusName: string;
  title: string;
  type: number;
}

export interface ItemLeadDetailData {
  allDay: boolean;
  collaborators: ItemCollaborator[];
  completed: boolean;
  costs: ItemCosts[];
  locates: ItemLocates[];
  description: string;
  duration: string | null;
  endDate: string | null;
  finishDay: string | null;
  id: string;
  ownerId: string;
  ownerName: string;
  place: string;
  recordId: number;
  recordName: string;
  relatedObject: any | null;
  result: number | null;
  resultName: string | null;
  root: number;
  startDate: string;
  title: string;
  totalCost: number;
  type: number;
  isCheckIn: boolean;
  isCheckOut: boolean;
  latitude: number | null;
  longtitude: number | null;
  placeId: string | null;
}
export interface ItemCosts {
  images: string[];
  costTypeId: string;
  costTypeName: string;
  creationTime: string;
  id: number;
  link: string | null;
  note: string | null;
  price: number;
}
export interface ItemLocates {
  creationTime: string;
  creatorId: string;
  creatorName: string;
  latitude: number;
  longtitude: number;
  placeId: string;
  type: number;
}
export interface ItemCollaborator {
  id: string;
  name: string;
}

export interface ItemDetailsInteractive {
  id: string;
  settingEmailId: number | null;
  activityCallHistoryId: number | null;
  callType: number | null;
  smsHistoryId: number | null;
  characterName: string | null;
  content: string | null;
  email: string | null;
  creationTime: string | null;
  activityTypeId: number;
  urlAudio: string | null;
  creatorName: string | null;
  creatorEmail: string | null;
  title: string | null;
  creatorId: string | null;
  callTypeAsString: string | null;
}

export interface ItemAttachFiles {
  id: number;
  ownerId: string;
  ownerName: string;
  dateCreate: string;
  fileName: string | null;
  filePath: string | null;
  fileExtension: string | null;
  fileType: number;
  fileSize: number;
  isPublic: boolean;
  canClick: boolean;
  isOwner: boolean;
  isSelected: boolean;
}

export interface DetailsAttachFilesModel {
  attachFiles: ItemAttachFiles[];
  domainSize: number;
  fileSize: number;
  objectId: number;
  totalAttachFileRecord: number;
}

export interface ItemDetailsActivity {
  id: string;
  activityName: string;
  additionalActivityName: string;
  activityTypeId: number;
  author: string;
  icon: string;
  time: string;
  createdBy: string;
  pipeLineName: string;
  settingEmailName: string;
  taskName: string;
  receiverActivityLeads: ItemReceiverActivity[];
}

export interface ItemReceiverActivity {
  userId: string;
  userName: string;
}

export interface LeadDetailsModel {
  abpOwnerEmail: string;
  accountName: string | null;
  address: string | null;
  allowRevokeToBrachPool: boolean;
  canNotRevokeToBranchPool: boolean;
  cdmarketing: string | null;
  classifyId: number | string | null;
  classifyName: string;
  companyAddress: null;
  companyEmails: EmailLeadDetails[] | null;
  companyFanpage: null;
  companyInvoiceAddress: null;
  companyName: string;
  companyPhones: LeadMobileItem[] | null;
  companyPipelineId: number;
  companyPipelineName: string;
  companyTaxCode: null;
  companyWebsite: null;
  creationTime: string;
  creatorName: string;
  customerCode: string;
  customerId: string | null;
  dateOfBirth: string | null;
  dealName: string | null;
  department: string | null;
  emails: EmailLeadDetails[] | null;
  expectationEndDate: string | null;
  expectationValue: string | null;
  facebook: string | null;
  failureReason: string | null;
  failureReasonId: number | string | null;
  fieldExtensionText: fieldExtensionChild[] | null;
  fieldExtensionNumber: fieldExtensionChild[] | null;
  fieldExtensionDate: fieldExtensionChild[] | null;
  fieldExtensionChoice: fieldExtensionChild[] | null;
  fieldExtensionMultiSelect: fieldExtensionChild[] | null;
  fromSourceId: number | string | null;
  fromSystem: number;
  fullName: string;
  hiddenInfo: boolean;
  homePhone: string | null;
  id: number;
  lastContactTime: string;
  lastModificationTime: string;
  leadCode: string;
  leadStatus: number;
  leadStatusName: string;
  mobiles: LeadMobileItem[] | null;
  modifierName: string;
  note: string | null;
  onsFieldExtensionLeadStorageChoice: onsFieldExtension;
  onsFieldExtensionLeadStorageDateTime: onsFieldExtension;
  onsFieldExtensionLeadStorageNumber: onsFieldExtension;
  onsFieldExtensionLeadStorageText: onsFieldExtension;
  ownerName: string;
  pipelineId: number;
  pipelinePositionId: number;
  pipelinePositionName: string;
  pipelines: PipeLinesDetails[];
  position: string | number | null;
  productName: string;
  products: ProductLeadDetails[];
  shortName: string | null;
  sourceId: number;
  sourceName: string;
  tags: string[];
  utmcampaign: string | null;
  utmcontent: string | null;
  utmmedium: string | null;
  utmsource: string | null;
  utmterm: string | null;
  websites: WebsiteLeadDetails[] | null;
  fanpages: FanpageLeadDetails[] | null;
}

export interface PipeLinesDetails {
  id: number;
  pipeline1: string;
  pipelineSymbol: string;
  pipelinePositionId: number;
  sort: number;
}

export interface EmailLeadDetails {
  isMain: boolean;
  email: string;
}
export interface FanpageLeadDetails {
  isMain: boolean;
  fanpage: string;
}
export interface WebsiteLeadDetails {
  isMain: boolean;
  website: string;
}

export interface ProductLeadDetails {
  productId: number;
  productName: string;
}

export interface ItemResultMission {
  label: number;
  value: string;
  email: string | null;
}

export interface FieldExtension {
  catalog: any[];
  choice: any | null;
  fieldType: number;
  format: any | null;
  id: string;
  isAddedField: boolean;
  isAlwaysUse: boolean;
  isDefault: boolean;
  isHaveData: boolean;
  isMobile: boolean;
  isReadOnly: boolean;
  isRequired: boolean;
  isUnique: boolean;
  label: string;
  mapfield: string | null;
  name: string;
  onsFieldExtensionGroupId: string | number | null;
  order: number;
  orderOnMobileDevice: number;
  placeholder: string | null;
  root: number;
  tooltip: string | null;
}

export interface FieldInsert {
  fields: FieldExtension[];
  id: string | null;
  label: string;
  name: string;
  order: number;
}

export interface DataConvertLead {
  brandName: string;
  companyCode: string;
  companyId: number;
  companyName: string;
  companyPipeLineId: number;
  companyPipeLineName: string;
  contactCode: string;
  dealName: string | null;
  emails: EmailLeadDetails[];
  expectationEndDate: string | null;
  expectationValue: number;
  fullName: string;
  id: number;
  mobiles: LeadMobileItem[];
}

export interface DataConvertLeadFormik {
  brandName: string;
  companyCode: string;
  companyId: ItemVel;
  companyName: string;
  companyPipeLineId: number;
  companyPipeLineName: string;
  contactCode: string;
  dealName: string | null;
  emails: FieldInputObject[];
  expectationEndDate: string | null;
  expectationValue: number;
  fullName: string;
  id: number;
  mobiles: FieldInputObject[];
}

export interface CompanyPipeLine {
  companyPipelineName: string;
  id: number;
  isDefault: boolean;
}

export interface BodyConvertLead {
  brandName: string | null;
  companyCode: string;
  companyId: number;
  companyName: string;
  companyPipeLineId: number;
  contactCode: string;
  dealName: string;
  emails: EmailLeadDetails[];
  expectationEndDate: string | null;
  expectationValue: number;
  fullName: string;
  mobiles: ContactMobilesUpper[];
}

export interface FanpagesUpper {
  fanpage: string;
  isMain: boolean;
}

export interface WebsitesUpper {
  website: string;
  isMain: boolean;
}
export interface LeadBodyFieldModel {
  choiceExtension: any;
  companyName: string | null;
  companyPipelineId: number;
  customerId: number | null;
  dateTimeExtension: any;
  emails: EmailLeadDetails[];
  expectationValue: number;
  failureReasonId: number | null;
  fullName: string;
  id: number;
  mobiles: ContactMobilesUpper[];
  multiSelectExtension: any;
  numberExtension: any;
  ownerName: string | null;
  pipelineId: number;
  products: LeadBodyFieldProduct[];
  sourceId: number;
  textExtension: any;
  companyMobiles: ContactMobilesUpper[] | null;
  fanpages: FanpagesUpper[] | null;
  websites: WebsitesUpper[] | null;
  companyEmails: EmailLeadDetails[] | null;
}
export interface LeadBodyFieldFormikModel {
  companyEmails: FieldInputObject[];
  ownerName: string | null;
  products: ItemVel[];
  companyMobiles: FieldInputObject[];
  fanpages: FieldInputObject[];
  websites: FieldInputObject[];
  companyName: string | ItemVel;
  customerId: string | null;
  dateTimeExtension: any;
  emails: FieldInputObject[];
  expectationValue: string | '' | null;
  fullName: string;
  id: number;
  failureReasonId: ItemVel | '';
  pipelineId: ItemVel | '';
  companyPipelineId: CompanyPipeline | string;
  sourceId: ItemVel | '';
  mobiles: FieldInputObject[];
  leadCode: string;
  classifyId: ItemVel | '';
  ownerId: string | null;
  productOfInterest: string | null;
  protectionStatus: string | null;
  shortName: string | null;
  tags: string | string[];
  updateByName?: string | null;
  utmcampaign?: string | null;
  utmcontent?: string | null;
  utmmedium?: string | null;
  utmsource?: string | null;
  utmterm?: string | null;
  website: string | null;
}

export interface LeadBodyFieldProduct {
  productId: number;
}

export interface LeadCUSuccess {
  address: string | null;
  cdmarketing: string | null;
  classifyId: string | null;
  companyAddress: string | null;
  companyEmail: string | null;
  companyInvoiceAddress: string | null;
  companyName: string;
  companyPhone: string | null;
  companyTaxCode: string | null;
  createByName: string;
  creationTime: string;
  creatorId: string;
  customerCode: string;
  dateOfBirth: string | null;
  dealName: string | null;
  deleterId: string | null;
  deletionTime: string | null;
  email: string;
  expectationEndDate: string | null;
  expectationValue: number | null;
  facebook: string | null;
  fanpage: string | null;
  fromSourceId: string | null;
  fromSystem: number | null;
  fullName: string;
  globalCode: string | null;
  homePhone: string | null;
  id: number;
  isDelete: string | null;
  isDeleted: false;
  lastModificationTime: string | null;
  lastModifierId: string | null;
  leadCode: string;
  leadStatus: number;
  mobile: string;
  needId: string | null;
  note: string | null;
  ownerId: string | null;
  ownerName: string | null;
  productOfInterest: string | null;
  protectionStatus: string | null;
  shortName: string | null;
  sourceId: number;
  tags: string | string[];
  updateByName: string | null;
  utmcampaign: string | null;
  utmcontent: string | null;
  utmmedium: string | null;
  utmsource: string | null;
  utmterm: string | null;
  website: string | null;
}
export interface DuplicateErrors {
  email: string | boolean;
  fanpage: string | boolean;
  mobile: string | boolean;
  website: string | boolean;
  recordName: string | undefined;
}
