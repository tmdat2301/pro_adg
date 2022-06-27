import AppText from '@components/AppText';
import { MyInput } from '@components/Input';
import color from '@helpers/color';
import { FieldType } from '@helpers/constants';
import fontSize from '@helpers/fontSize';
import padding from '@helpers/padding';
import { ResponseReturn } from '@interfaces/response.interface';
import { ProjectStatus } from '@screen/CreateAndEditScreen/components/DealCU';
import { apiGet } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import _ from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import AppHeader from './AppHeader';

export interface ModalSearchProjectProps {
  onSelect?: (data: ProjectItem) => void;
  onMutiSelect?: (data: ProjectItem[]) => void;
  title?: string;
  type?: FieldType.Choice | FieldType.MutiSelect;
  dataSelected?: ProjectItem[];
  statusIds: ProjectStatus[];
}

export interface OnsProjectUser {
  projectId: number;
  userId: string;
  id: string;
}

export interface ProjectItem {
  name: string;
  code: string;
  onsProjectUsers: OnsProjectUser[];
  startDate: Date;
  expectationEndDate: Date;
  creationTime: Date;
  lastModificationTime: Date;
  totalUsers: number;
  address: string;
  latitude: number;
  longtitude: number;
  description?: any;
  totalDeals: number;
  placeId: string;
  id: number;
}

const ModalSearchProject: FC<ModalSearchProjectProps> = React.memo((props) => {
  const {
    onSelect = () => { },
    dataSelected,
    title,
    type = FieldType.Choice,
    onMutiSelect = () => { },
    statusIds,
  } = props;
  const { t } = useTranslation();
  const [text, setText] = useState<string>('');
  const [dataSearch, setDataSearch] = useState<ProjectItem[]>([]);
  const [listDataSelected, setListDataSelected] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMutiSelect = type === FieldType.MutiSelect;
  const onFilter = async () => {
    const url = `${serviceUrls.path.projectSearch}`;
    setIsLoading(true)
    try {
      const params = {
        'statusIds[0]': statusIds[0]?.id ?? '',
        'statusIds[1]': statusIds[1]?.id ?? '',
        skipCount: 1,
        maxResultCount: 20,
        searchValue: text,
      };
      const response: ResponseReturn<{ total: number; items: ProjectItem[] }> = await apiGet(url, params);
      if (response.error && !_.isEmpty(response.detail)) {
      } else {
        setDataSearch(response.response?.data?.items || []);
      }
    } catch (error) { }
    finally {
      setIsLoading(false)
    }
  };
  useEffect(() => {
    dataSelected && setListDataSelected(dataSelected || []);
  }, [dataSelected]);

  useEffect(() => {
    onFilter();
  }, [text]);

  const onSearch = (value: string) => {
    setText(value);
  };

  const onChooseItem = (item: ProjectItem) => {
    if (isMutiSelect) {
      if (listDataSelected && listDataSelected.length > 0 && listDataSelected.some((elm) => elm?.id === item?.id)) {
        setListDataSelected(listDataSelected.filter((elm) => elm.id !== item?.id));
        return;
      }
      setListDataSelected([...(listDataSelected || []), item]);
    } else {
      onSelect(item);
    }
  };

  const onSave = () => {
    onMutiSelect(listDataSelected);
  };

  const renderUserItem = (item: ProjectItem, index: number) => {
    const isActive =
      listDataSelected &&
      listDataSelected.length > 0 &&
      listDataSelected.some((elm) => elm.id.toString() === item?.id.toString());
    return (
      <TouchableOpacity
        key={item.id.toString()}
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
              {item?.code || ''}
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

export default ModalSearchProject;

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
