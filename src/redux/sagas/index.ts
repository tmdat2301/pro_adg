import { takeEvery, takeLatest, all } from 'redux-saga/effects';
import actionTypes from '../actionTypes';
import * as userSaga from './userSaga';
import * as organizationSaga from './organizationSaga';
import * as businessSaga from './businessSaga';
import * as detailsLeadSaga from './detailsLeadSaga';
import * as detailsDealSaga from './detailsDealSaga';
import * as detailsContactSaga from './detailsContactSaga';
import * as detailsCorporateSaga from './detailsCorporateSaga';
import * as leadSaga from './leadSaga';
import * as contactSaga from './contactSaga';
import * as interpriseSaga from './interpriseSaga';
import * as dealSaga from './dealSaga';
import * as listTaskSaga from './listTaskSaga';
export default function* watch() {
  yield all([takeLatest(actionTypes.LOGIN_REQUEST, userSaga.login)]);
  yield all([takeLatest(actionTypes.GET_PROFILE_USER_REQUEST, userSaga.getProfileUser)]);
  yield all([
    takeEvery(actionTypes.ORGANIZATION_DROPDOWN_REQUEST, organizationSaga.getOrganizationDropDown),
    takeEvery(actionTypes.GET_ORGANIZATION_REQUEST, organizationSaga.getOrganizationList),
    takeEvery(actionTypes.KPI_OVERVIEW_REQUEST, businessSaga.getKpi),
    takeEvery(actionTypes.DEAL_SUMMARY_REQUEST, businessSaga.getDealSummary),
    takeEvery(actionTypes.LEAD_SUMMARY_REQUEST, businessSaga.getLeadSummary),
    takeEvery(actionTypes.STAFF_RANK_REQUEST, businessSaga.getStaffRank),
    takeEvery(actionTypes.REPORT_TASK_REQUEST, businessSaga.getReportTask),
    takeEvery(actionTypes.COUNT_TASK_REQUEST, businessSaga.getCountTask),
    takeEvery(actionTypes.LIST_TASK_DATE_REQUEST, businessSaga.getListTask),
    takeEvery(actionTypes.TASK_SUMMARY_REQUEST, businessSaga.getSummaryTask),
    takeLatest(actionTypes.ACTIVITY_TYPE_REQUEST, organizationSaga.getActivityType),
    takeEvery(actionTypes.GET_MAP_KEY_REQUEST, userSaga.getMapKey),
  ]);
  yield all([
    takeLatest(actionTypes.DETAILS_LEAD_INFO_REQUEST, detailsLeadSaga.getInfoLead),
    takeLatest(actionTypes.DETAILS_LEAD_NOTE_REQUEST, detailsLeadSaga.getNoteLead),
    takeLatest(actionTypes.DETAILS_LEAD_INTERACTIVE_REQUEST, detailsLeadSaga.getInteractiveLead),
    takeLatest(actionTypes.DETAILS_LEAD_ACTIVITY_REQUEST, detailsLeadSaga.getActivityLead),
    takeLatest(actionTypes.DETAILS_LEAD_FILE_REQUEST, detailsLeadSaga.getFileLead),
    takeLatest(actionTypes.DETAILS_LEAD_MISSION_REQUEST, detailsLeadSaga.getMissionLead),
    takeLatest(actionTypes.DETAILS_LEAD_APPOINTMENT_REQUEST, detailsLeadSaga.getAppointmentLead),
  ]);
  yield all([
    takeLatest(actionTypes.DETAILS_DEAL_INFO_REQUEST, detailsDealSaga.getInfoDeal),
    takeLatest(actionTypes.DETAILS_DEAL_NOTE_REQUEST, detailsDealSaga.getNoteDeal),
    takeLatest(actionTypes.DETAILS_DEAL_INTERACTIVE_REQUEST, detailsDealSaga.getInteractiveDeal),
    takeLatest(actionTypes.DETAILS_DEAL_ACTIVITY_REQUEST, detailsDealSaga.getActivityDeal),
    takeLatest(actionTypes.DETAILS_DEAL_FILE_REQUEST, detailsDealSaga.getFileDeal),
    takeLatest(actionTypes.DETAILS_DEAL_MISSION_REQUEST, detailsDealSaga.getMissionDeal),
    takeLatest(actionTypes.DETAILS_DEAL_APPOINTMENT_REQUEST, detailsDealSaga.getAppointmentDeal),
  ]);
  yield all([
    takeLatest(actionTypes.DETAILS_CONTACT_INFO_REQUEST, detailsContactSaga.getInfoContact),
    takeLatest(actionTypes.DETAILS_CONTACT_NOTE_REQUEST, detailsContactSaga.getNoteContact),
    takeLatest(actionTypes.DETAILS_CONTACT_INTERACTIVE_REQUEST, detailsContactSaga.getInteractiveContact),
    takeLatest(actionTypes.DETAILS_CONTACT_ACTIVITY_REQUEST, detailsContactSaga.getActivityContact),
    takeLatest(actionTypes.DETAILS_CONTACT_FILE_REQUEST, detailsContactSaga.getFileContact),
    takeLatest(actionTypes.DETAILS_CONTACT_MISSION_REQUEST, detailsContactSaga.getMissionContact),
    takeLatest(actionTypes.DETAILS_CONTACT_APPOINTMENT_REQUEST, detailsContactSaga.getAppointmentContact),
    takeLatest(actionTypes.DETAILS_CONTACT_DEAL_REQUEST, detailsContactSaga.getDealContact),
  ]);
  yield all([
    takeLatest(actionTypes.DETAILS_CORPORATE_INFO_REQUEST, detailsCorporateSaga.getInfoCorporate),
    takeLatest(actionTypes.DETAILS_CORPORATE_NOTE_REQUEST, detailsCorporateSaga.getNoteCorporate),
    takeLatest(actionTypes.DETAILS_CORPORATE_INTERACTIVE_REQUEST, detailsCorporateSaga.getInteractiveCorporate),
    takeLatest(actionTypes.DETAILS_CORPORATE_ACTIVITY_REQUEST, detailsCorporateSaga.getActivityCorporate),
    takeLatest(actionTypes.DETAILS_CORPORATE_FILE_REQUEST, detailsCorporateSaga.getFileCorporate),
    takeLatest(actionTypes.DETAILS_CORPORATE_MISSION_REQUEST, detailsCorporateSaga.getMissionCorporate),
    takeLatest(actionTypes.DETAILS_CORPORATE_APPOINTMENT_REQUEST, detailsCorporateSaga.getAppointmentCorporate),
    takeLatest(actionTypes.DETAILS_CORPORATE_DEAL_REQUEST, detailsCorporateSaga.getDealCorporate),
  ]);
  yield all([takeLatest(actionTypes.GET_DATA_LIST_LEAD_REQUEST, leadSaga.getListLead)]);
  yield all([takeLatest(actionTypes.GET_DATA_LIST_CONTACT_REQUEST, contactSaga.getListContact)]);
  yield all([takeLatest(actionTypes.GET_DATA_LIST_INTERPRISE_REQUEST, interpriseSaga.getListInterprise)]);
  yield all([takeLatest(actionTypes.GET_DATA_LIST_DEAL_REQUEST, dealSaga.getListDeal)]);
  //Filter
  yield all([takeEvery(actionTypes.GET_FILTER_LIST, leadSaga.getFilterList)]);
  yield all([takeEvery(actionTypes.GET_CONDITION_FILTER, leadSaga.getConditionFilter)]);
  yield all([takeEvery(actionTypes.TASK_REQUEST, listTaskSaga.getListTask)]);
}
