import AppText from '@components/AppText';
import { DATE_TIME_FORMAT } from '@helpers/constants';
import { padding, color, fontSize } from '@helpers/index';
import { ItemAttachFiles } from '@interfaces/lead.interface';
import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';

interface IItemFile {
  item: ItemAttachFiles;
  onPress: (id: number | string, fileType: number | string) => void;
}

const ItemFile = (props: IItemFile) => {
  const { item } = props;
  const { fileType, fileExtension, fileName, ownerName, dateCreate, id } = item;
  const renderFileType = () => {
    try {
      switch (fileType) {
        case 0:
          return <Icon name="link" type="antdesign" size={fontSize.f20} color={color.icon} />;
        case 1:
          return <Icon name="file-image-o" type="font-awesome" size={fontSize.f20} color={color.icon} />;
        case 2:
          return <Icon name="file1" type="antdesign" size={fontSize.f20} color={color.icon} />;
        default:
          return <Icon name="link" type="antdesign" size={fontSize.f20} color={color.icon} />;
      }
    } catch (error) {
      return <Icon name="file1" type="antdesign" size={fontSize.f20} color={color.icon} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <View style={styles.iconFileType}>{renderFileType()}</View>
        <View style={styles.contentFile}>
          <AppText value={`${fileName ?? ''}${fileExtension ?? ''}`} fontSize={fontSize.f14} numberOfLines={1} />
          <View style={styles.contentOwned}>
            <AppText value={ownerName} fontSize={fontSize.f12} color={color.subText} numberOfLines={1} />
            <Icon
              type="simple-line-icon"
              name="clock"
              size={fontSize.f10}
              color={color.icon}
              style={styles.iconClock}
            />
            <AppText
              value={dayjs(dateCreate).format(DATE_TIME_FORMAT)}
              fontSize={fontSize.f12}
              color={color.subText}
              numberOfLines={1}
            />
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.8} style={styles.iconOptions} onPress={() => props.onPress(id, fileType)}>
          <Icon type="entypo" name="dots-three-vertical" size={fontSize.f14} color={color.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.lineSepe} />
    </View>
  );
};

export default ItemFile;

const styles = StyleSheet.create({
  container: {
    width: ScreenWidth,
    paddingHorizontal: padding.p16,
    backgroundColor: color.white,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxHeight: ScreenWidth * 0.166,
  },
  lineSepe: {
    width: '100%',
    height: 1,
    backgroundColor: color.hawkesBlue,
  },
  iconFileType: {
    width: 20,
    alignItems: 'center',
  },
  contentFile: {
    flex: 1,
    padding: padding.p12,
  },
  contentOwned: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconOptions: {
    width: 15,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconClock: {
    marginHorizontal: padding.p8,
  },
});
