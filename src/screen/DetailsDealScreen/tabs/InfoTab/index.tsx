import styles from './styles';
import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ItemInfo } from '@components/Item/Details/index';
import { color, fontSize } from '@helpers/index';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/reducers';
import { setRefreshingDealInfo } from '@redux/actions/detailsActions';
import serviceUrls from '@services/serviceUrls';
import { ResponseReturn } from '@interfaces/response.interface';
import { FieldExtension } from '@interfaces/lead.interface';
import { apiGet } from '@services/serviceHandle';
import { DATE_FORMAT, FieldType, TypeFieldExtension } from '@helpers/constants';
import { convertCurrency, setFieldData } from '@helpers/untils';
import { Modalize } from 'react-native-modalize';
import { AppText, AppEmptyViewList } from '@components/index';
import { MyInput } from '@components/Input';
import { Portal } from 'react-native-portalize';
import dayjs from 'dayjs';
import { isIOS } from 'react-native-elements/dist/helpers';
import { screenHeight } from 'react-native-calendars/src/expandableCalendar/commons';
import { isArray } from 'lodash';
import { AppRoutes } from '@navigation/appRoutes';
import { useNavigation } from '@react-navigation/native';
interface IInfoTab {}

const InfoTab = (props: IInfoTab) => {
  useEffect(() => {
    if (arrFieldDetails.length === 0) {
      getFieldExtension();
    }
  });
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const bottomSheetModalRef = useRef<Modalize>();
  const [typeModal, setTypeModal] = useState<'product' | 'contact' | 'multi'>('contact');
  const [textFilter, setTextFilter] = useState('');
  const [titleBottom, setTitleBottom] = useState('');
  const { objInfo, isInfoError, isInfoLoading } = useSelector((state: RootState) => state.detailsDealReducer);
  const [arrFieldDetails, setFieldDetails] = useState<FieldExtension[]>([]);
  const getFieldExtension = async () => {
    try {
      const url = serviceUrls.path.fieldDetails.replace('{list}', TypeFieldExtension.deal);
      const response: ResponseReturn<FieldExtension[]> = await apiGet(url, {});
      if (response.error) {
        return;
      }
      if (response.response && response.response.data) {
        setFieldDetails(response.response.data);
      }
    } catch (error) {}
  };
  let convertInfo: [string, any][] = [];

  if (objInfo) {
    convertInfo = Object.entries(objInfo);
  }

  const openBottomSheet = (type: 'product' | 'contact' | 'multi', title: string) => {
    setTitleBottom(title);
    setTypeModal(type);
    bottomSheetModalRef.current?.open();
  };

  const isRolePress = objInfo && objInfo.contacts && objInfo.contacts.length > 1 ? true : false;
  const isProductMany = objInfo && objInfo.products && objInfo.products.length > 1 ? true : false;
  const getValueInfo = (label: string, fieldType: number) => {
    const objValue = {
      length: 1,
      value: '----',
    };
    try {
      if (objInfo) {
        switch (fieldType) {
          case FieldType.Text:
            if (objInfo.fieldExtensionText && objInfo.fieldExtensionText.length > 0) {
              const index = objInfo.fieldExtensionText.findIndex(
                (x) => x.name.toLocaleLowerCase() === label.toLocaleLowerCase(),
              );
              if (index > -1) {
                objValue.value = objInfo.fieldExtensionText[index].value.toString();
              }
            }
            break;
          case FieldType.Number:
            if (objInfo.fieldExtensionNumber && objInfo.fieldExtensionNumber.length > 0) {
              const index = objInfo.fieldExtensionNumber.findIndex(
                (x) => x.name.toLocaleLowerCase() === label.toLocaleLowerCase(),
              );
              if (index > -1) {
                objValue.value = objInfo.fieldExtensionNumber[index].value.toString();
              }
            }
            break;
          case FieldType.Textarea:
            if (objInfo.fieldExtensionText && objInfo.fieldExtensionText.length > 0) {
              const index = objInfo.fieldExtensionText.findIndex(
                (x) => x.name.toLocaleLowerCase() === label.toLocaleLowerCase(),
              );
              if (index > -1) {
                objValue.value = objInfo.fieldExtensionText[index].value.toString();
              }
            }
            break;
          case FieldType.MutiSelect:
            if (objInfo.fieldExtensionMultiSelect && objInfo.fieldExtensionMultiSelect.length > 0) {
              const index = objInfo.fieldExtensionMultiSelect.findIndex(
                (x) => x.name.toLocaleLowerCase() === label.toLocaleLowerCase(),
              );
              if (index > -1) {
                const split = objInfo.fieldExtensionMultiSelect[index].value.toString().split(';');
                if (split.length > 1) {
                  objValue.value = `${split[0]} + ${split.length - 1}`;
                  objValue.length = split.length;
                } else {
                  objValue.value = objInfo.fieldExtensionMultiSelect[index].value.toString();
                }
              }
            }
            break;
          case FieldType.DateTime:
            if (objInfo.fieldExtensionDate && objInfo.fieldExtensionDate.length > 0) {
              const index = objInfo.fieldExtensionDate.findIndex(
                (x) => x.name.toLocaleLowerCase() === label.toLocaleLowerCase(),
              );
              if (index > -1) {
                objValue.value = setFieldData(objInfo.fieldExtensionDate[index].value.toString());
              }
            }
            break;
          case FieldType.Choice:
            if (objInfo.fieldExtensionChoice && objInfo.fieldExtensionChoice.length > 0) {
              const index = objInfo.fieldExtensionChoice.findIndex(
                (x) => x.name.toLocaleLowerCase() === label.toLocaleLowerCase(),
              );
              if (index > -1) {
                objValue.value = objInfo.fieldExtensionChoice[index].value.toString();
              }
            }
            break;
          default:
            break;
        }
        return objValue;
      }
      return objValue;
    } catch (error) {
      return objValue;
    }
  };

  const renderBottomContent = () => {
    switch (typeModal) {
      case 'product':
        return (
          <>
            {objInfo &&
              objInfo.products &&
              objInfo.products.length > 0 &&
              objInfo.products
                .filter(
                  (x) => x.name.trim().toLocaleLowerCase().includes(textFilter.trim().toLocaleLowerCase()) === true,
                )
                .map((v, i) => {
                  return (
                    <View key={v.name} style={styles.touchItemSheet}>
                      <AppText value={v.name} fontSize={fontSize.f14} style={styles.textItemSheet} />
                      <View style={styles.lineItemSepe} />
                    </View>
                  );
                })}
          </>
        );
      case 'contact':
        return (
          <>
            {objInfo &&
              objInfo.contacts &&
              objInfo.contacts.length > 0 &&
              objInfo.contacts
                .filter(
                  (x) => x.name.trim().toLocaleLowerCase().includes(textFilter.trim().toLocaleLowerCase()) === true,
                )
                .map((v, i) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        bottomSheetModalRef.current?.close();
                        navigation.navigate(AppRoutes.DETAIL_CONTACT, { key: v.id, isGoback: true });
                      }}
                      key={v.name}
                      style={styles.touchItemSheet}>
                      <AppText
                        value={v.name}
                        fontSize={fontSize.f14}
                        style={styles.textItemSheet}
                        color={color.navyBlue}
                      />
                      <View style={styles.lineItemSepe} />
                    </TouchableOpacity>
                  );
                })}
          </>
        );
      case 'multi':
        if (objInfo && objInfo.fieldExtensionMultiSelect && objInfo.fieldExtensionMultiSelect.length > 0) {
          const index = objInfo.fieldExtensionMultiSelect.findIndex(
            (x) => x.name.toLocaleLowerCase() === titleBottom.toLocaleLowerCase(),
          );
          if (index > -1) {
            const split = objInfo.fieldExtensionMultiSelect[index].value.toString().split(';');
            return (
              <>
                {split
                  .filter(
                    (x) =>
                      x.toString().trim().toLocaleLowerCase().includes(textFilter.trim().toLocaleLowerCase()) === true,
                  )
                  .map((v, i) => {
                    return (
                      <View key={v} style={styles.touchItemSheet}>
                        <AppText value={v} fontSize={fontSize.f14} style={styles.textItemSheet} />
                        <View style={styles.lineItemSepe} />
                      </View>
                    );
                  })}
              </>
            );
          } else {
            return null;
          }
        } else {
          return null;
        }
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.viewFilter, { height: 4 }]} />
      {isInfoLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size={'large'} color={color.navyBlue} />
        </View>
      ) : (
        <ScrollView>
          {isInfoError ? (
            <AppEmptyViewList
              isRefreshing={isInfoLoading}
              isErrorData={isInfoError}
              onReloadData={() => dispatch(setRefreshingDealInfo(true))}
            />
          ) : (
            <>
              {arrFieldDetails.map((v, i) => {
                const foundField = convertInfo.findIndex(
                  (x) => x[0].toLocaleLowerCase() === v.name.toLocaleLowerCase(),
                );
                if (!v.isDefault) {
                  return (
                    <ItemInfo
                      key={i}
                      title={v.label}
                      content={getValueInfo(v.label, v.fieldType).value}
                      isTouch={getValueInfo(v.label, v.fieldType).length > 1}
                      colorExtra={getValueInfo(v.label, v.fieldType).length > 1 ? color.navyBlue : color.black}
                      onPress={() => {
                        if (getValueInfo(v.label, v.fieldType).length > 1) {
                          openBottomSheet('multi', v.label);
                        }
                      }}
                    />
                  );
                }
                if (v.name === 'ExpectationValue') {
                  return (
                    <ItemInfo
                      key={i}
                      title={v.label}
                      content={objInfo && objInfo.expectationValue ? convertCurrency(objInfo.expectationValue) : '----'}
                    />
                  );
                }
                if (v.name === 'CreatedDate') {
                  return (
                    <ItemInfo
                      key={i}
                      title={v.label}
                      content={
                        objInfo && objInfo.creationTime ? dayjs(objInfo.creationTime).format(DATE_FORMAT) : '----'
                      }
                    />
                  );
                }
                if (v.name === 'RetailerId') {
                  return (
                    <ItemInfo
                      key={i}
                      title={v.label}
                      content={objInfo && objInfo.retailerName && objInfo.retailerId ? objInfo.retailerName : '----'}
                    />
                  );
                }
                if (v.name === 'UpdatedDate') {
                  return (
                    <ItemInfo
                      key={i}
                      title={v.label}
                      content={
                        objInfo && objInfo.creationTime ? dayjs(objInfo.creationTime).format(DATE_FORMAT) : '----'
                      }
                    />
                  );
                }
                if (v.name === 'CreateByName') {
                  return (
                    <ItemInfo
                      key={i}
                      title={v.label}
                      content={objInfo && objInfo.createdName ? objInfo.createdName : '----'}
                    />
                  );
                }
                if (v.name === 'UpdateByName') {
                  return (
                    <ItemInfo
                      key={i}
                      title={v.label}
                      content={
                        objInfo
                          ? objInfo.updatedName
                            ? objInfo.updatedName
                            : objInfo.createdName
                            ? objInfo.createdName
                            : '----'
                          : '----'
                      }
                    />
                  );
                }
                if (v.name === 'ProductName') {
                  let product = '----';
                  if (objInfo && isArray(objInfo.products) && objInfo.products.length > 0) {
                    if (objInfo.products.length > 1) {
                      product = `${objInfo.products[0].name} +${objInfo.products.length - 1}`;
                    } else {
                      product = objInfo.products[0].name;
                    }
                  }
                  return (
                    <ItemInfo
                      key={i}
                      title={v.label}
                      isTouch={isProductMany}
                      onPress={() => {
                        if (isProductMany) {
                          openBottomSheet('product', v.label);
                        }
                      }}
                      colorExtra={isProductMany ? color.navyBlue : color.black}
                      content={product}
                    />
                  );
                }
                if (v.name === 'ContactName') {
                  let contact = '----';
                  if (objInfo && isArray(objInfo.contacts) && objInfo.contacts.length > 0) {
                    if (objInfo.contacts.length > 1) {
                      contact = `${objInfo.contacts[0].name} +${objInfo.contacts.length - 1}`;
                    } else {
                      contact = objInfo.contacts[0].name;
                    }
                  }
                  return (
                    <ItemInfo
                      key={i}
                      title={v.label}
                      content={contact}
                      isTouch={isRolePress}
                      onPress={() => {
                        if (isRolePress) {
                          openBottomSheet('contact', v.label);
                        }
                      }}
                      colorExtra={isRolePress ? color.navyBlue : color.black}
                    />
                  );
                }
                if (v.name === 'Tags') {
                  const tags =
                    objInfo && isArray(objInfo.tags) && objInfo.tags.length > 0
                      ? objInfo.tags.map((elm) => elm).join('; ')
                      : '----';
                  return <ItemInfo key={i} title={v.label} content={tags} />;
                }
                if (v.name === 'PipelineName') {
                  const pipeLineName =
                    objInfo?.pipelines.find((elm) => elm.id === objInfo.currentPipelineId)?.pipeline1 || '---';
                  return <ItemInfo key={i} title={v.label} content={pipeLineName} />;
                }
                if (v.name === 'ProjectId') {
                  return (
                    <ItemInfo
                      key={i}
                      title={v.label}
                      content={objInfo && objInfo.projectName ? objInfo.projectName : '----'}
                      isTouch={false}
                    />
                  );
                }
                if (foundField > -1) {
                  const dayjsContent =
                    v.fieldType === FieldType.DateTime
                      ? setFieldData(convertInfo[foundField][1])
                      : convertInfo[foundField][1];
                  return <ItemInfo key={i} title={v.label} content={dayjsContent || '----'} />;
                }

                return <ItemInfo key={i} title={v.label} content={'----'} />;
              })}
            </>
          )}
        </ScrollView>
      )}
      <Portal>
        <Modalize
          onClosed={() => {
            setTextFilter('');
          }}
          adjustToContentHeight
          HeaderComponent={() => {
            return (
              <View style={styles.headerBotSheet}>
                <View style={styles.centerHeader}>
                  <AppText
                    value={titleBottom}
                    fontSize={fontSize.f16}
                    fontWeight="semibold"
                    style={{ textAlign: 'center' }}
                  />
                </View>
              </View>
            );
          }}
          ref={bottomSheetModalRef}>
          <MyInput.Search
            value={textFilter}
            placeholder={`${t('lead:input_filter_bottom')} ${titleBottom.toLocaleLowerCase()}`}
            onChangeText={(text) => {
              setTextFilter(text);
            }}
          />
          <View style={{ height: isIOS ? undefined : screenHeight * 0.7 }}>{renderBottomContent()}</View>
        </Modalize>
      </Portal>
    </View>
  );
};

export default InfoTab;
