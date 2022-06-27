import AppText from '@components/AppText';
import { DATE_FORMAT_EN } from '@helpers/constants';
import dataDate from '@helpers/dataDate';
import { color, padding } from '@helpers/index';
import { NavigationDate } from '@interfaces/quickSearch.interface';
import { useNavigation } from '@react-navigation/core';
import { setFilterActivity, setFilterBusiness } from '@redux/actions/filterActions';
import { RootState } from '@redux/reducers';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import AppHeader from './components/Header';
import ModalCalendar from './components/ModalCalendar';
import SelectDay from './components/SelectDay';
import SelectMonth from './components/SelectMonth';
import SelectOther from './components/SelectOther';
import SelectQuarter from './components/SelectQuarter';
import SelectWeek from './components/SelectWeek';
import styles from './styles';

interface IDateTimeProps extends NavigationDate {}

const DateTime = (props: IDateTimeProps) => {
  const index = props.route.params.index;
  const navigation = useNavigation();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const filterReducer = useSelector((state: RootState) => state.filterReducer);
  const [typeDate, setTypeDate] = useState(
    index === 0 ? filterReducer.filterBusiness.FilterTimeType : filterReducer.filterActivity.FilterTimeType,
  );
  const [typeStart, setTypeStart] = useState(false);
  const [idCheck, setIdCheck] = useState(
    index === 0 ? filterReducer.filterBusiness.idTime : filterReducer.filterActivity.idTime,
  );
  const [typeCheck, setTypeCheck] = useState(
    index === 0 ? filterReducer.filterBusiness.FilterTimeType : filterReducer.filterActivity.FilterTimeType,
  );
  const [saveData, setSaveData] = useState<any>();
  const [showCalender, setModalcalender] = useState(false);
  const checkData = (type: 'start' | 'end') => {
    if (type === 'start') {
      if (index === 0) {
        return filterReducer.filterBusiness.startDate;
      }
      return filterReducer.filterActivity.startTime;
    }
    if (index === 0) {
      return filterReducer.filterBusiness.endDate;
    }
    return filterReducer.filterActivity.endTime;
  };

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const [valueDate, setValueDate] = useState({
    day: {
      startTime: dayjs(checkData('start')).format(DATE_FORMAT_EN) || dayjs(new Date()).format(DATE_FORMAT_EN),
      endTime: dayjs(checkData('end')).format(DATE_FORMAT_EN) || dayjs(new Date()).format(DATE_FORMAT_EN),
      type: 1,
    },
    week: {
      startTime: dayjs(checkData('start')).format(DATE_FORMAT_EN) || dayjs(sevenDaysAgo).format(DATE_FORMAT_EN),
      endTime: dayjs(checkData('end')).format(DATE_FORMAT_EN) || dayjs(new Date()).format(DATE_FORMAT_EN),
      type: 2,
    },
    other: {
      startTime: dayjs(checkData('start')).format(DATE_FORMAT_EN) || dayjs(sevenDaysAgo).format(DATE_FORMAT_EN),
      endTime: dayjs(checkData('end')).format(DATE_FORMAT_EN) || dayjs(new Date()).format(DATE_FORMAT_EN),
      type: 99,
    },
  });

  const setIsStart = (value: boolean) => {
    setTypeStart(value);
  };

  const onSaveData = (value: any) => {
    setSaveData(value);
  };

  const openModal = () => {
    setModalcalender(true);
  };
  const closeModal = () => {
    setModalcalender(false);
  };

  const onChangeDate = (startTime: string, endTime: string, type: number) => {
    switch (type) {
      case 1:
        setValueDate({
          ...valueDate,
          day: {
            startTime: startTime,
            endTime: endTime,
            type: type,
          },
        });
        break;
      case 2:
        setValueDate({
          ...valueDate,
          week: {
            startTime: startTime,
            endTime: endTime,
            type: type,
          },
        });
        break;
      case 99:
        if (typeStart) {
          setValueDate({
            ...valueDate,
            other: { ...valueDate.other, startTime: startTime, type: type },
          });
        } else {
          setValueDate({
            ...valueDate,
            other: { ...valueDate.other, endTime: endTime, type: type },
          });
        }
        break;

      default:
        break;
    }
  };

  const fillDate = [
    {
      type: 1,
      title: t('business:day'),
    },
    {
      type: 2,
      title: t('business:week'),
    },
    {
      type: 3,
      title: t('business:month'),
    },
    {
      type: 4,
      title: t('business:quarter'),
    },
    {
      type: 99,
      title: t('business:custom'),
    },
  ];

  const RenderDatetime = (typeDate: number | null | undefined) => {
    switch (typeDate) {
      case 1:
        return (
          <SelectDay
            type={typeDate}
            showCalendar={openModal}
            valueDay={valueDate}
            onSaveData={onSaveData}
            idCheck={idCheck}
            setIdCheck={setIdCheck}
            typeCheck={typeCheck}
            setTypeCheck={setTypeCheck}
          />
        );
      case 2:
        return (
          <SelectWeek
            type={typeDate}
            showCalendar={openModal}
            valueWeek={valueDate}
            onSaveData={onSaveData}
            idCheck={idCheck}
            setIdCheck={setIdCheck}
            typeCheck={typeCheck}
            setTypeCheck={setTypeCheck}
          />
        );
      case 3:
        return (
          <SelectMonth
            type={typeDate}
            onSaveData={onSaveData}
            idCheck={idCheck}
            setIdCheck={setIdCheck}
            typeCheck={typeCheck}
            setTypeCheck={setTypeCheck}
          />
        );
      case 4:
        return (
          <SelectQuarter
            type={typeDate}
            onSaveData={onSaveData}
            idCheck={idCheck}
            setIdCheck={setIdCheck}
            typeCheck={typeCheck}
            setTypeCheck={setTypeCheck}
          />
        );
      case 99:
        return <SelectOther type={typeDate} showCalendar={openModal} setIsStart={setIsStart} valueOther={valueDate} />;
      default:
        break;
    }
  };

  const onLoadData = (filterType: number, idTime: number) => {
    switch (filterType) {
      case 1:
        setSaveData(dataDate.dataDay.filter((el) => el.id == idTime)[0]);
        break;
      case 2:
        setSaveData(dataDate.dataWeek.filter((el) => el.id == idTime)[0]);
        break;
      case 3:
        setSaveData(dataDate.dataMonth?.filter((el) => el.id == idTime)[0]);
        break;
      case 4:
        setSaveData(dataDate.dataQuarter.filter((el) => el.id == idTime)[0]);
        break;
      case 99:
        setSaveData(dataDate.dataOther.filter((el) => el.id == idTime)[0]);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (index === 0) {
      onLoadData(filterReducer.filterBusiness.FilterTimeType || 0, filterReducer.filterBusiness.idTime || 0);
    } else {
      onLoadData(filterReducer.filterActivity.FilterTimeType || 0, filterReducer.filterActivity.idTime || 0);
    }
  }, []);

  const onSubmit = (type: number | null | undefined) => {
    let dataDateTime: any = {};
    let dataDateTimeActivity: any = {};
    switch (type) {
      case 1:
        dataDateTime = {
          FilterTimeType: saveData?.type,
          startDate: dayjs(saveData?.value).format(DATE_FORMAT_EN),
          endDate: dayjs(saveData?.value).format(DATE_FORMAT_EN),
          idTime: saveData?.id,
        };
        dataDateTimeActivity = {
          FilterTimeType: saveData?.type,
          idTime: saveData?.id,
          startTime: dayjs(saveData?.value).format(DATE_FORMAT_EN),
          endTime: dayjs(saveData?.value).format(DATE_FORMAT_EN),
        };
        break;
      case 2:
        dataDateTime = {
          FilterTimeType: saveData?.type,
          startDate: dayjs(saveData?.valueStart).format(DATE_FORMAT_EN),
          endDate: dayjs(saveData?.valueEnd).format(DATE_FORMAT_EN),
          idTime: saveData?.id,
        };
        dataDateTimeActivity = {
          FilterTimeType: saveData?.type,
          idTime: saveData?.id,
          startTime: dayjs(saveData?.valueStart).format(DATE_FORMAT_EN),
          endTime: dayjs(saveData?.valueEnd).format(DATE_FORMAT_EN),
        };
        break;
      case 3:
        dataDateTime = {
          FilterTimeType: saveData?.type,
          startDate: dayjs(saveData?.valueStart).format(DATE_FORMAT_EN),
          endDate: dayjs(saveData?.valueEnd).format(DATE_FORMAT_EN),
          idTime: saveData?.id,
        };
        dataDateTimeActivity = {
          FilterTimeType: saveData?.type,
          idTime: saveData?.id,
          startTime: dayjs(saveData?.valueStart).format(DATE_FORMAT_EN),
          endTime: dayjs(saveData?.valueEnd).format(DATE_FORMAT_EN),
        };
        break;
      case 4:
        dataDateTime = {
          FilterTimeType: saveData?.type,
          startDate: dayjs(saveData?.valueStart).format(DATE_FORMAT_EN),
          endDate: dayjs(saveData?.valueEnd).format(DATE_FORMAT_EN),
          idTime: saveData?.id,
        };
        dataDateTimeActivity = {
          FilterTimeType: saveData?.type,
          idTime: saveData?.id,
          startTime: dayjs(saveData?.valueStart).format(DATE_FORMAT_EN),
          endTime: dayjs(saveData?.valueEnd).format(DATE_FORMAT_EN),
        };
        break;
      case 99:
        dataDateTime = {
          FilterTimeType: valueDate.other.type,
          startDate: dayjs(valueDate.other.startTime).format(DATE_FORMAT_EN),
          endDate: dayjs(valueDate.other.endTime).format(DATE_FORMAT_EN),
          idTime: 0,
        };
        dataDateTimeActivity = {
          FilterTimeType: saveData?.type,
          idTime: saveData?.id,
          startTime: dayjs(valueDate.other.startTime).format(DATE_FORMAT_EN),
          endTime: dayjs(valueDate.other.endTime).format(DATE_FORMAT_EN),
        };
        break;
      default:
        break;
    }
    if (dayjs(dataDateTime?.startDate).isAfter(dayjs(dataDateTime?.endDate))) {
      Toast.show({
        type: 'error',
        text1: t('business:validateTime'),
      });
    } else {
      if (index === 0) {
        dispatch(setFilterBusiness(dataDateTime));
      } else {
        dispatch(setFilterActivity(dataDateTimeActivity));
      }
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.white }}>
      <AppHeader
        title={t('business:editTime')}
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => {
          onSubmit(typeDate);
        }}
      />
      <View style={styles.container}>
        {fillDate.map((el, index) => {
          return (
            <View key={index.toString()}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setTypeDate(el.type);
                }}>
                <AppText style={[styles.txtDatetime, typeDate === el.type && styles.txtDatetimePress]}>
                  {el.title.toUpperCase()}
                </AppText>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      <View style={{ paddingHorizontal: padding.p16 }}>{RenderDatetime(typeDate)}</View>

      <Modal visible={showCalender} animationType="slide" onRequestClose={closeModal}>
        <ModalCalendar
          onClose={closeModal}
          type={typeDate}
          onChangeDate={onChangeDate}
          typeStart={typeStart}
          onSaveData={onSaveData}
          setIdCheck={setIdCheck}
          setTypeCheck={setTypeCheck}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default DateTime;
