import React, { FC, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Keyboard } from 'react-native';
import { color, fontSize, padding, responsivePixel } from '@helpers/index';
import { AppText } from '@components/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import { Input } from 'react-native-elements/dist/input/Input';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import ButtonOrganization from './ButtonOrganization';
import { ItemOrganization, ItemOrganizationUnitList } from '@interfaces/dashboard.interface';
export interface AppFilterByOrganizationUnitProps {
  title: string;
  height?: number;
  onSelect: (item: ItemOrganization, listOrganizationChild: ItemOrganization[] | null) => void;
  idActive: string;
  arrOrganizationDropDown: ItemOrganization[];
  listOrganization: ItemOrganizationUnitList[];
  listOrganizationChild?: ItemOrganization[] | null;
}

const AppFilterByOrganizationUnit: FC<AppFilterByOrganizationUnitProps> = React.memo((props) => {
  const {
    title,
    height = ScreenHeight - 120,
    onSelect,
    idActive,
    arrOrganizationDropDown,
    listOrganization,
    listOrganizationChild,
  } = props;
  const { t } = useTranslation();
  const [data, setData] = useState<ItemOrganization[]>([]);
  const [type, setType] = useState<'DropDown' | 'Search'>('DropDown');
  const [dataSearch, setDataSearch] = useState<ItemOrganizationUnitList[]>([]);
  const [isShowIconBack, setShowIconBack] = useState<boolean>(false);

  useEffect(() => {
    setDataSearch(listOrganization);
  }, [listOrganization]);

  useEffect(() => {
    if (listOrganizationChild != null) {
      setData(listOrganizationChild);
      setShowIconBack(true);
      return;
    }
    setData(arrOrganizationDropDown);
  }, [arrOrganizationDropDown, listOrganizationChild]);

  const onFilterByOrganization = (item: ItemOrganization) => {
    onSelect(item, isShowIconBack ? data : null);
  };
  const onSearch = (text: string) => {
    if (text === '') {
      setDataSearch(listOrganization);
    } else {
      setDataSearch(
        listOrganization.filter((item, index) => {
          return item.displayName.toLocaleLowerCase().includes(text.toLocaleLowerCase());
        }),
      );
    }
  };

  const onBackToParentList = () => {
    setData(arrOrganizationDropDown);
    setShowIconBack(false);
  };
  const onNextToChildList = (item: ItemOrganization) => {
    setData([item]);
    setShowIconBack(true);
  };
  const renderContent = () => {
    if (type === 'DropDown') {
      return data.length > 0 ? (
        data?.map((el) => {
          return (
            <ButtonOrganization
              onNext={(item) => onNextToChildList(item)}
              level={0}
              key={el.id}
              data={el}
              idActive={idActive}
              listChild={el.children}
              isActive={idActive === el.id}
              onPress={(item) => onFilterByOrganization(item)}
              titleButton={el.label ?? ''}
            />
          );
        })
      ) : (
        <View />
      );
    } else {
      return dataSearch.length > 0 ? (
        dataSearch.map((item, index) => {
          const isActive = idActive === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={{ backgroundColor: isActive ? color.mainBlue200 : 'transparent', paddingHorizontal: padding.p12 }}
              onPress={() => {
                const itemFilter = {
                  children: null,
                  code: item.code,
                  id: item.id,
                  isVirtualNode: false,
                  label: item?.displayName || '',
                  parentId: item.parentId,
                  typeId: '',
                  typeName: null,
                };
                onFilterByOrganization(itemFilter);
              }}>
              <AppText
                fontSize={fontSize.f14}
                fontWeight={isActive ? 'semibold' : 'normal'}
                style={{
                  padding: padding.p10,
                  color: isActive ? color.primary : color.text,
                }}>
                {item?.displayName}
              </AppText>
            </TouchableOpacity>
          );
        })
      ) : (
        <View />
      );
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: useSafeAreaInsets().bottom,
          height: height,
        },
      ]}>
      <View style={styles.titleStyles}>
        {type === 'DropDown' && isShowIconBack && (
          <View style={{ position: 'absolute', left: padding.p16, bottom: 0 }}>
            <Icon
              hitSlop={styles.hitSlop}
              onPress={onBackToParentList}
              name={'left'}
              type="antdesign"
              size={20}
              color={color.primary}
            />
          </View>
        )}
        <AppText fontSize={fontSize.f16} fontWeight="semibold" value={title} />
      </View>

      <Input
        onTouchStart={() => {
          Keyboard.dismiss();
          setType('Search');
        }}
        inputStyle={{ minHeight: responsivePixel(32) }}
        leftIconContainerStyle={{ marginVertical: 0, height: responsivePixel(28) }}
        style={{ fontSize: fontSize.f12 }}
        inputContainerStyle={{
          borderWidth: 1,
          borderColor: color.grayLine,
          borderRadius: 5,
          paddingHorizontal: 8,
          marginTop: padding.p24,
          marginBottom: padding.p12,
          marginHorizontal: padding.p8,
        }}
        onChangeText={onSearch}
        placeholderTextColor={color.subText}
        placeholder={t('input:input_search_organization')}
        renderErrorMessage={false}
        leftIcon={<Icon name="search" size={18} color={color.icon} />}
      />
      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>{renderContent()}</ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  titleStyles: {
    paddingTop: padding.p24,
    alignItems: 'center',
  },
  hitSlop: {
    top: 8,
    right: 8,
    left: 8,
    bottom: 8,
  },
});
export default AppFilterByOrganizationUnit;
