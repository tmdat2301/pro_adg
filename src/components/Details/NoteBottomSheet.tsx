import { AppText } from '@components/index';
import { color, padding, fontSize } from '@helpers/index';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';

export interface IItemOptionsProps {
  onPress: (id: number) => void;
}

const NoteBottomSheet = (props: IItemOptionsProps) => {
  const { onPress } = props;
  const { t } = useTranslation();
  const arrOptions = [
    {
      id: 1,
      name: t('lead:edit_note'),
      type: 'edit',
    },
    {
      id: -99,
      name: t('lead:delete_note'),
      type: 'delete',
    },
  ];
  return (
    <>
      {arrOptions.map((v, i) => {
        const isLastItem = arrOptions.length - 1 === i
        return (
          <>
            <TouchableOpacity
              key={v.id}
              onPress={() => {
                onPress(v.id);
              }}
              activeOpacity={0.8}
              style={[styles.touchItemSheet2, { paddingBottom: isLastItem ? padding.p24 : 0 }]}>
              {v.id === -99 ? (
                <Icon type="antdesign" name="delete" color={color.red} />
              ) : (
                <Icon type="antdesign" name="edit" color={color.icon} />
              )}
              <AppText
                value={v.name}
                fontSize={fontSize.f14}
                color={v.id === -99 ? color.red : color.black}
                style={styles.textItemSheet2}
              />
            </TouchableOpacity>
            <View style={styles.lineItemSepe} />
          </>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  lineItemSepe: {
    width: '100%',
    height: 1,
    backgroundColor: color.hawkesBlue,
  },
  touchItemSheet: {
    width: ScreenWidth - 32,
    marginHorizontal: padding.p16,
  },
  textItemSheet: {
    paddingVertical: padding.p12,
  },
  touchItemSheet2: {
    width: ScreenWidth - 32,
    paddingHorizontal: padding.p16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16
  },
  textItemSheet2: {
    paddingVertical: padding.p12,
    paddingHorizontal: padding.p10,
  },
});

export default NoteBottomSheet;
