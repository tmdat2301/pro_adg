import { AppHeader, AppText } from '@components/index';
import { MyInput } from '@components/Input';
import { color, padding, fontSize } from '@helpers/index';
import { ContactBodyFieldModel, ItemVel, ContactDetailsModel } from '@interfaces/contact.interface';
import { ExtensionBodyFieldFormikModel, ResponseReturn } from '@interfaces/response.interface';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiGet, apiPost, apiPut } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import { Formik, FormikProps } from 'formik';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Keyboard, Modal, ScrollView, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { MyIcon } from '@components/Icon';
import { DuplicateErrors, FieldExtension, FieldInsert } from '@interfaces/lead.interface';
import { FieldType, ISO_DATES, TypeFieldExtension } from '@helpers/constants';
import DropDownMutiline from '@components/DropDownMutiline';
import { AppContext } from '@contexts/index';
import { AppRoutes } from '@navigation/appRoutes';
import { useDispatch } from 'react-redux';
import { detailsDealInfoRequest } from '@redux/actions/detailsActions';
import AppField from '@components/Input/MultiInput/AppField';
import { Host } from 'react-native-portalize';
import WrapInput from '@components/Input/WrapInput';
import { isDate, isEmpty, isNumber, set } from 'lodash';
import dayjs from 'dayjs';
import ModalPipelineStatus from './ModalPipelineStatus';
import AppConfirm from '@components/AppConfirm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModalDuplicate from './ModalDuplicate';

interface IDealCUProps {
  idDeal: number | null;
  isGoback?: boolean;
}
export interface ProjectStatus {
  status: string;
  id: string;
  order: number;
  totalProjects: number;
}
const listInputDefault = [
  'name',
  'expectationvalue',
  'ownername',
  'dealcode',
  'note',
  'utmcampaign',
  'utmsource',
  'utmmedium',
  'utmterm',
  'utmcontent',
];

