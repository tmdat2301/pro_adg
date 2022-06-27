import { FanpageLeadDetails, fieldExtensionChild, WebsiteLeadDetails } from './lead.interface';

export interface ContactModel {
  totalCount: number;
  items: ContactItem[];
}

export interface ContactItem {
  pipeLineName: string;
  contactTextStatus: number;
  abpOwnerEmail: string | null;
  abpOwnerId: string | null;
  accountContactNames: string | null;
  accountName: string | null;
  accountNumber: string | null;
  address: string | null;
  bankName: string | null;
  cdMarketing: string;
  companyInvoiceAddress: string | null;
  companyTaxCode: string | null;
  contactCode: string | null;
  contactTypeName: string | null;
  createByName: string | null;
  creationTime: string | null;
  customerGroup: string;
  dateOfBirth: string | null;
  department: string | null;
  email: string | null;
  expectationValue: number;
  facebook: null;
  fanpage: string;
  fieldExtensionChoice: fieldExtensionChild[] | null;
  fieldExtensionDate: fieldExtensionChild[] | null;
  fieldExtensionMultiSelect: fieldExtensionChild[] | null;
  fieldExtensionNumber: fieldExtensionChild[] | null;
  fieldExtensionText: fieldExtensionChild[] | null;
  fullName: string;
  genderName: string;
  id: number;
  industryClassification: string;
  lastActivity: string | null;
  lastCall: string | null;
  lastContact: string | null;
  lastModificationTime: string | null;
  lastNote: string;
  mobile: string;
  note: string | null;
  ownerId: string | null;
  ownerName: string | null;
  position: string | null;
  primaryAccountContactId: number;
  primaryAccountContactName: string | null;
  sourceName: string | null;
  tags: string | null;
  updateByName: string | null;
  utmcampaign: string | null;
  utmcontent: string | null;
  utmmedium: string | null;
  utmsource: string | null;
  utmterm: string | null;
  website: string;
}

export interface ContactDetails {
  name?: string;
  id?: number;
  phone?: string;
  type?: number;
  histories?: ContactHistory[] | null;
}

interface ContactHistory {
  startTime?: Date | string;
  createdTime?: Date | string;
  endTime?: Date | string;
  callType?: number | string;
  status?: number | string;
}

export interface ContactMobiles {
  isMain: boolean;
  code: string;
  phoneNumber: string;
}
export interface ContactMobilesUpper {
  isMain: boolean;
  code: string;
  PhoneNumber: string;
}

export interface ContactEmails {
  checked: boolean;
  value: string;
}

export interface ContactAccounts {
  id?: number;
  checked: boolean;
  corporateId: number;
  name?: string;
}

export interface LeadMobileItem {
  code: string;
  countryCode: number;
  isMain: boolean;
  phoneE164: string;
  phoneNational: number;
  phoneNumber: string;
}

export interface LeadSearchContactItem {
  phones: LeadMobileItem[];
  name: string;
  companyName: string;
  ownerName: string;
  note: string | null;
  type: number;
  id: number;
  isShowAll: boolean;
  creationTime: string;
}

export interface CallActivityItem {
  id: number;
  activityId: string;
  creationTime: string;
  name: string;
  type: number;
  callType: 3471 | 3472;
  phone: string;
  urlAudio: string;
  resultId: 3520 | 3465;
}

