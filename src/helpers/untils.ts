import { DATE_FORMAT, DATE_TIME_FORMAT } from '@helpers/constants';
import dayjs from 'dayjs';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import _ from 'lodash';
export const convertCurrency = (num: number | string) => {
  return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
};

export const convertMillion = (value: number | string, currency?: string) => {
  const convertCrnt = currency || 'M';
  try {
    let convert = value.toString() + convertCrnt;
    if (value >= 0) {
      if (value < 1000) return value.toString();
      if (value <= 999999 && value >= 1000) return (Number(value) / 1000).toFixed(1).toString() + 'k';
      if (value <= 999999999 && value >= 1000000) return (Number(value) / 1000000).toFixed(1).toString() + 'M';
      if (value >= 1000000000) return (Number(value) / 1000000000).toFixed(1).toString() + 'B';
    } else {
      if (value > -1000) return value.toString();
      if (value >= -999999 && value <= -1000) return (Number(value) / 1000).toFixed(1).toString() + 'k';
      if (value >= -999999999 && value <= -1000000) return (Number(value) / 1000000).toFixed(1).toString() + 'M';
      if (value <= -1000000000) return (Number(value) / 1000000000).toFixed(1).toString() + 'B';
    }
    return convert;
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: JSON.stringify(error),
    });
    return value.toString() + convertCrnt;
  }
};

export const setTimeOut = () => {
  if (Platform.OS === 'ios') {
    return 500;
  }
  return 300;
};

export const setFieldData = (value: string | null) => {
  try {
    if (value) {
      if (dayjs(value) && dayjs(value).format(DATE_FORMAT) !== 'Invalid Date') {
        return dayjs(value).format(DATE_FORMAT);
      }
      return value;
    }
    return '----';
  } catch (error) {
    return '----';
  }
};

export const formatPhone = (phone: string) => {
  if (phone.match(/(\+84)[0-9]*\b/g)) {
    return phone.split('+84').join(`(+84)`);
  }
  if (phone.match(/(\+01)[0-9]*\b/g)) {
    return phone.split('+01').join(`(+01)`);
  }
  return phone;
};

export function IsJsonString(str: string) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}


export type RecursiveKeyOf<TObj extends Record<string, any>> = {
  [TKey in keyof TObj & string]: TObj[TKey] extends Record<string, any>
    ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
    : `${TKey}`;
}[keyof TObj & string];


