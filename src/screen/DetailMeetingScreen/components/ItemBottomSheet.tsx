import { AppText } from '@components/index';
import { color, padding, fontSize } from '@helpers/index';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';
export interface IItemOptionsProps {
  onPress: (id: number) => void;
  type: string;
}

const ItemBottomSheet = (props: IItemOptionsProps) => {
  const { onPress, type } = props;
  const { t } = useTranslation();
  const arrOptions = [
    {
      id: 1,
      name: t('label:add_fee'),
      type: 'fee',
    },
    {
      id: -1,
      name: props.type,
      type: 'delete',
    },
  ];
  return (
    <>
      {arrOptions.map((v, i) => {
        return (
          <>
            <TouchableOpacity
              key={v.id}
              onPress={() => {
                onPress(v.id);
              }}
              activeOpacity={0.8}
              style={styles.touchItemSheet}>
              {v.id === -1 ? (
                <Icon type="antdesign" name="delete" color={color.red} style={{ width: 22 }} />
              ) : (
                <Icon style={{ width: 22 }} type="font-awesome" name="dollar" color={color.icon} />
              )}
              <AppText
                value={v.name}
                fontSize={fontSize.f14}
                color={v.id === -1 ? color.red : color.black}
                style={styles.textItemSheet}
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
    paddingHorizontal: padding.p16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: padding.p10,
  },
  textItemSheet: {
    marginHorizontal: padding.p12,
    marginVertical: padding.p10,
    paddingVertical: padding.p10,
  },
});

export default ItemBottomSheet;
