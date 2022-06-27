import AppConfirm from '@components/AppConfirm';
import AppHeader from '@components/AppHeader';
import AppText from '@components/AppText';
import DropDownMutiline from '@components/DropDownMutiline';
import { MyIcon } from '@components/Icon';
import { MyInput } from '@components/Input';
import AppField from '@components/Input/MultiInput/AppField';
import ArrayInput from '@components/Input/MultiInput/components/ArrayInput';
import WrapInput from '@components/Input/WrapInput';
import { CompanyPipeline } from '@components/ModalCompanyPipline';
import { AppContext } from '@contexts/index';
import { FieldType, ISO_DATES, TypeFieldExtension } from '@helpers/constants';
import { color, fontSize, padding } from '@helpers/index';
import { setTimeOut } from '@helpers/untils';
import { FieldInputObject, ItemVel } from '@interfaces/contact.interface';
import {
  DuplicateErrors,
  FieldExtension,
  FieldInsert,
  LeadBodyFieldFormikModel,
  LeadBodyFieldModel,
  LeadCUSuccess,
  LeadDetailsModel,
} from '@interfaces/lead.interface';
import { ExtensionBodyFieldFormikModel, ResponseReturn } from '@interfaces/response.interface';
import { AppRoutes } from '@navigation/appRoutes';
import { useNavigation } from '@react-navigation/native';
import { detailsLeadInfoRequest, setRefreshingLeadActivity } from '@redux/actions/detailsActions';
import { RootState } from '@redux/reducers';
import { apiGet, apiPost, apiPut } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import dayjs from 'dayjs';
import { Formik, FormikProps } from 'formik';
import { isDate, isEmpty, isNumber, set, isArray } from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Keyboard, Modal, StyleSheet, View } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Host } from 'react-native-portalize';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import ModalDuplicate from './ModalDuplicate';
import ModalPipelineStatus from './ModalPipelineStatus';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface ILeadCUProps {
  idLead: number | null;
}
export const checkLength = (name: string) => {
  switch (name) {
    case 'fullName':
      return 500;
    default:
      return undefined;
  }
};
const listArrayInputDefault = ['tags', 'emails', 'mobiles', 'companymobiles', 'websites', 'fanpages', 'companyemails'];
export const listInputDefault = [
  'fullname',
  'ownername',
  'leadcode',
  'address',
  'facebook',
  'department',
  'position',
  'companyaddress',
  'companyinvoiceaddress',
  'dealname',
  'expectationvalue',
  'note',
  'cdmarketing',
  'utmsource',
  'utmcampaign',
  'utmcontent',
  'utmmedium',
  'utmterm',
  'companytaxcode',
];

