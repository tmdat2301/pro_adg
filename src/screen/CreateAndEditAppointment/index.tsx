import AppHeader from '@components/AppHeader';
import { MyIcon } from '@components/Icon';
import { MyInput } from '@components/Input';
import { AppContext } from '@contexts/index';
import color from '@helpers/color';
import { ISO_DATES, TaskType } from '@helpers/constants';
import { padding } from '@helpers/index';
import { DataResult, DataRelated } from '@interfaces/profile.interface';
import { ResponseReturn } from '@interfaces/response.interface';
import { AppointmentModal } from '@interfaces/task.interface';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootState } from '@redux/reducers';
import { apiGet, apiPost, apiPut } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import dayjs from 'dayjs';
import { Formik, FormikProps } from 'formik';
import _ from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { Switch } from 'react-native-elements';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import DropDownMutiline from '../../components/DropDownMutiline';
import styles from './styles';
import AppField from '@components/Input/MultiInput/AppField';
import { Host } from 'react-native-portalize';
import { ItemLeadDetailData } from '@interfaces/lead.interface';
import { AppRoutes } from '@navigation/appRoutes';

interface Props {
  isAddCost?: boolean;
}
interface initialValuesTask {
  collaborators: DataResult[];
  completed: boolean;
  createdBy: string;
  createdDate: Date;
  finishDay: Date | string | null;
  result: DataResult | '';
  relatedObject: DataRelated | '';
  title: string;
  type: { value: TaskType; label: string };
  description: string;
  ownerId: DataResult;
  place: { placeId: string | null; latitude: number | null; longtitude: number | null; place: string | null };
  allDay: boolean;
  startDate: Date | string | '';
  endDate: Date | string | '';
}

