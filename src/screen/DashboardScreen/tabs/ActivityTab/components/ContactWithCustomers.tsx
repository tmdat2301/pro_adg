import React, { FC } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { color, fontSize, padding } from '@helpers/index';
import AppText from '@components/AppText';
import { MyIcon } from '@components/Icon';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/reducers';

export interface ContactWithCustomersProps {}

const ContactWithCustomers: FC<ContactWithCustomersProps> = React.memo((props) => {
  const { t } = useTranslation();
  const { objTaskSummary } = useSelector((state: RootState) => state.activityReducer);
  const renderAverageContactTime = () => {
    const { averageTime } = objTaskSummary;
    const time = `${averageTime.hours} ${t('label:hours')} ${averageTime.minutes} ${t('label:minutes')} ${
      averageTime.seconds
    } ${t('title:second')}`;
    return (
      <View style={styles.boxContent}>
        <View style={styles.viewRowFlexStart}>
          <MyIcon.CalendarColor fill="black" />
          <AppText fontWeight="semibold" fontSize={fontSize.f14} style={styles.title}>
            {t('label:averageContactTime')}
          </AppText>
        </View>
        <AppText fontWeight="semibold" fontSize={fontSize.f14} color={color.primary}>
          {time}
        </AppText>
      </View>
    );
  };

  const renderAppointment = () => {
    return (
      <View style={styles.boxContent}>
        <AppText fontSize={fontSize.f14} style={{ paddingBottom: padding.p8 }}>
          {t('label:appointment')}
        </AppText>
        <AppText fontWeight="semibold" fontSize={fontSize.f14}>
          {objTaskSummary.totalAppointment}
        </AppText>
      </View>
    );
  };

  const renderTimeTotal = () => {
    const { totalTime } = objTaskSummary;
    const time = `${totalTime.hours} ${t('label:hours')} ${totalTime.minutes} ${t('label:minutes')} ${
      totalTime.seconds
    } ${t('title:second')}`;
    return (
      <View style={styles.boxContentTotalTime}>
        <AppText fontSize={fontSize.f14} style={{ paddingBottom: padding.p8 }}>
          {t('label:totalTime')}
        </AppText>
        <AppText fontWeight="semibold" fontSize={fontSize.f14} style={{ paddingBottom: padding.p16 }}>
          {time}
        </AppText>
        <AppText fontSize={fontSize.f12} style={styles.textNote}>
          {t('translation:noteAppointment')}
        </AppText>
      </View>
    );
  };

  return (
    <View style={styles.contentContainer}>
      <AppText fontWeight="semibold" fontSize={fontSize.f14}>
        {t('label:contactWithCustomers')}
      </AppText>
      <ScrollView>
        {renderAverageContactTime()}
        {renderAppointment()}
        {renderTimeTotal()}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  contentContainer: { paddingHorizontal: padding.p4 },
  boxContent: {
    alignItems: 'center',
    borderBottomColor: color.lightGrayBorder,
    borderBottomWidth: 1,
    paddingVertical: padding.p16,
  },
  boxContentTotalTime: {
    alignItems: 'center',
    paddingTop: padding.p16,
  },
  title: {
    fontSize: fontSize.f14,
    paddingBottom: padding.p16,
    alignItems: 'center',
  },
  textNote: {
    paddingBottom: padding.p8,
    alignSelf: 'flex-start',
    fontStyle: 'italic',
  },
  viewRowFlexStart: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});

export default ContactWithCustomers;
