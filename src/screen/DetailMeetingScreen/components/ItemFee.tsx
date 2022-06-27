import fontSize from '@helpers/fontSize';
import React, { memo, useRef, useState } from 'react';
import { Modal, StyleSheet, View, TouchableOpacity } from 'react-native';
import { color, padding } from '@helpers/index';
import { MyIcon } from '@components/Icon';
import AppText from '@components/AppText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import AppImage from '@components/AppImage';
import AppConfirm from '@components/AppConfirm';
import { ItemCosts } from '@interfaces/lead.interface';
import { Modalize } from 'react-native-modalize';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Portal } from 'react-native-portalize';

export interface ItemCostProps {
  item: ItemCosts;
  onDelete?: () => void;
  onEdit?: (item: ItemCosts) => void;
}
const ItemFee = (props: ItemCostProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { onDelete, onEdit } = props;
  const { images, price, costTypeName } = props.item;
  const { t } = useTranslation();
  const [passData, setPassData] = useState<any>();
  const imageRef = useRef<any>();

  const previewImage = () => {
    return (
      <Portal>
        <Modalize modalHeight={ScreenHeight} ref={imageRef}>
          <View style={styles.modalImageContainer}>
            <TouchableOpacity
              style={{ position: 'absolute', top: 20, right: 20, zIndex: 9999 }}
              onPress={() => imageRef.current.close()}>
              <Icon name="close" type="antdesign" color={color.white} />
            </TouchableOpacity>
            <AppImage
              source={{
                uri:
                  typeof passData === 'string'
                    ? passData.includes('https:')
                      ? passData
                      : passData.replace('http:', 'https:')
                    : passData?.path || passData?.sourceURL,
              }}
              style={[
                styles.imageViewer,
                { height: passData?.height || ScreenHeight, width: passData?.width || ScreenWidth },
              ]}
              resizeMode="contain"
            />
          </View>
        </Modalize>
      </Portal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.text}>
          <AppText value={costTypeName} fontSize={fontSize.f14} />
          <AppText value={': '} />
          <AppText value={price} fontSize={fontSize.f14} fontWeight="semibold" />
          <AppText value={'đ'} fontSize={fontSize.f14} fontWeight="semibold" />
        </View>
        <TouchableOpacity style={{ marginRight: padding.p16, marginTop: padding.p4 }}>
          <AntDesign
            name="edit"
            size={fontSize.f20}
            color={color.icon}
            onPress={() => {
              if (onEdit) {
                onEdit(props.item);
              }
              // navigation.navigate(AppRoutes.COST, {});
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginRight: padding.p8, marginTop: padding.p4 }}>
          <FontAwesome
            name="trash-o"
            size={fontSize.f20}
            color={color.red}
            onPress={() => {
              setModalVisible(true);
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          style={styles.camera}
          onPress={() => {
            if (onEdit) {
              onEdit(props.item);
            }
            // navigation.navigate(AppRoutes.COST, {});
          }}>
          <MyIcon.Camera />
        </TouchableOpacity>
        <View style={styles.image}>
          {images?.map((v, i) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setPassData(v);
                  imageRef.current?.open();
                }}>
                <AppImage
                  key={i.toString()}
                  source={{ uri: v.replace('http:', 'https:') }}
                  style={{ backgroundColor: color.icon, width: 44, height: 44, marginHorizontal: padding.p4 }}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      {previewImage()}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <AppConfirm
          content={t('label:deleteCost')}
          title={t('label:delete')}
          onPressLeft={() => {
            setModalVisible(false);
          }}
          onPressRight={() => {
            setModalVisible(false);
            if (onDelete) {
              onDelete();
            }
          }}
        />
      </Modal>
    </View>
  );
};
export default memo(ItemFee);
const styles = StyleSheet.create({
  container: {},
  text: {
    flex: 1,
    flexDirection: 'row',
    marginTop: padding.p8,
    marginLeft: padding.p44,
  },
  image: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: padding.p20,
    // marginLeft: padding.p8,
  },
  camera: {
    paddingVertical: padding.p13,
    paddingHorizontal: padding.p13,
    borderRadius: 4,
    marginLeft: padding.p44,
    marginBottom: padding.p20,
    marginTop: padding.p15,
    shadowColor: color.grayShadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: color.white,
  },
  cancelButton: {
    alignItems: 'center',
    marginTop: padding.p16,
    backgroundColor: color.white,
    padding: padding.p16,
    borderRadius: 12,
  },
  takePhoto: {
    borderBottomWidth: 0.5,
    borderColor: color.subText,
    flexDirection: 'row',
    padding: padding.p16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    fontSize: fontSize.f16,
    fontWeight: '500',
    marginLeft: padding.p12,
    color: color.dodgerBlue,
  },
  modalOptionImage: {
    paddingHorizontal: padding.p8,
    backgroundColor: 'transparent',
  },
  closeIcon: {
    position: 'absolute',
    zIndex: 999999,
    top: -6,
    right: 0,
  },
  modalImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'black',
    height: ScreenHeight,
  },
  imageViewer: {
    maxHeight: ScreenHeight,
    maxWidth: ScreenWidth,
    zIndex: 100,
  },
});