const DealCU = (props: IDealCUProps) => {
  const { idDeal, isGoback } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [modalConfirm, setModalConfirm] = useState(false);
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const [arrFieldInsert, setFieldInsert] = useState<FieldInsert[]>([]);
  const refFormik = useRef<FormikProps<any>>(null);
  const [duplicateErrors, setDuplicateErrors] = useState<any>([]);
  const [duplicateModal, setDuplicateModal] = useState(false);
  const [validationSchema, setValidationSchema] = useState({
    name: Yup.string().required(t('label:required')),
    expectationValue: Yup.number().required(t('label:required')).typeError(t('error:type_number_err')),
    sourceId: Yup.object().required(t('label:required')),
    pipelineId: Yup.object().required(t('label:required')),
    companyPipelineId: Yup.object().required(t('label:required')),
    productIds: Yup.array()
      .min(1, t('label:required'))
      .of(
        Yup.object().shape({
          label: Yup.string().required(t('label:required')),
        }),
      )
      .required(t('label:required')),
    contactIds: Yup.array()
      .min(1, t('label:required'))
      .of(
        Yup.object().shape({
          label: Yup.string().required(t('label:required')),
        }),
      )
      .required(t('label:required')),
  });
  const { objInfo } = useRoute<any>().params;
  const [projectStatus, setProjectStatus] = useState<ProjectStatus[]>([]);
  const [initialValues, setInitialValues] = useState<any>({
    accountId: !!objInfo?.comporateId
      ? {
        label: objInfo?.comporateId ?? '',
        value: objInfo.comporateName ?? '',
        email: null,
      }
      : '',

    productIds: '',
    sourceId: '',
    pipelineId: '',
    contactIds: !!objInfo?.contacts ? objInfo.contacts : '',
    expectationValue: '0',
    companyPipelineId: '',
    multiSelectExtension: {},
    numberExtension: {},
    textExtension: {},
    dateTimeExtension: {},
    choiceExtension: {},
  });

  const getFieldInsert = async () => {
    try {
      appContext.setLoading(true);
      const url = `${serviceUrls.path.getFieldInsert(TypeFieldExtension.deal)}?option=false`;
      const response: ResponseReturn<FieldInsert[]> = await apiGet(url, {});
      if (response.error) {
        Toast.show({
          type: 'error',
          text1: t('lead:notice'),
          text2: response.errorMessage || response.detail || 'ERROR',
        });
        return;
      }
      if (response.response && response.response.data) {
        setFieldInsert(response.response.data);
        const newSchema: ExtensionBodyFieldFormikModel = {};
        response.response.data.forEach((elm: FieldInsert) => {
          if (elm.fields.length > 0) {
            elm.fields.forEach((item: FieldExtension) => {
              if (!item.isDefault && item.isRequired) {
                switch (item.fieldType) {
                  case FieldType.Choice:
                  case FieldType.Choice:
                    set(newSchema, `choiceExtension-${item.name}`, Yup.object().required(t('label:required')));
                    break;
                  case FieldType.DateTime:
                    set(newSchema, `dateExtension-${item.name}`, Yup.date().required(t('label:required')));
                    break;
                  case FieldType.Number:
                    set(newSchema, `numberExtension-${item.name}`, Yup.number().required(t('label:required')));
                    break;
                  case FieldType.MutiSelect:
                    set(
                      newSchema,
                      `multiSelectExtension-${item.name}`,
                      Yup.array().min(1, t('label:required')).required(t('label:required')),
                    );
                    break;
                  default:
                    set(newSchema, `textExtension-${item.name}`, Yup.string().required(t('label:required')));
                    break;
                }
              }
            });
          }
        });
        setValidationSchema({ ...validationSchema, ...newSchema });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('lead:notice'),
        text2: JSON.stringify(error),
      });
    } finally {
      appContext.setLoading(false);
    }
  };

  const setDetailsContact = async (idDeal: number) => {
    try {
      appContext.setLoading(true);
      const url = `${serviceUrls.path.dealDetailsInfo}${idDeal}`;
      const response: ResponseReturn<any> = await apiGet(url, { hiddenSomeThing: true });
      if (response.error) {
        return;
      }
      if (response.response && response.response.data) {
        const data = response.response.data;
        const objSource: ItemVel =
          data.sourceId !== null
            ? {
              label: data.sourceId,
              value: data.sourceName,
              email: null,
            }
            : '';
        const objProject: ItemVel =
          data.projectId !== null
            ? {
              id: data.projectId,
              name: data.projectName ?? '',
              code: '',
            }
            : null;
        const objAccount: ItemVel =
          data.accountId !== null
            ? {
              label: data.accountId,
              value: data.corporateName ?? '',
              email: null,
            }
            : null;
        if (data.fieldExtensionText && data.fieldExtensionText.length > 0) {
          data.fieldExtensionText.forEach((element, index) => {
            data[`textExtension-${element.onsFieldExtensionId}`] = element.value;
          });
        }
        if (data.fieldExtensionNumber && data.fieldExtensionNumber.length > 0) {
          data.fieldExtensionNumber.forEach((element, index) => {
            data[`numberExtension-${element.onsFieldExtensionId}`] = element.value;
          });
        }
        if (data.fieldExtensionMultiSelect && data.fieldExtensionMultiSelect.length > 0) {
          // data.fieldExtensionMultiSelect.forEach((element, index) => {
          //   data[`multiSelectExtension-${element.onsFieldExtensionId}`] = element.value;
          // });
          data.fieldExtensionMultiSelect.forEach((element, index) => {
            data[`multiSelectExtension-${element.onsFieldExtensionId}`] = element?.onsFieldExtensionCatalogIds.map(
              (item) => ({
                id: item,
                value: '',
              }),
            );
          });
        }
        if (data.fieldExtensionChoice && data.fieldExtensionChoice.length > 0) {
          data.fieldExtensionChoice.forEach((element, index) => {
            data[`choiceExtension-${element.onsFieldExtensionId}`] = {
              id: element.onsFieldExtensionCatalogId,
              value: element.value,
            };
          });
        }
        if (data.fieldExtensionDate && data.fieldExtensionDate.length > 0) {
          data.fieldExtensionDate.forEach((element, index) => {
            data[`dateExtension-${element.onsFieldExtensionId}`] = element.value;
          });
        }
        const initValues: ContactBodyFieldModel = {
          ...data,
          accountId: objAccount,
          projectId: objProject,
          retailerId: data?.failureReasonId
            ? { label: data.failureReasonId, value: data?.failureReason || '', email: null }
            : '',
          pipelineId: data?.currentPipelineId
            ? {
              label: data.currentPipelineId,
              value:
                data?.pipelines.length > 0
                  ? data?.pipelines.find((item) => item.id === data.currentPipelineId)?.pipeline1
                  : '',
              pipelinePositionId: data?.pipelines.length > 0
                ? data?.pipelines.find((item) => item.id === data.currentPipelineId)?.pipelinePositionId
                : '',
            }
            : '',
          companyPipelineId: data?.companyPipelineId
            ? { id: data.companyPipelineId, companyPipelineName: data?.companyPipelineName || '' }
            : '',
          productIds: data?.products
            ? data?.products.map((elm) => ({ label: elm.id, value: elm?.name || '', email: null }))
            : '',
          contactIds: data?.contacts
            ? data?.contacts.map((elm) => ({ label: elm.id, value: elm?.name || '', email: null }))
            : '',
          expectationValue: data.expectationValue.toString(),
          sourceId: objSource,
        };
        setInitialValues(initValues);
      }
    } catch (error) {
    } finally {
      appContext.setLoading(false);
    }
  };
  useEffect(() => {
    const getProjectStatus = async () => {
      try {
        const response = await apiGet(serviceUrls.path.projectStatus, { searchValue: '' });
        if (response.error || !!response.detail) {
          Toast.show({ type: 'error' });
        } else {
          setProjectStatus(response.response.data);
        }
      } catch (error) { }
    };
    getFieldInsert();
    getProjectStatus();
    if (idDeal) {
      setDetailsContact(idDeal);
    }
  }, []);

  const updateDeal = async (value: any) => {
    Keyboard.dismiss();
    try {
      appContext.setLoading(true);
      const choiceExtension = Object.create({});
      const numberExtension = Object.create({});
      const multiSelectExtension = Object.create({});
      const textExtension = Object.create({});
      const dateExtension = Object.create({});

      Object.keys(value).forEach((elm) => {
        if (elm.includes('multiSelectExtension-') && !isEmpty(value[elm]) && value[elm].length > 0) {
          const name = elm.replace('multiSelectExtension-', '');
          multiSelectExtension[name] = value[elm].map((item) => item.id);
        }
        if (elm.includes('choiceExtension-') && !isEmpty(value[elm])) {
          const name = elm.replace('choiceExtension-', '');
          choiceExtension[name] = value[elm]?.id;
        }
        if (elm.includes('numberExtension-') && !!value[elm]) {
          const name = elm.replace('numberExtension-', '');
          numberExtension[name] = value[elm];
        }
        if (elm.includes('textExtension-') && !isEmpty(value[elm])) {
          const name = elm.replace('textExtension-', '');
          textExtension[name] = value[elm];
        }
        if (elm.includes('dateExtension-') && isDate(dayjs(value[elm]).toDate())) {
          const name = elm.replace('dateExtension-', '');
          dateExtension[name] = dayjs(value[elm]).toISOString();
        }
      });
      const body: any = {
        id: value?.id ? value?.id : 0,
        dealCode: value?.dealCode ? value?.dealCode : null,
        name: value?.name ? value?.name : null,
        expectationValue: value?.expectationValue ? value?.expectationValue : null,
        utmsource: value?.utmsource ? value?.utmsource : null,
        utmcampaign: value?.utmcampaign ? value?.utmcampaign : null,
        utmcontent: value?.utmcontent ? value?.utmcontent : null,
        utmmedium: value?.utmmedium ? value?.utmmedium : null,
        utmterm: value?.utmterm ? value?.utmterm : null,
        note: value?.note ? value?.note : null,
        projectId: value?.projectId ? value?.projectId?.id : null,
        sourceId: value.sourceId?.label,
        customerId: value.customerGroupId ? value.customerGroupId?.label : null,
        accountId: value?.accountId ? value?.accountId.label : null,
        companyPipelineId: value?.companyPipelineId ? value?.companyPipelineId.id : null,
        contactIds: value?.contactIds ? value?.contactIds.map((item: ItemVel) => item.label) : null,
        pipelineId: value?.pipelineId ? value?.pipelineId?.label : null,
        productIds: value?.productIds ? value?.productIds.map((item: ItemVel) => item.label) : null,
        retailerId: value?.retailerId ? value?.retailerId?.id : null,
        failureReason: value?.failureReason ? value?.failureReason?.label : null,
        expectationEndDate: value?.expectationEndDate ? dayjs(value?.expectationEndDate).format(ISO_DATES) : null,
        choiceExtension: !isEmpty(choiceExtension) ? choiceExtension : {},
        textExtension: !isEmpty(textExtension) ? textExtension : {},
        dateTimeExtension: !isEmpty(dateExtension) ? dateExtension : {},
        multiSelectExtension: !isEmpty(multiSelectExtension) ? multiSelectExtension : {},
        numberExtension: !isEmpty(numberExtension) ? numberExtension : {},
      };

      const urlCreate = serviceUrls.path.getListDeal;
      if (idDeal) {
        const response: ResponseReturn<any> = await apiPut(`${urlCreate}`, body);
        if (response.code && response.code === 403) {
          Alert.alert(t('error:no_access'), t('error:no_access_content'), [
            {
              text: t('error:understand'),
              style: 'cancel',
            },
          ]);
          return;
        }
        if (response.error) {
          const duplicateErrors = response?.duplicates?.map((el: any) => {
            let productError = '';
            if (el.isDuplicateNeed) {
              el.products.forEach((el: any) => {
                productError += el.name + ', ';
              });
            }
            return {
              name: el?.isDuplicateName ? el.name : el.isDuplicateName,
              product: el?.isDuplicateNeed ? productError : el.isDuplicateNeed,
            };
          });
          setDuplicateErrors(duplicateErrors);
          if (!isEmpty(duplicateErrors) && !!duplicateErrors) {
            setDuplicateModal(true);
            return;
          }
          Toast.show({
            type: 'error',
            text1: t('lead:notice'),
            text2: response.errorMessage || response.detail || 'ERROR',
          });
          return;
        }
        if (response.response && response.response.data) {
          Toast.show({
            type: 'success',
            text1: t('lead:edit'),
            text2: t('lead:edit_deal_success'),
          });
          navigation.goBack();
          dispatch(detailsDealInfoRequest(idDeal, true));
        }
      } else {
        const response: ResponseReturn<any> = await apiPost(urlCreate, body);
        if (response.code && response.code === 403) {
          Alert.alert(t('error:no_access'), t('error:no_access_content'), [
            {
              text: t('error:understand'),
              style: 'cancel',
            },
          ]);
          return;
        }
        if (response.error) {
          const duplicateErrors = response.duplicates?.map((el) => {
            let productError = '';
            if (el.isDuplicateNeed) {
              el.products.forEach((el: any) => {
                productError += el.name + ', ';
              });
            }
            return {
              name: el.isDuplicateName ? el.name : el.isDuplicateName,
              product: el.isDuplicateNeed ? productError : el.isDuplicateNeed,
            };
          });
          setDuplicateErrors(duplicateErrors);
          if (!isEmpty(duplicateErrors) && !!duplicateErrors) {
            setDuplicateModal(true);
            return;
          }
          Toast.show({
            type: 'error',
            text1: t('lead:notice'),
            text2: response.errorMessage || response.detail || 'ERROR',
          });
          return;
        }
        if (response.response && response.response.data) {
          Toast.show({
            type: 'success',
            text1: t('lead:add'),
            text2: t('lead:add_deal_success'),
          });
          if (isGoback) {
            navigation.goBack();
          } else {
            navigation.navigate(AppRoutes.DETAIL_DEAL, { key: response.response.data, type: 'corporate' });
          }
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('label:error'),
        text2: JSON.stringify(error),
      });
    } finally {
      appContext.setLoading(false);
    }
  };
  return (
    <Host>
      <View style={styles.container}>
        {arrFieldInsert ? (
          <Formik
            initialValues={initialValues}
            enableReinitialize
            innerRef={refFormik}
            onSubmit={(value) => {
              updateDeal(value);
            }}
            validateOnChange={false}
            validationSchema={Yup.object().shape(validationSchema)}>
            {(props) => {
              const { handleSubmit, values, setFieldValue, errors } = props;
              return (
                <>
                  <AppHeader
                    headerContainerStyles={styles.headerContainer}
                    iconLeft={<MyIcon.Close />}
                    iconRight={<Icon type="materialIcons" name="done" size={28} color={color.icon} />}
                    iconLeftPress={() => {
                      if (props.dirty) {
                        setModalConfirm(true);
                      } else {
                        navigation.goBack();
                      }
                    }}
                    iconRightPress={handleSubmit}
                    title={idDeal ? t('button:update_deal') : t('button:add_deal')}
                  />
                  <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={styles.scrollInput}>
                    {arrFieldInsert
                      .sort((a, b) => {
                        return a.order - b.order;
                      })
                      .map((v, i) => {
                        v.fields.sort((a, b) => {
                          return a.order - b.order;
                        });
                        if (v.fields.length === 0) {
                          return null;
                        }
                        return (
                          <>
                            <AppText
                              value={v.label}
                              style={styles.textTitle}
                              fontSize={fontSize.f12}
                              color={color.subText}
                            />
                            <View style={styles.viewBorder}>
                              {v.fields.length > 0 &&
                                v.fields.map((vChild, iChild) => {
                                  if (vChild.name.toLocaleLowerCase() === 'tags') {
                                    return (
                                      <MyInput.Multi
                                        key={vChild.id}
                                        name={vChild.name}
                                        Component={WrapInput}
                                        placeholder={vChild.label}
                                      />
                                    );
                                  }
                                  if (listInputDefault.includes(vChild.name.toLocaleLowerCase())) {
                                    const isDisable =
                                      vChild.name.toLocaleLowerCase() === 'dealcode' ||
                                      vChild.name.toLocaleLowerCase() === 'ownername';
                                    const isNote = vChild.name.toLocaleLowerCase() === 'note';
                                    const isRequire =
                                      vChild.name.toLocaleLowerCase() === 'name' ||
                                      vChild.name.toLocaleLowerCase() === 'expectationvalue';
                                    return (
                                      <MyInput.Base
                                        key={vChild.id}
                                        name={vChild.name}
                                        multiline={isNote}
                                        disable={isDisable}
                                        editable={!isDisable}
                                        keyboardType={vChild.fieldType === FieldType.Number ? 'number-pad' : 'default'}
                                        isRequire={isRequire}
                                        errors={errors}
                                        placeholder={vChild.label}
                                        value={values[vChild.name]}
                                        onChangeTextData={(text) => setFieldValue(vChild.name, text)}
                                      />
                                    );
                                  }
                                  if (vChild.name.toLocaleLowerCase() === 'accountid') {
                                    return (
                                      <AppField
                                        key={vChild.id}
                                        typeSelect={FieldType.Choice}
                                        modalName="ModalCorporate"
                                        title={vChild.label}
                                        name={vChild.name}
                                        keyShow="value"
                                        Component={DropDownMutiline}
                                        titleModal={vChild?.label}
                                        onPressExtra={() => {
                                          setFieldValue('contactIds', '');
                                        }}
                                      />
                                    );
                                  }
                                  if (vChild.name.toLocaleLowerCase() === 'contactids') {
                                    return (
                                      <AppField
                                        key={vChild.id}
                                        typeSelect={FieldType.MutiSelect}
                                        modalName="ModalContactDropDown"
                                        title={vChild.label}
                                        name={vChild.name}
                                        keyShow="value"
                                        Component={DropDownMutiline}
                                        titleModal={vChild.label}
                                        isRequire
                                        idComporate={values.accountId?.label}
                                      />
                                    );
                                  }
                                  if (vChild.name.toLocaleLowerCase() === 'productids') {
                                    return (
                                      <AppField
                                        key={vChild.id}
                                        isRequire
                                        typeSelect={FieldType.MutiSelect}
                                        modalName="ModalProductDropDown"
                                        title={vChild.label}
                                        name={vChild.name}
                                        keyShow="value"
                                        Component={DropDownMutiline}
                                        titleModal={vChild.label}
                                      />
                                    );
                                  }

                                  if (vChild.name.toLocaleLowerCase() === 'retailerid') {
                                    return (
                                      <AppField
                                        key={vChild.id}
                                        typeSelect={FieldType.Choice}
                                        modalName="ModalSearchRetailers"
                                        title={vChild.label}
                                        name={vChild.name}
                                        keyShow="name"
                                        Component={DropDownMutiline}
                                        titleModal={vChild.label}
                                      />
                                    );
                                  }
                                  if (['expectationenddate', 'actualenddate'].includes(vChild.name.toLocaleLowerCase())) {
                                    return (
                                      <AppField
                                        disabled={vChild.name.toLocaleLowerCase() === 'actualenddate' && values?.pipelineId.pipelinePositionId != 4 && values?.pipelineId.pipelinePositionId != 3}
                                        key={vChild.id}
                                        modalName="ModalDate"
                                        title={vChild.label}
                                        name={vChild.name}
                                        Component={DropDownMutiline}
                                        type="date"
                                      />
                                    );
                                  }

                                  if (vChild.name.toLocaleLowerCase() === 'failurereason') {
                                    return (
                                      <AppField
                                        key={vChild.id}
                                        disabled={values?.pipelineId.pipelinePositionId != 4}
                                        typeSelect={FieldType.Choice}
                                        modalName="ModalFailReasonDeal"
                                        title={vChild.label}
                                        name={vChild.name}
                                        keyShow="value"
                                        Component={DropDownMutiline}
                                        titleModal={vChild.label}
                                      />
                                    );
                                  }

                                  if (vChild.name.toLocaleLowerCase() === 'projectid') {
                                    return (
                                      <AppField
                                        key={vChild.id}
                                        typeSelect={FieldType.Choice}
                                        modalName="ModalSearchProject"
                                        title={vChild.label}
                                        name={vChild.name}
                                        keyShow="name"
                                        projectStatusIds={projectStatus}
                                        Component={DropDownMutiline}
                                        titleModal={vChild.label}
                                      />
                                    );
                                  }
                                  if (vChild.name.toLocaleLowerCase() === 'pipelineid') {
                                    return (
                                      <ModalPipelineStatus
                                        key={vChild.id}
                                        disabled={!!idDeal || isEmpty(values.companyPipelineId)}
                                        idPipeline={values?.companyPipelineId?.id}
                                        typeSelect={FieldType.Choice}
                                        isRequire
                                        modalName="ModalSelect"
                                        title={vChild.label}
                                        name={vChild.name}
                                        keyShow="value"
                                        Component={DropDownMutiline}
                                        titleModal={vChild.label}
                                      />
                                    );
                                  }
                                  if (vChild.name.toLocaleLowerCase() === 'companypipelineid') {
                                    return (
                                      <AppField
                                        key={vChild.id}
                                        disabled={!!idDeal}
                                        typeSelect={FieldType.Choice}
                                        isRequire
                                        modalName="ModalCompanyPipelineDead"
                                        title={vChild.label}
                                        name={vChild.name}
                                        keyShow="companyPipelineName"
                                        Component={DropDownMutiline}
                                        titleModal={vChild.label}
                                      />
                                    );
                                  }
                                  if (vChild.name.toLocaleLowerCase() === 'customergroupid') {
                                    return (
                                      <AppField
                                        key={vChild.id}
                                        modalName="ModalCustomerGroupDropDown"
                                        title={vChild.label}
                                        titleModal={vChild.label}
                                        name={vChild.name}
                                        keyShow="value"
                                        Component={DropDownMutiline}
                                      />
                                    );
                                  }

                                  if (vChild.name.toLocaleLowerCase() === 'sourceid') {
                                    return (
                                      <AppField
                                        key={vChild.id}
                                        typeSelect={FieldType.Choice}
                                        isRequire
                                        modalName="ModalSourceDropdown"
                                        title={vChild.label}
                                        name="sourceId"
                                        keyShow="value"
                                        Component={DropDownMutiline}
                                        titleModal={t('label:source_select')}
                                      />
                                    );
                                  }

                                  if (vChild.fieldType === FieldType.Text || vChild.fieldType === FieldType.Textarea) {

                                    return (
                                      <MyInput.Base
                                        multiline={vChild.fieldType === FieldType.Textarea}
                                        style={vChild.isReadOnly && { opacity: 0.5 }}
                                        editable={!vChild.isReadOnly}
                                        disable={vChild.isReadOnly}
                                        key={vChild.id}
                                        name={`textExtension-${vChild.id}`}
                                        value={values[`textExtension-${vChild.id}`]}
                                        isRequire={vChild.isRequired}
                                        errors={errors}
                                        placeholder={vChild.label}
                                        onChangeText={(text) => {
                                          setFieldValue(`textExtension-${vChild.id}`, text);
                                        }}
                                      />
                                    );
                                  }
                                  if (vChild.fieldType === FieldType.Number) {
                                    return (
                                      <MyInput.Base
                                        style={vChild.isReadOnly && { opacity: 0.5 }}
                                        editable={!vChild.isReadOnly}
                                        disable={vChild.isReadOnly}
                                        key={vChild.id}
                                        name={`numberExtension-${vChild.id}`}
                                        value={(values[`numberExtension-${vChild.id}`] || '').toString()}
                                        keyboardType={'number-pad'}
                                        isRequire={vChild.isRequired}
                                        errors={errors}
                                        placeholder={vChild.label}
                                        onChangeText={(text) => {
                                          setFieldValue(`numberExtension-${vChild.id}`, text);
                                        }}
                                      />
                                    );
                                  }
                                  if (vChild.fieldType === FieldType.DateTime) {
                                    return (
                                      <AppField
                                        key={vChild.id}
                                        disabled={vChild.isReadOnly}
                                        modalName="ModalDate"
                                        title={vChild.label}
                                        name={`dateExtension-${vChild.id}`}
                                        Component={DropDownMutiline}
                                        type="date"
                                        isRequire={vChild.isRequired}
                                      />
                                    );
                                  }
                                  if (vChild.fieldType === FieldType.Choice) {
                                    if (isNumber(values[`choiceExtension-${vChild.id}`]) && vChild.catalog.length > 0) {
                                      setFieldValue(
                                        `choiceExtension-${vChild.id}`,
                                        vChild.catalog.find((elm) => elm.id === values),
                                      );
                                    }
                                    return (
                                      <AppField
                                        key={vChild.id}
                                        isRequire={vChild.isRequired}
                                        dataSelect={vChild.catalog || []}
                                        disabled={vChild.isReadOnly}
                                        modalName="ModalSelect"
                                        title={vChild.label}
                                        titleModal={vChild.label}
                                        name={`choiceExtension-${vChild.id}`}
                                        Component={DropDownMutiline}
                                        keyShow={'value'}
                                      />
                                    );
                                  }
                                  if (vChild.fieldType === FieldType.MutiSelect) {
                                    return (
                                      <AppField
                                        key={vChild.id}
                                        isRequire={vChild.isRequired}
                                        dataSelect={vChild.catalog || []}
                                        typeSelect={FieldType.MutiSelect}
                                        disabled={vChild.isReadOnly}
                                        keyShow={'value'}
                                        modalName="ModalSelect"
                                        titleModal={vChild.label}
                                        title={vChild.label}
                                        name={`multiSelectExtension-${vChild.id}`}
                                        Component={DropDownMutiline}
                                      />
                                    );
                                  }
                                })}
                            </View>
                          </>
                        );
                      })}
                  </KeyboardAwareScrollView>
                </>
              );
            }}
          </Formik>
        ) : null}
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalConfirm}
        onRequestClose={() => {
          setModalConfirm(false);
        }}>
        <AppConfirm
          content={!!idDeal ? t('label:message_cancel') : t('label:message_cancel_add')}
          title={t('label:cancel_edit')}
          onPressLeft={() => {
            setModalConfirm(false);
          }}
          onPressRight={() => {
            setModalConfirm(false);
            navigation.goBack();
          }}
        />
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={duplicateModal}
        onRequestClose={() => {
          setDuplicateModal(false);
        }}>
        <ModalDuplicate
          title="Trùng dữ liệu"
          dataDuplicate={duplicateErrors}
          onPressOut={() => {
            setDuplicateModal(false);
          }}></ModalDuplicate>
      </Modal>
    </Host>
  );
};

export default DealCU;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.white,
    paddingBottom: padding.p12,
  },
  scrollInput: {
    flex: 1,
    backgroundColor: color.lightGray,
  },
  headerBottomSheet: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: padding.p24,
  },
  viewBorder: {
    marginHorizontal: padding.p16,
    padding: padding.p8,
    backgroundColor: color.white,
    marginBottom: padding.p18,
  },
  textTitle: {
    marginHorizontal: padding.p16,
    marginVertical: padding.p6,
  },
  button: {
    paddingHorizontal: padding.p16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBoxContainer: {
    borderWidth: 0,
    padding: 0,
    backgroundColor: color.white,
    marginRight: padding.p12,
    marginBottom: padding.p4,
  },
});
