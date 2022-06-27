import actionTypes from '@redux/actionTypes';
import {
  ItemDetailsActivity,
  ItemAttachFiles,
  ItemDetailsInteractive,
  ItemDetailsNote,
  ItemTask,
  LeadDetailsModel,
} from '@interfaces/lead.interface';
import { ParamsFile } from '@interfaces/params.interface';
import { DealDetailsModel, ItemDealDetails } from '@interfaces/deal.interface';
import { ContactDetailsModel } from '@interfaces/contact.interface';
import { CorporateDetailsModel } from '@interfaces/interprise.interface';

//info Lead
export const detailsLeadInfoRequest = (leadId: number | string, hiddenSth: boolean) => {
  return {
    type: actionTypes.DETAILS_LEAD_INFO_REQUEST,
    hiddenSth,
    leadId,
  };
};

export const detailsLeadInfoSuccess = (data: LeadDetailsModel) => {
  return {
    type: actionTypes.DETAILS_LEAD_INFO_SUCCESS,
    data,
  };
};

export const detailsLeadInfoFailed = () => {
  return {
    type: actionTypes.DETAILS_LEAD_INFO_FAILED,
  };
};

// note Lead
export const detailsLeadNoteRequest = (leadId: number | string) => {
  return {
    type: actionTypes.DETAILS_LEAD_NOTE_REQUEST,
    leadId,
  };
};

export const detailsLeadNoteSuccess = (list: ItemDetailsNote[]) => {
  return {
    type: actionTypes.DETAILS_LEAD_NOTE_SUCCESS,
    list,
  };
};

export const detailsLeadNoteFailed = () => {
  return {
    type: actionTypes.DETAILS_LEAD_NOTE_FAILED,
  };
};

// interactive Lead
export const detailsLeadInteractiveRequest = (leadId: number | string, isDetails: boolean, date: string) => {
  return {
    type: actionTypes.DETAILS_LEAD_INTERACTIVE_REQUEST,
    isDetails,
    leadId,
    date,
  };
};

export const detailsLeadInteractiveSuccess = (list: ItemDetailsInteractive[]) => {
  return {
    type: actionTypes.DETAILS_LEAD_INTERACTIVE_SUCCESS,
    list,
  };
};

export const detailsLeadInteractiveFailed = () => {
  return {
    type: actionTypes.DETAILS_LEAD_INTERACTIVE_FAILED,
  };
};

// activity Lead
export const detailsLeadActivityRequest = (
  leadId: number | string,
  arrActivity: number[],
  limit: number,
  date: string,
) => {
  return {
    type: actionTypes.DETAILS_LEAD_ACTIVITY_REQUEST,
    leadId,
    arrActivity,
    limit,
    date,
  };
};

export const detailsLeadActivitySuccess = (list: ItemDetailsActivity[]) => {
  return {
    type: actionTypes.DETAILS_LEAD_ACTIVITY_SUCCESS,
    list,
  };
};

export const detailsLeadActivityFailed = () => {
  return {
    type: actionTypes.DETAILS_LEAD_ACTIVITY_FAILED,
  };
};

// file Lead
export const detailsLeadFileRequest = (params: ParamsFile) => {
  return {
    type: actionTypes.DETAILS_LEAD_FILE_REQUEST,
    params,
  };
};

export const detailsLeadFileSuccess = (list: ItemAttachFiles[], total: number, page?: number) => {
  return {
    type: actionTypes.DETAILS_LEAD_FILE_SUCCESS,
    list,
    page,
    total,
  };
};

export const detailsLeadFileFailed = () => {
  return {
    type: actionTypes.DETAILS_LEAD_FILE_FAILED,
  };
};

// task Lead: mission + appointment. params truyền type để lấy ra nhiệm vụ hoặc lịch hẹn. Nhiệm vụ là 1, cuộc hẹn là 2
export const detailsLeadMissionRequest = (leadId: number | string, date: string, status: number) => {
  return {
    type: actionTypes.DETAILS_LEAD_MISSION_REQUEST,
    leadId,
    date,
    status,
  };
};

