import AppText from '@components/AppText';
import { MyIcon } from '@components/Icon';
import BaseInput, { BaseInputProps } from '@components/Input/BaseInput';
import ModalCorporate from '@components/ModalCorporate';
import { COUNTRY_CODE_WIDTH } from '@helpers/constants';
import { color, fontSize, padding } from '@helpers/index';
import { FieldArrayRenderProps } from 'formik';
import { cloneDeep, get, isArray } from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, StyleSheet, TextInputProps, TouchableOpacity, View } from 'react-native';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';

interface ArrayInputI extends TextInputProps, BaseInputProps {
  arrayHelpers: FieldArrayRenderProps;
  onOpenCountry: () => void;
  textButton: string;
  isPhoneType?: boolean;
  isCorporate?: boolean;
}
export interface CountryCode {
  icon?: MyIcon;
  label: string;
  code: 'vn' | 'other';
  numberCode?: string;
}

export interface ArrayInputModel {
  text: string;
  code?: 'vn' | 'other' | any;
  isMain: boolean;
}

export const initialMobile = { text: '', code: 'vn', isMain: false };
export const initialArrayInput = { text: '', isMain: false };

export const listCountryCode: CountryCode[] = [
  { icon: <MyIcon.VietNam />, label: '(+84) Việt Nam', code: 'vn', numberCode: '+84' },
  { icon: <MyIcon.Usa />, label: '(+1) Hoa kỳ', code: 'other', numberCode: '+1 ' },
];

