import { AppText } from '@components/index';
import { color, fontSize, padding } from '@helpers/index';
import { useNavigation } from '@react-navigation/core';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export interface AppHeaderProps {
  title: string;
  onPressLeft?: () => void;
  onPressRight?: () => void;
}

const AppHeader: FC<AppHeaderProps> = React.memo((props) => {
  const { title, onPressLeft, onPressRight } = props;
  const navigation = useNavigation();
  const { t } = useTranslation();
  return (
    <View style={styles.wrapHeader}>
      <Icon name="x" size={24} color={color.icon} style={{ padding: padding.p16 }} onPress={onPressLeft} />
      <View style={{ flex: 1, alignItems: 'center' }}>
        <AppText numberOfLines={1} style={styles.titleHeader}>
          {title}
        </AppText>
      </View>
      <Icon name="check" size={24} color={color.icon} style={{ padding: padding.p16 }} onPress={onPressRight} />
    </View>
  );
});

const styles = StyleSheet.create({
  wrapHeader: { flexDirection: 'row', alignItems: 'center' },
  titleHeader: {
    fontSize: fontSize.f16,
    fontWeight: '600',
    color: color.text,
  },
});
export default AppHeader;
