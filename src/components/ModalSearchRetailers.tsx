import AppText from '@components/AppText';
import { MyInput } from '@components/Input';
import color from '@helpers/color';
import { FieldType } from '@helpers/constants';
import fontSize from '@helpers/fontSize';
import padding from '@helpers/padding';
import { ResponseReturn } from '@interfaces/response.interface';
import { apiGet } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import _ from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import AppHeader from './AppHeader';

export interface ModalSearchRetailersProps {
  onSelect?: (data: Retailer) => void;
  onMutiSelect?: (data: Retailer[]) => void;
  title?: string;
  type?: FieldType.Choice | FieldType.MutiSelect;
  dataSelected?: Retailer[];
}

export interface Retailer {
  retailerCode: string;
  name: string;
}

const ModalSearchRetailers: FC<ModalSearchRetailersProps> = React.memo((props) => {
  const { onSelect = () => { }, dataSelected, title, type = FieldType.Choice, onMutiSelect = () => { } } = props;

  const { t } = useTranslation();
  const [text, setText] = useState<string>('');
  const [dataSearch, setDataSearch] = useState<Retailer[]>([]);
  const [listDataSelected, setListDataSelected] = useState<Retailer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMutiSelect = type === FieldType.MutiSelect;
  const onFilter = async () => {
    const url = serviceUrls.path.vendor;
    setIsLoading(true)
    try {
      const params = {
        vendorType: 0,
        searching: text,
      };
      const response: ResponseReturn<{ items: Retailer[]; totalCount: number }> = await apiGet(url, params);
      if (response.code && response.code === 403) {
        Alert.alert(t('error:no_access'), t('error:no_access_content'), [
          {
            text: t('error:understand'),
            style: 'cancel',
          },
        ]);
        return;
      }
      if (response.error && !_.isEmpty(response.detail)) {
      } else {
        setDataSearch(response.response?.data.items || []);
      }
    } catch (error) { }
    finally {
      setIsLoading(false)
    }
  };
  useEffect(() => {
    dataSelected && setListDataSelected(dataSelected);
  }, [dataSelected]);

  useEffect(() => {
    onFilter();
  }, [text]);

  const onSearch = (value: string) => {
    setText(value);
  };

  const onChooseItem = (item: Retailer) => {
    if (isMutiSelect) {
      if (listDataSelected.some((elm) => elm.retailerCode === item?.retailerCode)) {
        setListDataSelected(listDataSelected.filter((elm) => elm.retailerCode !== item?.retailerCode));
        return;
      }
      setListDataSelected([...listDataSelected, item]);
    } else {
      onSelect(item);
    }
  };

  const onSave = () => {
    onMutiSelect(listDataSelected);
  };

  const renderUserItem = (item: Retailer, index: number) => {
    const isActive =
      listDataSelected &&
      listDataSelected.length > 0 &&
      listDataSelected.some((elm) => elm.retailerCode === item?.retailerCode);

    return (
      <TouchableOpacity
        key={item.retailerCode.toString()}
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
              {item?.name || ''}
            </AppText>
            <AppText fontSize={fontSize.f12} color={color.subText}>
              {item?.retailerCode || ''}
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
        iconRightPress={onMutiSelect && onSave}
      />
      <MyInput.Search onChangeText={onSearch} placeholder={t('input:search')} />
      {renderLoading()}
      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }} nestedScrollEnabled>
        {dataSearch.map((item, index) => {
          return renderUserItem(item, index);
        })}
      </ScrollView>
    </View>
  );
});

export default ModalSearchRetailers;

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