export const detailsLeadMissionSuccess = (list: ItemTask[]) => {
  return {
    type: actionTypes.DETAILS_LEAD_MISSION_SUCCESS,
    list,
  };
};

export const detailsLeadMissionFailed = () => {
  return {
    type: actionTypes.DETAILS_LEAD_MISSION_FAILED,
  };
};

export const detailsLeadAppointmentRequest = (leadId: number | string, date: string, status: number) => {
  return {
    type: actionTypes.DETAILS_LEAD_APPOINTMENT_REQUEST,
    leadId,
    date,
    status,
  };
};

export const detailsLeadAppointmentSuccess = (list: ItemTask[]) => {
  return {
    type: actionTypes.DETAILS_LEAD_APPOINTMENT_SUCCESS,
    list,
  };
};

export const detailsLeadAppointmentFailed = () => {
  return {
    type: actionTypes.DETAILS_LEAD_APPOINTMENT_FAILED,
  };
};

//setloadLead

export const setRefreshingLeadInfo = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_LEAD_INFO,
    isRefreshing,
  };
};
export const setRefreshingLeadInteractive = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_LEAD_INTERACTIVE,
    isRefreshing,
  };
};
export const setRefreshingLeadNote = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_LEAD_NOTE,
    isRefreshing,
  };
};
export const setRefreshingLeadActivity = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_LEAD_ACTIVITY,
    isRefreshing,
  };
};
export const setRefreshingLeadMission = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_LEAD_MISSION,
    isRefreshing,
  };
};
export const setRefreshingLeadFile = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_LEAD_FILE,
    isRefreshing,
  };
};
export const setRefreshingLeadAppointment = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_LEAD_APPOINTMENT,
    isRefreshing,
  };
};

export const setEmptyLead = () => {
  return {
    type: actionTypes.SET_EMPTY_LEAD,
  };
};

//info Deal
export const detailsDealInfoRequest = (dealId: number | string, hiddenSth: boolean) => {
  return {
    type: actionTypes.DETAILS_DEAL_INFO_REQUEST,
    hiddenSth,
    dealId,
  };
};

export const detailsDealInfoSuccess = (data: DealDetailsModel) => {
  return {
    type: actionTypes.DETAILS_DEAL_INFO_SUCCESS,
    data,
  };
};

export const detailsDealInfoFailed = () => {
  return {
    type: actionTypes.DETAILS_DEAL_INFO_FAILED,
  };
};

// note Deal
export const detailsDealNoteRequest = (dealId: number | string) => {
  return {
    type: actionTypes.DETAILS_DEAL_NOTE_REQUEST,
    dealId,
  };
};

export const detailsDealNoteSuccess = (list: ItemDetailsNote[]) => {
  return {
    type: actionTypes.DETAILS_DEAL_NOTE_SUCCESS,
    list,
  };
};

export const detailsDealNoteFailed = () => {
  return {
    type: actionTypes.DETAILS_DEAL_NOTE_FAILED,
  };
};

// interactive Deal
export const detailsDealInteractiveRequest = (dealId: number | string, isDetails: boolean, date: string) => {
  return {
    type: actionTypes.DETAILS_DEAL_INTERACTIVE_REQUEST,
    isDetails,
    dealId,
    date,
  };
};

export const detailsDealInteractiveSuccess = (list: ItemDetailsInteractive[]) => {
  return {
    type: actionTypes.DETAILS_DEAL_INTERACTIVE_SUCCESS,
    list,
  };
};

export const detailsDealInteractiveFailed = () => {
  return {
    type: actionTypes.DETAILS_DEAL_INTERACTIVE_FAILED,
  };
};

// activity Deal
export const detailsDealActivityRequest = (
  dealId: number | string,
  arrActivity: number[],
  limit: number,
  date: string,
) => {
  return {
    type: actionTypes.DETAILS_DEAL_ACTIVITY_REQUEST,
    dealId,
    arrActivity,
    limit,
    date,
  };
};

