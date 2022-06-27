import AppText from '@components/AppText';
import { TypeSearch } from '@helpers/constants';
import { color, fontSize, padding, responsivePixel } from '@helpers/index';
import { NavigationSearch, QuickSearchModel, SearchItems } from '@interfaces/quickSearch.interface';
import { ResponseReturn } from '@interfaces/response.interface';
import { useNavigation } from '@react-navigation/core';
import { apiPost } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { Input } from 'react-native-elements/dist/input/Input';
import { default as Back, default as RightIcon } from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppRoutes } from '../../navigation/appRoutes';
import styles from './styles';
import Toast from 'react-native-toast-message';
import { MyIcon } from '@components/Icon';

interface IListSearchProps extends NavigationSearch { }

const ListSearch = (props: IListSearchProps) => {
  const [text, setText] = useState('');
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isLoadingMore, setIsLoadingMore] = useState(true);
  const [isLoadingRefresh, setIsLoadingRefresh] = useState(true);
  const [pageData, setPageData] = useState(0);
  const [totalItem, setTotalItem] = useState(0);
  const [data, setData] = useState<SearchItems[]>([]);

  const type = props.route.params.type;

  const getListSearch = async () => {
    try {
      if (text.length === 0) {
        setData([]);
        setIsLoadingRefresh(false);
        setTotalItem(0);
        return;
      }
      setIsLoadingRefresh(true);
      const response: ResponseReturn<QuickSearchModel> = await apiPost(serviceUrls.path.getListSearch, {
        maxResultCount: 20,
        skipCount: pageData,
        textSearch: text,
      });
      if (!response.error && response.response && response.response.data) {
        setIsLoadingRefresh(false);
        setIsLoadingMore(true);
        setTotalItem(response.response.data[type].totalCount);
        if (pageData > 0) {
          setData(data.concat(response.response.data[type].items));
        } else {
          setData(response.response.data[type].items);
        }
      } else {
        Toast.show({
          type: 'error',
          text1: t('lead:notice'),
          text2: response.errorMessage || response.detail || '',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('lead:notice'),
        text2: JSON.stringify(error),
      });
    }
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getListSearch();
    }, 600);
    return () => clearTimeout(delayDebounceFn);

    // getCall();
  }, [pageData, text]);

  const renderLeadSearched = (item: SearchItems) => {
    const textName = item.name;
    const code = type === TypeSearch.deals ? item.ownerName || '---' : item.code;
    const phone = type === TypeSearch.deals ? item.code || '---' : item.phoneNumber;
    const email = type === TypeSearch.deals ? item.ouName || '---' : item.email;
    const owner = type === TypeSearch.deals ? '' : item.ownerName || '---';
    const product = type === TypeSearch.deals || type === TypeSearch.leads ? item.product : '' || '---';

    return (
      <TouchableOpacity
        style={{}}
        onPress={() => {
          switch (type) {
            case TypeSearch.leads:
              navigation.navigate(AppRoutes.DETAIL_LEAD, { key: item.id });
              break;
            case TypeSearch.contacts:
              navigation.navigate(AppRoutes.DETAIL_CONTACT, { key: item.id });
              break;
            case TypeSearch.deals:
              navigation.navigate(AppRoutes.DETAIL_DEAL, { key: item.id });
              break;
            case TypeSearch.accounts:
              navigation.navigate(AppRoutes.DETAIL_CORPORATE, { key: item.id });
              break;
            default:
              break;
          }
        }}>
        <View style={styles.container}>
          <View style={styles.stRow}>
            <AppText
              color={color.text}
              fontSize={fontSize.f14}
              fontWeight="semibold"
              numberOfLines={1}
              value={textName}
              style={{ marginBottom: padding.p4, paddingRight: padding.p4, flex: 1, textAlign: 'left' }}
            />
            <AppText
              color={color.text}
              style={{ marginBottom: padding.p4, flex: 1, textAlign: 'right' }}
              fontSize={fontSize.f13}
              numberOfLines={1}
              value={code}
            />
          </View>
          <View style={styles.ndRow}>
            <AppText
              color={color.text}
              style={{ marginBottom: padding.p4, flex: 1, textAlign: 'left' }}
              fontSize={fontSize.f13}
              numberOfLines={1}
              value={phone}
            />
            <AppText
              color={color.text}
              style={{ marginBottom: padding.p4, flex: 1, textAlign: 'right' }}
              fontSize={fontSize.f13}
              numberOfLines={1}
              value={email}
            />
          </View>
          <View style={styles.rdRow}>
            <AppText
              style={{ marginBottom: padding.p4, flex: 1 }}
              fontSize={fontSize.f13}
              color={color.subText}
              numberOfLines={1}
              value={product}
            />
            {type === TypeSearch.deals ? null : (
              <AppText
                color={color.text}
                style={{ marginBottom: padding.p4, flex: 1, textAlign: 'right' }}
                fontSize={fontSize.f13}
                numberOfLines={1}
                value={owner}
              />
            )}
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: color.centerborder, width: ScreenWidth }} />
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={{ backgroundColor: color.white, flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.back}>
          <Back name="left" size={fontSize.f24} color={color.icon} />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.5} style={styles.input}>
          <Input
            value={text}
            autoFocus
            inputStyle={{ minHeight: responsivePixel(32) }}
            leftIconContainerStyle={{ marginVertical: 0, height: responsivePixel(28) }}
            rightIconContainerStyle={{ marginVertical: 0, height: responsivePixel(28) }}
            style={{ fontSize: fontSize.f12, paddingVertical: 0 }}
            inputContainerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
            onChangeText={(txt) => {
              if (txt !== text) {
                setText(txt);
                setPageData(0);
                // setIsLoadingRefresh(true);
              }
            }}
            placeholderTextColor={color.subText}
            placeholder={t('input:input_lead_list')}
            renderErrorMessage={false}
            leftIcon={<MyIcon.IconSearch size={fontSize.f13} color={color.icon} />}
            rightIcon={
              text.length > 0 && (
                <RightIcon
                  name="closecircle"
                  size={13}
                  color={color.icon}
                  onPress={() => {
                    setText('');
                  }}
                />
              )
            }
          />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <AppText
          value={totalItem.toString()}
          color={color.text}
          fontSize={fontSize.f12}
          style={{ marginRight: padding.p4 }}
        />
        <AppText
          fontSize={fontSize.f12}
          color={color.subText}
          value={t('label:search_result').toString()}
          style={{ marginBottom: padding.p20, marginRight: padding.p15 }}
        />
      </View>
      {isLoadingRefresh && (
        <View style={{ backgroundColor: color.white }}>
          <ActivityIndicator color="gray" style={{ marginLeft: padding.p8 }} />
        </View>
      )}

      <FlatList
        data={data}
        extraData={data}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={({ item }) => renderLeadSearched(item)}
        ListFooterComponent={() => {
          if (data.length === totalItem) {
            return null;
          }
          return (
            <View style={{ backgroundColor: color.white }}>
              <ActivityIndicator color="gray" style={{ marginLeft: padding.p8 }} />
            </View>
          );
        }}
        onEndReached={() => {
          if (data.length >= totalItem) {
            setIsLoadingMore(false);
            return;
          }
          setPageData(pageData + 1);
        }}
        onEndReachedThreshold={1}
      />
    </SafeAreaView>
  );
};
export default ListSearch;
