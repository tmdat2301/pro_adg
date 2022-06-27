import AppFilterByOrganizationUnit from '@components/AppFilterByOrganizationUnit';
import { MyIcon } from '@components/Icon';
import { AppHeader, AppText, SelectButton } from '@components/index';
import { AppContext } from '@contexts/index';
import { color, fontSize, padding, responsivePixel } from '@helpers/index';
import { ItemOrganization, ItemOrganizationList } from '@interfaces/dashboard.interface';
import { UserDetailModel, UserSearch } from '@interfaces/profile.interface';
import { ResponseReturn } from '@interfaces/response.interface';
import { useNavigation } from '@react-navigation/native';
import { setUserFilter } from '@redux/actions/filterActions';
import { RootState } from '@redux/reducers';
import { apiGet } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import _ from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Input } from 'react-native-elements/dist/input/Input';
import { FlatList } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles';

const SearchUserByOrganization = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const appContext = useContext(AppContext);

  const filterReducer = useSelector((state: RootState) => state.filterReducer);
  const [organizationUnit, setOrganizationUnit] = useState<ItemOrganization | ItemOrganizationList | null>(
    filterReducer.organizationActivity || filterReducer.currentOrganization,
  );

  const [text, setText] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [dataSearch, setDataSearch] = useState<UserSearch[]>([]);
  const [userSelected, setUser] = useState<UserDetailModel | null>(filterReducer.filterUser || null);
  const bottomSheetModalRef = useRef<Modalize>(null);
  const [isLoading, setIsLoading] = useState(true);
  const onFilter = async () => {
    const url = `${serviceUrls.path.findUser}${organizationUnit?.id}`;
    setIsLoading(true);
    try {
      const params = {
        search: text,
        orgId: organizationUnit?.id,
        isExternal: false,
      };
      const response: ResponseReturn<UserSearch[]> = await apiGet(url, params);
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
    const delayDebounceFn = setTimeout(() => {
      onFilter();
    }, 600);
    return () => clearTimeout(delayDebounceFn);
  }, [text, organizationUnit]);

  const onSearch = (value: string) => {
    setText(value);
  };

  const renderUserItem = (item?: UserDetailModel) => {
    const isActive = item?.id === userSelected?.id;
    return (
      <TouchableOpacity
        onPress={() => setUser(item || null)}
        style={{ paddingHorizontal: padding.p16, backgroundColor: isActive ? color.mainBlue200 : 'transparent' }}>
        <View style={[styles.textContainer, { backgroundColor: 'transparent' }]}>
          {item ? (
            <>
              <AppText
                color={isActive ? color.mainBlue : color.text}
                fontSize={fontSize.f14}
                style={{ marginVertical: padding.p4 }}>
                {item?.userName || ''}
              </AppText>
              <AppText fontSize={fontSize.f12} color={isActive ? color.mainBlue : color.subText}>
                {item?.email || ''}
              </AppText>
            </>
          ) : (
            <AppText color={isActive ? color.mainBlue : color.text} fontSize={fontSize.f14}>
              {t('label:all')}
            </AppText>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderLoading = () => {
    return isLoading ? (
      <View style={{ paddingVertical: padding.p8 }}>
        <ActivityIndicator size="small" color={color.grayShaft} />
      </View>
    ) : (
      <View />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        iconLeft={<MyIcon.Close />}
        iconRight={<Icon type="materialIcons" name="done" size={28} color={color.icon} />}
        title={t('business:chooseStaff')}
        iconLeftPress={() => navigation.goBack()}
        iconRightPress={() => {
          dispatch(setUserFilter(userSelected, organizationUnit));
          navigation.goBack();
        }}
      />
      <View style={{ alignItems: 'center' }}>
        <SelectButton
          onPress={() => bottomSheetModalRef.current?.open()}
          titleStyle={{ color: color.subText, fontFamily: 'OpenSans-SemiBold' }}
          themeColor={color.subText}
          title={organizationUnit?.label ?? ''}
        />
      </View>
      <Input
        inputStyle={{ minHeight: responsivePixel(32), color: color.text }}
        leftIconContainerStyle={{ marginVertical: 0, height: responsivePixel(28) }}
        style={{ fontSize: fontSize.f12 }}
        inputContainerStyle={{
          borderWidth: 1,
          borderColor: color.grayLine,
          borderRadius: 5,
          paddingHorizontal: 8,
          marginTop: padding.p24,
          marginBottom: padding.p4,
          marginHorizontal: padding.p4,
        }}
        onChangeText={onSearch}
        placeholderTextColor={color.subText}
        placeholder={t('input:input_search_organization')}
        renderErrorMessage={false}
        leftIcon={<Icon name="search" size={18} color={color.icon} />}
      />
      {renderLoading()}
      <FlatList
        keyExtractor={(item, index) => item.id || index.toString()}
        ListHeaderComponent={renderUserItem()}
        data={dataSearch}
        renderItem={({ item, index }) => renderUserItem(item)}
      />
      <Modalize adjustToContentHeight withHandle={false} ref={bottomSheetModalRef}>
        <AppFilterByOrganizationUnit
          listOrganization={filterReducer.organizationList || []}
          arrOrganizationDropDown={filterReducer.arrOrganizationDropDownDashboard}
          idActive={organizationUnit?.id ?? ''}
          onSelect={(item: ItemOrganization | ItemOrganizationList) => {
            bottomSheetModalRef.current?.close();
            setOrganizationUnit(item);
          }}
          height={ScreenHeight - 180}
          title={t('title:select_organization')}
        />
      </Modalize>
    </SafeAreaView>
  );
};

export default SearchUserByOrganization;