export const detailsDealActivitySuccess = (list: ItemDetailsActivity[]) => {
  return {
    type: actionTypes.DETAILS_DEAL_ACTIVITY_SUCCESS,
    list,
  };
};

export const detailsDealActivityFailed = () => {
  return {
    type: actionTypes.DETAILS_DEAL_ACTIVITY_FAILED,
  };
};

// file Deal
export const detailsDealFileRequest = (params: ParamsFile) => {
  return {
    type: actionTypes.DETAILS_DEAL_FILE_REQUEST,
    params,
  };
};

export const detailsDealFileSuccess = (list: ItemAttachFiles[], total: number, page?: number) => {
  return {
    type: actionTypes.DETAILS_DEAL_FILE_SUCCESS,
    list,
    page,
    total,
  };
};

export const detailsDealFileFailed = () => {
  return {
    type: actionTypes.DETAILS_DEAL_FILE_FAILED,
  };
};

// task Deal: mission + appointment. params truyền type để lấy ra nhiệm vụ hoặc lịch hẹn. Nhiệm vụ là 1, cuộc hẹn là 2
export const detailsDealMissionRequest = (dealId: number | string, date: string, status: number) => {
  return {
    type: actionTypes.DETAILS_DEAL_MISSION_REQUEST,
    dealId,
    date,
    status,
  };
};

export const detailsDealMissionSuccess = (list: ItemTask[]) => {
  return {
    type: actionTypes.DETAILS_DEAL_MISSION_SUCCESS,
    list,
  };
};

export const detailsDealMissionFailed = () => {
  return {
    type: actionTypes.DETAILS_DEAL_MISSION_FAILED,
  };
};

export const detailsDealAppointmentRequest = (dealId: number | string, date: string, status: number) => {
  return {
    type: actionTypes.DETAILS_DEAL_APPOINTMENT_REQUEST,
    dealId,
    date,
    status,
  };
};

export const detailsDealAppointmentSuccess = (list: ItemTask[]) => {
  return {
    type: actionTypes.DETAILS_DEAL_APPOINTMENT_SUCCESS,
    list,
  };
};

export const detailsDealAppointmentFailed = () => {
  return {
    type: actionTypes.DETAILS_DEAL_APPOINTMENT_FAILED,
  };
};

//setloadDeal

export const setRefreshingDealInfo = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_DEAL_INFO,
    isRefreshing,
  };
};
export const setRefreshingDealInteractive = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_DEAL_INTERACTIVE,
    isRefreshing,
  };
};
export const setRefreshingDealNote = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_DEAL_NOTE,
    isRefreshing,
  };
};
export const setRefreshingDealActivity = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_DEAL_ACTIVITY,
    isRefreshing,
  };
};
export const setRefreshingDealMission = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_DEAL_MISSION,
    isRefreshing,
  };
};
export const setRefreshingDealFile = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_DEAL_FILE,
    isRefreshing,
  };
};
export const setRefreshingDealAppointment = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_DEAL_APPOINTMENT,
    isRefreshing,
  };
};

export const setEmptyDeal = () => {
  return {
    type: actionTypes.SET_EMPTY_DEAL,
  };
};

//info Contact
export const detailsContactInfoRequest = (contactId: number | string, hiddenSth: boolean) => {
  return {
    type: actionTypes.DETAILS_CONTACT_INFO_REQUEST,
    hiddenSth,
    contactId,
  };
};

export const detailsContactInfoSuccess = (data: ContactDetailsModel) => {
  return {
    type: actionTypes.DETAILS_CONTACT_INFO_SUCCESS,
    data,
  };
};

export const detailsContactInfoFailed = () => {
  return {
    type: actionTypes.DETAILS_CONTACT_INFO_FAILED,
  };
};

