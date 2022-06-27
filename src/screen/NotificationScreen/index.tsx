import React, { useContext, useEffect, useRef, useState } from 'react';
import AppText from '@components/AppText';
import { fontSize, color, padding } from '@helpers/index';
import styles from './styles';
import { View, TouchableOpacity, FlatList, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Andesign from 'react-native-vector-icons/AntDesign';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { ScreenNotification, SocketEvent, TypeIconNotification } from '@helpers/constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/reducers';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { cloneDeep } from 'lodash';
import { setNotificationUnread } from '@redux/actions/notificationActions';
import { MyIcon } from '@components/Icon';
import { AppRoutes } from '@navigation/appRoutes';
import { SocketContext, SocketIo } from '@services/socketHandle';
import Toast from 'react-native-toast-message';
require('dayjs/locale/vi');

dayjs.extend(relativeTime);
dayjs.locale('vi');

export interface Noti {
  title: string;
  content: string;
  duration: string;
}

const Notification = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [arrCurrent, setArrCurrent] = useState<any[]>([]);
  const [isLoadingRefresh, setIsLoadingRefresh] = useState(true);
  const [pageData, setPageData] = useState(1);
  const totalPage = useRef<number>(0);
  const notiReducer = useSelector((state: RootState) => state.notificationsReducer);

  const socketInstance = useContext<SocketIo>(SocketContext);

  const dispatch = useDispatch();

  const getData = () => {
    socketInstance.emitEvent(SocketEvent.EmitNotifications, { page: isLoadingRefresh ? 1 : pageData });
  };

  const onReadAll = () => {
    socketInstance.emitEvent(SocketEvent.ReadAllNotification, {});
  };

  useEffect(() => {
    socketInstance.listenEvent(SocketEvent.ViewAllResult, (event: any) => {
      if (event === true) {
        setIsLoadingRefresh(true);
        getData();
        dispatch(setNotificationUnread(0));
      } else {
        Toast.show({ type: 'error', text1: t('lead:notice'), text2: t('error:some_thing_wrong') });
      }
    });
    socketInstance.listenEvent(SocketEvent.OnNotifications, (event: any) => {
      const data = event.page === 1 ? event.results : [...arrCurrent, ...event.results];
      totalPage.current = event.totalPages;
      setArrCurrent(data);
      setIsLoadingRefresh(false);
    });
    socketInstance.listenEvent(SocketEvent.NewNotification, (event) => {
      const notifications = cloneDeep(arrCurrent);
      notifications.unshift(event);
      setArrCurrent(notifications);
    });
    return () => {
      socketInstance.offEvent(SocketEvent.OnNotifications);
      socketInstance.offEvent(SocketEvent.ViewAllResult);
    };
  }, [arrCurrent]);

  useEffect(() => {
    if (pageData > 1 || isLoadingRefresh) {
      getData();
    }
  }, [pageData, isLoadingRefresh]);

  const getInnerContent = (text: string, index: number) => {
    if (text.startsWith('[[')) {
      return (
        <AppText key={index.toString()} fontWeight="semibold">
          {text.replace('[[', '').replace(']]', '')}
        </AppText>
      );
    }
    if (text.startsWith('[{{')) {
      return (
        <AppText key={index.toString()} fontWeight="semibold" style={{ color: color.mainBlue }}>
          {text.replace('[{{', '').replace('}}]', '')}
        </AppText>
      );
    }
    return <AppText key={index.toString()}>{text}</AppText>;
  };

  const splitContent = (content: string) => {
    const convertContent = content
      .replace(/\[\[\[/g, '*[{{')
      .replace(/\]\]\]/, '}}]*')
      .replace(/\[\[/g, '*[[')
      .replace(/\]\]/, ']]*');
    const contentArray = convertContent.split('*');
    return <AppText style={{}}>{contentArray.map(getInnerContent)}</AppText>;
  };

  const getPageParams = (screenCode: string, type: string) => {
    const isLead = ['leadDetail', 'dealDetail'].includes(screenCode);
    const isContact = ['contactDetail', 'corporateDetail'].includes(screenCode);
    switch (type) {
      case '1':
        if (isLead) {
          return 4;
        }
        if (isContact) {
          return 5;
        }
        return 0;
      case '2':
        if (isLead) {
          return 5;
        }
        if (isContact) {
          return 6;
        }
        return 0;
      default:
        return 0;
    }
  };

  const handleViewNotification = (item: any, index: number) => {
    if (!item.viewed) {
      socketInstance.emitEvent(SocketEvent.SeenNotifications, { id: item.id });
      const data = cloneDeep(arrCurrent);
      data[index].viewed = true;
      dispatch(setNotificationUnread(notiReducer.notificationCount - 1));
      setArrCurrent(data);
    }
    handleNavigateNotification(item);
  };

  const handleNavigateNotification = (item: any) => {
    const type = item.type;
    const data: string[] = item.link.split('/');
    switch (type) {
      case TypeIconNotification.appointmentNotification:
        navigation.navigate(AppRoutes.DETAIL_MEETING, { id: item.reference_id, type: data[1] });
        break;
      case TypeIconNotification.taskNotification:
        navigation.navigate(AppRoutes.DETAIL_MEETING, { id: item.reference_id, type: data[1] });
        break;
      default:
        const screenCode: string = !data[1].includes('?') ? `${data[1]}Detail` : data[1].split('?')[0];
        if (ScreenNotification?.[screenCode]) {
          const params: { key?: number; page?: number; isGoback: boolean } = {};
          if (!data[1].includes('?')) {
            const paramsArr: any = data[2].split('?');

            params.key = Number(paramsArr[0]) || 0;
            if (paramsArr[1]) {
              params.page = getPageParams(screenCode, paramsArr[1].split('=')[1] || '');
            }
          }
          navigation.navigate(ScreenNotification?.[screenCode], { ...params, isGoback: true });
        }
        break;
    }
  };
  const changeIconType = (icon: TypeIconNotification) => {
    switch (icon) {
      case TypeIconNotification.appointmentNotification:
        return <MyIcon.CalendarActivity fill={color.textPhone} />;
      case TypeIconNotification.transferNotification:
        return <MyIcon.TransferNotification />;
      case TypeIconNotification.transferMultiNotification:
        return <MyIcon.TransferNotification />;
      case TypeIconNotification.sharingNotification:
        return <MyIcon.SharingMultiNotification />;
      case TypeIconNotification.sharingMultiNotification:
        return <MyIcon.SharingMultiNotification />;
      case TypeIconNotification.revokeMultiNotification:
        return <MyIcon.RevokeNotification />;
      case TypeIconNotification.revokeNotification:
        return <MyIcon.RevokeNotification />;
      case TypeIconNotification.taskNotification:
        return <MyIcon.NewDating />;
    }
  };

  const renderNotification = (item: any, index: number) => {
    const { content, title, viewed } = item;
    const duration = dayjs(item.created_date).locale('vi').fromNow();
    return (
      <TouchableOpacity
        style={[styles.item, { backgroundColor: !viewed ? color.notiBlue : color.white }]}
        onPress={() => handleViewNotification(item, index)}>
        <View style={{ paddingHorizontal: padding.p14 }}>{changeIconType(item.type)}</View>

        <View style={{ flex: 1, paddingTop: padding.p1 }}>
          <AppText
            value={title}
            fontSize={fontSize.f14}
            fontWeight="semibold"
            color={color.text}
            style={{ marginBottom: padding.p4 }}
          />
          {splitContent(content)}
          <View style={{ flexDirection: 'row' }}>
            <Andesign
              name="clockcircleo"
              size={fontSize.f10}
              color={color.icon}
              style={{ marginRight: padding.p8, paddingTop: padding.p3 }}
            />
            <AppText
              value={duration}
              fontSize={fontSize.f12}
              color={color.subText}
              style={{ marginBottom: padding.p12 }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const renderFooter = () => {
    return arrCurrent && arrCurrent.length > 0 && arrCurrent.length < notiReducer.notificationCount ? (
      <View>
        <ActivityIndicator size="large" color={color.grayShaft} />
      </View>
    ) : null;
  };

  const loadMoreNotification = () => {
    if (pageData < totalPage.current) {
      setPageData(pageData + 1);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.white }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{ marginLeft: padding.p14, flex: 1 }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Andesign name="close" size={fontSize.f20} color={color.icon} />
        </TouchableOpacity>
        <AppText
          style={{ flex: 1, textAlign: 'center' }}
          fontWeight="semibold"
          value={t('label:notice').toString()}
          color={color.text}
          fontSize={fontSize.f16}
        />
        <TouchableOpacity onPress={onReadAll} style={{ marginRight: padding.p14, flex: 1, alignItems: 'flex-end' }}>
          <AppText style={{ color: '#3B7DE3' }}>
            {t('title:read_all')}({notiReducer.notificationCount})
          </AppText>
        </TouchableOpacity>
      </View>
      <FlatList
        refreshing={isLoadingRefresh}
        onRefresh={() => {
          setPageData(1);
          setIsLoadingRefresh(true);
        }}
        data={arrCurrent}
        extraData={arrCurrent}
        keyExtractor={(item, index) => item?.id?.toString()}
        renderItem={({ item, index }) => {
          return renderNotification(item, index);
        }}
        style={{ backgroundColor: color.lightGray, paddingTop: padding.p8 }}
        onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 1}
        onEndReached={loadMoreNotification}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={() => {
          return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              {isLoadingRefresh ? null : <AppText value={'Empty Data'} />}
            </View>
          );
        }}
        maxToRenderPerBatch={10}
        initialNumToRender={6}
        updateCellsBatchingPeriod={500}
      />
    </SafeAreaView>
  );
};
export default Notification;
