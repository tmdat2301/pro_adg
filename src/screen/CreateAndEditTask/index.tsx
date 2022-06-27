import AppHeader from '@components/AppHeader';
import { MyIcon } from '@components/Icon';
import { MyInput } from '@components/Input';
import { AppContext } from '@contexts/index';
import color from '@helpers/color';
import { ISO_DATES, TaskType } from '@helpers/constants';
import { padding } from '@helpers/index';
import { DataResult, DataRelated } from '@interfaces/profile.interface';
import { ResponseReturn } from '@interfaces/response.interface';
import { CreateTaskModal } from '@interfaces/task.interface';
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
import { SafeAreaView } from 'react-native-safe-area-context';
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
  duration: Date;
  finishDay: Date | null;
  result: DataResult | '';
  relatedObject: DataRelated | '';
  title: string;
  type: { value: TaskType; label: string };
  description: string;
  ownerId: DataResult;
}

export default (props: Props) => {
  const userReducer = useSelector((state: RootState) => state.userReducer);
  const route = useRoute();
  const params = route.params as DataRelated;
  const taskId = route?.params?.taskId || null;
  const onRefreshing = route?.params?.onRefreshing || null;
  const typeTab = route?.params?.typeTab || null;

  const { t } = useTranslation();
  const getTaskTypeName = (type: TaskType) => {
    switch (type) {
      case TaskType.callPhone:
        return t('lead:call_phone');
      case TaskType.sendEmail:
        return t('lead:send_mail');
      case TaskType.callPrice:
        return t('lead:call_price');
      default:
        return t('lead:call_phone');
    }
  };
  const [initialValues, setInitialValues] = useState<initialValuesTask>({
    collaborators: [],
    completed: false,
    createdBy: userReducer.data?.sub,
    createdDate: new Date(),
    duration: dayjs().add(1, 'days').toDate(),
    finishDay: null,
    ownerId: {
      email: userReducer.data?.email || '',
      label: userReducer.data?.sub || '',
      value: userReducer.data?.name || '',
    },
    relatedObject: params ?? '',
    result: '',
    title: '',
    type: { value: TaskType.callPhone, label: getTaskTypeName(TaskType.callPhone) },
    description: '',
  });
  const appContext = useContext(AppContext);

  const refFormik = useRef<FormikProps<any>>(null);
  const validationSchema = Yup.object().shape({
    duration: Yup.date().typeError(t('label:errorNumber')).required(t('label:required')),
    title: Yup.string().required(t('label:required')).max(100, t('error:max_100_string')),
    relatedObject: Yup.object().required(t('label:required')),
    ownerId: Yup.object().nullable().required(t('label:required')),
  });

  const navigation = useNavigation();
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
      } catch (error) { }
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
            duration: data.duration || '',
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
  const onDone = (value: boolean) => {
    if (refFormik?.current != null) {
      refFormik?.current.setFieldValue('completed', value);
      if (value) {
        refFormik?.current.setFieldValue('finishDay', new Date().toISOString());
      } else {
        refFormik?.current.setFieldValue('result', '');
        refFormik?.current.setFieldValue('finishDay', '');
      }
    }
  };

  const onCreate = async (values: initialValuesTask) => {
    try {
      appContext.setLoading(true);
      const menuId = values?.relatedObject ? values?.relatedObject?.menuId : '';
      const recordId = values?.relatedObject ? values?.relatedObject?.id : '';
      const body: CreateTaskModal = {
        ...values,
        type: values.type.value,
        collaborators:
          values?.collaborators.length > 0
            ? values.collaborators?.map((item: DataResult) => item.label?.toString() ?? '')
            : null,
        ownerId: values.ownerId?.label.toString() ?? '',
        relatedObject: `${values?.relatedObject ? values?.relatedObject?.menuId : ''}-${values?.relatedObject ? values?.relatedObject?.id : ''
          }`,
        result: values?.result ? values?.result?.label : null,
        duration: dayjs(values.duration).format(ISO_DATES),
        finishDay: values.finishDay ? dayjs(values.finishDay).format(ISO_DATES) : null,
        createdDate: dayjs(values.createdDate).format(ISO_DATES),
      };
      if (taskId) {
        const response: ResponseReturn<boolean> = await apiPut(
          `${serviceUrls.path.updateTask}?menuId=${menuId}&recordId=${recordId}`,
          {
            ...body,
            id: taskId,
          },
        );
        if (response.error && !_.isEmpty(response.detail)) {
          Toast.show({
            type: 'error',
            text1: t('lead:notice'),
            text2: response.errorMessage || response.detail || t('title:edit_task_false'),
          });
        } else {
          !!onRefreshing && onRefreshing();
          Toast.show({ type: 'success', text1: t('lead:notice'), text2: t('title:edit_task_success') });
          navigation.goBack();
        }
      } else {
        const response: ResponseReturn<boolean> = await apiPost(serviceUrls.path.updateTask, body);
        if (response.error && !_.isEmpty(response.detail)) {
          Toast.show({
            type: 'error',
            text1: t('lead:notice'),
            text2: response.errorMessage || response.detail || t('title:create_task_false'),
          });
        } else {
          Toast.show({ type: 'success', text1: t('lead:notice'), text2: t('title:create_task_success') });
          navigation.goBack();
          if (onRefreshing) {
            onRefreshing();
          }
          navigation.navigate(AppRoutes.DETAIL_MEETING, { id: response.response?.data, type: typeTab });
        }
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: t('lead:notice'), text2: JSON.stringify(error) });
    } finally {
      appContext.setLoading(false);
    }
  };

  return (
    <Host>
      <SafeAreaView style={styles.wrapper}>
        <Formik
          innerRef={refFormik}
          validateOnChange={false}
          initialValues={initialValues}
          onSubmit={(values) => onCreate(values)}
          enableReinitialize
          validationSchema={validationSchema}>
          {(props) => {
            const { handleSubmit, errors, values, setFieldValue, handleBlur, handleChange } = props;
            return (
              <>
                <AppHeader
                  headerContainerStyles={styles.headerContainer}
                  iconLeft={<MyIcon.Close />}
                  iconRight={<Icon type="materialIcons" name="done" size={28} color={color.icon} />}
                  iconLeftPress={() => navigation.goBack()}
                  iconRightPress={handleSubmit}
                  title={t(!taskId ? 'title:add_task' : 'title:edit_task')}
                />
                <ScrollView style={{ flex: 1, backgroundColor: color.lavender, padding: padding.p16 }}>
                  <View style={{ backgroundColor: color.white, borderRadius: 3, padding: padding.p8, paddingTop: padding.p8 }}>
                    <MyInput.Base
                      name="title"
                      onChangeTextData={(text) => setFieldValue('title', text)}
                      isRequire
                      placeholder={t('input:task_name')}
                      errors={errors}
                      onBlur={handleBlur('title')}
                      value={values.title || ''}
                      maxLength={100}
                    />

                    <AppField
                      isRequire
                      modalName="ModalMission"
                      title={t('input:task_type')}
                      name="type"
                      keyShow="label"
                      Component={DropDownMutiline}
                    />
                    <View style={{ flexDirection: 'row' }}>
                      <AppField
                        containerStyle={{ marginRight: padding.p16, flex: 1 }}
                        isRequire
                        type="date"
                        modalName="ModalDate"
                        title={t('input:expiration_date')}
                        name="duration"
                        titleCalendar={t('input:expiration_date')}
                        Component={DropDownMutiline}
                      />
                      <AppField
                        containerStyle={{ flex: 1 }}
                        isRequire
                        type="time"
                        modalName="ModalDate"
                        title={t('input:time')}
                        name="duration"
                        titleCalendar={t('input:time')}
                        Component={DropDownMutiline}
                      />
                    </View>
                    <MyInput.Base
                      name="description"
                      value={values.description || ''}
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