// note Contact
export const detailsContactNoteRequest = (contactId: number | string) => {
  return {
    type: actionTypes.DETAILS_CONTACT_NOTE_REQUEST,
    contactId,
  };
};

export const detailsContactNoteSuccess = (list: ItemDetailsNote[]) => {
  return {
    type: actionTypes.DETAILS_CONTACT_NOTE_SUCCESS,
    list,
  };
};

export const detailsContactNoteFailed = () => {
  return {
    type: actionTypes.DETAILS_CONTACT_NOTE_FAILED,
  };
};

// interactive Contact
export const detailsContactInteractiveRequest = (contactId: number | string, isDetails: boolean, date: string) => {
  return {
    type: actionTypes.DETAILS_CONTACT_INTERACTIVE_REQUEST,
    isDetails,
    contactId,
    date,
  };
};

export const detailsContactInteractiveSuccess = (list: ItemDetailsInteractive[]) => {
  return {
    type: actionTypes.DETAILS_CONTACT_INTERACTIVE_SUCCESS,
    list,
  };
};

export const detailsContactInteractiveFailed = () => {
  return {
    type: actionTypes.DETAILS_CONTACT_INTERACTIVE_FAILED,
  };
};

// activity Contact
export const detailsContactActivityRequest = (
  contactId: number | string,
  arrActivity: number[],
  limit: number,
  date: string,
) => {
  return {
    type: actionTypes.DETAILS_CONTACT_ACTIVITY_REQUEST,
    contactId,
    arrActivity,
    limit,
    date,
  };
};

export const detailsContactActivitySuccess = (list: ItemDetailsActivity[]) => {
  return {
    type: actionTypes.DETAILS_CONTACT_ACTIVITY_SUCCESS,
    list,
  };
};

export const detailsContactActivityFailed = () => {
  return {
    type: actionTypes.DETAILS_CONTACT_ACTIVITY_FAILED,
  };
};

// file Contact
export const detailsContactFileRequest = (params: ParamsFile) => {
  return {
    type: actionTypes.DETAILS_CONTACT_FILE_REQUEST,
    params,
  };
};

export const detailsContactFileSuccess = (list: ItemAttachFiles[], total: number, page?: number) => {
  return {
    type: actionTypes.DETAILS_CONTACT_FILE_SUCCESS,
    list,
    page,
    total,
  };
};

export const detailsContactFileFailed = () => {
  return {
    type: actionTypes.DETAILS_CONTACT_FILE_FAILED,
  };
};

// deal contact
export const detailsContactDealRequest = (contactId: string | number, dealStatusPipeline: number) => {
  return {
    type: actionTypes.DETAILS_CONTACT_DEAL_REQUEST,
    contactId,
    dealStatusPipeline,
  };
};

export const detailsContactDealSuccess = (list: ItemDealDetails[]) => {
  return {
    type: actionTypes.DETAILS_CONTACT_DEAL_SUCCESS,
    list,
  };
};

export const detailsContactDealFailed = () => {
  return {
    type: actionTypes.DETAILS_CONTACT_DEAL_FAILED,
  };
};

// task Contact: mission + appointment. params truyền type để lấy ra nhiệm vụ hoặc lịch hẹn. Nhiệm vụ là 1, cuộc hẹn là 2
export const detailsContactMissionRequest = (contactId: number | string, date: string, status: number) => {
  return {
    type: actionTypes.DETAILS_CONTACT_MISSION_REQUEST,
    contactId,
    date,
    status,
  };
};

export const detailsContactMissionSuccess = (list: ItemTask[]) => {
  return {
    type: actionTypes.DETAILS_CONTACT_MISSION_SUCCESS,
    list,
  };
};

export const detailsContactMissionFailed = () => {
  return {
    type: actionTypes.DETAILS_CONTACT_MISSION_FAILED,
  };
};

export const detailsContactAppointmentRequest = (contactId: number | string, date: string, status: number) => {
  return {
    type: actionTypes.DETAILS_CONTACT_APPOINTMENT_REQUEST,
    contactId,
    date,
    status,
  };
};

