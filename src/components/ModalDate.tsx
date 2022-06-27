import AppText from '@components/AppText';
import color from '@helpers/color';
import fontSize from '@helpers/fontSize';
import padding from '@helpers/padding';
import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

export interface Props {
  titleCalendar: string;
  handleConfirm: (date: Date) => void;
  handleCancel: () => void;
  date: Date;
  mode?: 'time' | 'date' | 'datetime' | undefined;
  minimumDate?: Date | undefined;
  maximumDate?: Date | undefined;
}

export default forwardRef((props: Props, ref: any) => {
  const { titleCalendar, handleConfirm, handleCancel, date, mode = 'date', minimumDate, maximumDate } = props;
  const { t } = useTranslation();
  let tempDate: Date = date || new Date();

  return (
    <View>
      <View style={styles.headerModal}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            tempDate = date;
            handleCancel();
          }}>
          <AppText style={styles.textButton} value={t('button:cancel').toString()} />
        </TouchableOpacity>
        <AppText style={styles.title} value={titleCalendar} />
        <TouchableOpacity
          onPress={() => {
            handleConfirm(tempDate);
            handleCancel();
          }}
          style={{ flex: 1, alignItems: 'flex-end' }}>
          <AppText style={styles.textButton} value={t('button:confirm').toString()} />
        </TouchableOpacity>
      </View>
      <DatePicker
        date={date}
        style={{ width: ScreenWidth, height: 200 }}
        mode={mode}
        onDateChange={(date) => (tempDate = date)}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
      />
    </View>
  );
});

export const styles = StyleSheet.create({
  headerModal: {
    flexDirection: 'row',
    paddingHorizontal: padding.p16,
    padding: 12,
  },
  title: {
    fontSize: fontSize.f17,
    flex: 1,
    textAlign: 'center',
  },
  textButton: {
    fontSize: fontSize.f17,
    color: color.primary,
  },
});
