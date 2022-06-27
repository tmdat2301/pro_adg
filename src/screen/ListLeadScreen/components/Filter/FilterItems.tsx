import AppText from '@components/AppText';
import { MyIcon } from '@components/Icon';
import { device, responsivePixel } from '@helpers/index';
import color from '@helpers/color';
import fontSize from '@helpers/fontSize';
import padding from '@helpers/padding';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Input } from 'react-native-elements/dist/input/Input';
import {
  dateOperator,
  DATE_FORMAT,
  DATE_FORMAT_EN,
  DATE_TIME_FORMAT_INPUT,
  DATE_TIME_MM_DD,
  decimalOneInput,
  decimalOneInputOperator,
  decimalOperator,
  filterType,
  textOperator,
} from '@helpers/constants';
import ModalDropDown from '@components/ModalDropDown';
import { Modalize } from 'react-native-modalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ModalDropDownMultiple from '@components/ModalDropDownMultiple';
import ModalDate from '@components/ModalDate';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Portal } from 'react-native-portalize';
import { isEmpty } from 'lodash';
dayjs.extend(customParseFormat);
export interface Props {
  content?: string;
  onChooseOperator: (operator: string) => void;
  type: number;
  onUpdateValue: (values: any) => void;
  values: any;
  onDeleteItem: () => void;
  operator: string;
  itemData: any;
  error: string | undefined;
}

const noOperator = [filterType.choice, filterType.multiselect];
const toDay = new Date();
const yesterday = new Date(toDay);
yesterday.setDate(yesterday.getDate() - 1);
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
// const startLastWeek = dayjs(sevenDaysAgo).startOf('week').toDate();
// const endLastWeek = dayjs(sevenDaysAgo).endOf('week').toDate();
const last30Days = new Date();
last30Days.setDate(last30Days.getDate() - 30);

const dataDate = [
  {
    key: 'toDay',
    start: dayjs(toDay).startOf('day').format(DATE_TIME_MM_DD),
    end: dayjs(toDay).endOf('day').format(DATE_TIME_MM_DD),
  },
  {
    key: 'yesterday',
    start: dayjs(yesterday).startOf('day').format(DATE_TIME_MM_DD),
    end: dayjs(toDay).endOf('day').format(DATE_TIME_MM_DD),
  },
  {
    key: 'thisWeek',
    start: dayjs().startOf('week').format(DATE_TIME_MM_DD),
    end: dayjs().endOf('week').format(DATE_TIME_MM_DD),
  },
  {
    key: 'previousWeek',
    start: dayjs(sevenDaysAgo).startOf('week').format(DATE_TIME_MM_DD),
    end: dayjs(sevenDaysAgo).endOf('week').format(DATE_TIME_MM_DD),
  },
  {
    key: 'thisMonth',
    start: dayjs().startOf('month').format(DATE_TIME_MM_DD),
    end: dayjs().endOf('month').format(DATE_TIME_MM_DD),
  },
  {
    key: 'previousMonth',
    start: dayjs(last30Days).startOf('month').format(DATE_TIME_MM_DD),
    end: dayjs(last30Days).endOf('month').format(DATE_TIME_MM_DD),
  },
  {
    key: 'custom',
    start: '',
    end: '',
  },
]