export const detailsContactAppointmentSuccess = (list: ItemTask[]) => {
  return {
    type: actionTypes.DETAILS_CONTACT_APPOINTMENT_SUCCESS,
    list,
  };
};

export const detailsContactAppointmentFailed = () => {
  return {
    type: actionTypes.DETAILS_CONTACT_APPOINTMENT_FAILED,
  };
};

//setloadContact

export const setRefreshingContactInfo = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_CONTACT_INFO,
    isRefreshing,
  };
};
export const setRefreshingContactDeal = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_CONTACT_DEAL,
    isRefreshing,
  };
};
export const setRefreshingContactInteractive = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_CONTACT_INTERACTIVE,
    isRefreshing,
  };
};
export const setRefreshingContactNote = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_CONTACT_NOTE,
    isRefreshing,
  };
};
export const setRefreshingContactActivity = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_CONTACT_ACTIVITY,
    isRefreshing,
  };
};
export const setRefreshingContactMission = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_CONTACT_MISSION,
    isRefreshing,
  };
};
export const setRefreshingContactFile = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_CONTACT_FILE,
    isRefreshing,
  };
};
export const setRefreshingContactAppointment = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_CONTACT_APPOINTMENT,
    isRefreshing,
  };
};

export const setEmptyContact = () => {
  return {
    type: actionTypes.SET_EMPTY_CONTACT,
  };
};

//info Corporate
export const detailsCorporateInfoRequest = (corporateId: number | string, hiddenSth: boolean) => {
  return {
    type: actionTypes.DETAILS_CORPORATE_INFO_REQUEST,
    hiddenSth,
    corporateId,
  };
};

export const detailsCorporateInfoSuccess = (data: CorporateDetailsModel) => {
  return {
    type: actionTypes.DETAILS_CORPORATE_INFO_SUCCESS,
    data,
  };
};

export const detailsCorporateInfoFailed = () => {
  return {
    type: actionTypes.DETAILS_CORPORATE_INFO_FAILED,
  };
};

// note Corporate
export const detailsCorporateNoteRequest = (corporateId: number | string) => {
  return {
    type: actionTypes.DETAILS_CORPORATE_NOTE_REQUEST,
    corporateId,
  };
};

export const detailsCorporateNoteSuccess = (list: ItemDetailsNote[]) => {
  return {
    type: actionTypes.DETAILS_CORPORATE_NOTE_SUCCESS,
    list,
  };
};

export const detailsCorporateNoteFailed = () => {
  return {
    type: actionTypes.DETAILS_CORPORATE_NOTE_FAILED,
  };
};

// interactive Corporate
export const detailsCorporateInteractiveRequest = (corporateId: number | string, isDetails: boolean, date: string) => {
  return {
    type: actionTypes.DETAILS_CORPORATE_INTERACTIVE_REQUEST,
    isDetails,
    corporateId,
    date,
  };
};

export const detailsCorporateInteractiveSuccess = (list: ItemDetailsInteractive[]) => {
  return {
    type: actionTypes.DETAILS_CORPORATE_INTERACTIVE_SUCCESS,
    list,
  };
};

export const detailsCorporateInteractiveFailed = () => {
  return {
    type: actionTypes.DETAILS_CORPORATE_INTERACTIVE_FAILED,
  };
};

// activity Corporate
export const detailsCorporateActivityRequest = (
  corporateId: number | string,
  arrActivity: number[],
  limit: number,
  date: string,
) => {
  return {
    type: actionTypes.DETAILS_CORPORATE_ACTIVITY_REQUEST,
    corporateId,
    arrActivity,
    limit,
    date,
  };
};

export const detailsCorporateActivitySuccess = (list: ItemDetailsActivity[]) => {
  return {
    type: actionTypes.DETAILS_CORPORATE_ACTIVITY_SUCCESS,
    list,
  };
};