const LeadCU = (props: ILeadCUProps) => {
  const { idLead } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const appContext = useContext(AppContext);
  const navigation = useNavigation();
  const refFormik = useRef<FormikProps<any>>(null);
  const [arrFieldInsert, setFieldInsert] = useState<FieldInsert[]>([]);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [duplicateErrors, setDuplicateErrors] = useState<any>([]);
  const [duplicateModal, setDuplicateModal] = useState(false);
  const [validationSchema, setValidationSchema] = useState({
    fullName: Yup.string().required(t('label:required')).max(500, t('label:required')),
    emails: Yup.array().when('mobiles', {
      is: (val: any[]) => {
        const checkMobiles = val?.filter((e) => !isEmpty(e.text) || !!e?.text);
        return checkMobiles?.length === 0;
      },
      then: Yup.array()
        .min(1, t('label:required'))
        .of(
          Yup.object().shape({
            text: Yup.string().required(t('label:required')).email(t('error:email_wrong_format')),
          }),
        ),
      otherwise: Yup.array().min(0),
    }),
    mobiles: Yup.array()
      .when('emails', {
        is: (val: any[]) => {
          const checkMails = val?.filter((e) => !!e?.text && e?.text.length > 0);
          return checkMails?.length === 0;
        },
        then: Yup.array()
          .min(1, t('label:required'))
          .of(
            Yup.object().shape({
              text: Yup.string().required(t('label:required')).min(9, t('error:phone_wrong_format')),
            }),
          ),
        otherwise: Yup.array().min(0),
      })
      .of(
        Yup.object().shape({
          text: Yup.string().min(9, t('error:type_number_err')),
        }),
      ),
    companyMobiles: Yup.array().of(
      Yup.object().shape({
        text: Yup.string().notRequired().min(9, t('error:phone_wrong_format')),
      }),
    ),
    companyEmails: Yup.array().of(
      Yup.object().shape({
        text: Yup.string().email(t('error:email_wrong_format')),
      }),
    ),
    expectationValue: Yup.number().nullable().typeError(t('error:type_number_err')),

    accounts: Yup.array()
      .min(1, t('label:required'))
      .of(
        Yup.object().shape({
          text: Yup.string().required(t('label:required')),
        }),
      ),
    sourceId: Yup.object().required(t('label:required')),
    companyPipelineId: Yup.object().required(t('label:required')),
    pipelineId: Yup.object().required(t('label:required')),
    products: Yup.array().min(1, t('label:required')),
  });

  const userReducer = useSelector((state: RootState) => state.userReducer);
  const [initialValues, setInitValues] = useState({
    mobiles: [
      {
        code: 'vn',
        isMain: true,
        text: '',
      },
    ],
    emails: [
      {
        isMain: true,
        text: '',
      },
    ],
    companyMobiles: [
      {
        code: 'vn',
        isMain: true,
        text: '',
      },
    ],
    fanpages: [
      {
        isMain: true,
        text: '',
      },
    ],
    websites: [
      {
        isMain: true,
        text: '',
      },
    ],
    companyEmails: [
      {
        isMain: true,
        text: '',
      },
    ],
    expectationValue: '',
    companyName: '',
    customerId: '',
    pipelineId: '',
    companyPipelineId: '',
    sourceId: '',
    failureReasonId: '',
    fullName: '',
    ownerName: userReducer.data.name,
    products: [],
    dateTimeExtension: '',
    id: 0,
    leadCode: '',
  });

  const setDetailsLead = async (idLead: number | null) => {
    if (idLead === null) {
      return;
    }
    try {
      appContext.setLoading(true);
      const url = `${serviceUrls.path.leadDetailsInfo}${idLead}`;
      const response: ResponseReturn<LeadDetailsModel> = await apiGet(url, { hiddenSomeThing: true });
      if (response.error) {
        return;
      }
      if (response.response && response.response.data) {
        const data = response.response.data;
        const arrMobile: FieldInputObject[] = [];
        const arrEmail: FieldInputObject[] = [];
        const arrProducts: ItemVel[] = [];
        if (data.mobiles && data.mobiles.length > 0) {
          for (let index = 0; index < data.mobiles.length; index++) {
            const element = data.mobiles[index];
            const obj: FieldInputObject = {
              isMain: element.isMain,
              text: element.phoneNational.toString(),
              code: element.code.toLocaleLowerCase(),
            };
            arrMobile.push(obj);
          }
        } else {
          arrMobile.push({
            isMain: true,
            text: '',
            code: 'vn',
          });
        }
        if (data.emails && data.emails.length > 0) {
          for (let index = 0; index < data.emails.length; index++) {
            const element = data.emails[index];
            const obj: FieldInputObject = {
              isMain: element.isMain,
              text: element.email,
            };
            arrEmail.push(obj);
          }
        } else {
          arrEmail.push({
            isMain: true,
            text: '',
          });
        }
        if (data.products && data.products.length > 0) {
          for (let index = 0; index < data.products.length; index++) {
            const element = data.products[index];
            const obj: ItemVel = {
              email: null,
              label: element.productId,
              value: element.productName,
            };
            arrProducts.push(obj);
          }
        }
        const indexChildPipeLine = data.pipelines.findIndex((x) => x.id === data.pipelineId);
        const objSource: ItemVel | '' = data.sourceId
          ? {
            label: data.sourceId,
            value: data.sourceName ?? '',
            email: null,
          }
          : '';
        const objClassify: ItemVel | '' = data?.classifyId
          ? {
            label: data.classifyId,
            value: data.classifyName,
            email: null,
          }
          : '';
        const objPipeLineParent: CompanyPipeline | '' = data.companyPipelineId
          ? {
            id: data.companyPipelineId,
            companyPipelineName: data?.companyPipelineName ?? '',
            isDefault: false,
          }
          : '';
        const objPipeLineChild: ItemVel = {
          label: data.pipelineId,
          value: indexChildPipeLine > -1 ? data.pipelines[indexChildPipeLine].pipeline1 : '',
          email: null,
        };
        const objFailureReason: ItemVel = data.failureReasonId
          ? {
            label: data.failureReasonId ?? null,
            value: data.failureReason ?? '',
            email: null,
          }
          : '';
        const objCompanyName: ItemVel = data.customerId
          ? {
            label: data.customerId ?? null,
            value: data.companyName ?? '',
            email: null,
          }
          : '';

        const arrFanpages =
          isArray(data.fanpages) && data.fanpages?.length > 0
            ? data.fanpages.map((item) => ({
              text: item.fanpage.toLocaleLowerCase() || '',
              isMain: item.isMain,
            }))
            : [{ text: '', isMain: true }];
        const arrWebsites =
          isArray(data.websites) && data.websites?.length > 0
            ? data.websites.map((item) => ({
              text: item.website.toLocaleLowerCase() || '',
              isMain: item.isMain,
            }))
            : [{ text: '', isMain: true }];
        const arrCompanyEmails =
          isArray(data.companyEmails) && data.companyEmails?.length > 0
            ? data.companyEmails.map((item) => ({
              text: item.email || '',
              isMain: item.isMain,
            }))
            : [{ text: '', isMain: true }];
        const arrCompanyMobiles =
          isArray(data.companyPhones) && data.companyPhones?.length > 0
            ? data.companyPhones.map((item) => ({
              text: item.phoneNational.toString() || '',
              isMain: item.isMain,
              code: 'vn',
            }))
            : [{ text: '', isMain: true, code: 'vn' }];

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
        const initValuess: LeadBodyFieldFormikModel = {
          ...data,
          classifyId: objClassify,
          companyMobiles: arrCompanyMobiles,
          companyEmails: arrCompanyEmails,
          websites: arrWebsites,
          fanpages: arrFanpages,
          mobiles: arrMobile,
          emails: arrEmail,
          expectationValue: data.expectationValue ? data.expectationValue.toString() : null,
          companyName: objCompanyName,
          pipelineId: objPipeLineChild,
          companyPipelineId: objPipeLineParent,
          sourceId: objSource,
          failureReasonId: objFailureReason,
          fullName: data.fullName ? data.fullName : '',
          ownerName: data.ownerName ?? '',
          products: arrProducts,
          leadCode: data.leadCode || '',
          id: data.id,
        };

        setInitValues(initValuess);
      }
    } catch (error) {
    } finally {
      appContext.setLoading(false);
    }
  };

  const filterArray = (arr: any[]) => {
    const arrClone = arr.filter((e: any) => !isEmpty(e?.text) || !!e?.text);
    return arrClone;
  };

  const createLead = async (value: LeadBodyFieldFormikModel) => {
    Keyboard.dismiss();
    try {
      appContext.setLoading(true);
      const choiceExtension = Object.create({});
      const numberExtension = Object.create({});
      const multiSelectExtension = Object.create({});
      const textExtension = Object.create({});
      const dateExtension = Object.create({});

      Object.keys(value).forEach((elm) => {
        if (elm.includes('multiSelectExtension') && value[elm].length > 0) {
          const name = elm.replace('multiSelectExtension-', '');
          multiSelectExtension[name] = value[elm].map((item) => item.id);
        }
        if (elm.includes('choiceExtension') && !isEmpty(value[elm])) {
          const name = elm.replace('choiceExtension-', '');
          choiceExtension[name] = value[elm]?.id;
        }
        if (elm.includes('numberExtension') && !!value[elm]) {
          const name = elm.replace('numberExtension-', '');
          numberExtension[name] = value[elm];
        }
        if (elm.includes('textExtension') && !isEmpty(value[elm])) {
          const name = elm.replace('textExtension-', '');
          textExtension[name] = value[elm];
        }
        if (elm.includes('dateExtension') && isDate(dayjs(value[elm]).toDate())) {
          const name = elm.replace('dateExtension-', '');
          dateExtension[name] = dayjs(value[elm]).format(ISO_DATES);
        }
      });

      const body: LeadBodyFieldModel = {
        id: value?.id ? value.id : null,
        address: value?.address ? value.address : null,
        cdmarketing: value?.cdmarketing ? value.cdmarketing : null,
        companyAddress: value?.companyAddress ? value.companyAddress : null,
        companyInvoiceAddress: value?.companyInvoiceAddress ? value.companyInvoiceAddress : null,
        facebook: value?.facebook ? value.facebook : null,
        companyTaxCode: value?.companyTaxCode ? value.companyTaxCode : null,
        dealName: value?.dealName ? value.dealName : null,
        department: value?.department ? value.department : null,
        fullName: value?.fullName ? value.fullName : null,
        leadCode: value?.leadCode ? value.leadCode : null,
        note: value?.note ? value.note : null,
        ownerName: value?.ownerName ? value.ownerName : null,
        position: value?.position ? value.position : null,
        tags: value?.tags ? value.tags : null,
        utmcampaign: value?.utmcampaign ? value.utmcampaign : null,
        utmcontent: value?.utmcontent ? value.utmcontent : null,
        utmmedium: value?.utmmedium ? value.utmmedium : null,
        utmsource: value?.utmsource ? value.utmsource : null,
        utmterm: value?.utmterm ? value.utmterm : null,
        expectationEndDate: value?.expectationEndDate ? dayjs(value.expectationEndDate).format(ISO_DATES) : null,
        companyMobiles:
          value.companyMobiles && value.companyMobiles.length > 0 && !value.companyMobiles.some((elm) => !elm.text)
            ? value.companyMobiles.map((elm) => {
              return {
                PhoneNumber: elm.text,
                code: elm.code ?? 'vn',
                isMain: elm.isMain,
              };
            })
            : null,
        fanpages:
          value.fanpages && value.fanpages.length > 0 && !value.fanpages.some((elm) => !elm.text)
            ? value.fanpages.map((elm) => {
              return {
                fanpage: elm.text.toLocaleLowerCase(),
                isMain: elm.isMain,
              };
            })
            : null,
        websites:
          value.websites && value.websites.length > 0 && !value.websites.some((elm) => !elm.text)
            ? value.websites.map((elm) => ({
              website: elm.text.toLocaleLowerCase(),
              isMain: elm.isMain,
            }))
            : null,
        companyEmails:
          value.companyEmails && value.companyEmails.length > 0 && !value.companyEmails.some((elm) => !elm.text)
            ? value.companyEmails.map((elm) => {
              return {
                email: elm.text.toLocaleLowerCase(),
                isMain: elm.isMain,
              };
            })
            : null,
        classifyId: value?.classifyId ? value?.classifyId?.label : null,
        companyPipelineId: value.companyPipelineId ? value?.companyPipelineId?.id : null,
        customerId: value.companyName?.label ? value?.companyName?.label : null,
        companyName: value.companyName?.label ? null : value.companyName?.value,
        emails: filterArray(value.emails).map((elm) => {
          return {
            isMain: elm.isMain,
            email: elm.text.toLocaleLowerCase(),
          };
        }),

        expectationValue: value.expectationValue ? value.expectationValue : null,
        mobiles: filterArray(value.mobiles).map((elm) => {
          return {
            PhoneNumber: elm.text,
            code: elm.code ?? 'vn',
            isMain: elm.isMain,
          };
        }),
        choiceExtension: !isEmpty(choiceExtension) ? choiceExtension : {},
        textExtension: !isEmpty(textExtension) ? textExtension : {},
        dateTimeExtension: !isEmpty(dateExtension) ? dateExtension : {},
        multiSelectExtension: !isEmpty(multiSelectExtension) ? multiSelectExtension : {},
        numberExtension: !isEmpty(numberExtension) ? numberExtension : {},
        pipelineId: value.pipelineId ? value.pipelineId?.label : null,
        products: value.products.map((elm) => {
          return { productId: elm.label };
        }),
        sourceId: value.sourceId ? value.sourceId?.label : -99,
        failureReasonId:
          value.failureReasonId && value.failureReasonId.label !== -99 ? value.failureReasonId.label : null,
      };

      const url = serviceUrls.path.getListLead;
      if (idLead) {
        const response: ResponseReturn<LeadCUSuccess> = await apiPut(`${url}${idLead}`, body);
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
          const duplicateErrors = response?.duplicates?.map((el) => {
            return {
              recordName: el?.recordName,
              email: el?.isDuplicateEmail ? el?.email : el?.isDuplicateEmail,
              fanpage: el?.isDuplicateFanpage ? el?.fanpage : el?.isDuplicateFanpage,
              mobile: el?.isDuplicateMobile ? el?.mobile : el?.isDuplicateMobile,
              website: el?.isDuplicateWebsite ? el?.website : el?.isDuplicateWebsite,
              ownerName: el?.ownerName,
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
            text2: t('lead:edit_lead_success'),
          });
          navigation.goBack();
          dispatch(detailsLeadInfoRequest(idLead, true));
        }
      } else {
        const response: ResponseReturn<LeadCUSuccess> = await apiPost(url, body);
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
          const duplicateErrors = response?.duplicates?.map((el) => {
            return {
              recordName: el?.recordName,
              email: el?.isDuplicateEmail ? el?.email : el?.isDuplicateEmail,
              fanpage: el?.isDuplicateFanpage ? el?.fanpage : el?.isDuplicateFanpage,
              mobile: el?.isDuplicateMobile ? el?.mobile : el?.isDuplicateMobile,
              website: el?.isDuplicateWebsite ? el?.website : el?.isDuplicateWebsite,
              ownerName: el?.ownerName,
            };
          });
          setDuplicateErrors(duplicateErrors);
          if (!isEmpty(duplicateErrors) && !!response.duplicates) {
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
            text2: t('lead:add_lead_success'),
          });
          const id = response.response.data.id;
          navigation.goBack();
          setTimeout(() => {
            navigation.navigate(AppRoutes.DETAIL_LEAD, { key: id });
          }, setTimeOut());
        }
      }
    } catch (error) {
    } finally {
      appContext.setLoading(false);
    }
  };

  useEffect(() => {
    appContext.setLoading(true);
    Promise.all([getFieldInsert(), setDetailsLead(idLead || null)])
      .then((value) => { })
      .catch((error) => { })
      .finally(() => {
        appContext.setLoading(false);
      });
  }, []);

  const getFieldInsert = async () => {
    try {
      const url = `${serviceUrls.path.getFieldInsert(TypeFieldExtension.lead)}?option=false`;
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
                    set(newSchema, `choiceExtension-${item.name}`, Yup.object().required(t('label:required')));
                    break;
                  case FieldType.DateTime:
                    set(newSchema, `dateExtension-${item.name}`, Yup.date().required(t('label:required')));
                    break;
                  case FieldType.Number:
                    set(
                      newSchema,
                      `numberExtension-${item.name}`,
                      Yup.number().typeError(t('error:type_number_err')).required(t('label:required')),
                    );
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
    }
  };

  return (
    <Host>
      <View style={styles.container}>
        {arrFieldInsert ? (
          <Formik
            initialValues={initialValues}
            innerRef={refFormik}
            enableReinitialize
            validateOnChange={false}
            onSubmit={(value) => {
              createLead(value);
            }}
            validationSchema={Yup.object().shape(validationSchema, [['emails', 'mobiles']])}>
            {(props) => {
              const { handleSubmit, errors, values, setFieldValue, dirty } = props;
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
                    title={idLead ? t('button:update_lead') : t('button:add_lead')}
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
                              key={v.id}
                              value={v.label}
                              style={styles.textTitle}
                              fontSize={fontSize.f12}
                              color={color.subText}
                            />
                            <View style={styles.viewBorder}>
                              {v.fields.length > 0 &&
                                v.fields.map((vChild, iChild) => {
                                  if (listArrayInputDefault.includes(vChild.name.toLocaleLowerCase())) {
                                    if (
                                      vChild.name.toLocaleLowerCase() === 'mobiles' ||
                                      vChild.name.toLocaleLowerCase() === 'companymobiles'
                                    ) {
                                      return (
                                        <MyInput.Multi
                                          key={vChild.id}
                                          keyboardType={'phone-pad'}
                                          name={vChild.name}
                                          Component={ArrayInput}
                                          isPhoneType={true}
                                          textButton={t('button:add_phone')}
                                          isRequire={vChild.name.toLocaleLowerCase() === 'mobiles'}
                                          placeholder={vChild.label}
                                          maxLength={10}
                                        />
                                      );
                                    }
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
                                    return (
                                      <MyInput.Multi
                                        key={vChild.id}
                                        isRequire={vChild.isRequired}
                                        name={vChild.name}
                                        Component={ArrayInput}
                                        textButton={t('button:add_something', { name: vChild.label })}
                                        placeholder={vChild.label}
                                      />
                                    );
                                  }
                                  if (vChild.name.toLocaleLowerCase() === 'classifyid') {
                                    return (
                                      <AppField
                                        key={vChild.id}
                                        modalName="ModalIndustryClassification"
                                        title={vChild.label}
                                        titleModal={vChild.label}
                                        name={vChild.name}
                                        keyShow="value"
                                        Component={DropDownMutiline}
                                      />
                                    );
                                  }
                                  if (listInputDefault.includes(vChild.name.toLocaleLowerCase())) {
                                    const isDisable =
                                      vChild.name.toLocaleLowerCase() === 'leadcode' ||
                                      vChild.name.toLocaleLowerCase() === 'ownername';
                                    return (
                                      <MyInput.Base
                                        key={iChild}
                                        name={vChild.name}
                                        disable={isDisable}
                                        editable={!isDisable}
                                        keyboardType={vChild.fieldType === FieldType.Number ? 'number-pad' : 'default'}
                                        isRequire={
                                          vChild.name.toLocaleLowerCase() === 'ownername' ? false : vChild.isRequired
                                        }
                                        errors={errors}
                                        placeholder={vChild.label}
                                        value={values[vChild.name]}
                                        onChangeTextData={(text) => setFieldValue(vChild.name, text)}
                                        maxLength={checkLength(vChild.name)}
                                      />
                                    );
                                  }
                                  if (vChild.name.toLocaleLowerCase() === 'companyname') {
                                    return (
                                      <AppField
                                        key={vChild.id}
                                        modalName="ModalCorporate"
                                        title={vChild.label}
                                        name={vChild.name}
                                        keyShow="value"
                                        Component={DropDownMutiline}
                                        titleModal={vChild.label}
                                      />
                                    );
                                  }
                                  if (vChild.name.toLocaleLowerCase() === 'products') {
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
                                  if (vChild.name.toLocaleLowerCase() === 'sourceid') {
                                    return (
                                      <AppField
                                        key={vChild.id}
                                        typeSelect={FieldType.Choice}
                                        isRequire
                                        modalName="ModalSourceDropdown"
                                        title={vChild.label}
                                        name={vChild.name}
                                        keyShow="value"
                                        Component={DropDownMutiline}
                                        titleModal={t('label:source_select')}
                                      />
                                    );
                                  }
                                  if (vChild.name.toLocaleLowerCase() === 'expectationenddate') {
                                    return (
                                      <AppField
                                        key={vChild.id}
                                        disabled={vChild.isReadOnly}
                                        modalName="ModalDate"
                                        title={vChild.label}
                                        name={vChild.name}
                                        Component={DropDownMutiline}
                                        type="date"
                                        isRequire={vChild.isRequired}
                                      />
                                    );
                                  }
                                  if (vChild.name.toLocaleLowerCase() === 'pipelineid') {
                                    return (
                                      <ModalPipelineStatus
                                        key={vChild.id}
                                        idPipeline={values?.companyPipelineId?.id}
                                        typeSelect={FieldType.Choice}
                                        isRequire
                                        modalName="ModalSelect"
                                        title={vChild.label}
                                        name={vChild.name}
                                        keyShow="value"
                                        Component={DropDownMutiline}
                                        titleModal={vChild.label}
                                        disabled={!!idLead || isEmpty(values.companyPipelineId)}
                                      />
                                    );
                                  }
                                  if (vChild.name.toLocaleLowerCase() === 'companypipelineid') {
                                    return (
                                      <AppField
                                        key={vChild.id}
                                        disabled={!!idLead}
                                        typeSelect={FieldType.Choice}
                                        isRequire
                                        modalName="ModalCompanyPipelineLead"
                                        title={vChild.label}
                                        name={vChild.name}
                                        keyShow="companyPipelineName"
                                        Component={DropDownMutiline}
                                        titleModal={vChild.label}
                                      />
                                    );
                                  }
                                  if (vChild.name.toLocaleLowerCase() === 'failurereasonid') {
                                    return (
                                      <AppField
                                        key={vChild.id}
                                        disabled={values?.pipelineId?.pipelinePositionId !== 4}
                                        typeSelect={FieldType.Choice}
                                        modalName="ModalFailReasonLead"
                                        title={vChild.label}
                                        name={vChild.name}
                                        keyShow="value"
                                        Component={DropDownMutiline}
                                        titleModal={vChild.label}
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
                                        title={vChild.label}
                                        titleModal={vChild.label}
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
          content={idLead ? t('label:message_cancel') : t('label:message_cancel_add')}
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
          subTitle="Dữ liệu bạn nhập đã tồn tài trên hệ thống"
          dataDuplicate={duplicateErrors}
          onPressOut={() => {
            setDuplicateModal(false);
          }}
        />
      </Modal>
    </Host>
  );
};

export default LeadCU;

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
  lineItemSepe: {
    width: '100%',
    height: 1,
    backgroundColor: color.hawkesBlue,
  },
  touchItemSheet: {
    width: ScreenWidth - 32,
    marginHorizontal: padding.p16,
  },
  textItemSheet: {
    paddingVertical: padding.p12,
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
});
