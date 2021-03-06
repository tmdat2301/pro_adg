import styles from './styles';
import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ItemInfo } from '@components/Item/Details/index';
import { color, fontSize } from '@helpers/index';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/reducers';
import { AppEmptyViewList, AppText } from '@components/index';
import { setRefreshingContactInfo } from '@redux/actions/detailsActions';
import { ResponseReturn } from '@interfaces/response.interface';
import { FieldExtension } from '@interfaces/lead.interface';
import serviceUrls from '@services/serviceUrls';
import { apiGet } from '@services/serviceHandle';
import { DATE_FORMAT, FieldType, TypeFieldExtension } from '@helpers/constants';
import { convertCurrency, setFieldData } from '@helpers/untils';
import dayjs from 'dayjs';
import { isArray } from 'lodash';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { MyInput } from '@components/Input';
import { useNavigation } from '@react-navigation/native';
import { AppRoutes } from '@navigation/appRoutes';
import { isIOS, ScreenHeight } from 'react-native-elements/dist/helpers';
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
  const [textFilter, setTextFilter] = useState('');
  const { objInfo, isInfoError, isInfoLoading } = useSelector((state: RootState) => state.detailsContactReducer);
  const [arrFieldDetails, setFieldDetails] = useState<FieldExtension[]>([]);
  const [titleBottom, setTitleBottom] = useState('');
  const [typeModal, setTypeModal] = useState<'webs' | 'fanpage' | 'email' | 'phone' | 'accounts' | 'multi' | 'single'>(
    'phone',
  );
  const getFieldExtension = async () => {
    try {
      const url = serviceUrls.path.fieldDetails.replace('{list}', TypeFieldExtension.contact);
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

  const openBottomSheet = (
    type: 'webs' | 'fanpage' | 'email' | 'phone' | 'accounts' | 'multi' | 'single',
    title: string,
  ) => {
    setTitleBottom(title);
    setTypeModal(type);
    bottomSheetModalRef.current?.open();
  };

  const renderBottomContent = () => {
    switch (typeModal) {
      case 'fanpage':
        return (
          <>
            {objInfo &&
              objInfo.fanpages &&
              objInfo.fanpages.length > 0 &&
              objInfo.fanpages
                .filter((x) => x.fanpage.toLocaleLowerCase().includes(textFilter.trim().toLocaleLowerCase()) === true)
                .map((v, i) => {
                  return (
                    <View key={v.fanpage} style={styles.touchItemSheet}>
                      <AppText value={v.fanpage} fontSize={fontSize.f14} style={styles.textItemSheet} />
                      <View style={styles.lineItemSepe} />
                    </View>
                  );
                })}
          </>
        );
      case 'webs':
        return (
          <>
            {objInfo &&
              objInfo.websites &&
              objInfo.websites.length > 0 &&
              objInfo.websites
                .filter((x) => x.website.toLocaleLowerCase().includes(textFilter.trim().toLocaleLowerCase()) === true)
                .map((v, i) => {
                  return (
                    <View key={v.website} style={styles.touchItemSheet}>
                      <AppText value={v.website} fontSize={fontSize.f14} style={styles.textItemSheet} />
                      <View style={styles.lineItemSepe} />
                    </View>
                  );
                })}
          </>
        );
      case 'phone':
        return (
          <>
            {objInfo &&
              objInfo.mobiles &&
              objInfo.mobiles.length > 0 &&
              objInfo.mobiles
                .filter(
                  (x) =>
                    `${x.code.trim()}${x.phoneNumber.trim()}`
                      .replace(' ', '')
                      .includes(textFilter.trim().toLocaleLowerCase()) === true,
                )
                .map((v, i) => {
                  return (
                    <View key={v.phoneNumber} style={styles.touchItemSheet}>
                      <AppText
                        value={`(+${v.code})${v.phoneNumber}`}
                        fontSize={fontSize.f14}
                        style={styles.textItemSheet}
                      />
                      <View style={styles.lineItemSepe} />
                    </View>
                  );
                })}
          </>
        );
      case 'email':
        return (
          <>
            {objInfo &&
              objInfo.emails &&
              objInfo.emails.length > 0 &&
              objInfo.emails
                .filter(
                  (x) => x.value.trim().toLocaleLowerCase().includes(textFilter.trim().toLocaleLowerCase()) === true,
                )
                .map((v, i) => {
                  return (
                    <View key={v.value} style={styles.touchItemSheet}>
                      <AppText value={v.value} fontSize={fontSize.f14} style={styles.textItemSheet} />
                      <View style={styles.lineItemSepe} />
                    </View>
                  );
                })}
          </>
        );
      case 'accounts':
        return (
          <>
            {objInfo &&
              objInfo.accounts &&
              objInfo.accounts.length > 0 &&
              objInfo.accounts
                .filter(
                  (x) => x.name?.trim().toLocaleLowerCase().includes(textFilter.trim().toLocaleLowerCase()) === true,
                )
                .map((v, i) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        bottomSheetModalRef.current?.close();
                        navigation.navigate(AppRoutes.DETAIL_CORPORATE, { key: v.corporateId, isGoback: true });
                      }}
                      key={v.corporateId}
                      style={styles.touchItemSheet}>
                      <AppText
                        value={v.name ?? ''}
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
      case 'single':
        if (objInfo && objInfo.fieldExtensionText && objInfo.fieldExtensionText.length > 0) {
          const index = objInfo.fieldExtensionText.findIndex(
            (x) => x.name.toLocaleLowerCase() === titleBottom.toLocaleLowerCase(),
          );
          if (index > -1 && JSON.parse(objInfo.fieldExtensionText[index].value.toString()).length > 0) {
            return (
              <>
                {JSON.parse(objInfo.fieldExtensionText[index].value.toString())
                  .filter(
                    (x) =>
                      x?.Name.toString().trim().toLocaleLowerCase().includes(textFilter.trim().toLocaleLowerCase()) ===
                      true,
                  )
                  .map((v, i) => {
                    return (
                      <View key={v?.Name} style={styles.touchItemSheet}>
                        <AppText
                          value={`${v?.Name} - ${convertCurrency(v?.Value)}??`}
                          fontSize={fontSize.f14}
                          style={styles.textItemSheet}
                        />
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

  const getValueInfo = (label: string, fieldType: number) => {
    const objValue = {
      length: 1,
      value: '----',
      type: 1,
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
                if (JSON.parse(objInfo.fieldExtensionText[index].value.toString()).length > 0) {
                  const dataFormat = JSON.parse(objInfo.fieldExtensionText[index].value.toString());
                  objValue.value = dataFormat.map((v) => `${v.Name} - ${convertCurrency(v.Value)}??`).join('; ');
                  objValue.length = dataFormat.length;
                } else {
                  objValue.value = objInfo.fieldExtensionText[index].value.toString();
                }
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
                  objValue.type = 99;
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
  const isWebMany = objInfo && objInfo.websites && objInfo.websites.length > 1 ? true : false;
  const isFanpageMany = objInfo && objInfo.fanpages && objInfo.fanpages.length > 1 ? true : false;
  const isEmailMany = objInfo && objInfo.emails && objInfo.emails.length > 1 ? true : false;
  const isPhoneMany = objInfo && objInfo.mobiles && objInfo.mobiles.length > 1 ? true : false;
  const isAccMany = objInfo && objInfo.accounts && objInfo.accounts.length > 1 ? true : false;
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
              onReloadData={() => dispatch(setRefreshingContactInfo(true))}
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
                          openBottomSheet(getValueInfo(v.label, v.fieldType).type === 99 ? 'multi' : 'single', v.label);
                        }
                      }}
                    />
                  );
                }
                if (v.name === 'LastActivity') {
                  return (
                    <ItemInfo
                      key={i}
                      title={v.label}
                      content={
                        objInfo && objInfo.lastUpdatedActivies
                          ? objInfo.lastUpdatedActivies
                          : objInfo && objInfo.updatedDate
                          ? dayjs(objInfo.updatedDate).format(DATE_FORMAT)
                          : '----'
                      }
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
                if (v.name === 'Website') {
                  let website = '----';
                  if (objInfo && isArray(objInfo.websites) && objInfo.websites.length > 0) {
                    if (objInfo.websites.length > 1) {
                      const indexMain = objInfo.websites.findIndex((x) => x.isMain);
                      if (indexMain > -1) {
                        website = `${objInfo.websites[indexMain].website} +${objInfo.websites.length - 1}`;
                      } else {
                        website = `${objInfo.websites[0].website} +${objInfo.websites.length - 1}`;
                      }
                    } else {
                      website = objInfo.websites[0].website;
                    }
                  }
                  return (
                    <ItemInfo
                      key={i}
                      title={v.label}
                      content={website || '----'}
                      isTouch={isWebMany}
                      onPress={() => {
                        if (isWebMany) {
                          openBottomSheet('webs', v.label);
                        }
                      }}
                      colorExtra={isWebMany ? color.navyBlue : color.black}
                    />
                  );
                }
                if (v.name === 'Fanpage') {
                  let fanpage = '----';
                  if (objInfo && isArray(objInfo.fanpages) && objInfo.fanpages.length > 0) {
                    if (objInfo.fanpages.length > 1) {
                      const indexMain = objInfo.fanpages.findIndex((x) => x.isMain);
                      if (indexMain > -1) {
                        fanpage = `${objInfo.fanpages[indexMain].fanpage} +${objInfo.fanpages.length - 1}`;
                      } else {
                        fanpage = `${objInfo.fanpages[0].fanpage} +${objInfo.fanpages.length - 1}`;
                      }
                    } else {
                      fanpage = objInfo.fanpages[0].fanpage;
                    }
                  }
                  return (
                    <ItemInfo
                      key={i}
                      title={v.label}
                      content={fanpage || '----'}
                      isTouch={isFanpageMany}
                      onPress={() => {
                        if (isFanpageMany) {
                          openBottomSheet('fanpage', v.label);
                        }
                      }}
                      colorExtra={isFanpageMany ? color.navyBlue : color.black}
                    />
                  );
                }
                if (v.name === 'Email') {
                  let email = '----';
                  if (objInfo && isArray(objInfo.emails) && objInfo.emails.length > 0) {
                    if (objInfo.emails.length > 1) {
                      const indexMain = objInfo.emails.findIndex((x) => x.checked);
                      if (indexMain > -1) {
                        email = `${objInfo.emails[indexMain].value} +${objInfo.emails.length - 1}`;
                      } else {
                        email = `${objInfo.emails[0].value} +${objInfo.emails.length - 1}`;
                      }
                    } else {
                      email = objInfo.emails[0].value;
                    }
                  }
                  return (
                    <ItemInfo
                      key={i}
                      title={v.label}
                      content={email || ''}
                      isTouch={isEmailMany}
                      onPress={() => {
                        if (isEmailMany) {
                          openBottomSheet('email', v.label);
                        }
                      }}
                      colorExtra={isEmailMany ? color.navyBlue : color.black}
                    />
                  );
                }
                if (v.name === 'Mobile') {
                  let mobile = '----';
                  if (objInfo && isArray(objInfo.mobiles) && objInfo.mobiles.length > 0) {
                    if (objInfo.mobiles.length > 1) {
                      const indexMain = objInfo.mobiles.findIndex((x) => x.isMain);
                      if (indexMain > -1) {
                        mobile = `(+${objInfo.mobiles[indexMain].code})${objInfo.mobiles[0].phoneNumber} +${
                          objInfo.mobiles.length - 1
                        }`;
                      } else {
                        mobile = `(+${objInfo.mobiles[0].code})${objInfo.mobiles[0].phoneNumber} +${
                          objInfo.mobiles.length - 1
                        }`;
                      }
                    } else {
                      mobile = `(+${objInfo.mobiles[0].code})${objInfo.mobiles[0].phoneNumber}`;
                    }
                  }
                  return (
                    <ItemInfo
                      key={i}
                      title={v.label}
                      content={mobile || '----'}
                      isTouch={isPhoneMany}
                      onPress={() => {
                        if (isPhoneMany) {
                          openBottomSheet('phone', v.label);
                        }
                      }}
                      colorExtra={isPhoneMany ? color.navyBlue : color.black}
                    />
                  );
                }
                if (v.name === 'PrimaryAccountContactName') {
                  let account = '----';
                  if (objInfo && isArray(objInfo.accounts) && objInfo.accounts.length > 0) {
                    if (objInfo.accounts.length > 1) {
                      const indexMain = objInfo.accounts.findIndex((x) => x.checked);
                      if (indexMain > -1) {
                        account = `${objInfo.accounts[indexMain].name ?? ''} +${objInfo.accounts.length - 1}`;
                      } else {
                        account = `${objInfo.accounts[0].name ?? ''} +${objInfo.accounts.length - 1}`;
                      }
                    } else {
                      account = objInfo.accounts[0].name ?? '----';
                    }
                  }
                  return (
                    <ItemInfo
                      key={i}
                      title={v.label}
                      content={account}
                      isTouch={isAccMany}
                      onPress={() => {
                        if (isAccMany) {
                          openBottomSheet('accounts', v.label);
                        }
                      }}
                      colorExtra={isAccMany ? color.navyBlue : color.black}
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
                if (v.name === 'AccountNumber') {
                  return (
                    <ItemInfo
                      key={i}
                      title={v.label}
                      content={objInfo && objInfo.accountNumber ? objInfo.accountNumber : '----'}
                    />
                  );
                }
                if (v.name === 'IndustryClassification') {
                  return (
                    <ItemInfo
                      key={i}
                      title={v.label}
                      content={
                        objInfo && objInfo.industryClassificationName ? objInfo.industryClassificationName : '----'
                      }
                    />
                  );
                }
                if (foundField > -1 && convertInfo[foundField]) {
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
          <>
            <MyInput.Search
              value={textFilter}
              placeholder={`${t('lead:input_filter_bottom')} ${titleBottom.toLocaleLowerCase()}`}
              onChangeText={(text) => {
                setTextFilter(text);
              }}
            />
            <View style={{ height: isIOS ? undefined : ScreenHeight * 0.7 }}>{renderBottomContent()}</View>
          </>
        </Modalize>
      </Portal>
    </View>
  );
};

export default InfoTab;