export const detailsCorporateActivityFailed = () => {
  return {
    type: actionTypes.DETAILS_CORPORATE_ACTIVITY_FAILED,
  };
};

// file Corporate
export const detailsCorporateFileRequest = (params: ParamsFile) => {
  return {
    type: actionTypes.DETAILS_CORPORATE_FILE_REQUEST,
    params,
  };
};

export const detailsCorporateFileSuccess = (list: ItemAttachFiles[], total: number, page?: number) => {
  return {
    type: actionTypes.DETAILS_CORPORATE_FILE_SUCCESS,
    list,
    page,
    total,
  };
};

export const detailsCorporateFileFailed = () => {
  return {
    type: actionTypes.DETAILS_CORPORATE_FILE_FAILED,
  };
};

// deal corporate
export const detailsCorporateDealRequest = (corporateId: string | number, dealStatusPipeline: number) => {
  return {
    type: actionTypes.DETAILS_CORPORATE_DEAL_REQUEST,
    corporateId,
    dealStatusPipeline,
  };
};

export const detailsCorporateDealSuccess = (list: ItemDealDetails[]) => {
  return {
    type: actionTypes.DETAILS_CORPORATE_DEAL_SUCCESS,
    list,
  };
};

export const detailsCorporateDealFailed = () => {
  return {
    type: actionTypes.DETAILS_CORPORATE_DEAL_FAILED,
  };
};

// task Corporate: mission + appointment. params truyền type để lấy ra nhiệm vụ hoặc lịch hẹn. Nhiệm vụ là 1, cuộc hẹn là 2
export const detailsCorporateMissionRequest = (corporateId: number | string, date: string, status: number) => {
  return {
    type: actionTypes.DETAILS_CORPORATE_MISSION_REQUEST,
    corporateId,
    date,
    status,
  };
};

export const detailsCorporateMissionSuccess = (list: ItemTask[]) => {
  return {
    type: actionTypes.DETAILS_CORPORATE_MISSION_SUCCESS,
    list,
  };
};

export const detailsCorporateMissionFailed = () => {
  return {
    type: actionTypes.DETAILS_CORPORATE_MISSION_FAILED,
  };
};

export const detailsCorporateAppointmentRequest = (corporateId: number | string, date: string, status: number) => {
  return {
    type: actionTypes.DETAILS_CORPORATE_APPOINTMENT_REQUEST,
    corporateId,
    date,
    status,
  };
};

export const detailsCorporateAppointmentSuccess = (list: ItemTask[]) => {
  return {
    type: actionTypes.DETAILS_CORPORATE_APPOINTMENT_SUCCESS,
    list,
  };
};

export const detailsCorporateAppointmentFailed = () => {
  return {
    type: actionTypes.DETAILS_CORPORATE_APPOINTMENT_FAILED,
  };
};

//setloadCorporate

export const setRefreshingCorporateInfo = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_CORPORATE_INFO,
    isRefreshing,
  };
};
export const setRefreshingCorporateDeal = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_CORPORATE_DEAL,
    isRefreshing,
  };
};
export const setRefreshingCorporateInteractive = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_CORPORATE_INTERACTIVE,
    isRefreshing,
  };
};
export const setRefreshingCorporateNote = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_CORPORATE_NOTE,
    isRefreshing,
  };
};
export const setRefreshingCorporateActivity = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_CORPORATE_ACTIVITY,
    isRefreshing,
  };
};
export const setRefreshingCorporateMission = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_CORPORATE_MISSION,
    isRefreshing,
  };
};
export const setRefreshingCorporateFile = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_CORPORATE_FILE,
    isRefreshing,
  };
};
export const setRefreshingCorporateAppointment = (isRefreshing: boolean) => {
  return {
    type: actionTypes.SET_LOADING_DETAILS_CORPORATE_APPOINTMENT,
    isRefreshing,
  };
};

export const setEmptyCorporate = () => {
  return {
    type: actionTypes.SET_EMPTY_CORPORATE,
  };
};
