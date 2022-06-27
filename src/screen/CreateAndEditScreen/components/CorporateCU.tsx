import AppConfirm from '@components/AppConfirm';
import DropDownMutiline from '@components/DropDownMutiline';
import { MyIcon } from '@components/Icon';
import { AppHeader, AppText } from '@components/index';
import { MyInput } from '@components/Input';
import AppField from '@components/Input/MultiInput/AppField';
import ArrayInput, { ArrayInputModel } from '@components/Input/MultiInput/components/ArrayInput';
import WrapInput from '@components/Input/WrapInput';
import { AppContext } from '@contexts/index';
import { FieldType, ISO_DATES, TypeFieldExtension } from '@helpers/constants';
import { color, fontSize, padding } from '@helpers/index';
import { ContactBodyFieldModel, ContactDetailsModel, FieldInputObject, ItemVel } from '@interfaces/contact.interface';
import { FieldExtension, FieldInsert } from '@interfaces/lead.interface';
import { ExtensionBodyFieldFormikModel, ResponseReturn } from '@interfaces/response.interface';
import { AppRoutes } from '@navigation/appRoutes';
import { useNavigation } from '@react-navigation/native';
import { detailsCorporateInfoRequest } from '@redux/actions/detailsActions';
import { apiGet, apiPost, apiPut } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import dayjs from 'dayjs';
import { Formik, FormikProps } from 'formik';
import { isArray, isDate, isEmpty, isNumber, set } from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Keyboard, Modal, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Host } from 'react-native-portalize';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import ModalMessage from './ModalMessage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { IsJsonString } from '@helpers/untils';

interface ICorporateCUProps {
  idCorporate: number | null;
}
const listArrayInputDefault = ['tags', 'emails', 'mobiles', 'websites', 'fanpages'];
const listInputDefault = [
  'fullname',
  'brandname',
  'ownername',
  'facebook',
  'department',
  'companyaddress',
  'invoiceaddress',
  'bankname',
  'representname',
  'cdmarketing',
  'utmcampaign',
  'utmsource',
  'utmmedium',
  'utmterm',
  'utmcontent',
  'note',
  'customercode',
  'cdmarketing',
  'contactcode',
  'saledictrict',
  'saleorg',
  'salegroup',
  'saleoffice',
  'debtlimit',
  'deliverylimit',
  'debt',
  'taxcode',
];

