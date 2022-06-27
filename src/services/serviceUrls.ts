export default {
  path: {
    contactDetail: (type: 'lead' | 'deal' | 'contact' | 'corporate') => `/api/app/${type}/interactive`,
    historyCall: '/api/app/oncaller/call-activity',
    searchPhone: '/api/app/oncaller/contact-call',
    organizationDropDown: '/api/app/organization-units-extension/organization-dropdown',
    organizationList: '/api/app/organization-units-extension/organization-list',
    leadSummary: '/api/app/dashboard/lead-summary',
    dealSummary: '/api/app/dashboard/deal-summary',
    rankStaff: '/api/app/dashboard/rank-staff',
    kpiOverview: '/api/app/dashboard/kpi-overview',
    tennatsByName: '/api/abp/multi-tenancy/tenants/by-name/',
    getLinkLoginSSO: '/authenticate/get-link-redirect-to-sso',
    exchangeToken: '/authenticate/exchange-token',
    leadTaskDetail: '/api/app/ons-task/task-by-id/',
    leadDetailsInfo: '/api/app/lead/lead-detail/',
    leadDetailsActivity: '/api/app/lead/all-activity-by-filter/',
    leadDetailsNote: '/api/app/lead/note/',
    leadDetailsTask: '/api/app/lead/task/',
    leadDetailsInteractive: '/api/app/lead/interactive/',
    detailsFile: '/api/app/attachment-file/attachment-files',
    dealDetailsInfo: '/api/app/deal/detail/',
    dealDetailsActivity: '/api/app/deal/all-activity-by-filter/',
    dealDetailsNote: '/api/app/deal/note/',
    dealDetailsTask: '/api/app/deal/task/',
    dealDetailsInteractive: '/api/app/deal/interactive/',
    activityType: '/api/app/activity-type',
    changeStatusLeadTask: '/api/app/lead/change-status-task/',
    changeStatusDealTask: '/api/app/deal/change-status-task/',
    changeStatusContactTask: '/api/app/contact/change-status-task/',
    changeStatusCorporateTask: '/api/app/corporate/change-status-task/',
    getListLead: '/api/app/lead/',
    getOrganizationTree: '/api/app/organization-units-extension/organization',
    getListContact: '/api/app/contact/',
    getProfileUser: '/api/app/user/{id}/user-detail',
    getListUser: '/api/app/user',
    getListInterprise: '/api/app/corporate/',
    getListDeal: '/api/app/deal/',
    changeStatusLeadPipeLine: '/api/app/lead/lead-pipeline',
    changeStatusDealPipeLine: '/api/app/deal/pipeline',
    failureReason: '/api/app/failure-reason/failure-reason-drop-down/',
    contactDetailsNote: '/api/app/contact/note/',
    corporateDetailsNote: '/api/app/corporate/note/',
    deleteAttachFile: '/api/app/attachment-file/attachment/',
    resultMisison: '/api/app/mission-result/mission-result-drop-down/',
    updateTask: '/api/app/ons-task/task',
    getListSearch: '/api/app/quick-search/search',
    filterList: (settingName: string) => `/setting/filter/${settingName}`,
    conditionFilter: (type: string) => `/api/app/${type}/default-and-custom-field`,
    fieldDetails: 'api/app/{list}/field-extension-in-detail',
    contactDetailsInfo: '/api/app/contact/detail/',
    contactDetailsActivity: '/api/app/contact/all-activity-by-filter/',
    contactDetailsTask: '/api/app/contact/task/',
    contactDetailsInteractive: '/api/app/contact/interactive/',
    contactDetailsDeal: '/api/app/contact/deal-bussiness-opportunities-by-contact/',
    corporateDetailsInfo: '/api/app/corporate/detail/',
    corporateDetailsActivity: '/api/app/corporate/all-activity-by-filter/',
    corporateDetailsTask: '/api/app/corporate/task/',
    corporateDetailsInteractive: '/api/app/corporate/interactive/',
    corporateDetailsDeal: '/api/app/corporate/deal-bussiness-opportunities-by-corporate/',
    findUser: '/api/app/user/find-user-in-org/',
    changeStatus: '/api/app/{type}/change-status-task/',
    deleteTask: '/api/app/ons-task/{id}/task/',
    deleteAppointment: '/api/app/ons-task/{id}/appointment/',
    sourceDropdown: 'api/app/source/source-drop-down',
    corporateDropdown: 'api/app/corporate/corporate-drop-down/',
    calllog: '/api/app/call-log/',
    getFieldInsert: (type: string) => `api/app/${type}/group-field-extension-insert/`,
    dataConvertLead: (id: string) => `/api/app/lead/${id}/data-convert-lead`,
    convertLead: '/api/app/lead/{id}/convert-lead',
    companyPipeLineCurrent: '/api/app/deal/company-pipeline-by-curent',
    companyPipeLineCurrentL: '/api/app/lead/company-pipeline-by-curent',
    findUserByName: '/api/app/user/find-user-by-names',
    findRelated: '/api/app/ons-task/find-related-object',
    getMissionResult: '/api/app/mission-result/mission-result-drop-down/',
    getProductDropDown: 'api/app/product/product-drop-down/',
    getStatus: 'api/app/pipeline/pipeline-status-drop-down/',
    updateAppointment: '/api/app/ons-task/appointment',
    validatedToken: 'authenticate/validated-token',
    createCost: '/api/app/ons-task/cost/',
    costType: '/api/app/ons-task/cost-type/',
    checkIn: '/api/app/ons-task/check-in',
    checkOut: '/api/app/ons-task/check-out',
    industryClassification: '/api/app/industry-classification/industry-classificatio-drop-down',
    customerGroupDropDown: '/api/app/customner-group/customer-group-drop-down',
    vendor: '/api/app/vendor',
    contactDropDown: 'api/app/contact/contact-drop-down',
    getPhoneTask: '/api/app/ons-task/phone-number/',
    reportTask: '/api/app/ons-task/report-task',
    countTask: '/api/app/ons-task/count-task-by-date',
    listTask: '/api/app/ons-task/task-or-appointment-by-date',
    getTokenCall: '​/api/app/oncaller/user-token-by-current-user',
    summaryTask: '/api/app/ons-task/report-time-talking-with-customers',
    projectStatus: '/api/app/project/status',
    projectSearch: '/api/app/project/find-by-name-or-code',
    showDownload: '/api/app/attachment-file/show-or-download-file-attached/',
    taskList: '/api/app/ons-task/all-task-or-appointment',
    sendTask: '/api/app/ons-task/send-payment-request',
    getContactByDeal: (id: string | number) => `/api/app/deal/${id}/contact-by-deal`,
    currentOrganizationUnitList: '/api/app/kpi-business-plan/current-organization-unit-list',
    deleteImageCost: '/api/app/ons-task/cost-image',
    changeTimeTask: '/api/app/ons-task/time-of-task-or-appointment',
    changeResultTask: '/api/app/ons-task/result-of-task-or-appointment',
    settingGoogle: '/setting/google',
  },
  goongMapBaseUrl: 'https://rsapi.goong.io',
  goongMapParamsLatLongUrl: (lat: string | number, long: string | number) =>
    `https://rsapi.goong.io/Geocode?latlng=${lat},${long}`,
  statusCode: {
    success: [200, 201, 204],
    auth: [401],
    notFound: [404],
    error: [500, 400],
  },
};