export interface ContactDetailsModel {
  abpOwnerEmail: string;
  accountId: number;
  accountName: string | null;
  accountNumber: string | null;
  accountType: number;
  accounts: ContactAccounts[];
  activities: string | null;
  address: string | null;
  appointments: string | null;
  bankName: string | null;
  brandName: string | null;
  cdMarketing: string | null;
  cdMarketingName: string | null;
  checkEdit: number;
  classifyId: string | null;
  companyAddress: string | null;
  companyEmail: string | null;
  companyFanpage: string | null;
  companyInvoiceAddress: string | null;
  companyPhone: string | null;
  companyTaxCode: string | null;
  companyWebsite: string | null;
  contactAccountId: number;
  contactCode: string;
  contactType: number;
  contactTypeName: string;
  createByName: string;
  createdBy: number;
  createdDate: string;
  createdName: string | null;
  createdTime: string | null;
  creationTime: string;
  customerCode: string;
  customerGroup: string | null;
  customerGroupId: string | null;
  dateOfBirth: string | null;
  department: string | null;
  email: string;
  emails: ContactEmails[];
  enterprise: string | null;
  expectationValue: number;
  facebook: string | null;
  fanpage: string | null;
  fieldExtensionChoice: fieldExtensionChild[] | null;
  fieldExtensionDate: fieldExtensionChild[] | null;
  fieldExtensionMultiSelect: fieldExtensionChild[] | null;
  fieldExtensionNumber: fieldExtensionChild[] | null;
  fieldExtensionText: fieldExtensionChild[] | null;
  fullName: string;
  genderId: string | null;
  genderName: string;
  globalCode: string;
  haveDeal: boolean;
  hiddenInfo: boolean;
  homePhone: string | null;
  id: number;
  industryClassificationId: string | null;
  industryClassificationName: string | null;
  interactives: any[] | null;
  isDeleted: boolean;
  keyAccount: boolean;
  keyAccountPotentialProtectionEnabled: boolean;
  keyAccountProtectionEnabled: boolean;
  lastContactTime: null;
  lastModificationTime: string;
  lastNote: string | null;
  lastUpdatedActivies: null;
  leadId: number;
  managerId: string | null;
  managerName: string | null;
  mobile: string | null;
  mobileFullText: string | null;
  mobiles: ContactMobiles[];
  nameAccount: string | null;
  nameActivies: null;
  needId: string | null;
  needName: string | null;
  note: null;
  notes: any[] | null;
  ownerId: string;
  ownerName: string;
  position: string | null;
  primaryAccountContactId: number;
  primaryAccountContactName: string;
  productBackup: string | null;
  referId: string | null;
  retailerId: string | null;
  shortName: string | null;
  sourceId: number;
  sourceName: string;
  subdivisionName: string | null;
  tags: string[];
  tasks: any[] | null;
  updateByName: string;
  updatedBy: string | null;
  updatedDate: string | null;
  updatedName: string | null;
  userId: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmMedium: string | null;
  utmSource: string | null;
  utmTerm: string | null;
  website: string | null;
  websites: WebsiteLeadDetails[] | null;
  fanpages: FanpageLeadDetails[] | null;
}
export interface ContactCorporate {
  checked: boolean;
  corporateId: number;
}

export interface ItemVel {
  email: string | null;
  label: number;
  value: string;
}

export interface ContactBodyModel {
  accounts: ContactCorporate[];
  cdMarketing: string;
  choiceExtension: any;
  contactType: number;
  dateTimeExtension: any;
  email: ContactEmails[];
  fullName: string;
  id: number;
  mobile: ContactMobiles[];
  multiSelectExtension: any;
  numberExtension: any;
  sourceId: number;
  textExtension: any;
}

export interface ContactBodyFieldModel {
  accounts: FieldInputObject[];
  cdMarketing: string;
  choiceExtension: any;
  contactType: ItemVel;
  dateTimeExtension: any;
  email: FieldInputObject[];
  fullName: string;
  id: number;
  mobile: FieldInputObject[];
  multiSelectExtension: any;
  numberExtension: any;
  sourceId: ItemVel;
  textExtension: any;
  contactCode?: string;
  ownerName?: string;
}

export interface FieldInputObject {
  code?: string;
  isMain: boolean;
  text: string;
}

export interface ContactCUSuccess {
  abpOwnerEmail: string | null;
  abpOwnerId: string;
  accountContactNames: string | null;
  accountName: string | null;
  accountNumber: string | null;
  address: string | null;
  bankName: string | null;
  cdMarketing: string;
  companyInvoiceAddress: string | null;
  companyTaxCode: string | null;
  contactCode: string;
  contactTypeName: string;
  createByName: string;
  creationTime: string;
  customerGroup: string | null;
  dateOfBirth: string | null;
  department: string | null;
  email: string;
  expectationValue: number;
  facebook: string | null;
  fanpage: string;
  fieldExtensionChoice: fieldExtensionChild[] | null;
  fieldExtensionDate: fieldExtensionChild[] | null;
  fieldExtensionMultiSelect: fieldExtensionChild[] | null;
  fieldExtensionNumber: fieldExtensionChild[] | null;
  fieldExtensionText: fieldExtensionChild[] | null;
  fullName: string;
  genderName: string | null;
  id: number;
  industryClassification: string | null;
  lastActivity: string;
  lastCall: string | null;
  lastContact: string | null;
  lastModificationTime: string;
  lastNote: string;
  mobile: string;
  note: string | null;
  ownerId: string;
  ownerName: string;
  position: string | null;
  primaryAccountContactId: number;
  primaryAccountContactName: string | null;
  sourceName: string;
  tags: string | null;
  updateByName: string;
  utmcampaign: string | null;
  utmcontent: string | null;
  utmmedium: string | null;
  utmsource: string | null;
  utmterm: string | null;
  website: string;
}

export interface ContactPhoneActivity {
  id: number;
  isMain: boolean;
  name: string;
  phoneNumber: LeadMobileItem[];
  root: number;
}
