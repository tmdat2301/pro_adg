import {
  BodyConvertLead,
  CompanyPipeLine,
  DataConvertLead,
  DataConvertLeadFormik,
  EmailLeadDetails,
  ItemResultMission,
} from '@interfaces/lead.interface';
import { NavigationId } from '@interfaces/quickSearch.interface';
import { ResponseReturn, ResponseReturnArray } from '@interfaces/response.interface';
import { useNavigation } from '@react-navigation/native';
import { apiGet, apiPost } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import styles from './styles';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Modalize } from 'react-native-modalize';
import { useTranslation } from 'react-i18next';
import { ContactMobilesUpper, FieldInputObject, ItemVel } from '@interfaces/contact.interface';
import { AppHeader, AppText } from '@components/index';
import { MyIcon } from '@components/Icon';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { color, fontSize, padding, responsivePixel } from '@helpers/index';
import { MyInput } from '@components/Input';
import ArrayInput, { listCountryCode } from '@components/Input/MultiInput/components/ArrayInput';
import { Input } from 'react-native-elements/dist/input/Input';
import { setTimeOut } from '@helpers/untils';
import { ItemOptions } from '@components/Item/Details';
import { confirmLeadConvert } from '@redux/actions/leadAction';
import { AppContext } from '@contexts/index';
import DropDownMutiline from '@components/DropDownMutiline';
import ModalDate from '@components/ModalDate';
import dayjs from 'dayjs';
import { FieldType } from '@helpers/constants';
import Toast from 'react-native-toast-message';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import { AppRoutes } from '@navigation/appRoutes';
import AppField from '@components/Input/MultiInput/AppField';
import { Host } from 'react-native-portalize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
interface IConvertLeadProps extends NavigationId { }

