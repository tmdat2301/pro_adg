import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { color, fontSize, padding, responsivePixel } from '@helpers/index';
import AppText from '@components/AppText';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'react-native-elements/dist/tooltip/Tooltip';
import { ItemReportTask } from '@interfaces/dashboard.interface';
import { MyIcon } from '@components/Icon';
import { isIOS } from 'react-native-elements/dist/helpers';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/reducers';

export interface BoxListActivityProps {
}

const BoxListActivity: FC<BoxListActivityProps> = React.memo((props) => {
  const activityReducer = useSelector((state: RootState) => state.activityReducer);
  const listActivityType = activityReducer.arrReportTask || [];
  const { t } = useTranslation();

  const renderColumnDone = (popover: string, iconNotDone: any, listData: ItemReportTask[]) => {
    return (
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <View style={[styles.columnItem, { paddingRight: padding.p42 }]}>
          <Tooltip
            popover={<AppText style={{ color: color.white, fontSize: fontSize.f12 }}>{popover}</AppText>}
            overlayColor={'transparent'}
            height={50}
            containerStyle={{ position: 'absolute', top: isIOS ? responsivePixel(112) : responsivePixel(90) }}
            backgroundColor={color.midnight}>
            <View>{iconNotDone}</View>
          </Tooltip>
          <View style={{ height: padding.p20 }} />
          {listData?.map((item, index) => (
            <View key={index.toString()} style={styles.boxText}>
              <AppText fontSize={fontSize.f14}>{item.complete}</AppText>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderColumn = (popover: string, iconDone: any, listData: ItemReportTask[]) => {
    return (
      <View style={[styles.columnItem]}>
        <Tooltip
          popover={<AppText style={{ color: color.white, fontSize: fontSize.f12 }}>{popover}</AppText>}
          overlayColor={'transparent'}
          height={50}
          containerStyle={{ position: 'absolute', top: isIOS ? responsivePixel(112) : responsivePixel(90) }}
          backgroundColor={color.midnight}>
          <View>{iconDone}</View>
        </Tooltip>
        <View style={{ height: padding.p20 }} />
        {listData?.map((item, index) => (
          <View key={index.toString()} style={styles.boxText}>
            <AppText fontSize={fontSize.f14} fontWeight="semibold">
              {item.unfinished}
            </AppText>
          </View>
        ))}
      </View>
    );
  };

  const renderListActivity = (title: string, listData: ItemReportTask[]) => {
    return (
      <View style={styles.listActivity}>
        <AppText fontWeight="semibold" style={styles.title}>
          {title}
        </AppText>
        {listData?.map((item, index) => (
          <View key={index.toString()} style={styles.boxText}>
            <AppText fontSize={fontSize.f14}>{item.name}</AppText>
          </View>
        ))}
      </View>
    );
  };

  return (
    // <View showsVerticalScrollIndicator={false}>
    <View style={styles.contentContainer}>
      {renderListActivity(t('label:activity'), listActivityType)}
      {renderColumn(t('label:notDone'), <MyIcon.WarningActivity />, listActivityType)}
      {renderColumnDone(t('label:done'), <MyIcon.TickActivity color={color.green900} />, listActivityType)}
    </View>
    // </ScrollView>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: padding.p4,
    alignItems: 'flex-end',
  },
  columnItem: {
    alignItems: 'center',
  },
  listActivity: {
    alignItems: 'flex-start',
    flex: 1,
  },
  title: {
    fontSize: fontSize.f14,
    paddingBottom: padding.p16,
    alignItems: 'center',
  },
  boxText: {
    height: padding.p36,
    justifyContent: 'flex-start',
  },
});

export default BoxListActivity;
