import AppText from '@components/AppText';
import { MyInput } from '@components/Input';
import color from '@helpers/color';
import { FieldType } from '@helpers/constants';
import fontSize from '@helpers/fontSize';
import padding from '@helpers/padding';
import { DataResult } from '@interfaces/profile.interface';
import { ResponseReturn } from '@interfaces/response.interface';
import { apiGet } from '@services/serviceHandle';
import _, { isNumber } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import AppHeader from './AppHeader';

export interface ModalSelectProps {
  onSelect?: (data: DataResult | DataResult[]) => void;
  title?: string;
  type?: FieldType.Choice | FieldType.MutiSelect;
  dataSelected?: DataResult[];
  dataSelect?: DataResult[];
  apiUrl?: string;
}
const ModalSelect: FC<ModalSelectProps> = React.memo((props) => {
  const { onSelect = () => {}, dataSelected, title, type = FieldType.Choice, dataSelect, apiUrl } = props;

  const { t } = useTranslation();
  const [text, setText] = useState<string>('');
  const [dataSearch, setDataSearch] = useState<DataResult[]>([]);

  const [listDataSelected, setListDataSelected] = useState<DataResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMutiSelect = type === FieldType.MutiSelect;

  const [resultData, setResultData] = useState<DataResult[]>([]);

  useEffect(() => {
    const onGetData = async (url: string) => {
      setIsLoading(true);
      try {
        const response: ResponseReturn<DataResult[]> = await apiGet(url, {});
        if (response.error && !_.isEmpty(response.detail)) {
        } else {
          setDataSearch(response.response?.data || []);
          setResultData(response.response?.data || []);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    if (apiUrl) {
      onGetData(apiUrl);
    }
  }, []);

  useEffect(() => {
    if (text === '') {
      setDataSearch(resultData);
    } else {
      setDataSearch(resultData.filter((item) => item.value.toLocaleLowerCase().includes(text.toLocaleLowerCase())));
    }
  }, [text]);

  useEffect(() => {
    dataSelected && setListDataSelected(dataSelected);
  }, [dataSelected]);

  useEffect(() => {
    if (dataSelect && dataSelect.length > 0) {
      setDataSearch(dataSelect);
      setResultData(dataSelect);
    }
  }, [dataSelect]);

  const onSearch = (value: string) => {
    setText(value);
  };

  const checkField = (item: DataResult, elm: DataResult) => {
    if (item?.label || isNumber(item.label)) {
      return elm?.label === item?.label;
    }
    if (item?.id || isNumber(item.id)) {
      return elm?.id === item?.id;
    }
    return false;
  };

  const onChooseItem = (item: DataResult) => {
    if (isMutiSelect) {
      if (listDataSelected && listDataSelected.length > 0 && listDataSelected.some((elm) => checkField(item, elm))) {
        setListDataSelected(listDataSelected.filter((elm) => !checkField(item, elm)));
        return;
      }
      setListDataSelected([...listDataSelected, item]);
    } else {
      onSelect(item);
    }
  };

  const onSave = () => {
    onSelect(listDataSelected);
  };

  const renderValue = (value: string) => {
    if (!value) {
      const dataShow = dataSearch.find((elm) => elm.id == value);
      if (dataShow) {
        return dataShow?.value;
      }
      return '';
    }
    return value;
  };
  const renderUserItem = (item: DataResult, index: number) => {
    const isActive =
      listDataSelected && listDataSelected.length > 0 && listDataSelected.some((elm) => checkField(item, elm));
    return (
      <TouchableOpacity
        key={index.toString()}
        onPress={() => {
          onChooseItem(item);
        }}
        style={{ paddingHorizontal: padding.p16 }}>
        <View style={[styles.textContainer, { backgroundColor: 'transparent' }]}>
          <View style={{ flex: 1 }}>
            <AppText
              color={isActive ? color.mainBlue : color.text}
              fontSize={fontSize.f14}
              style={{ marginVertical: padding.p4 }}>
              {renderValue(item?.value || item?.label || item?.id || '')}
            </AppText>
            {/* <AppText fontSize={fontSize.f12} color={color.subText}>
              {item?.email || ''}
            </AppText> */}
          </View>
          {isActive && <Icon name="check" color={color.mainBlue} />}
        </View>
      </TouchableOpacity>
    );
  };
  const renderLoading = () => {
    return isLoading ? (
      <View style={{ paddingTop: 8 }}>
        <ActivityIndicator size="small" color={color.grayShaft} />
      </View>
    ) : null;
  };
  return (
    <View style={{ paddingTop: 16, height: ScreenHeight * 0.85 }}>
      <AppHeader
        headerContainerStyles={{ paddingBottom: 16 }}
        title={title ?? ''}
        iconRight={
          isMutiSelect && (
            <AppText color={color.mainBlue} fontWeight="semibold" style={styles.titleStyles}>
              {t('button:done')}
            </AppText>
          )
        }
        iconRightPress={onSave}
      />
      <MyInput.Search onChangeText={onSearch} placeholder={t('input:search')} />
      {renderLoading()}
      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }} nestedScrollEnabled>
        {dataSearch &&
          dataSearch?.map((item, index) => {
            return renderUserItem(item, index);
          })}
      </ScrollView>
    </View>
  );
});

export default ModalSelect;

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: padding.p16,
    borderBottomWidth: 1,
    borderBottomColor: color.grayLine,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleStyles: {
    paddingVertical: padding.p8,
    fontSize: fontSize.f16,
    textAlign: 'center',
  },
});
