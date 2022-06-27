import AppText from '@components/AppText';
import color from '@helpers/color';
import { TaskType } from '@helpers/constants';
import fontSize from '@helpers/fontSize';
import padding from '@helpers/padding';
import { DataResult } from '@interfaces/profile.interface';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';

export interface ModalMissionProps {
  onSelect: (data: any) => void;
  title?: string;
  type?: 'task' | 'appointment';
  dataSelected?: DataResult;
}
export interface dataModal {
  label: string;
  key: string;
}
const ModalMission: FC<ModalMissionProps> = React.memo((props) => {
  const { onSelect, title, type = 'task', dataSelected } = props;
  const { t } = useTranslation();

  const renderItem = (item?: any) => {
    const isActive = dataSelected?.value == item;
    return (
      <TouchableOpacity
        onPress={() => onSelect({ value: item, label: getTaskTypeName(item) })}
        style={{ paddingHorizontal: padding.p16 }}>
        <View style={[styles.textContainer, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <AppText color={isActive ? color.primary : color.text} fontSize={fontSize.f14} style={{ marginVertical: padding.p4 }}>
            {getTaskTypeName(item)}
          </AppText>
          {isActive && <Icon name="check" color={color.mainBlue} />}
        </View>
      </TouchableOpacity>
    );
  };
  const getTaskTypeName = (type: TaskType) => {
    switch (type) {
      case TaskType.callPhone:
        return t('lead:call_phone');
      case TaskType.sendEmail:
        return t('lead:send_mail');
      case TaskType.callPrice:
        return t('lead:call_price');
      case TaskType.meetCustomer:
        return t('lead:meet_customer');
      case TaskType.demoProduct:
        return t('lead:demo_product');
      case TaskType.meeting:
        return t('lead:meeting');
      default:
        return t('lead:other');
    }
  };
  return (
    <View style={{ paddingTop: padding.p8 }}>
      {title && (
        <AppText fontWeight="semibold" style={styles.titleStyles}>
          {title}
        </AppText>
      )}
      {type === 'task' ? (
        <>
          {renderItem(TaskType.callPhone)}
          {renderItem(TaskType.sendEmail)}
          {renderItem(TaskType.callPrice)}
        </>
      ) : (
        <>
          {renderItem(TaskType.demoProduct)}
          {renderItem(TaskType.meeting)}
          {renderItem(TaskType.meetCustomer)}
          {renderItem(TaskType.other)}
        </>
      )}
    </View>
  );
});

export default ModalMission;

const styles = StyleSheet.create({
  textContainer: {
    backgroundColor: 'transparent',
    paddingVertical: padding.p16,
    borderBottomWidth: 1,
    borderBottomColor: color.grayLine,
  },
  titleStyles: {
    paddingVertical: padding.p8,
    fontSize: fontSize.f16,
    textAlign: 'center',
  },
});