const CorporateCU = (props: ICorporateCUProps) => {
  const { idCorporate } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const [arrFieldInsert, setFieldInsert] = useState<FieldInsert[]>([]);
  const refFormik = useRef<FormikProps<any>>(null);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [duplicateModal, setDuplicateModal] = useState(false);
  const [validationSchema, setValidationSchema] = useState({
    brandName: Yup.string().required(t('label:required')),
    sourceId: Yup.object().required(t('label:required')),
    emails: Yup.array().of(
      Yup.object().shape({
        text: Yup.string().email(t('error:email_wrong_format')),
      }),
    ),
    mobiles: Yup.array().of(
      Yup.object().shape({
        text: Yup.string().min(9, t('error:phone_wrong_format')),
      }),
    ),
  });

  const [initialValues, setInitialValues] = useState<any>({
    assignUserByFileWhenImporting: true,
    saleOrg: '',
    saleOffice: '',
    saleDictrict: '',
    debtLimit: '',
    deliveryLimit: '',
    debt: '',
    placeId: '',
    saleGroup: '',
    note: '',
    brandName: '',
    emails: [
      {
        isMain: true,
        text: '',
      },
    ],
    id: 0,
    mobiles: [
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
    sourceId: '',
    multiSelectExtension: {},
    numberExtension: {},
    textExtension: {},
    dateTimeExtension: {},
    choiceExtension: {},
  });

  const getFieldInsert = async () => {
    try {
      appContext.setLoading(true);
      const url = `${serviceUrls.path.getFieldInsert(TypeFieldExtension.corporate)}?option=false`;
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

  const setDetailsContact = async (idCorporate: number) => {
    try {
      appContext.setLoading(true);
      const url = `${serviceUrls.path.corporateDetailsInfo}${idCorporate}`;
      const response: ResponseReturn<ContactDetailsModel> = await apiGet(url, { hiddenSomeThing: true });
      if (response.error) {
        return;
      }
      if (response.response && response.response.data) {
        const data = response.response.data;
        let arrMobile: FieldInputObject[] = [];
        let arrEmail: FieldInputObject[] = [];
        let arrFanpage: ArrayInputModel[] = [];
        let arrWebsite: ArrayInputModel[] = [];

        if (data.mobiles && data.mobiles.length > 0) {
          arrMobile = data.mobiles.map((item) => {
            return {
              isMain: item.isMain,
              text: item.phoneNational.toString(),
              code: item.countryCode === 84 ? 'vn' : 'other',
            };
          });
        }
        if (data.emails && data.emails.length > 0) {
          arrEmail = data.emails.map((item) => {
            return {
              isMain: item.isMain,
              text: item.email || '',
            };
          });
        }
        if (data.fanpages && data.fanpages.length > 0) {
          arrFanpage = data.fanpages.map((item) => {
            return {
              isMain: item.isMain,
              text: item.fanpage || '',
            };
          });
        }
        if (data.websites && data.websites.length > 0) {
          arrWebsite = data.websites.map((item) => {
            return {
              isMain: item.isMain,
              text: item.website || '',
            };
          });
        }

        const objSource: ItemVel =
          data.contactType !== null
            ? {
              label: data.sourceId,
              value: data.sourceName,
              email: null,
            }
            : '';
        const objCustomerGroupId: ItemVel = {
          label: data.customerGroupId,
          value: data.customerGroup || '',
          email: null,
        };
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
        const initValues: ContactBodyFieldModel = {
          ...data,
          customerGroupId: objCustomerGroupId,
          industryClassificationId:
            data?.industryClassificationId !== null
              ? { label: data.industryClassificationId, value: data.subdivision }
              : '',
          sourceId: objSource,
          emails:
            arrEmail.length > 0
              ? arrEmail
              : [
                {
                  isMain: true,
                  text: '',
                },
              ],
          mobiles:
            arrMobile.length > 0
              ? arrMobile
              : [
                {
                  isMain: true,
                  text: '',
                  code: 'vn',
                },
              ],
          fanpages:
            arrFanpage.length > 0
              ? arrFanpage
              : [
                {
                  isMain: true,
                  text: '',
                },
              ],
          websites:
            arrWebsite.length > 0
              ? arrWebsite
              : [
                {
                  isMain: true,
                  text: '',
                },
              ],
        };
        setInitialValues(initValues);
      }
    } catch (error) {
    } finally {
      appContext.setLoading(false);
    }
  };

  useEffect(() => {
    getFieldInsert();
    if (idCorporate) {
      setDetailsContact(idCorporate);
    }
  }, []);

  const handleArrayField = (array: ArrayInputModel[], type: 'mobiles' | 'fanpages' | 'websites' | 'emails') => {
    const newArray = array?.filter((elm) => !!elm.text);
    if (isArray(newArray) && newArray.length > 0) {
      return newArray.map((elm) => {
        switch (type) {
          case 'mobiles':
            return {
              PhoneNumber: elm.text,
              code: elm.code ?? 'vn',
              isMain: newArray.length === 1 ? true : elm.isMain,
            };
          case 'fanpages':
            return {
              fanpage: elm.text.toLocaleLowerCase(),
              isMain: newArray.length === 1 ? true : elm.isMain,
            };
          case 'websites':
            return {
              website: elm.text.toLocaleLowerCase(),
              isMain: newArray.length === 1 ? true : elm.isMain,
            };
          case 'emails':
            return {
              email: elm.text,
              isMain: newArray.length === 1 ? true : elm.isMain,
            };
          default:
            return {
              email: elm.text,
              isMain: newArray.length === 1 ? true : elm.isMain,
            };
        }
      });
    }
    return null;
  };
  const createContact = async (value: ContactBodyFieldModel) => {
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
          dateExtension[name] = dayjs(value[elm]).format(ISO_DATES);
        }
      });
      const body: any = {
        ...value,
        mobiles: handleArrayField(value.mobiles, 'mobiles'),
        emails: handleArrayField(value.emails, 'emails'),
        fanpages: handleArrayField(value.fanpages, 'fanpages'),
        websites: handleArrayField(value.websites, 'websites'),
        sourceId: value.sourceId?.label,
        customerGroupId: value.customerGroupId ? value.customerGroupId?.label : null,
        industryClassificationId: value?.industryClassificationId ? value?.industryClassificationId?.label : null,
        choiceExtension: !isEmpty(choiceExtension) ? choiceExtension : null,
        textExtension: !isEmpty(textExtension) ? textExtension : null,
        dateTimeExtension: !isEmpty(dateExtension) ? dateExtension : null,
        multiSelectExtension: !isEmpty(multiSelectExtension) ? multiSelectExtension : null,
        numberExtension: !isEmpty(numberExtension) ? numberExtension : null,
      };
      const urlCreate = serviceUrls.path.getListInterprise;
      if (idCorporate) {
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
            text2: t('lead:edit_corporate_success'),
          });
          navigation.goBack();
          dispatch(detailsCorporateInfoRequest(idCorporate, true));
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
            text2: t('lead:add_corporate_success'),
          });
          navigation.navigate(AppRoutes.DETAIL_CORPORATE, { key: response.response.data, isGoback: false });
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
              createContact(value);
            }}
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
                    title={idCorporate ? t('button:update_enterprise') : t('button:add_enterprise')}
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
                                  if (listArrayInputDefault.includes(vChild.name.toLocaleLowerCase())) {
                                    if (vChild.name.toLocaleLowerCase() === 'mobiles') {
                                      return (
                                        <MyInput.Multi
                                          key={vChild.id}
                                          keyboardType={'number-pad'}
                                          name={vChild.name}
                                          Component={ArrayInput}
                                          isPhoneType={true}
                                          textButton={t('button:add_phone')}
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
                                        name={vChild.name}
                                        Component={ArrayInput}
                                        textButton={t('button:add_something', { name: vChild.label })}
                                        placeholder={vChild.label}
                                      />
                                    );
                                  }
                                  if (listInputDefault.includes(vChild.name.toLocaleLowerCase())) {
                                    const isDisable =
                                      vChild.name.toLocaleLowerCase() === 'customercode' ||
                                      vChild.name.toLocaleLowerCase() === 'debtlimit' ||
                                      vChild.name.toLocaleLowerCase() === 'deliverylimit' ||
                                      vChild.name.toLocaleLowerCase() === 'debt' ||
                                      vChild.name.toLocaleLowerCase() === 'ownername';
                                    const isNote = vChild.name.toLocaleLowerCase() === 'note';
                                    return (
                                      <MyInput.Base
                                        key={vChild.id}
                                        name={vChild.name}
                                        multiline={isNote}
                                        disable={isDisable}
                                        editable={!isDisable}
                                        keyboardType={vChild.fieldType === FieldType.Number ? 'number-pad' : 'default'}
                                        isRequire={vChild.name.toLocaleLowerCase() === 'brandname'}
                                        errors={errors}
                                        placeholder={vChild.label}
                                        value={values[vChild.name]}
                                        onChangeTextData={(text) => setFieldValue(vChild.name, text)}
                                      />
                                    );
                                  }
                                  if (vChild.name.toLocaleLowerCase() === 'founding') {
                                    return (
                                      <AppField
                                        key={vChild.id}
                                        modalName="ModalDate"
                                        title={vChild.label}
                                        name={vChild.name}
                                        Component={DropDownMutiline}
                                        type="date"
                                      />
                                    );
                                  }
                                  if (vChild.name.toLocaleLowerCase() === 'industryclassificationid') {
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
                                    if (
                                      vChild.format === 'CRM.A.O.id,name,value' &&
                                      values[`textExtension-${vChild.id}`]
                                    ) {
                                      let valueString = '';
                                      valueString = values[`textExtension-${vChild.id}`] || '';
                                      if (IsJsonString(values[`textExtension-${vChild.id}`])) {
                                        const valueArr = JSON?.parse(values[`textExtension-${vChild.id}`]).map(
                                          (e: { Name: string; Value: string }) => {
                                            return `${e?.Name || ''}-${e?.Value || ''}`;
                                          },
                                        );
                                        if (isArray(valueArr) && valueArr.length > 0) {
                                          valueString = valueArr.join(', ');
                                        }
                                      }

                                      return (
                                        <MyInput.Base
                                          style={vChild.isReadOnly && { opacity: 0.5 }}
                                          disable={true}
                                          editable={false}
                                          multiline={vChild.fieldType === FieldType.Textarea}
                                          key={vChild.id}
                                          name={`textExtension-${vChild.id}`}
                                          value={valueString}
                                          isRequire={vChild.isRequired}
                                          errors={errors}
                                          placeholder={vChild.label}
                                          onChangeText={(text) => {
                                            setFieldValue(`textExtension-${vChild.id}`, text);
                                          }}
                                        />
                                      );
                                    }

                                    return (
                                      <MyInput.Base
                                        style={vChild.isReadOnly && { opacity: 0.5 }}
                                        editable={!vChild.isReadOnly}
                                        disable={vChild.isReadOnly}
                                        multiline={vChild.fieldType === FieldType.Textarea}
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
          content={idCorporate ? t('label:message_cancel') : t('label:message_cancel_add')}
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
        <ModalMessage
          title="Trùng dữ liệu"
          message={messageError}
          onPressOut={() => {
            setDuplicateModal(false);
          }}
        />
      </Modal>
    </Host>
  );
};

export default CorporateCU;

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
