import { AppText } from '@components/index';
import { ModalizeDetailsType } from '@helpers/constants';
import { color, padding, fontSize } from '@helpers/index';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { ItemOptions } from '@components/Item/Details/index';
export interface IInteractiveBottomSheetProps {
  type: ModalizeDetailsType;
  onPress: (id?: number) => void;
}

const InteractiveBottomSheet = (props: IInteractiveBottomSheetProps) => {
  const { type, onPress } = props;
  const { t } = useTranslation();
  const arrFilter = [
    {
      id: -99,
      name: t('lead:all_interactive'),
      type: null,
    },
    {
      id: 1,
      name: t('lead:call_phone'),
      type: 'call',
    },
    {
      id: 2,
      name: t('lead:send_mail'),
      type: 'email',
    },
    {
      id: 3,
      name: 'SMS',
      type: 'sms',
    },
  ];
  if (type === ModalizeDetailsType.filter) {
    return (
      <>
        {arrFilter.map((v, i) => {
          return (
            <ItemOptions
              key={v.id}
              value={v.name}
              onPress={() => {
                onPress(v.id);
              }}
            />
          );
        })}
      </>
    );
  }
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
      activeOpacity={0.8}
      style={styles.touchItemSheet}>
      <Icon type="antdesign" name="delete" color={color.red} />
      <AppText
        value={t('lead:delete_interactive').toString()}
        fontSize={fontSize.f14}
        color={color.red}
        style={styles.textItemSheet}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchItemSheet: {
    width: ScreenWidth - 32,
    paddingHorizontal: padding.p16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: padding.p24
  },
  textItemSheet: {
    paddingVertical: padding.p12,
    paddingHorizontal: padding.p10,
  },
});

export default InteractiveBottomSheet;
