import { AppRoutes } from '@navigation/appRoutes';

export const LANGUAGE_DEFAULT = 'vi';
export const TOP_LEVEL_DOMAIN = '.oncrm.asia';
export const URL_CURRENT = 'https://adgstaging.api.oncrm.asia';
export const EMAIL_REGEX = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
export const PHONE_REGEX = /^0\d{8,10}$/;
export const HOURS_MINUTE_FORMAT = 'HH:mm';
export const TIME_FORMAT_24 = 'HH:mm';
export const TIME_FORMAT_SECONDS = 'HH:mm:ss';
export const ISO_DATES = 'YYYY-MM-DDTHH:mm:ssZ';
export const DATE_TIME_FORMAT = 'DD/MM/YYYY, HH:mm:ss';
export const DATE_TIME_FORMAT_INPUT = 'DD/MM/YYYY HH:mm:ss';
export const DATE_TIME_MM_DD = 'MM/DD/YYYY, HH:mm:ss';

export const TIME_FORMAT_MINUTE_SECONDS = 'mm:ss';

export const DATE_FORMAT = 'DD/MM/YYYY';

export const DATE_FORMAT_EN = 'YYYY-MM-DD';
export const DATE_TIME = 'HH:mm YYYY-MM-DD';
export const DATE_TIME2 = 'HH:mm DD-MM-YYYY';

export const TOTAL_SECOND_IN_HOURS = 3600;
export const TOTAL_SECOND_IN_MINUTE = 60;
export const COUNTRY_CODE_WIDTH = 66;

export const CallType = {
  callGo: 3471,
  callBack: 3472,
};
export enum StatusType {
  callFinish = 3465,
  callMissed = 3472,
  dontPickUp = 3462,
}

export enum TaskType {
  //type của nhiệm vụ
  callPhone = 3476,
  callPrice = 3481,
  sendEmail = 3477,
  //type của cuộc hẹn
  meetCustomer = 3478,
  demoProduct = 3482,
  meeting = 3483,
  other = 3484,
}

export enum TypeIconNotification {
  appointmentNotification = 'AppointmentNotification',
  guardPolicyNotification = 'GuardPolicyNotification',
  keyAccountPotentialDisabled = 'KeyAccountPotentialDisabled',
  revokeNotification = 'RevokeNotification',
  revokeMultiNotification = 'RevokeMultiNotification',
  sharingNotification = 'SharingNotification',
  sharingMultiNotification = 'SharingMultiNotification',
  taskNotification = 'TaskNotification',
  transferNotification = 'TransferNotification',
  transferMultiNotification = 'TransferMultiNotification',
  transferToBranchPool = 'TransferToBranchPool',
}

export enum ModalizeDetailsType {
  calendar = 'calendar',
  filter = 'filter',
  item = 'item',
  type = 'type',
}

export enum TypeSearch {
  leads = 'leads',
  contacts = 'contacts',
  accounts = 'accounts',
  deals = 'deals',
}

export const filterType = {
  text: 1,
  date: 3,
  decimal: 2,
  choice: 4,
  textarea: 6,
  multiselect: 5,
};

export enum FilterScreenType {
  leads = 'leads',
  contacts = 'contacts',
  enterprise = 'enterprise',
  deals = 'deals',
}
export enum TypeFieldExtension {
  lead = 'lead',
  deal = 'deal',
  corporate = 'corporate',
  contact = 'contact',
}

export enum TypeCriteria {
  all = 0,
  lead = 3,
  deal = 1,
  corporate = 2,
  contact = 5,
}

export const textOperator = (t: any): { title: string; key: string }[] => [
  {
    title: t('lead:equal'),
    key: 'equal',
  },
  {
    title: t('lead:not_equal'),
    key: 'notEqual',
  },
  {
    title: t('lead:contain'),
    key: 'include',
  },
  {
    title: t('lead:not_contain'),
    key: 'notInclude',
  },
];

export const decimalOperator = (t: any): { title: string; key: string }[] => [
  {
    title: t('lead:equal'),
    key: 'equal',
  },
  {
    title: t('lead:not_equal'),
    key: 'notEqual',
  },
  {
    title: t('filter:greaterThan'),
    key: 'greaterThan',
  },
  {
    title: t('filter:greaterThanEqual'),
    key: 'greaterThanOrEqual',
  },
  {
    title: t('filter:lessThan'),
    key: 'lessThan',
  },
  {
    title: t('filter:lessThanEqual'),
    key: 'lessThanOrEqual',
  },
  {
    title: t('filter:fromTo'),
    key: 'fromTo',
  },
  {
    title: t('filter:fromToWithEqual'),
    key: 'fromToWithEqual',
  },
];
export const dateOperator = (t: any): { title: string; key: string }[] => [
  {
    title: t('filter:toDay'),
    key: 'toDay',
  },
  {
    title: t('filter:yesterday'),
    key: 'yesterday',
  },
  {
    title: t('filter:thisWeek'),
    key: 'thisWeek',
  },
  {
    title: t('filter:previousWeek'),
    key: 'previousWeek',
  },
  {
    title: t('filter:thisMonth'),
    key: 'thisMonth',
  },
  {
    title: t('filter:previousMonth'),
    key: 'previousMonth',
  },
  {
    title: t('filter:custom'),
    key: 'fromToWithEqual',
  },
];

export const decimalOneInputOperator = ['fromTo', 'fromToWithEqual'];
export const decimalOneInput = ['greaterThan', 'lessThan', 'lessThanOrEqual', 'greaterThanOrEqual'];
export enum FieldType {
  Text = 1,
  Number = 2,
  DateTime = 3,
  Choice = 4,
  MutiSelect = 5,
  Textarea = 6,
}

export enum SocketEvent {
  OnNotifications = 'get_result',
  EmitNotifications = 'get',
  SeenNotifications = 'view',
  Connecting = 'connecting',
  NewNotification = 'update',
  ReadAllNotification = 'viewall',
  ViewAllResult = 'viewall-result',
}

export const ScreenNotification: { [key: string]: string } = {
  lead: 'LeadTab',
  deal: 'DealTab',
  leadDetail: AppRoutes.DETAIL_LEAD,
  dealDetail: AppRoutes.DETAIL_DEAL,
  contact: 'ContactTab',
  contactDetail: AppRoutes.DETAIL_CONTACT,
  corporateDetail: AppRoutes.DETAIL_CORPORATE,
};

export const NotificationType = {
  appointment: 'AppointmentNotification',
  task: 'TaskNotification',
};
