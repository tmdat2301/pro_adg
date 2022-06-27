import React, { useContext, useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View, Linking, Clipboard } from 'react-native';
import { color, padding } from '@helpers/index';
import { AppText } from '@components/index';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import ItemHistoryCall from './components/ItemHistoryCall';
import ItemPhoneContact from './components/ItemPhoneContact';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/core';
import NameContact from './components/NameContact';
import { apiGet } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import { isArray } from 'lodash';
import { CallActivityItem, LeadMobileItem, LeadSearchContactItem } from '@interfaces/contact.interface';
import { ResponseReturn } from '@interfaces/response.interface';
import { DetailContact } from '@interfaces/detailContact.interface';
import { AppContext } from '@contexts/index';
import Toast from 'react-native-toast-message';
import { AppRoutes } from '@navigation/appRoutes';
import { TypeCriteria } from '@helpers/constants';
import { Modalize } from 'react-native-modalize';
import ModalAudio from '@components/ModalAudio';

export enum TypeDetails {
  DetailsLead = 3,
  DetailsContact = 5,
  DetailsInterprise = 2,
  DetailsDeal = 1,
}

const ContactScreen = (props: any) => {
  const route = useRoute();

  const params = route.params as LeadSearchContactItem;

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const { t } = useTranslation();
  const [dataDetail, setDataDetail] = useState<any[]>([]);
  const bottomSheetModalRef = useRef<Modalize>(null);
  const [urlAudio, setUrlAudio] = useState<string>('');
  const name = params?.name ?? '';
  const phones = params?.phones ?? '';
  const id = params?.id ?? '';

  const checkType = (type: TypeCriteria) => {
    switch (type) {
      case TypeCriteria.lead:
        return 'lead';
      case TypeCriteria.corporate:
        return 'corporate';
      case TypeCriteria.deal:
        return 'deal';
      default:
        return 'contact';
        break;
    }
  };

  const checkTypeNavigation = (type: TypeCriteria, idNumber: number) => {
    console.log("idNumber", idNumber);

    switch (type) {
      case TypeCriteria.lead:
        navigation.navigate(AppRoutes.DETAIL_LEAD, { key: idNumber, isGoback: true });
        break;
      case TypeCriteria.corporate:
        navigation.navigate(AppRoutes.DETAIL_CORPORATE, { key: idNumber, isGoback: true });
        break;
      case TypeCriteria.deal:
        navigation.navigate(AppRoutes.DETAIL_DEAL, { key: idNumber, isGoback: true });
        break;
      case TypeCriteria.contact:
        navigation.navigate(AppRoutes.DETAIL_CONTACT, { key: idNumber, isGoback: true });
        break;
    }
  };

  useEffect(() => {
    const callApiDetail = async () => {
      try {
        appContext.setLoading(true);
        const response: ResponseReturn<DetailContact[]> = await apiGet(
          `${serviceUrls.path.contactDetail(checkType(params.type))}/${id}`,
          {
            isDetail: false,
            interactiveType: 5,
          },
        );
        if (!response.error && response.response) {
          if (response.response.data) {
            setDataDetail(response.response.data);
          }
        } else {
          Toast.show({
            type: 'error',
            text1: t('lead:notice'),
            text2: response.errorMessage || response.detail || t('error:some_thing_wrong'),
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: t('lead:notice'),
          text2: t('title:error_getData'),
        });
      } finally {
        appContext.setLoading(false);
      }
    };
    callApiDetail();
  }, []);

  const onCall = () => {
    if (isArray(phones)) {
      let phone = `${phones[0].countryCode}${phones[0].phoneNational}`;
      let phoneShow = phones[0].phoneE164;

      const mainPhoneIndex = phones.findIndex((elm) => elm.isMain);
      if (mainPhoneIndex !== -1) {
        phone = `${phones[mainPhoneIndex].countryCode}${phones[mainPhoneIndex].phoneNational}`;
        phoneShow = phones[mainPhoneIndex].phoneE164;
      }
      navigation.navigate(AppRoutes.CALL, { name: params.name, phone: phone, phoneShow: phoneShow });
    }
  };

  const openAudio = (url: string) => {
    setUrlAudio(url);
    bottomSheetModalRef.current?.open();
  };

  const copyToClipboard = () => {
    if (isArray(phones)) {
      let phone = phones[0].phoneE164;
      const mainPhoneIndex = phones.findIndex((elm) => elm.isMain);
      if (mainPhoneIndex !== -1) {
        phone = phones[mainPhoneIndex].phoneE164;
      }
      Clipboard.setString(phone);
      Toast.show({ type: 'success', text1: t('lead:notice'), text2: t('title:success') });
    }
  };

  const renderItemCall = ({ item, index }: { item: DetailContact; index: number }) => {
    return (
      <ItemHistoryCall
        playIcon={() => openAudio(item.urlAudio)}
        callTime={item.creationTime}
        startTime={item.creationTime}
        creationTime={item.creationTime}
        endTime={item.creationTime}
        callType={item.callType}
        status={item.callTypeAsString}
        urlAudio={item.urlAudio}
      />
    );
  };

  const renderListPhoneNumber = (listPhone: string[]) => {
    return (
      <View>
        <View style={styles.formNumberPhone}>
          <Icon name="phone" type="antdesign" color={color.icon} size={18} style={styles.iconPhoneContent} />
          <AppText style={styles.textPhoneContent}>{t('title:phone_number')}</AppText>
        </View>
        {listPhone.map((item, index) => (
          <ItemPhoneContact phoneContact={item} />
        ))}
        <View style={styles.formHistoryCall}>
          <View>
            <Icon name="history" type="MaterialIcons" color={color.icon} size={20} style={styles.iconHistoryCall} />
          </View>
          <AppText style={styles.textHistoryCall}>{t('title:history_call')}</AppText>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient locations={[0.3518, 0.738, 1]} colors={[color.primary900, color.primary790, color.primary700]}>
        <View style={[styles.formHead, { paddingTop: Math.max(insets.top, padding.p20) }]}>
          <TouchableOpacity style={styles.topHead} onPress={() => navigation.goBack()}>
            <Icon name="left" type="antdesign" size={24} color={color.white} />
            <AppText style={styles.textTopHead}>{t('title:contact')}</AppText>
          </TouchableOpacity>
          <View style={styles.centerHead}>
            <View style={styles.formAvatar}>
              <Icon name="user" type="antdesign" color={color.white} size={28} />
            </View>
            <NameContact onNavigation={() => checkTypeNavigation(params.type, params.id)} nameContact={name} />
          </View>
          <View style={styles.footerHead}>
            <TouchableOpacity style={styles.formIconFooter} onPress={onCall}>
              <Icon name="phone" type="antdesign" color={color.primary} size={18} />
            </TouchableOpacity>
            <TouchableOpacity onPress={copyToClipboard} style={[styles.formIconFooter, { marginHorizontal: 35 }]}>
              <Icon name="content-copy" type="MaterialIcons" color={color.primary} size={18} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.formIconFooter}
              onPress={() => Linking.openURL('mailto:onbd123456@gmail.com')}>
              <MaterialIcon name="email-outline" color={color.primary} size={18} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.viewCenter} />
      </LinearGradient>
      <View style={styles.formContent}>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          ListHeaderComponent={() => renderListPhoneNumber(phones.map((item: LeadMobileItem) => item?.phoneE164 || ''))}
          data={dataDetail}
          renderItem={renderItemCall}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
      <Modalize adjustToContentHeight ref={bottomSheetModalRef}>
        {!!urlAudio && <ModalAudio urlAudio={urlAudio || ''} />}
      </Modalize>
    </View>
  );
};
export default ContactScreen;