const ConvertLeadScreen = (props: IConvertLeadProps) => {
  const id = props.route.params.id;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const [objDataConvertLead, setDataConvertLead] = useState<DataConvertLead | null>(null);
  const [objDataConvertLeadFormik, setDataConvertLeadFormik] = useState<DataConvertLeadFormik | null>(null);
  const [arrPipeLineCompany, setPipelineCompany] = useState<ItemResultMission[]>([]);
  const bottomSheetModalRef = useRef<Modalize>();
  const datePickerRef = useRef<Modalize>(null);
  const refArrayMobile = useRef<any>(null);
  const refFormik = useRef<FormikProps<any>>(null);
  const [typeDropdown, setTypeDropdown] = useState<'phone' | 'pipeline' | 'calendar' | 'corporate'>('phone');
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required(t('label:required')),
    // companyName: Yup.string().required(t('label:required')),
    dealName: Yup.string().required(t('label:required')),
    expectationValue: Yup.number().typeError(t('label:errorNumber')).required(t('label:required')).moreThan(0),
    email: Yup.array()
      .min(1, t('label:required'))
      .of(
        Yup.object().shape({
          text: Yup.string().required(t('label:required')),
        }),
      ),
    mobile: Yup.array()
      .min(1, t('label:required'))
      .of(
        Yup.object().shape({
          text: Yup.string().required(t('label:required')),
        }),
      ),
  });

  const getViewDropdown = () => {
    try {
      switch (typeDropdown) {
        case 'phone':
          return (
            <>
              {listCountryCode.map((v, i) => {
                return (
                  <View key={i} style={{ borderTopWidth: i >= 1 ? 1 : 0, borderTopColor: color.grayLine }}>
                    <TouchableOpacity
                      style={[styles.button]}
                      onPress={() => {
                        refArrayMobile &&
                          refArrayMobile.current &&
                          refArrayMobile.current.onUpdateCountry(v, bottomSheetModalRef.current);
                      }}>
                      {v.icon}
                      <AppText fontSize={fontSize.f14} style={{ padding: padding.p12 }}>
                        {v.label}
                      </AppText>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </>
          );
        default:
          return <></>;
      }
    } catch (error) {
      return <></>;
    }
  };

  const getTitleHeader = () => {
    try {
      switch (typeDropdown) {
        case 'phone':
          return t('label:phone_select');
        case 'calendar':
          return t('business:selectDay');
        case 'corporate':
          return t('lead:brand_select');
        case 'pipeline':
          return t('lead:status_select');
        default:
          return '';
      }
    } catch (error) {
      return '';
    }
  };

  const convertLead = async (value: DataConvertLeadFormik) => {
    try {
      const arrMobile: ContactMobilesUpper[] = [];
      const arrEmail: EmailLeadDetails[] = [];
      if (value && value.mobiles && value.emails) {
        for (let index = 0; index < value.mobiles.length; index++) {
          const element = value.mobiles[index];
          const objMob: ContactMobilesUpper = {
            code: element.code?.toLocaleLowerCase() ?? '',
            isMain: element.isMain,
            PhoneNumber: element.text,
          };
          arrMobile.push(objMob);
        }
        for (let index = 0; index < value.emails.length; index++) {
          const element = value.emails[index];
          const objMail: EmailLeadDetails = {
            email: element.text,
            isMain: element.isMain,
          };
          arrEmail.push(objMail);
        }
      }

      const bodyConvertLead: BodyConvertLead = {
        brandName: value.brandName,
        companyCode: value.companyCode,
        companyId: value.companyId.label,
        companyName: value.companyName,
        companyPipeLineId: value.companyPipeLineId,
        contactCode: value.contactCode,
        dealName: value.dealName ?? '',
        emails: arrEmail,
        mobiles: arrMobile,
        expectationEndDate: value.expectationEndDate,
        expectationValue: value.expectationValue,
        fullName: value.fullName,
      };
      appContext.setLoading(true);
      const url = serviceUrls.path.convertLead.replace('{id}', id);
      const response: ResponseReturn<number> = await apiPost(url, bodyConvertLead);
      if (response.error) {
        Toast.show({
          type: 'error',
          text1: t('lead:notice'),
          text2: response.errorMessage || response.detail || '',
        });
        return;
      }
      if (response.response && response.response.data) {
        dispatch(confirmLeadConvert());
        navigation.popToTop();
        navigation.navigate(AppRoutes.CONTACT_TAB);
        navigation.navigate(AppRoutes.DETAIL_CONTACT, { key: response.response.data });
        Toast.show({
          type: 'success',
          text1: t('lead:notice'),
          text2: t('lead:convert_lead_success'),
        });
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

  const getDataConvertLead = async () => {
    try {
      const url = serviceUrls.path.dataConvertLead(id);
      const response: ResponseReturnArray<DataConvertLead> = await apiGet(url, {});
      if (response.code && response.code === 403) {
        navigation.goBack();
        Alert.alert(t('error:no_access'), t('error:no_access_content'), [
          {
            text: t('error:understand'),
            style: 'cancel',
          },
        ]);
        return;
      }
      if (response.error) {
        return;
      }
      if (response.response && response.response) {
        const arrMobile: FieldInputObject[] = [];
        const arrEmail: FieldInputObject[] = [];

        if (response.response.mobiles && response.response.mobiles.length > 0) {
          for (let index = 0; index < response.response.mobiles.length; index++) {
            const element = response.response.mobiles[index];
            const objMob: FieldInputObject = {
              code: element.code.toLocaleLowerCase(),
              isMain: element.isMain,
              text: element.phoneNational.toString(),
            };
            arrMobile.push(objMob);
          }
        }
        if (response.response.emails && response.response.emails.length > 0) {
          for (let index = 0; index < response.response.emails.length; index++) {
            const element = response.response.emails[index];
            const objMail: FieldInputObject = {
              isMain: element.isMain,
              text: element.email,
            };
            arrEmail.push(objMail);
          }
        }
        const valueInitFormik: DataConvertLeadFormik = {
          ...response.response,
          mobiles: arrMobile,
          emails: arrEmail,
          dealName: response.response.dealName ?? '',
          companyId: {
            email: null,
            label: response.response.companyId,
            value: response.response.companyName,
          },
        };
        setDataConvertLeadFormik(valueInitFormik);
        setDataConvertLead(response.response);
      }
    } catch (error) { }
  };

  const getCompanyPipeLine = async () => {
    try {
      const url = serviceUrls.path.companyPipeLineCurrent;
      const response: ResponseReturnArray<CompanyPipeLine[]> = await apiPost(url, {});
      if (response.error) {
        return;
      }
      if (response.response) {
        const arr: ItemVel[] = [];
        for (let index = 0; index < response.response.length; index++) {
          const element = response.response[index];
          const obj: ItemVel = {
            email: null,
            label: element.id,
            value: element.companyPipelineName,
          };
          arr.push(obj);
        }
        setPipelineCompany(arr);
      }
    } catch (error) { }
  };

  useEffect(() => {
    if (!objDataConvertLead) {
      getDataConvertLead();
    }
    if (arrPipeLineCompany.length === 0) {
      getCompanyPipeLine();
    }
  });
  return (
    <Host>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
        {objDataConvertLead ? (
          <>
            <Formik
              initialValues={objDataConvertLeadFormik ? objDataConvertLeadFormik : {}}
              innerRef={refFormik}
              onSubmit={(value) => {
                convertLead(value);
              }}
              validationSchema={validationSchema}
              validateOnChange={false}
              validateOnBlur={false}>
              {(props) => {
                const { handleSubmit, errors, values, setFieldValue } = props;
                return (
                  <>
                    <AppHeader
                      headerContainerStyles={styles.headerContainer}
                      iconLeft={<MyIcon.Close />}
                      iconRight={<Icon type="materialIcons" name="done" size={28} color={color.icon} />}
                      iconLeftPress={() => navigation.goBack()}
                      iconRightPress={handleSubmit}
                      title={t('lead:convert_lead')}
                    />
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={styles.scrollInput}>
                      <AppText
                        value={t('title:contact').toString()}
                        style={styles.textTitle}
                        fontSize={fontSize.f12}
                        color={color.subText}
                      />
                      <View style={styles.viewBorder}>
                        <MyInput.Base
                          value={values?.fullName}
                          name="fullName"
                          isRequire
                          errors={errors}
                          placeholder={t('label:contact_name')}
                        />
                        <MyInput.Base
                          value={values.contactCode}
                          style={{ opacity: 0.5 }}
                          editable={false}
                          placeholder={t('lead:contact_code')}
                        />
                        <MyInput.Multi
                          refField={refArrayMobile}
                          name="mobiles"
                          Component={ArrayInput}
                          onOpenCountry={() => {
                            setTypeDropdown('phone');
                            bottomSheetModalRef.current?.open();
                          }}
                          isPhoneType={true}
                          textButton={t('button:add_phone')}
                          isRequire
                          placeholder={t('title:phone_number')}
                        />
                        <MyInput.Multi
                          refField={refArrayMobile}
                          name="emails"
                          Component={ArrayInput}
                          textButton={t('button:add_email')}
                          isRequire
                          placeholder={t('label:email')}
                        />
                      </View>
                      <AppText
                        value={t('tabbar:enterprise').toString()}
                        style={styles.textTitle}
                        fontSize={fontSize.f12}
                        color={color.subText}
                      />
                      <View style={styles.viewBorder}>
                        <AppField
                          typeSelect={FieldType.Choice}
                          modalName="ModalCorporate"
                          title={t('lead:brand_name')}
                          name="companyId"
                          keyShow="value"
                          Component={DropDownMutiline}
                          titleModal={t('lead:brand_name')}
                        />

                        <MyInput.Base
                          value={values.companyName}
                          onChangeText={(text) => {
                            setFieldValue('companyName', text);
                          }}
                          placeholder={t('lead:full_name')}
                        />
                        <MyInput.Base
                          style={{ opacity: 0.5 }}
                          editable={false}
                          value={values.companyCode}
                          placeholder={t('lead:corporate_code')}
                        />
                      </View>
                      <AppText
                        value={t('tabbar:deal').toString()}
                        style={styles.textTitle}
                        fontSize={fontSize.f12}
                        color={color.subText}
                      />
                      <View style={styles.viewBorder}>
                        <MyInput.Base
                          value={values.dealName}
                          name="dealName"
                          isRequire
                          errors={errors}
                          placeholder={t('lead:deal_name')}
                          onChangeText={(text) => {
                            setFieldValue('dealName', text);
                          }}
                        />
                        <MyInput.Base
                          onChangeText={(text) => {
                            setFieldValue('expectationValue', text);
                          }}
                          keyboardType={'number-pad'}
                          value={values?.expectationValue?.toString() || ''}
                          name="expectationValue"
                          errors={errors}
                          isRequire
                          placeholder={t('lead:deal_value')}
                          rightIcon={<AppText value={'VNĐ'} color={color.subText} />}
                        />
                        <AppField
                          modalName="ModalDate"
                          title={t('lead:expect_end_date')}
                          name="expectationEndDate"
                          Component={DropDownMutiline}
                          type="date"
                        />
                        <AppField
                          typeSelect={FieldType.Choice}
                          modalName="ModalSelect"
                          title={t('lead:pipeline')}
                          name="companyPipeLineName"
                          keyShow="value"
                          dataSelect={arrPipeLineCompany}
                          Component={DropDownMutiline}
                          titleModal={t('lead:pipeline')}
                        />
                      </View>
                    </KeyboardAwareScrollView>
                    <Modalize
                      modalHeight={ScreenHeight * 0.85}
                      withHandle={false}
                      ref={bottomSheetModalRef}
                      HeaderComponent={() => {
                        return (
                          <View style={styles.headerBottomSheet}>
                            <AppText value={getTitleHeader()} fontSize={fontSize.f16} fontWeight="semibold" />
                          </View>
                        );
                      }}>
                      <ScrollView>{getViewDropdown()}</ScrollView>
                    </Modalize>
                    {typeDropdown === 'calendar' ? (
                      <ModalDate
                        ref={datePickerRef}
                        date={
                          values.expectationEndDate && dayjs(values.expectationEndDate)
                            ? dayjs(values.expectationEndDate).toDate()
                            : new Date()
                        }
                        handleCancel={() => {
                          datePickerRef.current?.close();
                          setTypeDropdown('corporate');
                        }}
                        handleConfirm={(date) => {
                          refFormik.current?.setFieldValue('expectationEndDate', date);
                          datePickerRef.current?.close();
                          setTypeDropdown('corporate');
                        }}
                        titleCalendar={t('business:selectDay')}
                        mode={'date'}
                      />
                    ) : null}
                  </>
                );
              }}
            </Formik>
          </>
        ) : null}
      </SafeAreaView>
    </Host>
  );
};

export default ConvertLeadScreen;
