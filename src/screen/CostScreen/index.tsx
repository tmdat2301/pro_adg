import AppHeader from '@components/AppHeader';
import AppImage from '@components/AppImage';
import AppText from '@components/AppText';
import DropDownMutiline from '@components/DropDownMutiline';
import { MyIcon } from '@components/Icon';
import { MyInput } from '@components/Input';
import AppField from '@components/Input/MultiInput/AppField';
import color from '@helpers/color';
import { FieldType } from '@helpers/constants';
import { NavigationCost } from '@interfaces/quickSearch.interface';
import { ResponseReturn } from '@interfaces/response.interface';
import { useNavigation } from '@react-navigation/native';
import { apiDelete, apiGet, apiPostFormData, apiPutFormData } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import { Formik, FormikProps } from 'formik';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Modal, Platform, TouchableOpacity, View } from 'react-native';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import ImagePicker from 'react-native-image-crop-picker';
import { Modalize } from 'react-native-modalize';
import { Host } from 'react-native-portalize';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import styles from './styles';
import Toast from 'react-native-toast-message';
import { AppContext } from '@contexts/index';
import { InitValuesCostFormik, ItemCostFormik } from '@interfaces/task.interface';
import { setTimeOut } from '@helpers/untils';
import AppConfirm from '@components/AppConfirm';
interface CostProps extends NavigationCost { }

interface ItemCostType {
  id: string;
  name: string;
}