const ArrayInput = (props: ArrayInputI, ref: React.ForwardedRef<unknown>) => {
  //! State
  const { arrayHelpers, onOpenCountry, textButton, isPhoneType, isCorporate, ...restProps } = props;
  const [indexItemSelected, setIndexItemSelected] = useState<number>(0);
  const { name, form } = arrayHelpers;
  const { setFieldValue } = form;
  const mobileError = get(form.errors, name);
  const mobileTouched = get(form.touched, name);
  const value = get(form.values, name);
  const { t } = useTranslation();
  const mobileList = value;
  const lastIndex = mobileList ? mobileList.length - 1 : -1;
  const bottomSheetModalRef = useRef<Modalize>(null);
  const bottomModalRef = useRef<any>();

  //! Function

  const onUpdateCountry = (country: CountryCode) => {
    setFieldValue(`${name}.${indexItemSelected}.code`, country.code);
    bottomModalRef.current.close();
  }
  const getMsgError = (field: string) => {
    if (get(mobileTouched, field)) {
      return isArray(mobileError) ? get(mobileError, field) : mobileError;
    }
    return '';
  };

  const onAdd = useCallback(() => {
    const listHasMain = mobileList.some((el: ArrayInputModel) => el.isMain);
    return arrayHelpers.push({ ...(isPhoneType ? initialMobile : initialArrayInput), isMain: !listHasMain });
  }, [mobileList, arrayHelpers]);

  const onRemove = useCallback(
    (index) => () => {
      const tempMobileList = [...mobileList];
      if (tempMobileList[index].isMain) {
        setFieldValue(`${name}.${0}.isMain`, true);
      }
      if (index === 0) {
        setFieldValue(`${name}.${1}.isMain`, true);
      }
      arrayHelpers.remove(index);
    },
    [mobileList, arrayHelpers],
  );

  const onOpenCountryList = useCallback(
    (index: number) => () => {
      bottomModalRef.current?.open();
      setIndexItemSelected(index);
    },
    [onOpenCountry, setIndexItemSelected],
  );

  const onChangeMain = useCallback(
    (index) => () => {
      let tempMobileList = cloneDeep(mobileList);
      tempMobileList = tempMobileList.map((el: ArrayInputModel) => {
        return {
          ...el,
          isMain: false,
        };
      });
      tempMobileList[index].isMain = true;

      setFieldValue(name, tempMobileList);
    },
    [mobileList, setFieldValue],
  );

  const handleChangeText = (name: string) => (text: string) => {
    setFieldValue(name, text);
  };
  const handleChange = useCallback(
    (data: any) => {
      setFieldValue(`${name}.${indexItemSelected}`, {
        ...value[indexItemSelected],
        text: data.value,
        code: data.label,
      });

      bottomSheetModalRef.current?.close();
    },
    [setFieldValue, indexItemSelected],
  );

  //! Render
  return (
    <View>
      {mobileList &&
        mobileList.map((item: any, index: number) => (
          <View key={index} style={[styles.container, index !== lastIndex && { borderBottomWidth: 0 }]}>
            <View style={styles.icon}>
              <Icon
                size={18}
                onPress={onChangeMain(index)}
                color={color.mainBlue}
                name={item?.isMain ? 'star' : 'star-o'}
                type="font-awesome"
              />
            </View>

            <View style={{ flex: 1, marginRight: 24 }}>
              <BaseInput
                key={index}
                name={`${name}.${index}.text`}
                onPressIn={
                  isCorporate
                    ? () => {
                      Keyboard.dismiss();
                      setIndexItemSelected(index);
                      bottomSheetModalRef.current?.open();
                    }
                    : undefined
                }
                value={value[index].text}
                errorMessage={getMsgError(`${index}.text`)}
                onChangeText={handleChangeText(`${name}.${index}.text`)}
                leftIcon={
                  isPhoneType ? (
                    <TouchableOpacity
                      onPress={onOpenCountryList(index)}
                      style={{
                        marginBottom: item.text !== '' ? 22 : 4,
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: COUNTRY_CODE_WIDTH,
                      }}>
                      {listCountryCode[item.code === 'vn' ? 0 : 1].icon}
                      <AppText
                        style={{ marginLeft: 8 }}
                        value={listCountryCode[item.code === 'vn' ? 0 : 1].numberCode}
                        color={color.subText}
                      />
                      <View style={styles.stick} />
                    </TouchableOpacity>
                  ) : undefined
                }
                {...restProps}
              />
              {index === lastIndex && (
                <TouchableOpacity style={styles.buttonAdd} onPress={onAdd}>
                  <Icon name="pluscircleo" type="antdesign" size={16} color={color.primary} />
                  <AppText numberOfLines={1} style={styles.text} value={textButton} />
                </TouchableOpacity>
              )}
            </View>
            {lastIndex !== 0 && (
              <View style={{ paddingTop: padding.p14 }}>
                <Icon size={18} onPress={onRemove(index)} color={color.miss} name={'remove-circle'} type="ionicons" />
              </View>
            )}
          </View>
        ))}
      <Portal>
        <Modalize
          ref={bottomSheetModalRef}
          modalHeight={ScreenHeight * 0.85}
          onOverlayPress={() => bottomSheetModalRef.current?.close()}
          withHandle={false}>
          <ModalCorporate title={t('button:add_enterprise')} onSelect={(data: any) => handleChange(data)} />
        </Modalize>
      </Portal>
      {isPhoneType && (
        <Portal>
          <Modalize
            adjustToContentHeight
            withHandle={false}
            ref={bottomModalRef}
            HeaderComponent={() => {
              return (
                <View style={styles.headerBottomSheet}>
                  <AppText value={t('label:phone_select').toString()} fontSize={fontSize.f16} fontWeight="semibold" />
                </View>
              );
            }}>
            <>
              {listCountryCode.map((v, i) => {
                return (
                  <View key={i} style={{ borderTopWidth: i >= 1 ? 1 : 0, borderTopColor: color.grayLine }}>
                    <TouchableOpacity
                      style={[styles.button]}
                      onPress={() => {
                        onUpdateCountry(v);
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
          </Modalize>
        </Portal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: padding.p2,
    borderBottomColor: color.grayLine,
    borderBottomWidth: 1,
    justifyContent: 'flex-start',
    marginBottom: padding.p2,
  },
  text: {
    paddingHorizontal: padding.p8,
    color: color.primary,
  },
  stick: { height: 21, width: 1, backgroundColor: color.gray, marginHorizontal: 4 },
  buttonAdd: { flexDirection: 'row', alignItems: 'center', paddingVertical: padding.p12 },
  icon: {
    paddingRight: padding.p16,
    paddingTop: padding.p16,
  },
  headerBottomSheet: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: padding.p24,
  },
  button: {
    paddingHorizontal: padding.p16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default React.memo(React.forwardRef(ArrayInput));
