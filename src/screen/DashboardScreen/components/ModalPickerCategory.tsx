import React, { FC } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { color, fontSize, padding } from '@helpers/index';
import { AppText } from '@components/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export interface ModalPickerCategoryProps {
  onSelect: (key: number | string) => void;
  title: string;
  data: dataModal[];
}

export interface dataModal {
  label: string;
  key: string | number;
}

const ModalPickerCategory: FC<ModalPickerCategoryProps> = React.memo((props) => {
  const { onSelect, title, data } = props;
  const { t } = useTranslation();

  const renderButton = (titleButton: string, onPress: () => void, textColor: string = color.text) => {
    return (
      <TouchableOpacity style={[styles.button]} onPress={onPress}>
        <AppText fontSize={fontSize.f14} style={{ padding: padding.p12 }}>
          {titleButton}
        </AppText>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: useSafeAreaInsets().bottom,
        },
      ]}>
      <View style={styles.titleStyles}>
        <AppText fontSize={fontSize.f16} fontWeight="semibold" value={title} />
      </View>
      <ScrollView style={{ flex: 1 }}>
        {data?.map((el, index) => {
          return (
            <View style={{ borderTopWidth: index >= 1 ? 1 : 0, borderTopColor: color.grayLine }}>
              {renderButton(el.label, () => onSelect(el.key))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  button: {
    paddingHorizontal: padding.p16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleStyles: {
    paddingTop: padding.p24,
    alignItems: 'center',
  },
});
export default ModalPickerCategory;
