import AppText from '@components/AppText';
import fontSize from '@helpers/fontSize';
import { useNavigation } from '@react-navigation/core';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { color, padding } from '@helpers/index';
export interface ItemCheckContentProps {
  location: string;
  time: string;
}
const ItemCheckContent = (props: ItemCheckContentProps) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { location, time } = props;
  return (
    <View style={styles.container}>
      <AppText value={location} fontSize={fontSize.f14} style={{ marginBottom: padding.p2 }} />
      <AppText value={time} fontSize={fontSize.f12} color={color.subText} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: padding.p8,
    marginLeft: padding.p44,
    marginRight: padding.p16,
  },
});
export default memo(ItemCheckContent);
