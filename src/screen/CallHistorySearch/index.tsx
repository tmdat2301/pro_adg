import AppText from '@components/AppText';
import { responsivePixel } from '@helpers/index';
import color from '@helpers/color';
import fontSize from '@helpers/fontSize';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';
import { Input } from 'react-native-elements/dist/input/Input';
import Icon from 'react-native-vector-icons/AntDesign';
import { useTranslation } from 'react-i18next';
import styles from './styles';
import { useNavigation } from '@react-navigation/core';
import Back from 'react-native-vector-icons/AntDesign';
import { MyIcon, TabIcon } from '@components/Icon';
import { apiGet } from '@services/serviceHandle';
import { LeadSearchContactItem } from '@interfaces/contact.interface';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppRoutes } from '@navigation/appRoutes';
import serviceUrls from '@services/serviceUrls';
import { ScreenHeight } from 'react-native-elements/dist/helpers';


const CallHistorySearch = () => {
  const search = async () => {
    setIsLoading(true)
    try {
      if (text.length === 0) {
        return;
      }
      const response = await apiGet(serviceUrls.path.searchPhone, {
        skipCount: 1,
        maxResultCount: 7,
        filter: text,
      });

      if (!response.error) {
        setData(response.response.data.items);
      }
    } catch (error) { }
    finally {
      setIsLoading(false)
    }
  };
  const [data, setData] = useState<LeadSearchContactItem[]>([]);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      search();
    }, 600);
    return () => clearTimeout(delayDebounceFn);
  }, [text]);

  const renderIconType = (type: number) => {
    if (type === 2) {
      return <TabIcon.Enterprise fill={color.icon} size={18} />;
    }

    if (type === 3) {
      return <MyIcon.User fill={color.icon} size={18} />;
    }
    if (type === 5) {
      return <TabIcon.Contact fill={color.icon} size={18} />;
    } else {
      return;
    }
  };

  const renderCallSearch = (item: LeadSearchContactItem) => {
    return (
      <TouchableOpacity style={styles.container} onPress={() => navigation.navigate(AppRoutes.DETAIL_PHONEBOOK, item)}>
        <View style={styles.userIcon}>{renderIconType(item.type)}</View>
        <View style={styles.viewItem}>
          <View style={{ flex: 1 }}>
            <AppText numberOfLines={2} style={styles.textName}>
              {item.name.length > 0 ? item.name : t('label:emptyName')}
            </AppText>
            {item.phones.length > 0 &&
              item.phones.map((v, i) => {
                return (
                  <AppText key={v.phoneE164} numberOfLines={1} style={styles.textPhone}>
                    {'(+' + v.countryCode.toString() + ')' + v.phoneNumber.slice(1)}
                  </AppText>
                );
              })}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderLoading = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator size="large" color={color.grayShaft} />
      </View>
    ) : (
      <View />
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
          <Back name="left" size={fontSize.f24} color={color.primary} />
        </TouchableOpacity>

        <View style={styles.input}>
          <Input
            autoFocus={true}
            value={text}
            inputStyle={{ minHeight: responsivePixel(32) }}
            leftIconContainerStyle={{ marginVertical: 0, height: responsivePixel(28) }}
            rightIconContainerStyle={{ marginVertical: 0, height: responsivePixel(24) }}
            style={{ fontSize: fontSize.f12, paddingVertical: 0 }}
            inputContainerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
            onChangeText={(text) => {
              setText(text);
            }}
            // keyboardType={'phone-pad'}
            placeholderTextColor={color.subText}
            placeholder={t('input:input_call_history')}
            renderErrorMessage={false}
            rightIcon={
              text.length > 0 && (
                <Icon
                  name="closecircle"
                  size={13}
                  color={color.icon}
                  onPress={() => {
                    setText('');
                  }}
                />
              )
            }
            leftIcon={<MyIcon.IconSearch size={13} color={color.icon} />}
          />
        </View>
      </View>
      {renderLoading()}
      <FlatList
        data={data}
        extraData={data}
        keyExtractor={(item, index) => item.id.toString() + index.toString()}
        renderItem={({ item }) => renderCallSearch(item)}
      />
    </SafeAreaView>
  );
};
export default CallHistorySearch;
