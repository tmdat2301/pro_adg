import AppText from '@components/AppText';
import { MyInput } from '@components/Input';
import color from '@helpers/color';
import fontSize from '@helpers/fontSize';
import padding from '@helpers/padding';
import { DataResult } from '@interfaces/profile.interface';
import { ResponseReturn } from '@interfaces/response.interface';
import { apiGet } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import _ from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import Icon from 'react-native-vector-icons/AntDesign';
import AppHeader from './AppHeader';

export interface ModalMissionResultProps {
  onSelect: (data: DataResult) => void;
  onClose?: () => void;
  dataSelected: DataResult;
}
const ModalMissionResult: FC<ModalMissionResultProps> = React.memo((props) => {
  const { onSelect, onClose, dataSelected } = props;
  const { t } = useTranslation();
  const [text, setText] = useState<string>('');
  const [dataSearch, setDataSearch] = useState<DataResult[]>([]);
  const [resultData, setResultData] = useState<DataResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const onGetData = async () => {
      setIsLoading(true)
      try {
        const response: ResponseReturn<DataResult[]> = await apiGet(serviceUrls.path.getMissionResult, {});
        if (response.error && !_.isEmpty(response.detail)) {
        } else {
          setDataSearch(response.response?.data || []);
          setResultData(response.response?.data || []);
        }
      } catch (error) { }
      finally {
        setIsLoading(false)
      }
    };
    onGetData();
  }, []);

  useEffect(() => {
    if (text === '') {
      setDataSearch(resultData);
    } else {
      setDataSearch(resultData.filter((item) => item.value.toLocaleLowerCase().includes(text.toLocaleLowerCase())));
    }
  }, [text]);

  const onSearch = (value: string) => {
    setText(value);
  };

  const onChooseItem = (item: DataResult) => {
    onSelect(item);
  };

  const renderUserItem = (item: DataResult, index?: number) => {
    const isActive = !!dataSelected && dataSelected?.label && dataSelected?.label === item?.label
    return (
      <TouchableOpacity
        key={item.label.toString()}
        onPress={() => {
          onChooseItem(item);
        }}
        style={{ paddingHorizontal: padding.p16 }}>
        <View style={[styles.textContainer, { backgroundColor: 'transparent' }]}>
          <View style={{ flex: 1 }}>
            <AppText color={isActive ? color.primary : color.text} fontSize={fontSize.f14} style={{ marginVertical: padding.p4 }}>
              {item?.value || ''}
            </AppText>
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
    <View style={{ paddingTop: 8, height: ScreenHeight * 0.85 }}>
      <AppHeader

        headerContainerStyles={{ paddingVertical: 8, paddingBottom: 16 }}
        title={t('title:result_select')}
        iconRightPress={onClose && onClose}
        iconRight={
          <AppText fontWeight="semibold" color={color.mainBlue}>
            {t('button:skip')}
          </AppText>
        }
      />

      <MyInput.Search onChangeText={onSearch} placeholder={t('input:search')} />
      {renderLoading()}
      <ScrollView style={{ flex: 1 }} nestedScrollEnabled>
        {dataSearch.map((item, index) => {
          return renderUserItem(item, index);
        })}
      </ScrollView>
    </View>
  );
});

export default ModalMissionResult;

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
    paddingVertical: padding.p16,
    fontSize: fontSize.f16,
    textAlign: 'center',
  },
});