export default (props: Props) => {
  const userReducer = useSelector((state: RootState) => state.userReducer);

  const route = useRoute();
  const params = route.params as any;

  const taskId = route?.params?.taskId || null;
  const onRefreshing = route?.params?.onRefreshing || null;
  const typeTab = route?.params?.typeTab || null;
  const { t } = useTranslation();

  const getTaskTypeName = (type: TaskType) => {
    switch (type) {
      case TaskType.sendEmail:
        return t('lead:send_mail');
      case TaskType.meetCustomer:
        return t('lead:meet_customer');
      case TaskType.demoProduct:
        return t('lead:demo_product');
      case TaskType.meeting:
        return t('lead:meeting');
      default:
        return t('lead:other');
    }
  };
  const [initialValues, setInitialValues] = useState<initialValuesTask>({
    collaborators: [],
    completed: false,
    createdBy: userReducer.data?.sub,
    createdDate: new Date(),
    finishDay: null,
    ownerId: {
      email: userReducer.data?.email || '',
      label: userReducer.data?.sub || '',
      value: userReducer.data?.name || '',
    },
    relatedObject: params ?? '',
    result: '',
    title: '',
    type: { value: TaskType.meetCustomer, label: getTaskTypeName(TaskType.meetCustomer) },
    description: '',
    place: '',
    allDay: false,
    startDate: '',
    endDate: '',
  });
  const appContext = useContext(AppContext);

  useEffect(() => {
    const getRelatedObject = async (id: string) => {
      try {
        const response: ResponseReturn<DataRelated[]> = await apiPost(
          `${serviceUrls.path.findRelated}?maxResultCount=20`,
          { ids: [id] },
        );
        if (!response.error && response.response && response.response.data) {
          const data = response.response.data.length > 0 ? response.response.data : null;
          if (data != null) {
            refFormik.current?.setFieldValue('relatedObject', data[0]);
          }
        } else {
        }
      } catch (error) {}
    };
    const getTaskDetail = async (id: string) => {
      appContext.setLoading(true);
      try {
        const response: ResponseReturn<ItemLeadDetailData> = await apiGet(
          `${serviceUrls.path.leadTaskDetail}${id}`,
          {},
        );
        if (!response.error && response.response && response.response.data) {
          const data = response.response.data;
          if (data.root && data.recordId) {
            getRelatedObject(`${data.root}-${data.recordId}`);
          }
          setInitialValues({
            ...initialValues,
            collaborators: data.collaborators
              ? data.collaborators.map((item) => ({ label: item.id, value: item.name, email: null }))
              : [],
            completed: data.completed,
            finishDay: data.finishDay || null,
            ownerId: {
              email: '',
              label: data.ownerId || '',
              value: data.ownerName || '',
            },
            result: data.result
              ? { label: data.result, value: data.resultName ? data.resultName : '', email: null }
              : '',
            title: data.title,
            type: { value: data.type, label: getTaskTypeName(data.type) },
            description: data.description || '',
            place: {
              place: data.place || '',
              latitude: data.latitude,
              longtitude: data.longtitude,
              placeId: data.placeId,
            },
            allDay: data.allDay,
            startDate: data.startDate || '',
            endDate: data.endDate || '',
          });
        } else {
        }
      } catch (error) {
      } finally {
        appContext.setLoading(false);
      }
    };
    if (taskId) {
      getTaskDetail(taskId);
    }
  }, []);

  const refFormik = useRef<FormikProps<any>>(null);
  const validationSchema = Yup.object().shape({
    startDate: Yup.date().typeError(t('label:errorNumber')).required(t('label:required')),
    endDate: Yup.date().typeError(t('label:errorNumber')).required(t('label:required')),
    title: Yup.string().required(t('label:required')),
    relatedObject: Yup.object().nullable(false).required(t('label:required')),
    ownerId: Yup.object().nullable().required(t('label:required')),
  });

  const navigation = useNavigation();

  const onDone = (value: boolean) => {
    if (refFormik?.current != null) {
      refFormik?.current.setFieldValue('completed', value);
      if (value) {
        refFormik?.current.setFieldValue('finishDay', new Date());
      } else {
        refFormik?.current.setFieldValue('result', '');
        refFormik?.current.setFieldValue('finishDay', '');
      }
    }
  };

  const setAllDay = (value: boolean) => {
    if (refFormik?.current != null) {
      refFormik?.current.setFieldValue('allDay', value);
      if (value) {
        refFormik?.current.setFieldValue(
          'startDate',
          dayjs(refFormik?.current.values.startDate || dayjs().add(1, 'day').toDate())
            .startOf('days')
            .format(ISO_DATES),
        );
        refFormik?.current.setFieldValue(
          'endDate',
          dayjs(refFormik?.current.values.endDate || dayjs().add(1, 'day').toDate())
            .endOf('days')
            .format(ISO_DATES),
        );
      }
    }
  };

  const onCreate = async (values: initialValuesTask) => {
    try {
      appContext.setLoading(true);
      const menuId = values?.relatedObject ? values?.relatedObject?.menuId : '';
      const recordId = values?.relatedObject ? values?.relatedObject?.id : '';
      const body: AppointmentModal = {
        ...values,
        type: values.type.value,
        collaborators:
          values?.collaborators.length > 0
            ? values.collaborators?.map((item: DataResult) => item.label?.toString() ?? '')
            : null,
        ownerId: values.ownerId?.label.toString() ?? '',
        relatedObject: `${menuId}-${recordId}`,
        result: values?.result ? values?.result?.label : null,
        startDate: dayjs(values.startDate).format(ISO_DATES),
        endDate: dayjs(values.endDate).format(ISO_DATES),
        finishDay: values.finishDay ? dayjs(values.finishDay).format(ISO_DATES) : null,
        createdDate: dayjs(values.createdDate).format(ISO_DATES),
        latitude: values.place.latitude || null,
        longtitude: values.place.longtitude || null,
        placeId: values.place.placeId || null,
        place: values.place.place || '',
      };
      if (taskId) {
        const response: ResponseReturn<boolean> = await apiPut(
          `${serviceUrls.path.updateAppointment}?menuId=${menuId}&recordId=${recordId}`,
          {
            ...body,
            id: taskId,
          },
        );
        if (response.error && !_.isEmpty(response.detail)) {
          Toast.show({
            type: 'error',
            text1: t('lead:notice'),
            text2: response.errorMessage || response.detail || t('title:edit_appointment_false'),
          });
        } else {
          !!onRefreshing && onRefreshing();
          Toast.show({ type: 'success', text1: t('lead:notice'), text2: t('title:edit_appointment_success') });
          navigation.goBack();
        }
      } else {
        const response: ResponseReturn<boolean> = await apiPost(serviceUrls.path.updateAppointment, body);
        if (response.error && !_.isEmpty(response.errorMessage)) {
          Toast.show({
            type: 'error',
            text1: t('lead:notice'),
            text2: response.errorMessage || response.detail || t('title:create_appointment_false'),
          });
        } else {
          Toast.show({ type: 'success', text1: t('lead:notice'), text2: t('title:create_appointment_success') });
          navigation.goBack();
          if (onRefreshing) {
            onRefreshing();
          }
          navigation.navigate(AppRoutes.DETAIL_MEETING, { id: response.response?.data, type: typeTab });
        }
      }
    } catch (error) {
    } finally {
      appContext.setLoading(false);
    }
  };

  return (
    <Host>
      <SafeAreaView edges={['top']} style={[styles.wrapper, { paddingBottom: useSafeAreaInsets().bottom }]}>
        <Formik
          innerRef={refFormik}
          validateOnChange={false}
          initialValues={initialValues}
          onSubmit={(values) => onCreate(values)}
          enableReinitialize
          validationSchema={validationSchema}>
          {(props) => {
            const { handleSubmit, errors, values, setFieldValue, handleBlur } = props;
            return (
              <>
                <AppHeader
                  headerContainerStyles={styles.headerContainer}
                  iconLeft={<MyIcon.Close />}
                  iconRight={<Icon type="materialIcons" name="done" size={28} color={color.icon} />}
                  iconLeftPress={() => navigation.goBack()}
                  iconRightPress={handleSubmit}
                  title={t(!taskId ? 'title:add_appointment' : 'title:edit_appointment')}
                />
                <ScrollView style={{ flex: 1, backgroundColor: color.lavender, padding: padding.p16 }}>
                  <View
                    style={{
                      backgroundColor: color.white,
                      borderRadius: 3,
                      padding: padding.p8,
                      paddingTop: padding.p8,
                    }}>
                    <MyInput.Base
                      name="title"
                      onBlur={handleBlur('title')}
                      onChangeTextData={(text) => setFieldValue('title', text)}
                      isRequire
                      value={values.title}
                      placeholder={t('input:appointment_name')}
                      errors={errors}
                      maxLength={250}
                    />

                    <AppField
                      isRequire
                      modalName="ModalAppointment"
                      title={t('input:appointment_type')}
                      name="type"
                      keyShow="label"
                      Component={DropDownMutiline}
                    />
                    <MyInput.Base
                      placeholder={t('input:all_day')}
                      editable={false}
                      rightIcon={
                        <Switch
                          trackColor={{ true: color.primary, false: color.grayLine }}
                          style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                          value={values.allDay}
                          onChange={() => setAllDay(!values.allDay)}
                        />
                      }
                    />
                    <View style={{ flexDirection: 'row' }}>
                      <AppField
                        containerStyle={{ marginRight: padding.p16, flex: 1 }}
                        isRequire
                        type="date"
                        modalName="ModalDate"
                        title={t('input:since')}
                        name="startDate"
                        titleCalendar={t('input:since')}
                        Component={DropDownMutiline}
                      />
                      <AppField
                        containerStyle={{ flex: 1 }}
                        isRequire
                        type="time"
                        modalName="ModalDate"
                        title={t('input:time')}
                        name="startDate"
                        titleCalendar={t('input:time')}
                        Component={DropDownMutiline}
                        disabled={values.allDay}
                      />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <AppField
                        containerStyle={{ marginRight: padding.p16, flex: 1 }}
                        isRequire
                        type="date"
                        modalName="ModalDate"
                        title={t('input:to_the_day')}
                        name="endDate"
                        titleCalendar={t('input:to_the_day')}
                        Component={DropDownMutiline}
                      />
                      <AppField
                        containerStyle={{ flex: 1 }}
                        isRequire
                        type="time"
                        modalName="ModalDate"
                        title={t('input:time')}
                        name="endDate"
                        titleCalendar={t('input:time')}
                        Component={DropDownMutiline}
                        disabled={values.allDay}
                      />
                    </View>
                    <AppField
                      modalName="ModalAutocompleteSearch"
                      title={t('input:place')}
                      name="place"
                      keyShow="place"
                      Component={DropDownMutiline}
                    />
                    <MyInput.Base
                      name="description"
                      value={values?.description || ''}
                      onChangeTextData={(text) => setFieldValue('description', text)}
                      placeholder={t('input:description')}
                    />
                    <MyInput.Base
                      placeholder={t('input:done_confirm')}
                      editable={false}
                      rightIcon={
                        <Switch
                          trackColor={{ true: color.primary, false: color.grayLine }}
                          style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                          value={values.completed}
                          onChange={() => onDone(!values.completed)}
                        />
                      }
                    />
                    {values.completed && (
                      <>
                        <AppField
                          modalName="ModalMissionResult"
                          title={t('input:result')}
                          name="result"
                          keyShow="value"
                          Component={DropDownMutiline}
                        />
                        <AppField
                          disabled
                          modalName="ModalDate"
                          title={t('input:finish_date')}
                          name="finishDay"
                          Component={DropDownMutiline}
                          type="datetime"
                        />
                      </>
                    )}
                    <AppField
                      modalName="ModalFindOwner"
                      isRequire
                      title={t('input:executor')}
                      name="ownerId"
                      keyShow="value"
                      Component={DropDownMutiline}
                    />
                    <AppField
                      modalName="ModalRelated"
                      isRequire
                      title={t('input:related_subjects')}
                      name="relatedObject"
                      keyShow="name"
                      Component={DropDownMutiline}
                    />

                    <AppField
                      modalName="ModalCoordinator"
                      title={t('input:coordinator')}
                      name="collaborators"
                      Component={DropDownMutiline}
                      keyShow="value"
                    />
                  </View>
                </ScrollView>
              </>
            );
          }}
        </Formik>
      </SafeAreaView>
    </Host>
  );
};
