import AppText from '@components/AppText';
import { MyIcon } from '@components/Icon';
import color from '@helpers/color';
import fontSize from '@helpers/fontSize';
import padding from '@helpers/padding';
import { isArray } from 'lodash';
import React, { forwardRef, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Modalize } from 'react-native-modalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface Props {
  dataFilterList: any[];
  onDelete: (index: number) => void;
  onFavorite: (id: string) => void;
  onChoose: (index: number) => void;
}

export default forwardRef((props: Props, ref: any) => {
  const { t } = useTranslation();
  const { dataFilterList, onDelete, onFavorite, onChoose } = props;

  const handleClickHeart = (id: string) => {
    onFavorite(id);
  };
  const dataFilterListSort = useMemo(() => {
    if (!isArray(dataFilterList)) {
      return [];
    }
    let result: any = [];
    const dataTrue = dataFilterList?.filter((el) => !!el.IsFavorite);
    const dataFalse = dataFilterList?.filter((el) => !el.IsFavorite);
    result = [...result, ...dataTrue, ...dataFalse];
    return result;
  }, [dataFilterList]);

  const renderFilterListItem = (item: any, index: number) => {
    const { Name: content, IsFavorite: isFavorite, Id: id } = item;
    return (
      <TouchableOpacity key={id} onPress={() => onChoose(item)} style={styles.content}>
        <AppText value={content} />
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => onDelete(index)} style={{ marginRight: padding.p24 }} hitSlop={{ top: 12, bottom: 12, right: 12, left: 12 }}>
            <MyIcon.Delete />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleClickHeart(item.Id)} hitSlop={{ top: 12, bottom: 12, right: 11, left: 11 }}>
            <Icon
              name={isFavorite ? 'heart' : 'hearto'}
              type="antdesign"
              size={16}
              color={isFavorite ? color.primary : color.subText}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <Modalize
      withHandle={false}
      modalHeight={ScreenHeight - 200 - useSafeAreaInsets().top}
      modalStyle={{ flex: 1, paddingHorizontal: padding.p16 }}
      HeaderComponent={() => {
        return (
          <View style={styles.header}>
            <AppText fontWeight="semibold" style={{ fontSize: fontSize.f16 }}>
              {t('lead:filter_list')}
            </AppText>
          </View>
        );
      }}
      ref={ref}>
      {dataFilterListSort?.map((el: any, index: any) => {
        return renderFilterListItem(el, index);
      })}
    </Modalize>
  );
});

export const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    padding: padding.p24,
  },
  searchWrapper: {
    borderWidth: 1,
    borderColor: color.grayLine,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: padding.p12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: padding.p10
  },
});
