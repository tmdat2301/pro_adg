import { color, fontSize, padding } from '@helpers/index';
import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from '@components/AppText';
import dayjs from 'dayjs';
import { DATE_FORMAT, DATE_TIME, DATE_TIME2, TIME_FORMAT_24 } from '@helpers/constants';
import AppMenu, { ItemAppMenuProps } from '@components/AppMenu';
import { formatPhone } from '@helpers/untils';
import { useTranslation } from 'react-i18next';

export enum pipelinePositionId {
  LEAD_1 = 1,
  LEAD_2 = 2,
  LEAD_3 = 3,
  LEAD_4 = 4,
  LEAD_5 = 5,
}
export interface ItemLeadProps {
  leadName: string;
  leadPhoneNumber: string;
  leadTime: string;
  leadID: string;
  leadJobName: string;
  leadColorStatus: pipelinePositionId;
  leadTextStatus: string;
  onPress: () => void;
  listAction: ItemAppMenuProps[];
}
const ListLeadItem: FC<ItemLeadProps> = React.memo(

  ({
    leadName = '',
    leadPhoneNumber = '',
    leadTime = '',
    leadJobName = '',
    leadID = '',
    leadColorStatus,
    leadTextStatus,
    onPress,
    listAction = [],
  }) => {
    const { t } = useTranslation();
    const renderStatus = (status: pipelinePositionId) => {
      let colorStatus = color.red;
      switch (status) {
        case pipelinePositionId.LEAD_1:
          colorStatus = color.green900;
          break;
        case pipelinePositionId.LEAD_4:
          colorStatus = color.red;
          break;
        default:
          colorStatus = color.yellow;
          break;
      }
      return (
        <View style={styles.formLeadStatus}>
          <View style={[styles.iconLeadStatus, { backgroundColor: colorStatus }]} />
          <AppText value={leadTextStatus} numberOfLines={1} color={colorStatus} />
        </View>
      );
    };

    const renderFormatDate = (time: Date | string) => {
      let times = dayjs(time).format(TIME_FORMAT_24).toString();
      if (!dayjs(time).isSame(new Date(), 'dates')) {
        times = dayjs(time).format(DATE_TIME2).toString();
      }
      return times;
    };
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.formItemLeft}>
          <AppText style={styles.itemName} numberOfLines={1} fontWeight="semibold">
            {leadName}
          </AppText>
          <AppText style={styles.itemPhone}>{formatPhone(leadPhoneNumber)}</AppText>
          <AppText style={styles.itemTime}>{renderFormatDate(leadTime)}</AppText>
        </View>
        <View style={styles.formItemRight}>
          <View style={{ alignItems: 'flex-end', flex: 1 }}>
            <AppText style={styles.itemId}>{leadID}</AppText>
            <AppText numberOfLines={1} style={styles.itemJobName}>
              {leadJobName}
            </AppText>
            {renderStatus(leadColorStatus)}
          </View>
          <AppMenu buttonStyle={styles.formIconItem} data={listAction} />
        </View>
      </TouchableOpacity>
    );
  },
);
export default ListLeadItem;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: color.white,
    paddingHorizontal: padding.p16,
    marginBottom: padding.p4,
  },
  formItemLeft: {
    flex: 1,
    paddingVertical: padding.p12,
  },
  itemName: {
    lineHeight: fontSize.f18,
    fontSize: fontSize.f13,
    color: color.black,
  },
  itemPhone: {
    lineHeight: fontSize.f18,
    paddingVertical: padding.p4,
    fontSize: fontSize.f13,
    color: color.text,
  },
  itemTime: {
    lineHeight: fontSize.f18,
    fontSize: fontSize.f13,
    color: color.subText,
  },
  formItemRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemId: {
    lineHeight: fontSize.f18,
    fontSize: fontSize.f13,
    color: color.black,
  },
  itemJobName: {
    lineHeight: fontSize.f18,
    paddingVertical: padding.p4,
    fontSize: fontSize.f13,
    color: color.text,
  },
  formIconItem: {
    paddingBottom: padding.p12,
    marginLeft: padding.p8,
  },
  formLeadStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeadStatus: {
    width: 6,
    height: 6,
    borderRadius: padding.p6,
    marginRight: padding.p6,
  },
});
