import styles from './styles';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import { SelectButton, AppEmptyViewList, AppText, AppImage, AppConfirm } from '@components/index';
import { color, fontSize, isIos } from '@helpers/index';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/reducers';
import { ItemFile } from '@components/Item/Details/index';
import { detailsCorporateFileRequest, setRefreshingCorporateFile } from '@redux/actions/detailsActions';
import { ItemAttachFiles } from '@interfaces/lead.interface';
import { ModalizeDetailsType, TypeCriteria, URL_CURRENT } from '@helpers/constants';
import { Modalize } from 'react-native-modalize';
import FileBottomSheet from '@components/Details/FileBottomSheet';
import { Portal } from 'react-native-portalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import Toast from 'react-native-toast-message';
import serviceUrls from '@services/serviceUrls';
import { apiDelete, apiShowDownload } from '@services/serviceHandle';
import { AppContext } from '@contexts/index';
import { ResponseReturn, ResponseReturnArray } from '@interfaces/response.interface';
import { setTimeOut } from '@helpers/untils';
import { ItemChild } from '@interfaces/deal.interface';
import RNFetchBlob, { RNFetchBlobConfig } from 'rn-fetch-blob';
interface FileTab {}

const FileTab = (props: FileTab) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const bottomSheetModalRef = useRef<Modalize>();
  const imageRef = useRef<Modalize>();
  const insets = useSafeAreaInsets();
  const appContext = useContext(AppContext);
  const [modalType, setModalType] = useState<'ModalFilter' | 'ModalItem'>('ModalItem');
  const [selectedFile, setSelecteFile] = useState<ItemAttachFiles | null>(null);
  const { objFile, corporateId } = useSelector((state: RootState) => state.detailsCorporateReducer);
  const [imageShow, setImageShow] = useState<string | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [idFilter, setIdFilter] = useState(-99);
  const userReducer = useSelector((params: RootState) => params.userReducer);
  const [skipCount, setSkipCount] = useState(1);
  useEffect(() => {
    if (objFile.load.isRefreshing) {
      if (idFilter === -99) {
        dispatch(
          detailsCorporateFileRequest({
            ObjectId: corporateId ?? '',
            menuId: TypeCriteria.corporate,
            SkipCount: skipCount,
            TakeResultCount: 20,
          }),
        );
      } else {
        dispatch(
          detailsCorporateFileRequest({
            ObjectId: corporateId ?? '',
            menuId: TypeCriteria.corporate,
            SkipCount: skipCount,
            TakeResultCount: 20,
            FileType: idFilter,
          }),
        );
      }
    }
  }, [objFile.load.isRefreshing]);

  const previewImage = () => {
    return (
      <Modalize modalHeight={ScreenHeight} ref={imageRef}>
        <View style={styles.modalImageContainer}>
          <TouchableOpacity
            style={{ position: 'absolute', top: insets.top + 20, right: 20 }}
            onPress={() => imageRef.current?.close()}>
            <Icon name="close" type="antdesign" color={color.white} />
          </TouchableOpacity>
          {imageShow ? <AppImage source={{ uri: imageShow }} style={styles.imageViewer} resizeMode="contain"/> : null}
        </View>
      </Modalize>
    );
  };

  const openModal = (type: 'ModalFilter' | 'ModalItem') => {
    setModalType(type);
    bottomSheetModalRef.current?.open();
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'ModalItem':
        return (
          <FileBottomSheet
            item={selectedFile}
            type={ModalizeDetailsType.item}
            onPress={(id: number) => {
              actionItem(id);
              bottomSheetModalRef.current?.close();
            }}
          />
        );
      case 'ModalFilter':
        return (
          <FileBottomSheet
            item={null}
            type={ModalizeDetailsType.filter}
            onPress={(id: number) => {
              setIdFilter(id);
              bottomSheetModalRef.current?.close();
              setTimeout(() => {
                dispatch(setRefreshingCorporateFile(true));
              }, setTimeOut());
            }}
          />
        );
      default:
        return null;
    }
  };

  const showDownload = async () => {
    try {
      appContext.setLoading(true);
      if (selectedFile) {
        const url = `${serviceUrls.path.showDownload}${selectedFile.id}`;
        if (selectedFile.fileType === 1) {
          const response: ResponseReturnArray<Blob> = await apiShowDownload(url, {});
          if (response.error) {
            Toast.show({
              type: 'error',
              text1: t('lead:notice'),
              text2: response.errorMessage || response.detail || '',
            });
            return;
          }
          if (response.response) {
            const fileReaderInstance = new FileReader();
            fileReaderInstance.readAsDataURL(response.response);
            fileReaderInstance.onload = () => {
              if (typeof fileReaderInstance.result === 'string') {
                if (fileReaderInstance.result.includes('data:image')) {
                  setImageShow(fileReaderInstance.result);
                } else {
                  setImageShow(
                    `data:image/${selectedFile.fileExtension?.replace('.', '') ?? 'jpg'}:base64${
                      fileReaderInstance.result
                    }`,
                  );
                }
                setTimeout(() => {
                  imageRef.current?.open();
                }, setTimeOut());
              }
            };
          }
        } else {
          const {
            dirs: { DownloadDir, DocumentDir },
          } = RNFetchBlob.fs;
          const { config } = RNFetchBlob;
          const aPath = Platform.select({ ios: DocumentDir, android: DownloadDir });
          const fPath = `${aPath || ''}/${
            selectedFile && selectedFile.fileName
              ? selectedFile.fileName
              : Math.floor(new Date(Date.now()).getSeconds() + new Date(Date.now()).getMilliseconds())
          }${selectedFile.fileExtension || '.'}`;
          const fileExt = selectedFile.fileExtension;
          let mimeType = '';

          if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg') {
            mimeType = 'image/*';
          }
          if (fileExt === 'pdf') {
            mimeType = 'application/pdf';
          }
          if (fileExt === 'avi' || fileExt === 'mp4' || fileExt === 'mov') {
            mimeType = 'video/*';
          }
          const configOptions = Platform.select({
            ios: {
              fileCache: true,
              path: fPath,
              notification: true,
            },

            android: {
              fileCache: false,
              appendExt: fileExt,
              addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                mediaScannable: true,
                path: fPath,
                mime: mimeType,
                description: 'Downloading...',
              },
            },
          });
          if (!isIos) {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
              title: 'Permission to save file into the file storage',
              message: 'The app needs access to your file storage so you can download the file',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            });

            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
              throw new Error();
            }
          }
          config(configOptions as RNFetchBlobConfig)
            .fetch('GET', URL_CURRENT + url, { Authorization: `Bearer ${userReducer.accessToken}` })
            .then((res) => {
              if (isIos) {
                setTimeout(() => {
                  // RNFetchBlob.ios.previewDocument('file://' + res.path());   //<---Property to display iOS option to save file
                  RNFetchBlob.ios.openDocument(res.data); //<---Property to display downloaded file on documaent viewer
                }, 300);
              } else {
                RNFetchBlob.android.addCompleteDownload({
                  title: selectedFile?.fileName || '',
                  description: 'Download complete',
                  mime: mimeType,
                  path: fPath,
                  showNotification: true,
                });
                Toast.show({
                  type: 'success',
                  text1: t('lead:notice'),
                  text2: t('lead:download_file_success'),
                });
              }
            })
            .catch((errorMessage) => {
              Toast.show({ type: 'error', text1: errorMessage });
            });
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

  const deleteFile = async () => {
    try {
      appContext.setLoading(true);
      if (selectedFile) {
        const url = `${serviceUrls.path.deleteAttachFile}${selectedFile.id}`;
        const response: ResponseReturn<boolean> = await apiDelete(url, {});
        if (response.error) {
          Toast.show({
            type: 'error',
            text1: t('lead:notice'),
            text2: response.errorMessage || response.detail || '',
          });
          return;
        }
        if (response.response && response.response.data) {
          dispatch(setRefreshingCorporateFile(true));
        }
      }
    } catch (error) {
    } finally {
      appContext.setLoading(false);
    }
  };

  const actionItem = (id: number) => {
    try {
      switch (id) {
        case 1:
          showDownload();
          break;
        case 2:
          showDownload();
          break;
        case 3:
          if (selectedFile && selectedFile.filePath) {
            Linking.openURL(selectedFile.filePath);
          }
          break;
        case -99:
          setOpenConfirm(true);
          break;
        default:
          break;
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('lead:notice'),
        text2: JSON.stringify(error),
      });
    }
  };

  const arrFilter = [
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
    {
      id: -99,
      name: t('label:all'),
    },
  ];
  let obj: ItemChild = {
    id: -99,
    name: t('label:all'),
  };
  const findIndex = arrFilter.findIndex((x) => x.id === idFilter);
  if (findIndex > -1) {
    obj = arrFilter[findIndex];
  }

  return (
    <View style={styles.container}>
      <View style={styles.viewFilter}>
        <SelectButton
          titleStyle={styles.filterText}
          themeColor={color.subText}
          onPress={() => {
            openModal('ModalFilter');
          }}
          title={obj.name}
        />
      </View>
      <FlatList
        refreshing={objFile.load.isRefreshing}
        onRefresh={() => {
          dispatch(setRefreshingCorporateFile(true));
        }}
        data={objFile.arrFile}
        extraData={objFile.arrFile}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={({ item, index }) => (
          <ItemFile
            item={item}
            onPress={() => {
              setSelecteFile(item);
              openModal('ModalItem');
            }}
          />
        )}
        ListEmptyComponent={() => {
          return (
            <AppEmptyViewList
              isRefreshing={objFile.load.isRefreshing}
              isErrorData={objFile.load.isError}
              onReloadData={() => dispatch(setRefreshingCorporateFile(true))}
            />
          );
        }}
        ListFooterComponent={() => {
          if (objFile.arrFile.length >= objFile.totalFile || objFile.load.isRefreshing) {
            return null;
          }
          return (
            <View style={styles.loading}>
              <ActivityIndicator size={'large'} color={color.navyBlue} />
            </View>
          );
        }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (objFile.arrFile.length >= objFile.totalFile) {
            return;
          }
          dispatch(
            detailsCorporateFileRequest({
              ObjectId: corporateId ?? '',
              menuId: TypeCriteria.corporate,
              SkipCount: objFile.page + 1,
              TakeResultCount: 20,
              FileType: idFilter !== -99 ? idFilter : null,
            }),
          );
        }}
      />
      <Portal>
        <Modalize
          adjustToContentHeight
          HeaderComponent={() => {
            if (modalType === 'ModalFilter') {
              return (
                <View style={styles.headerBotSheet}>
                  <View style={styles.centerHeader}>
                    <AppText value={t('lead:file_select').toString()} fontSize={fontSize.f16} fontWeight="semibold" />
                  </View>
                </View>
              );
            }
            return null;
          }}
          ref={bottomSheetModalRef}>
          {renderModalContent()}
        </Modalize>
        {previewImage()}
      </Portal>
      <Modal visible={openConfirm} transparent animationType="fade">
        <AppConfirm
          title={t('lead:confirm')}
          content={t('lead:confirm_delete_attach')}
          onPressLeft={() => setOpenConfirm(false)}
          onPressRight={() => {
            setOpenConfirm(false);
            deleteFile();
          }}
        />
      </Modal>
    </View>
  );
};

export default FileTab;
