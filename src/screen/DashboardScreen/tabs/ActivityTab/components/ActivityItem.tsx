import React, { FC, memo, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { AppText } from '@components/index';
import { color, fontSize, padding } from '@helpers/index';
import { MyIcon } from '@components/Icon';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { DATE_TIME_FORMAT, TaskType, TypeFieldExtension } from '@helpers/constants';
import { ItemListTask } from '@interfaces/dashboard.interface';
import serviceUrls from '@services/serviceUrls';
import { apiGet } from '@services/serviceHandle';
import { useNavigation } from '@react-navigation/native';
import { AppRoutes } from '@navigation/appRoutes';
import AppMenu, { ItemAppMenuProps } from '@components/AppMenu';
import { ResponseReturn } from '@interfaces/response.interface';
import { ContactPhoneActivity } from '@interfaces/contact.interface';
import { ItemLocates } from '@interfaces/lead.interface';
export interface ActivityItemProps {
  item: ItemListTask;
  pressCompleted: () => void;
  pressCheck: () => void;
  isLast: boolean;
}

const ActivityItem: FC<ActivityItemProps> = memo((props) => {
  const {
    completed,
    title,
    beginTime,
    endTime,
    type,
    id,
    isCheckIn,
    isCheckOut,
    place,
    locates,
    root,
    name,
    ownerName,
    description,
    duration,
  } = props.item;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isAppointment = type !== TaskType.callPhone && type !== TaskType.callPrice && type !== TaskType.sendEmail;
  const [data, setData] = useState<ItemAppMenuProps[]>([]);
  let locatesCheckIn: ItemLocates | null = null;
  let locatesCheckOut: ItemLocates | null = null;
  let totalTime: string | null = null;
  const findCheckIn = locates.findIndex((x) => x.type === 1);
  const findCheckOut = locates.findIndex((x) => x.type === 2);
  locatesCheckIn = findCheckIn > -1 ? locates[findCheckIn] : null;
  locatesCheckOut = findCheckOut > -1 ? locates[findCheckOut] : null;
  if (locatesCheckIn && locatesCheckOut) {
    const durationMin = dayjs(locatesCheckOut.creationTime).diff(locatesCheckIn.creationTime, 'minutes');
    const durationHours = dayjs(locatesCheckOut.creationTime).diff(locatesCheckIn.creationTime, 'hours');
    const durationSec = dayjs(locatesCheckOut.creationTime).diff(locatesCheckIn.creationTime, 'seconds');

    totalTime = `${durationHours !== 0 ? `${durationHours} ${t('label:hours')} ` : ''}${
      durationMin !== 0 ? `${durationMin - durationHours * 60} ${t('label:minutes')} ` : ''
    }${durationSec !== 0 ? `${durationSec - durationMin * 60} ${t('title:second')} ` : ''}`;
  }
  useEffect(() => {
    const getPhoneList = async () => {
      try {
        const url = serviceUrls.path.getPhoneTask + id;
        const response: ResponseReturn<ContactPhoneActivity[]> = await apiGet(url, {});
        if (response.error) {
          setData([]);
          return;
        }
        if (response.response && response.response.data && response.response.data.length > 0) {
          const arr: ItemAppMenuProps[] = [];
          for (let index = 0; index < response.response.data.length; index++) {
            const element = response.response.data[index];
            if (element.phoneNumber.length > 0) {
              for (let jndex = 0; jndex < element.phoneNumber.length; jndex++) {
                const elementChild = element.phoneNumber[jndex];
                const obj: ItemAppMenuProps = {
                  title: elementChild.phoneNumber.trim(),
                  function: () => {
                    const phone = `${elementChild.countryCode}${elementChild.phoneNational}`;
                    const phoneShow = elementChild.phoneE164;
                    navigation.navigate(AppRoutes.CALL, {
                      name: name,
                      phone: phone,
                      phoneShow: phoneShow,
                    });
                  },
                  titleStyle: { color: element.isMain ? color.navyBlue : color.black },
                  icon: <MyIcon.CallModal />,
                };
                arr.push(obj);
              }
            }
          }
          setData(arr);
        }
      } catch (error) {}
    };
    getPhoneList();
  }, [id]);

  const renderTextLine = (subTitle: string, context: string) => {
    return (
      <AppText numberOfLines={2} fontSize={fontSize.f13} style={[styles.text, { opacity: completed ? 0.3 : 1 }]}>
        <AppText fontWeight="semibold">{subTitle}: </AppText>
        {context}
      </AppText>
    );
  };

  const getLocation = () => {
    if ((!isCheckOut && !isCheckIn) || completed) {
      return renderTextLine(t('lead:place'), place || '');
    }
    if (!completed && !isCheckOut && isCheckIn) {
      return locatesCheckIn ? renderTextLine('Check in', locatesCheckIn?.place || '') : null;
    }
    if (isCheckOut) {
      return (
        <>
          {locatesCheckOut ? renderTextLine('Check out', locatesCheckOut?.place || '') : null}
          {totalTime ? renderTextLine(t('label:totalTime'), totalTime || '') : null}
        </>
      );
    }
  };
  const renderCall = () => {
    return (
      <>
        {data.length === 1 ? (
          <TouchableOpacity
            style={styles.formCall}
            onPress={() => {
              data[0].function();
            }}>
            <MyIcon.CallActivity />
            <AppText style={styles.textFormCall} value={t('business:call').toString()} fontSize={fontSize.f12} />
          </TouchableOpacity>
        ) : (
          <AppMenu position="right" data={data}>
            <View style={styles.formCall}>
              <MyIcon.CallActivity />
              <AppText style={styles.textFormCall} value={t('business:call').toString()} fontSize={fontSize.f12} />
            </View>
          </AppMenu>
        )}
        {!completed && (
          <TouchableOpacity style={styles.formFinish} onPress={() => props.pressCompleted()}>
            <MyIcon.FinishActivity />
            <AppText style={styles.textFormFinish} value={t('business:done').toString()} fontSize={fontSize.f12} />
          </TouchableOpacity>
        )}
      </>
    );
  };

  const renderRoot = () => {
    switch (root) {
      case 1:
        return 'DE';
      case 2:
        return 'DN';
      case 3:
        return 'LE';
      case 5:
        return 'LH';
      default:
        return 'LE';
    }
  };

  const getType = () => {
    switch (root) {
      case 1:
        return TypeFieldExtension.deal;
      case 2:
        return TypeFieldExtension.corporate;
      case 3:
        return TypeFieldExtension.lead;
      case 5:
        return TypeFieldExtension.deal;
      default:
        return 'LE';
    }
  };

  const renderAppointmentInfo = (status: 'Check out' | 'Check in') => {
    return (
      <>
        {!completed && !isCheckOut ? (
          <TouchableOpacity style={styles.buttonMarker} onPress={() => props.pressCheck()}>
            <View style={styles.formCheck}>
              <MyIcon.MapMarker />
              <AppText
                numberOfLines={1}
                style={{ paddingHorizontal: padding.p4 }}
                fontSize={fontSize.f12}
                color={color.primary}>
                {status}
              </AppText>
            </View>
          </TouchableOpacity>
        ) : null}
      </>
    );
  };
  const renderIcon = (icon: TaskType) => {
    let iconType = <MyIcon.EmailActivity fill={completed ? color.subText : color.primary} />;
    switch (icon) {
      case TaskType.sendEmail:
        iconType = <MyIcon.EmailActivity fill={completed ? color.subText : color.primary} />;
        break;
      case TaskType.callPrice:
        iconType = <MyIcon.PriceActivity fill={completed ? color.subText : color.primary} />;
        break;
      case TaskType.meeting:
        iconType = (
          <Icon
            type="material-community"
            name="account-group-outline"
            size={16}
            color={completed ? color.subText : color.primary}
          />
        );
        break;
      case TaskType.demoProduct:
        iconType = <MyIcon.DemoProduct fill={completed ? color.subText : color.primary} />;
        break;
      case TaskType.meetCustomer:
        iconType = <MyIcon.CalendarActivity fill={completed ? color.subText : color.primary} />;
        break;
      case TaskType.callPhone:
        iconType = <MyIcon.CallActivity fill={completed ? color.subText : color.primary} />;
        break;
      case TaskType.other:
        iconType = <MyIcon.ListAltActivity fill={completed ? color.subText : color.primary} />;
        break;
    }
    return iconType;
  };

  return (
    <View style={[styles.contentContainer, props.isLast && { borderBottomEndRadius: 8, borderBottomStartRadius: 8 }]}>
      <View style={styles.boxIcon}>
        {renderIcon(type)}
        <View style={styles.bar} />
      </View>

      <View style={{ flex: 1 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate(AppRoutes.DETAIL_MEETING, { id, type: getType() });
          }}>
          <AppText
            fontSize={fontSize.f14}
            fontWeight="semibold"
            style={[styles.time, { opacity: completed ? 0.3 : 1 }]}>
            {isAppointment
              ? `${dayjs(beginTime).format(DATE_TIME_FORMAT)} - ${dayjs(endTime).format(DATE_TIME_FORMAT)}`
              : duration
              ? dayjs(duration).format(DATE_TIME_FORMAT)
              : t('label:emptyName')}
          </AppText>
          <AppText
            fontSize={fontSize.f14}
            fontWeight="semibold"
            style={[styles.text, { opacity: completed ? 0.3 : 1 }]}>
            {title}
          </AppText>
          {renderTextLine(renderRoot(), name)}
          {renderTextLine(t('business:performer'), ownerName)}
          {isAppointment ? (
            getLocation()
          ) : (
            <View>{renderTextLine(t('label:description'), `${description || ''}\n`)}</View>
          )}
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
          {isAppointment ? renderAppointmentInfo(isCheckIn ? 'Check out' : 'Check in') : null}
          {renderCall()}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    paddingVertical: padding.p12,
    paddingHorizontal: padding.p8,
    backgroundColor: color.white,
  },
  title: {
    fontSize: fontSize.f14,
    paddingBottom: padding.p16,
    alignItems: 'center',
  },
  boxText: { height: padding.p40, justifyContent: 'flex-start' },
  bar: { width: 2, flex: 1, backgroundColor: color.solitude, marginRight: 2, marginTop: padding.p4 },
  time: { paddingBottom: padding.p8 },
  text: { paddingBottom: padding.p4 },
  boxIcon: { alignItems: 'center', marginRight: padding.p8, paddingTop: padding.p3 },
  buttonMarker: { flexDirection: 'row', alignItems: 'center' },
  formCall: {
    borderWidth: 1,
    borderColor: '#3B7DE3',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: padding.p8,
    paddingVertical: padding.p4,
  },
  formFinish: {
    borderWidth: 1,
    borderColor: '#3B7DE3',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: padding.p8,
    paddingVertical: padding.p4,
  },
  textFormCall: { color: color.primary, paddingHorizontal: padding.p4 },
  textFormFinish: { color: color.primary, paddingHorizontal: padding.p4 },
  formCheck: {
    borderWidth: 1,
    borderColor: '#3B7DE3',
    borderRadius: 3,
    flexDirection: 'row',
    paddingHorizontal: padding.p4,
    paddingVertical: padding.p4,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemCheckContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  mh8: { marginHorizontal: padding.p8 },
});

export default ActivityItem;