export default (props: Props) => {
  const { content, onChooseOperator, type, onUpdateValue, values: allValues, onDeleteItem, operator, itemData, error } = props;
  const { values, start, end } = allValues;
  const { t } = useTranslation();
  const [textValue, setTextValue] = useState('');
  const [showFullInfo, setShowFullInfo] = useState(true);
  const [operatorIndex, setOperatorIndex] = useState<number>(-1);
  const [selectValue, setSelectValue] = useState<any[]>([]);
  const [inRange, setInrange] = useState({
    start: start || values[0] || '',
    end: end || values[1] || '',
  });
  const [isStartDate, setIsStartDate] = useState(true);
  useEffect(() => {
    const index = getOperatorArray().findIndex((el: any) => el.key === operator);
    setOperatorIndex(index);
    if (type == filterType.date) {
      handleDatePickerOption();
    }
  }, [operator]);

  const handleDatePickerOption = () => {
    const dateItem = dataDate.filter((el) => el.key == operator)?.[0];
    setInrange({ ...inRange, start: dateItem?.start || inRange.start, end: dateItem?.end || inRange.end });
    if (itemData.isFieldExtension) {
      onUpdateValue({ values: [dateItem?.start || inRange.start, dateItem?.end || inRange.end] });
    } else {
      onUpdateValue({ start: dateItem?.start || inRange.start, end: dateItem?.end || inRange.end });
    }
  }

  const bottomSheetModalRef = useRef<any>();
  const operatorModalRef = useRef<any>();

  const onEndEditing = () => {
    if (!textValue) {
      return;
    }
    if (values.length >= 0) {
      setTextValue('');
    }
    const newArray = [...values];
    newArray.push(textValue);
    onUpdateValue({ values: newArray, start: null, end: null });
  };

  const onOpenFilter = () => {
    if (noOperator.includes(type)) {
      onDeleteItem();
      return;
    }
    setShowFullInfo(!showFullInfo);
  };

  const onDeleteInput = (index: number) => {
    const newArray = [...values];
    newArray.splice(index, 1);
    onUpdateValue({ values: newArray, start: null, end: null });
  };

  const getDateDefaultValue = () => {
    const date = isStartDate ? inRange.start : inRange.end;
    if (!dayjs(date, DATE_TIME_MM_DD).isValid()) {
      return new Date();
    }
    return dayjs(date, DATE_TIME_MM_DD).toDate();
  };

  const getOperatorArray = () => {
    switch (type) {
      case filterType.text:
        return textOperator(t);
      case filterType.decimal:
        return decimalOperator(t);
      case filterType.date:
        return dateOperator(t);
      default:
        return [];
    }
  };

  const renderValueInput = () => {
    return (
      <>
        <View style={styles.inputWrapper}>
          {!!values && values.length > 0 && values.map((el: string, index: number) => {
            return (
              <View key={index.toString()} style={styles.enterInputStyles}>
                {renderEnterInput(el, index)}
              </View>
            );
          })}
          {
            ((type == filterType.decimal && decimalOneInput.includes(operator) ? values.length < 1 : true)) && renderInputFilter()
          }
        </View>
        {values.length === 0 && !!error && <AppText style={styles.errorStyle}>{t('validate:filterContent')}</AppText>}
      </>
    );
  };

  const handleOpenDate = (isStart: boolean) => {
    setIsStartDate(isStart);
    bottomSheetModalRef.current?.open();
  };

  const showRenderFromType = (type: number) => {
    switch (type) {
      case filterType.text:
        return renderValueInput();
      case filterType.date:
        if (operator == 'fromToWithEqual') {
          return (
            <>
              <View style={{ flexDirection: 'row' }}>
                {renderDate(inRange.start, true, { marginRight: padding.p20 })}
                {renderDate(inRange.end, false)}
              </View>
              {(!inRange.start || !inRange.end) && !!error && (
                <AppText style={styles.errorStyle}>{t('validate:filterInrange')}</AppText>
              )}
            </>
          )
        }
        return null;
      case filterType.decimal:
        if (decimalOneInputOperator.includes(operator)) {
          return (
            <>
              <View style={{ flexDirection: 'row' }}>
                {renderValueInRange({ marginRight: padding.p20 }, true)}
                {renderValueInRange()}
              </View>
              {(!inRange.start || !inRange.end) && (
                <AppText style={styles.errorStyle}>{t('validate:filterInrange')}</AppText>
              )}
            </>
          );
        }
        return renderValueInput();
      case filterType.choice:
        return (
          <>
            {renderCondition(
              values[0] || t('filter:defaultValue'),
              <Icon
                name="caretdown"
                type="antdesign"
                size={18}
                color={color.subText}
                style={{ marginBottom: padding.p10 }}
              />,
              () => bottomSheetModalRef.current.open(),
              { borderBottomWidth: 1.5, borderColor: color.brightGray, marginTop: padding.p20 },
              { marginBottom: padding.p10, color: color.black },
            )}
            {values.length === 0 && !!error && <AppText style={styles.errorStyle}>{t('validate:filterChoice')}</AppText>}
          </>
        );
      case filterType.multiselect:
        return (
          <>
            {renderCondition(
              values.toString() || t('filter:defaultValue'),
              <Icon
                name="caretdown"
                type="antdesign"
                size={18}
                color={color.subText}
                style={{ marginBottom: padding.p10 }}
              />,
              () => { bottomSheetModalRef.current.open() },
              { borderBottomWidth: 1.5, borderColor: color.brightGray, marginTop: padding.p20 },
              { marginBottom: padding.p10, color: color.black },
            )}
            {values.length === 0 && !!error && <AppText style={styles.errorStyle}>{t('validate:filterChoice')}</AppText>}
          </>
        );
      default:
        break;
    }
  };

  const renderCondition = (
    titleFilter: string,
    icon: any,
    handleClick: () => void,
    filterStyles?: ViewStyle,
    textStyles?: TextStyle,
  ) => {
    return (
      <TouchableOpacity style={[styles.filterContainer, filterStyles]} onPress={handleClick}>
        <AppText value={titleFilter} style={[styles.conditionStyles, textStyles]} />
        {icon}
      </TouchableOpacity>
    );
  };

  const renderItemHeader = (title: string) => {
    const isOperator = !noOperator.includes(type);
    return (
      <View style={[styles.filterContainer]}>
        <TouchableOpacity
          activeOpacity={isOperator ? 0.8 : 1}
          style={{ flex: 1 }}
          onPress={isOperator ? onOpenFilter : () => null}>
          <AppText value={title} style={[styles.conditionStyles]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onOpenFilter}>
          {isOperator ? <Icon name="up" type="antdesign" size={20} color={color.subText} /> : <MyIcon.Close />}
        </TouchableOpacity>
      </View>
    );
  };

  const renderDate = (text: string, isStart: boolean, dateWrapper?: ViewStyle) => {
    const dateValue = dayjs(text, DATE_TIME_MM_DD);
    const dateString = dateValue.isValid() ? dateValue.format(DATE_FORMAT) : t('filter:defaultValue');
    return (
      <TouchableOpacity onPress={() => handleOpenDate(isStart)} style={[styles.dateWrapper, dateWrapper]}>
        <AppText value={dateString} style={styles.dateTitle} />
        {!!showFullInfo && <MyIcon.Calendar fill={color.subText} />}
      </TouchableOpacity>
    );
  };

  const handleChooseOperator = (key: string, index: number) => {
    onChooseOperator(key);
  };

  const renderShortFilter = (titleFilter: string, textStyles?: TextStyle) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={[styles.shortFilterStyles, {
          borderColor: color.red,
          borderStyle: 'solid',
          borderWidth: checkborderError() ? 1 : 0
        }]}
        onPress={() => setShowFullInfo(!showFullInfo)}>
        <View style={{ flex: 1 }}>
          <AppText value={titleFilter} style={[styles.conditionStyles, textStyles]} />
          {showRenderFromType(type)}
        </View>
        <TouchableOpacity onPress={onDeleteItem}>
          <MyIcon.Close />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderValueInRange = (inputValueContainer?: ViewStyle, isStart?: boolean) => {
    return (
      <View style={[styles.inputValueContainer, inputValueContainer]}>
        <Input
          keyboardType={'numeric'}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          labelStyle={[styles.labelStyles, { fontWeight: '400' }]}
          placeholder={t('lead:enter_value')}
          value={isStart ? inRange.start || '' : inRange.end || ''}
          placeholderTextColor={color.subText}
          errorStyle={{ height: 0 }}
          onChangeText={(value) => handleChangeInputRange(value, isStart)}
          containerStyle={{ paddingHorizontal: 0 }}
        />
      </View>
    );
  };

  const handleChangeInputRange = (value: string, isStart?: boolean) => {
    const defaultValues = { ...inRange };
    if (isStart) {
      defaultValues.start = value;
      setInrange(defaultValues);
    } else {
      defaultValues.end = value;
      setInrange(defaultValues);
    }
    if (itemData.isFieldExtension) {
      onUpdateValue({ values: [defaultValues.start, defaultValues.end] });
    } else {
      onUpdateValue({ start: defaultValues.start, end: defaultValues.end });
    }
  };

  const renderInputFilter = () => {
    return (
      <View style={{ flex: 1, minWidth: 50 }}>
        <Input
          inputStyle={{ minHeight: responsivePixel(32) }}
          inputContainerStyle={{
            borderBottomWidth: 0,
          }}
          placeholderTextColor={color.subText}
          placeholder={t('lead:enter_filter_content')}
          renderErrorMessage={false}
          containerStyle={{ paddingHorizontal: 0, marginTop: padding.p8 }}
          value={textValue}
          onChangeText={setTextValue}
          onEndEditing={onEndEditing}
          keyboardType={type == filterType.decimal ? 'phone-pad' : 'default'}
        />
      </View>
    );
  };

  const renderEnterInput = (value: string, index: number) => {
    return (
      <>
        <AppText value={value} />
        <TouchableOpacity onPress={() => onDeleteInput(index)}>
          <MyIcon.Close width={12} style={{ marginLeft: padding.p5 }} />
        </TouchableOpacity>
      </>
    );
  };

  const handleSingleSelect = (key: string, index: number) => {
    onUpdateValue({ values: [key] });
    setSelectValue([index]);
  };

  const handleMultiSelect = (key: string, index: number) => {
    const valuesTemp = [...values];
    if (values.includes(key)) {
      const indexValue = values.findIndex((el: any) => {
        return el === key;
      });
      valuesTemp.splice(indexValue, 1);
    } else {
      valuesTemp.push(key);
    }
    onUpdateValue({ values: valuesTemp });
  };

  const handlePickDate = (date: Date) => {
    const params: any = { ...inRange };
    const fieldTitle = isStartDate ? 'start' : 'end';
    const dateValue = isStartDate ? dayjs(date).startOf('date') : dayjs(date).endOf('date');
    params[fieldTitle] = dateValue.format(DATE_TIME_MM_DD);
    params.values = [];
    if (itemData.isFieldExtension) {
      onUpdateValue({ values: [params.start, params.end] });
    } else {
      onUpdateValue(params);
    }
    setInrange(params);
  };

  const renderModalContent = () => {
    switch (type) {
      case filterType.choice:
        return (
          <ModalDropDown
            header={t('lead:chooseCondition')}
            handleClick={handleSingleSelect}
            modalHeight={device.height / 3}
            selectOne={selectValue[0]}
            type={type}
            data={itemData.catalog}
          />
        );
      case filterType.multiselect:
        return (
          <ModalDropDownMultiple
            header={t('label:filter_lead')}
            handleClick={handleMultiSelect}
            data={itemData.catalog}
            chooseConditions={values}
          />
        );
      case filterType.date:
        return (
          <ModalDate
            handleConfirm={handlePickDate}
            handleCancel={() => bottomSheetModalRef.current?.close()}
            date={getDateDefaultValue()}
            titleCalendar={isStartDate ? t('lead:start_date') : t('lead:end_date')}
            minimumDate={isStartDate ? undefined : isEmpty(inRange.start) ? undefined : dayjs(inRange.start).toDate()}
            maximumDate={isStartDate ? isEmpty(inRange.end) ? undefined : dayjs(inRange.end).toDate() : undefined}
          />
        );
      default:
        return null;
    }
  };
  const checkborderError = () => {
    if (error) {
      switch (type) {
        case filterType.date:
          return (!inRange.start || !inRange.end)
        default:
          return (values.length === 0)
      }
    }
    return false
  }
  return (
    <View>
      {showFullInfo || noOperator.includes(type) ? (
        <View
          style={{
            backgroundColor: color.white,
            marginTop: 20,
            padding: padding.p12,
            borderColor: color.red,
            borderStyle: 'solid',
            borderWidth: checkborderError() ? 1 : 0
          }}>
          {renderItemHeader(content || '')}
          {!noOperator.includes(type) &&
            renderCondition(
              getOperatorArray()[operatorIndex]?.title || t('filter:defaultValue'),
              <Icon
                name="caretdown"
                type="antdesign"
                size={18}
                color={color.subText}
                style={{ marginBottom: padding.p10 }}
              />,
              () => operatorModalRef.current.open(),
              { borderBottomWidth: 1.5, borderColor: color.brightGray, marginTop: padding.p20 },
              { marginBottom: padding.p10, color: color.black },
            )}
          {showRenderFromType(type)}
        </View>
      ) : (
        <View >{renderShortFilter(`${content || ''} ${getOperatorArray()[operatorIndex]?.title || ''}`)}</View>
      )}
      <Portal>
        <Modalize
          adjustToContentHeight
          withHandle={false}
          FooterComponent={<View style={{ height: useSafeAreaInsets().bottom }} />}
          ref={bottomSheetModalRef}>
          {renderModalContent()}
        </Modalize>
      </Portal>
      <Portal>
        <Modalize
          adjustToContentHeight
          withHandle={false}
          panGestureEnabled={true}
          panGestureComponentEnabled={true}
          closeOnOverlayTap
          ref={operatorModalRef}>
          <ModalDropDown
            header={t('lead:chooseCondition')}
            handleClick={handleChooseOperator}
            modalHeight={device.height / 3}
            selectOne={operatorIndex}
            type={type}
            data={getOperatorArray()}
          />
        </Modalize>
      </Portal>
    </View>
  );
};

