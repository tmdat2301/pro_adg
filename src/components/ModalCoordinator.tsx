import AppText from '@components/AppText';
import { MyInput } from '@components/Input';
import color from '@helpers/color';
import { FieldType } from '@helpers/constants';
import fontSize from '@helpers/fontSize';
import padding from '@helpers/padding';
import { DataResult } from '@interfaces/profile.interface';
import { ResponseReturn } from '@interfaces/response.interface';
import { RootState } from '@redux/reducers';
import { apiPost } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import _ from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import AppHeader from './AppHeader';

export interface ModalCoordinatorProps {
  onSelect?: (data: DataResult) => void;
  onMutiSelect?: (data: DataResult[]) => void;
  title?: string;
  type?: FieldType.Choice | FieldType.MutiSelect;
  dataSelected?: DataResult[];
}
const ModalCoordinator: FC<ModalCoordinatorProps> = React.memo((props) => {
  const { onSelect = () => {}, dataSelected, title, type = FieldType.Choice, onMutiSelect = () => {} } = props;

  const { t } = useTranslation();
  const [text, setText] = useState<string>('');
  const [dataSearch, setDataSearch] = useState<DataResult[]>([]);
  const [listDataSelected, setListDataSelected] = useState<DataResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMutiSelect = type === FieldType.MutiSelect;
  const onFilter = async () => {
    const url = `${serviceUrls.path.findUserByName}?page_size=20`;
    setIsLoading(true);
    try {
      const params = {
        names: text,
      };
      const response: ResponseReturn<DataResult[]> = await apiPost(url, params);
      if (response.error && !_.isEmpty(response.detail)) {
      } else {
        setDataSearch(response.response?.data || []);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    dataSelected && setListDataSelected(dataSelected);
  }, [dataSelected]);

  useEffect(() => {
    if (text !== '') {
      onFilter();
    }
  }, [text]);

  const onSearch = (value: string) => {
    setText(value);
  };

  const onChooseItem = (item: DataResult) => {
    if (isMutiSelect) {
      if (listDataSelected.some((elm) => elm.label === item?.label)) {
        setListDataSelected(listDataSelected.filter((elm) => elm.label !== item?.label));
        return;
      }
      setListDataSelected([...listDataSelected, item]);
    } else {
      onSelect(item);
    }
  };

  const onSave = () => {
    onMutiSelect && onMutiSelect(listDataSelected);
  };

  const renderUserItem = (item: DataResult, index: number) => {
    const isActive = listDataSelected.some((elm) => elm.label === (item?.label as string));
    return (
      <TouchableOpacity
        key={item.label.toString()}
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
              {item?.value || ''}
            </AppText>
            <AppText fontSize={fontSize.f12} color={color.subText}>
              {item?.email || ''}
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
    <View style={{ paddingTop: 16, height: ScreenHeight * 0.85 }}>
      <AppHeader
        headerContainerStyles={{ paddingBottom: 16 }}
        title={title ?? ''}
        iconRight={
          isMutiSelect && (
            <AppText color={color.mainBlue} fontWeight="semibold">
              {t('button:done')}
            </AppText>
          )
        }
        iconRightPress={onSave}
      />
      <MyInput.Search onChangeText={onSearch} placeholder={t('input:search_input')} />
      {renderLoading()}
      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }} nestedScrollEnabled>
        {dataSearch.map((item, index) => {
          return renderUserItem(item, index);
        })}
      </ScrollView>
    </View>
  );
});

export default ModalCoordinator;

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
