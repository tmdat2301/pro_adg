import { AppText } from '@components/index';
import { ItemOptions } from '@components/Item/Details';
import { ModalizeDetailsType } from '@helpers/constants';
import { color, padding, fontSize } from '@helpers/index';
import { ItemAttachFiles } from '@interfaces/lead.interface';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';

export interface IFileBottomSheetProps {
  type: ModalizeDetailsType;
  onPress: (id: number) => void;
  item: ItemAttachFiles | null;
}

const FileBottomSheet = (props: IFileBottomSheetProps) => {
  const { type, item, onPress } = props;
  const { t } = useTranslation();

  const renderIcon = (id: number) => {
    switch (id) {
      case 1:
        return <Icon type="evilicon" name="external-link" color={color.icon} size={18} />;
      case 2:
        return <Icon type="antdesign" name="download" color={color.icon} size={18} />;
      case 3:
        return <Icon type="evilicon" name="external-link" color={color.icon} size={18} />;
      case -99:
        return <Icon type="antdesign" name="delete" color={color.red} size={18} />;
    }
  };
  const arrOptions = [
    {
      id: 1,
      name: t('lead:open_image'),
    },
    {
      id: 2,
      name: t('lead:download_file'),
    },
    {
      id: 3,
      name: t('lead:open_link'),
    },
    {
      id: -99,
      name: t('lead:delete_file'),
    },
  ];
  const arrFilter = [
    {
      id: -99,
      name: t('label:all'),
    },
    {
      id: 1,
      name: t('lead:image'),
    },
    {
      id: 2,
      name: t('lead:file'),
    },
    {
      id: 3,
      name: t('lead:link'),
    },
  ];
  if (type === ModalizeDetailsType.filter) {
    return (
      <>
        {arrFilter.map((v, i) => {
          return (
            <ItemOptions
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
    <>
      {arrOptions
        .filter((x) => x.id === item?.fileType || x.id === -99)
        .map((v, i) => {
          return (
            <>
              <TouchableOpacity
                key={v.id}
                onPress={() => {
                  onPress(v.id);
                }}
                activeOpacity={0.8}
                style={styles.touchItemSheet}>
                <View style={styles.iconFileType}>{renderIcon(v.id)}</View>
                <AppText
                  value={v.name}
                  fontSize={fontSize.f14}
                  color={v.id === -99 ? color.red : color.black}
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
  iconFileType: {
    width: 20,
    alignItems: 'center',
  },
  touchItemSheet: {
    width: ScreenWidth - 32,
    paddingHorizontal: padding.p16,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingBottom: padding.p24
  },
  textItemSheet: {
    paddingVertical: padding.p12,
    paddingHorizontal: padding.p10,
  },
});

export default FileBottomSheet;