export const styles = StyleSheet.create({
  containerStyles: {
    backgroundColor: color.white,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: padding.p24,
  },
  labelStyles: {
    color: color.subText,
    fontSize: fontSize.f14,
    marginTop: padding.p12,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  conditionStyles: {
    fontSize: fontSize.f14,
    color: color.subText,
  },
  dateWrapper: {
    borderBottomWidth: 1.5,
    borderBottomColor: color.brightGray,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: padding.p16,
    flex: 1,
  },
  dateTitle: {
    fontSize: fontSize.f14,
    color: color.subText,
    flex: 1,
  },
  inputValueContainer: {
    flex: 1,
    borderBottomWidth: 1.5,
    borderColor: color.brightGray,
    marginTop: 4,
  },
  enterInputStyles: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.lightGray,
    borderWidth: 1.5,
    borderColor: color.hawkesBlue,
    borderRadius: 5,
    paddingHorizontal: padding.p8,
    marginRight: 4,
    padding: 8,
    marginTop: padding.p12,
  },
  inputWrapper: {
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderColor: color.brightGray,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  shortFilterStyles: {
    backgroundColor: color.white,
    marginTop: padding.p24,
    alignItems: 'center',
    padding: padding.p12,
    flexDirection: 'row',
  },
  errorStyle: {
    color: color.red,
    marginTop: padding.p1,
  },
});
