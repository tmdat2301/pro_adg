import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { color, fontSize, padding } from '@helpers/index';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import AppText from '@components/AppText';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { TaskType } from '@helpers/constants';
import { MyIcon } from '@components/Icon';

export interface ItemMeetingProps {
  iconName: string;
  iconType: string;
  content?: string;
  subContent?: string;
  note?: string;
  sizeContent?: number;
  iconSize?: number;
  taskType?: TaskType;
  isTitleLong?: boolean;
}
const ItemMeeting = (props: ItemMeetingProps) => {
  const {
    iconName,
    iconType,
    content = '',
    subContent = '',
    sizeContent,
    iconSize = 20,
    note = '',
    taskType,
    isTitleLong,
  } = props;
  const renderIcon = (icon: TaskType) => {
    let iconType = <MyIcon.EmailActivity fill={color.primary} />;
    switch (icon) {
      case TaskType.sendEmail:
        iconType = <MyIcon.EmailActivity fill={color.primary} />;
        break;
      case TaskType.callPrice:
        iconType = <MyIcon.PriceActivity fill={color.primary} />;
        break;
      case TaskType.meeting:
        iconType = <Icon type="material-community" name="account-group-outline" size={16} color={color.primary} />;
        break;
      case TaskType.demoProduct:
        iconType = <MyIcon.DemoProduct fill={color.primary} />;
        break;
      case TaskType.meetCustomer:
        iconType = <MyIcon.CalendarActivity fill={color.primary} />;
        break;
      case TaskType.callPhone:
        iconType = <MyIcon.CallActivity fill={color.primary} />;
        break;
      case TaskType.other:
        iconType = <MyIcon.ListAltActivity fill={color.primary} />;
        break;
    }
    return iconType;
  };
  return (
    <View style={[styles.container, { alignItems: isTitleLong ? 'flex-start' : 'center' }]}>
      <View style={{ width: 30, paddingTop: 2, paddingLeft: taskType == TaskType.callPhone ? 3 : 0 }}>
        {taskType ? (
          renderIcon(taskType)
        ) : (
          <Icon
            type={iconType}
            name={iconName}
            color={color.navyBlue}
            style={{ marginRight: padding.p10 }}
            size={iconSize}
          />
        )}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <AppText
          fontSize={sizeContent || fontSize.f14}
          style={{ marginRight: content ? padding.p16 : 0, alignSelf: 'center' }}
          fontWeight="semibold">
          {`${content} `}
          <AppText fontSize={fontSize.f12} value={note} style={{ lineHeight: fontSize.f18 }} color={color.subText} />
        </AppText>
      </View>
      <AppText
        style={{ alignSelf: 'center', paddingRight: padding.p16 }}
        fontSize={sizeContent || fontSize.f14}
        value={subContent}
      />
    </View>
  );
};
export default memo(ItemMeeting);
const styles = StyleSheet.create({
  container: {
    marginTop: padding.p20,
    marginHorizontal: padding.p16,
    alignItems: 'center',
    flexDirection: 'row',
    width: ScreenWidth - 32,
  },
});
