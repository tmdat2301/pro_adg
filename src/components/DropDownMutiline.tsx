import AppText from '@components/AppText';
import { MyIcon } from '@components/Icon';
import React, { useMemo, useRef } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TouchableOpacityProps,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { color, fontSize, padding } from '@helpers/index';
import ModalDate from './ModalDate';
import dayjs from 'dayjs';
import { Modalize } from 'react-native-modalize';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import ModalSelect from './ModalSelect';
import { DataResult } from '@interfaces/profile.interface';
import ModalCoordinator from './ModalCoordinator';
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT_INPUT,
  FieldType,
  TIME_FORMAT_24,
  TypeCriteria,
  TypeFieldExtension,
} from '@helpers/constants';
import ModalMission from './ModalMission';
import ModalRelated from './ModalRelated';
import { useTranslation } from 'react-i18next';
import { FieldProps } from 'formik';
import { useCallback } from 'react';
import { isArray, isEmpty } from 'lodash';
import AutoCompleteSearch from './AutoCompleteSearch';
import ModalCorporate from './ModalCorporate';
import { Portal } from 'react-native-portalize';
import serviceUrls from '@services/serviceUrls';
import ModalSearchRetailers from './ModalSearchRetailers';
import ModalSearchContact from './ModalSearchContact';
import ModalCompanyPipeline from './ModalCompanyPipline';
import ModalSearchProject from './ModalSearchProject';
import { ProjectStatus } from '@screen/CreateAndEditScreen/components/DealCU';
import ModalMissionResult from './ModalMissionResult';
interface DropDownFormik extends DropDownMutilineProps {
  fieldFormik: FieldProps;
}
export interface DropDownMutilineProps extends TouchableOpacityProps {
  onPress?: () => void;
  onPressExtra?: (data: any) => void;
  valueDate?: Date;
  title?: string;
  keyShow?: string;
  isRequire?: boolean;
  disabled?: boolean;
  type?: 'datetime' | 'time' | 'date';
  typeSelect?: FieldType.Choice | FieldType.MutiSelect;
  containerStyle?: StyleProp<ViewStyle>;
  titleCalendar?: string;
  onChangeDate?: (date: Date) => void;
  titleModal?: string;
  dataSelect?: DataResult[];
  name: string;
  projectStatusIds?: ProjectStatus[];
  idComporate?: number;
  modalName:
  | 'ModalCoordinator'
  | 'ModalRelated'
  | 'ModalMission'
  | 'ModalMissionResult'
  | 'ModalFindOwner'
  | 'ModalSelect'
  | 'ModalDate'
  | 'ModalAutocompleteSearch'
  | 'ModalAppointment'
  | 'ModalIndustryClassification'
  | 'ModalCorporate'
  | 'ModalSourceDropdown'
  | 'ModalCustomerGroupDropDown'
  | 'ModalSearchRetailers'
  | 'ModalProductDropDown'
  | 'ModalCompanyPipelineLead'
  | 'ModalContactDropDown'
  | 'ModalCompanyPipelineDead'
  | 'ModalFailReasonDeal'
  | 'ModalFailReasonLead'
  | 'ModalSearchProject'
  | 'ModalFailReason';
}
const DropDownMutiline = (props: DropDownFormik) => {
  const {
    onPress,
    title,
    disabled,
    keyShow,
    isRequire = false,
    type,
    containerStyle,
    valueDate,
    titleCalendar = '',
    titleModal = '',
    onChangeDate,
    dataSelect,
    modalName,
    fieldFormik,
    typeSelect = FieldType.Choice,
    onPressExtra,
    projectStatusIds = [],
    idComporate,
    ...restProps
  } = props;
  const bottomSheetModalRef = useRef<Modalize>(null);
  const isTypeSelect = !type;
  const { field, form } = fieldFormik;
  const { value, name } = field;
  const { setFieldValue, errors, handleBlur } = form;

  const haveListData = !!value && isArray(value) && value.length > 0;
  const haveValue = (keyShow && !isEmpty(value)) || (!!value && !isArray(value));

  const haveData = haveListData || haveValue;
  const { t } = useTranslation();
  const onDelete = useCallback(
    (index: number) => () => {
      if (haveListData) {
        const newList = value.filter((_item: any, idx: number) => index !== idx);
        setFieldValue(name, newList);
      }
    },
    [haveListData, fieldFormik],
  );

  const checkField = (item: DataResult, elm: DataResult) => {
    if (item?.label) {
      return elm?.label === item?.label;
    }
    return elm?.id === item?.id;
  };
  const handleChange = useCallback(
    (data: any) => {
      setFieldValue(name, data);
      onPressExtra && onPressExtra(data);
      bottomSheetModalRef.current?.close();
    },
    [fieldFormik],
  );

  const renderEnterInput = (value: any, index: number = 0) => {
    let dataShow = keyShow ? value[keyShow] : '';
    if (keyShow && !value[keyShow] && !!dataSelect) {
      const newValue = dataSelect.find((elm) => elm?.id === value?.id) as any;
      dataShow = newValue ? newValue[keyShow] : '';
    }
    return (
      <View key={index.toString()} style={styles.wraper}>
        <AppText style={{ maxWidth: 200 }} numberOfLines={1} value={dataShow} />
        <TouchableOpacity onPress={onDelete(index)}>
          <MyIcon.Close width={12} style={{ marginLeft: padding.p5 }} />
        </TouchableOpacity>
      </View>
    );
  };
  const renderIcon = () => {
    if (haveValue && !haveListData) {
      return (
        <TouchableOpacity
          onPress={() => {
            handleChange('');
          }}
          hitSlop={{ bottom: 12, right: 8, left: 10, top: 12 }}>
          <Icon name="closecircle" color={color.icon} size={15} type="antdesign" />
        </TouchableOpacity>
      );
    }
    switch (type) {
      case 'datetime':
        return <Icon name="calendar" color={color.icon} size={16} type="feather" />;
      case 'date':
        return <Icon name="calendar" color={color.icon} size={16} type="feather" />;
      case 'time':
        return <Icon name="access-time" color={color.icon} size={16} type="materialIcons" />;
      default:
        return <Icon name="down" color={color.icon} size={12} type="antdesign" />;
    }
  };

  const renderModalSelectWithApi = (api: string) => {
    return (
      <ModalSelect
        type={typeSelect}
        onSelect={(data) => {
          handleChange(data);
        }}
        title={titleModal}
        apiUrl={api}
        dataSelected={typeSelect === FieldType.MutiSelect ? value : [value]}
      />
    );
  };
  const renderModalContent = useMemo(() => {
    switch (modalName) {
      case 'ModalCoordinator':
        return (
          <ModalCoordinator
            title={t('input:coordinator')}
            type={FieldType.MutiSelect}
            dataSelected={value}
            onMutiSelect={(data) => handleChange(data)}
          />
        );
      case 'ModalCorporate':
        return (
          <ModalCorporate
            title={titleModal}
            dataSelected={value ? [value] : []}
            type={typeSelect}
            onMutiSelect={(data) => handleChange(data)}
            onSelect={(data) => handleChange(data)}
            onAdd={(data) => handleChange(data)}
          />
        );
      case 'ModalSearchProject':
        return (
          <ModalSearchProject
            statusIds={projectStatusIds}
            title={titleModal}
            type={typeSelect}
            dataSelected={value ? [value] : []}
            onSelect={(data) => handleChange(data)}
            onMutiSelect={(data) => handleChange(data)}
          />
        );
      case 'ModalCompanyPipelineDead':
        return (
          <ModalCompanyPipeline
            dataSelected={value}
            title={titleModal}
            type={TypeCriteria.deal}
            onSelect={(data) => handleChange(data)}
          />
        );
      case 'ModalCompanyPipelineLead':
        return (
          <ModalCompanyPipeline
            dataSelected={value}
            title={titleModal}
            type={TypeCriteria.lead}
            onSelect={(data) => handleChange(data)}
          />
        );
      case 'ModalSearchRetailers':
        return (
          <ModalSearchRetailers
            title={titleModal}
            dataSelected={value ? [value] : []}
            type={typeSelect}
            onMutiSelect={(data) => handleChange(data)}
            onSelect={(data) => handleChange(data)}
          />
        );
      case 'ModalFailReasonDeal':
        return renderModalSelectWithApi(`${serviceUrls.path.failureReason}${TypeCriteria.deal}`);
      case 'ModalFailReasonLead':
        return renderModalSelectWithApi(`${serviceUrls.path.failureReason}${TypeCriteria.lead}`);
      case 'ModalRelated':
        return <ModalRelated title={t('input:related_subjects')} onSelect={(data) => handleChange(data)} />;
      case 'ModalAutocompleteSearch':
        return (
          <AutoCompleteSearch
            onPress={(data) => {
              handleChange(data);
            }}
          />
        );
      case 'ModalMission':
        return <ModalMission title={t('input:task_type')} onSelect={(data) => handleChange(data)} dataSelected={value} />;
      case 'ModalAppointment':
        return (
          <ModalMission
            type="appointment"
            title={t('input:appointment_type')}
            onSelect={(data) => handleChange(data)}
            dataSelected={value}
          />
        );
      case 'ModalContactDropDown':
        return (
          <ModalSearchContact
            onMutiSelect={(data) => handleChange(data)}
            type={typeSelect}
            dataSelected={typeSelect === FieldType.MutiSelect ? value : [value]}
            title={titleModal}
            onSelect={(data) => handleChange(data)}
            idComporate={idComporate}
          />
        );
      case 'ModalProductDropDown':
        return renderModalSelectWithApi(serviceUrls.path.getProductDropDown);
      case 'ModalIndustryClassification':
        return renderModalSelectWithApi(serviceUrls.path.industryClassification);
      case 'ModalSourceDropdown':
        return renderModalSelectWithApi(serviceUrls.path.sourceDropdown);
      case 'ModalCustomerGroupDropDown':
        return renderModalSelectWithApi(serviceUrls.path.customerGroupDropDown);
      case 'ModalFindOwner':
        return <ModalCoordinator title={t('input:executor')} onSelect={(data) => handleChange(data)} />;
      case 'ModalSelect':
        return (
          <ModalSelect
            type={typeSelect}
            onSelect={(data) => {
              if (onPressExtra) {
                onPressExtra(data);
              }
              handleChange(data);
            }}
            title={titleModal}
            dataSelect={dataSelect || []}
            dataSelected={typeSelect === FieldType.MutiSelect ? value : [value]}
          />
        );
      case 'ModalDate':
        return (
          <ModalDate
            date={valueDate || value ? dayjs(valueDate ?? value).toDate() : new Date()}
            handleCancel={() => bottomSheetModalRef.current?.close()}
            handleConfirm={(data) => handleChange(data)}
            titleCalendar={titleCalendar}
            mode={type ? type : 'date'}
          />
        );
      case 'ModalMissionResult':
        return (
          <ModalMissionResult
            onSelect={(data: DataResult) => handleChange(data)}
            onClose={() => {
              bottomSheetModalRef.current?.close();
            }}
            dataSelected={value}
          />
        );
      default:
        return renderModalSelectWithApi(serviceUrls.path.getMissionResult);
    }
  }, [value, modalName, dataSelect, typeSelect, projectStatusIds, idComporate]);

  const renderValue = () => {
    switch (type) {
      case 'date':
        return dayjs(value).format(DATE_FORMAT);
      case 'time':
        return dayjs(value).format(TIME_FORMAT_24);
      case 'datetime':
        return dayjs(value).format(DATE_TIME_FORMAT_INPUT);
      default:
        if (!isEmpty(value) && keyShow) {
          let dataShow = value[keyShow];
          if (!value[keyShow] && !!dataSelect) {
            const newValue = dataSelect.find((elm) => elm?.label === value?.label) as any;
            dataShow = newValue ? newValue[keyShow] : '';
          }
          return dataShow;
        }
        return value;
    }
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress ? onPress : () => bottomSheetModalRef.current?.open()}
      style={[styles.container, containerStyle, disabled && { opacity: 0.5 }]}
      onBlur={handleBlur(name)}
      {...restProps}>
      <View style={[styles.viewWrap, haveData && { alignItems: 'flex-start' }]}>
        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
          <AppText allowFontScaling={false} style={[styles.title, haveData && styles.titleHasData]}>
            {title}
            <AppText style={{ fontSize: 12 }} color={haveData ? color.red : color.subText}>
              {isRequire ? '*' : ' '}
            </AppText>
          </AppText>
          <View style={styles.contentContainer}>
            {haveListData ? (
              (value || []).map((el: string, index: number) => {
                return (
                  <View key={index} style={styles.enterInputStyles}>
                    {renderEnterInput(el, index)}
                  </View>
                );
              })
            ) : (
              <View />
            )}
            {haveValue && !haveListData && (
              <AppText numberOfLines={1} style={{ fontSize: fontSize.f14, paddingRight: 16 }}>
                {renderValue()}
              </AppText>
            )}
          </View>
        </View>
        <View style={styles.iconRight}>{renderIcon()}</View>
      </View>
      <Portal>
        <Modalize
          scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
          disableScrollIfPossible
          adjustToContentHeight
          modalStyle={!isTypeSelect && { borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
          ref={bottomSheetModalRef}
          onOverlayPress={() => bottomSheetModalRef.current?.close()}
          withHandle={false}>
          <View style={{ height: isTypeSelect ? ScreenHeight * 0.85 : 300 }}>{renderModalContent}</View>
        </Modalize>
      </Portal>
      {!!errors[name] && <AppText style={styles.textError}>{errors[name]}</AppText>}
    </TouchableOpacity>
  );
};

export default DropDownMutiline;

const styles = StyleSheet.create({
  container: { minHeight: 42, justifyContent: 'flex-start', marginVertical: 4 },
  viewWrap: {
    borderBottomWidth: 1,
    borderBottomColor: color.grayLine,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 4,
  },
  title: {
    color: color.subText,
    fontSize: fontSize.f14,
    paddingTop: 4,
    paddingBottom: padding.p2,
    marginBottom: padding.p8,
  },
  value: {
    fontWeight: '400',
    color: color.text,
    fontSize: fontSize.f14,
  },
  wraper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: color.brightGray,
    borderRadius: 3,
    alignItems: 'center',
    backgroundColor: color.lightGray,
    marginRight: padding.p8,
    padding: 4,
  },

  enterInputStyles: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: padding.p4,
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  textError: { fontSize: 12, color: color.miss, paddingVertical: 4 },
  titleHasData: { fontSize: 12, marginBottom: 0, paddingTop: 0 },
  iconRight: { position: 'absolute', top: 14, right: 6 },
});