export default (props: CostProps) => {
  const { isAddCost, taskId, item, onRefreshing } = props.route.params;
  const { t } = useTranslation();
  const [image, setImage] = useState<any[]>(item && item.images ? item.images : []);
  const imageRef = useRef<any>();
  const optionRef = useRef<any>();
  const [passData, setPassData] = useState<any>();
  const [arrCostType, setCostType] = useState<ItemCostFormik[]>([]);
  const [imageLink, setImageLink] = useState<string | null>(null);
  const [indexLink, setIndexLink] = useState(-1);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const initialValues: InitValuesCostFormik = {
    costs:
      item && item.costTypeId
        ? {
          email: null,
          label: item && item.costTypeId ? item.costTypeId : '',
          value: item && item.costTypeId ? item.costTypeName : '',
        }
        : '',
    license_link: item && item.link ? item.link : '',
    note: item && item.note ? item.note : '',
    total_cost: item && item.price ? item.price.toString() : '',
  };

  const validationSchema = Yup.object().shape({
    costs: Yup.object().required(t('label:required')),
    total_cost: Yup.number().typeError(t('label:errorNumber')).required(t('label:required')).moreThan(0),
    license_link: Yup.string(),
  });

  const onDeleteImage = (index: number) => {
    const newImage = [...image];
    newImage.splice(index, 1);
    setImage(newImage);
  };
  const chooseImageMultiple = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
    })
      .then((images) => {
        if (image.length + images.length > 5) {
          Toast.show({
            type: 'error',
            text1: t('lead:notice'),
            text2: t('label:photoLimit', { number: 5 }),
          });
          return;
        }
        setImage([...image, ...images]);
      })
      .catch((reason) => {
        Toast.show({
          type: 'error',
          text1: t('lead:notice'),
          text2: JSON.stringify(reason),
        });
      });
  };

  const renderImagePicker = () => {
    return (
      <View style={styles.cameraStyles}>
        <MyIcon.Camera fill={image.length < 5 ? color.navyBlue : color.cameraIcon} />
      </View>
    );
  };

  const takePhoto = () => {
    ImagePicker.openCamera({
      cropping: false,
    })
      .then((images) => {
        if (image.length === 5) {
          Toast.show({
            type: 'error',
            text1: t('lead:notice'),
            text2: t('label:photoLimit', { number: 5 }),
          });
          return;
        }
        setImage([...image, images]);
      })
      .catch((reason) => {
        Toast.show({
          type: 'error',
          text1: t('lead:notice'),
          text2: JSON.stringify(reason),
        });
      });
  };

  const deleteImage = async (fileId: string | number) => {
    try {
      const url = serviceUrls.path.deleteImageCost;
      const response: ResponseReturn<boolean> = await apiDelete(url, {
        costId: item.id,
        fileId: fileId,
      });
      if (response.error) {
        Toast.show({
          type: 'error',
          text1: t('lead:notice'),
          text2: response.errorMessage || response.detail || t('lead:delete_image_fail'),
        });
        return;
      }
      if (response.response && response.response.data) {
        onDeleteImage(indexLink);
        Toast.show({
          type: 'success',
          text1: t('lead:notice'),
          text2: t('lead:delete_image_success'),
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('lead:notice'),
        text2: JSON.stringify(error),
      });
    }
  };

  const CUCost = async (value: any) => {
    try {
      appContext.setLoading(true);
      const formdata = new FormData();
      if (isAddCost) {
        formdata.append('taskId', taskId);
        formdata.append('costTypeId', value.costs.label);
        formdata.append('note', value.note);
        formdata.append('link', value.license_link);
        formdata.append('price', value.total_cost);
        if (image.length > 0) {
          for (let index = 0; index < image.length; index++) {
            const element = image[index];
            const objImage = {
              uri: Platform.OS === 'ios' ? element.path.toString().replace('file://', '') : element.path,
              type: element.mime || 'image/jpg',
              name: `image${index}.jpg`,
            };
            formdata.append('files', objImage);
          }
        }
        const url = serviceUrls.path.createCost;
        const response: ResponseReturn<boolean> = await apiPostFormData(url, formdata);
        if (response.error) {
          Toast.show({
            type: 'error',
            text1: t('lead:notice'),
            text2: response.errorMessage || response.detail || '',
          });
          appContext.setLoading(false);
          return;
        }
        if (response.response && response.response.data) {
          Toast.show({
            type: 'success',
            text1: t('lead:notice'),
            text2: t('lead:create_cost_success'),
          });
          onRefreshing();
          navigation.goBack();
        }
      } else {
        formdata.append('note', value.note);
        formdata.append('link', value.license_link);
        formdata.append('price', value.total_cost);
        if (image.length > 0) {
          for (let index = 0; index < image.length; index++) {
            const element = image[index];
            if (typeof element === 'string') {
              formdata.append('files', element);
            } else {
              const objImage = {
                uri: Platform.OS === 'ios' ? element.path.toString().replace('file://', '') : element.path,
                type: element.mime || 'image/jpg',
                name: `image${index}.jpg`,
              };
              formdata.append('files', objImage);
            }
          }
        }
        const url = serviceUrls.path.createCost + taskId;
        const response: ResponseReturn<boolean> = await apiPutFormData(url, formdata);
        if (response.error) {
          Toast.show({
            type: 'error',
            text1: t('lead:notice'),
            text2: response.errorMessage || response.detail || '',
          });
          appContext.setLoading(false);
          return;
        }
        if (response.response && response.response.data) {
          Toast.show({
            type: 'success',
            text1: t('lead:notice'),
            text2: t('lead:edit_cost_success'),
          });
          onRefreshing();
          navigation.goBack();
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('lead:notice'),
        text2: JSON.stringify(error),
      });
    } finally {
      appContext.setLoading(false);
    }
  };

  useEffect(() => {
    if (arrCostType.length === 0) {
      getCostType();
    }
  }, [item]);

  const getCostType = async () => {
    try {
      const url = serviceUrls.path.costType;
      const response: ResponseReturn<ItemCostType[]> = await apiGet(url, {});
      if (response.error) {
        return;
      }
      if (response.response && response.response.data) {
        const arrCost: ItemCostFormik[] = [];
        for (let index = 0; index < response.response.data.length; index++) {
          const element = response.response.data[index];
          const obj: ItemCostFormik = {
            email: null,
            label: element.id,
            value: element.name,
          };
          arrCost.push(obj);
        }
        setCostType(arrCost);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('lead:notice'),
        text2: JSON.stringify(error),
      });
    }
  };
  const renderOptionImage = () => {
    return (
      <Modalize withHandle={false} ref={optionRef} modalHeight={ScreenHeight / 4} modalStyle={styles.modalOptionImage}>
        <View style={{ backgroundColor: color.white, borderRadius: 12 }}>
          <TouchableOpacity
            style={styles.takePhoto}
            onPress={() => {
              optionRef.current.close();
              setTimeout(() => {
                takePhoto();
              }, setTimeOut());
            }}>
            <AppText style={styles.txt}>{t('label:take_a_photo')}</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.takePhoto}
            onPress={() => {
              chooseImageMultiple();
              optionRef.current.close();
            }}>
            <AppText style={styles.txt}>{t('label:select_photo')}</AppText>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.cancelButton} onPress={() => optionRef.current.close()}>
          <AppText style={styles.txt}>{t('label:cancel')}</AppText>
        </TouchableOpacity>
      </Modalize>
    );
  };

  const titleInput: { label: string; key: string }[] = [
    {
      label: t('label:total_cost'),
      key: 'total_cost',
    },
    {
      label: t('label:license_link'),
      key: 'license_link',
    },
    {
      label: t('label:note'),
      key: 'note',
    },
  ];

  const previewImage = () => {
    if (passData) {
      return (
        <Modalize modalHeight={ScreenHeight} ref={imageRef}>
          <View style={styles.modalImageContainer}>
            <TouchableOpacity
              style={{ position: 'absolute', top: insets.top + 20, right: 20, zIndex: 9999 }}
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
      );
    }
    return null;
  };

  const renderInputItem = (label: string, key: string, formikProps: FormikProps<typeof initialValues>) => {
    const { setFieldValue, errors, values } = formikProps;
    return (
      <MyInput.Base
        onChangeText={(text) => {
          setFieldValue(key, text);
        }}
        value={values[key]}
        keyboardType={key === 'total_cost' ? 'number-pad' : 'default'}
        name={key}
        errors={errors}
        placeholder={label}
        rightIcon={key === 'total_cost' && <AppText style={{ color: color.subText }}>VNĐ</AppText>}
      />
    );
  };
  return (
    <SafeAreaView edges={['top']} style={styles.wrapper}>
      <Host>
        <Formik
          validateOnChange={false}
          initialValues={initialValues}
          onSubmit={(value) => {
            CUCost(value);
          }}
          validationSchema={validationSchema}>
          {(props) => {
            const { handleSubmit } = props;
            return (
              <View style={styles.containerStyles}>
                <View style={styles.header}>
                  <AppHeader
                    headerContainerStyles={styles.headerContainer}
                    iconLeft={<MyIcon.Close />}
                    iconRight={<Icon type="materialIcons" name="done" size={28} color={color.icon} />}
                    iconLeftPress={() => navigation.goBack()}
                    iconRightPress={handleSubmit}
                    title={isAddCost ? t('title:add_cost') : t('title:edit_cost')}
                  />
                </View>

                <View style={styles.costView}>
                  {arrCostType.length > 0 ? (
                    <AppField
                      containerStyle={{ paddingTop: 8, marginLeft: 4 }}
                      typeSelect={FieldType.Choice}
                      isRequire
                      modalName="ModalSelect"
                      title={t('label:costs')}
                      keyShow="value"
                      name="costs"
                      dataSelect={arrCostType}
                      Component={DropDownMutiline}
                    />
                  ) : null}

                  {titleInput?.map((el) => renderInputItem(el.label, el.key, props))}
                  <View style={styles.chooseImageContainerStyles}>
                    <View style={styles.imagePicker}>
                      <TouchableOpacity
                        disabled={image.length === 5}
                        style={{ marginBottom: 8 }}
                        activeOpacity={0.5}
                        onPress={() => {
                          Keyboard.dismiss();
                          if (image.length === 5) {
                            Toast.show({
                              type: 'error',
                              text1: t('label:notice'),
                              text2: t('label:photoLimit', { number: 5 }),
                            });
                            return;
                          }
                          optionRef.current.open();
                        }}>
                        {renderImagePicker()}
                      </TouchableOpacity>
                      {image.map((el, index) => {
                        return (
                          <TouchableOpacity
                            key={index.toString()}
                            onPress={() => {
                              setPassData(el);
                              imageRef.current?.open();
                            }}>
                            <TouchableOpacity
                              style={styles.closeIcon}
                              onPress={() => {
                                if (typeof el === 'string') {
                                  setIndexLink(index);
                                  setImageLink(el);
                                } else {
                                  onDeleteImage(index);
                                }
                              }}>
                              <Icon
                                name="closecircleo"
                                type="antdesign"
                                size={16}
                                color={image.length === 5 ? color.subText : color.navyBlue}
                              />
                            </TouchableOpacity>
                            <AppImage
                              source={{
                                uri:
                                  typeof el === 'string'
                                    ? el.includes('https:')
                                      ? el
                                      : el.replace('http:', 'https:')
                                    : el.path,
                              }}
                              style={styles.imageStyles}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        </Formik>
      </Host>
      {previewImage()}
      {renderOptionImage()}
      <Modal visible={!!imageLink} animationType="fade" transparent={true}>
        <AppConfirm
          title={t('lead:delete_image')}
          content={t('lead:confirm_delete_image')}
          onPressLeft={() => {
            setImageLink(null);
          }}
          onPressRight={() => {
            if (imageLink) {
              const arrQuest = imageLink.split('?');

              const link = arrQuest[1];
              const arrSplit = link.split('&');
              if (arrSplit.length > 0) {
                const find = arrSplit.find((x) =>
                  x
                    .trim()
                    .toLocaleLowerCase()
                    .includes('fielid' || 'fileid'),
                );
                if (find) {
                  const arrChildSplit = find.split('=');
                  if (arrChildSplit.length === 2) {
                    deleteImage(arrChildSplit[1]);
                    setImageLink(null);
                  }
                }
              }
            }
          }}
        />
      </Modal>
    </SafeAreaView>
  );
};
