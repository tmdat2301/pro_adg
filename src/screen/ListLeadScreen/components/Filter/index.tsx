import AppButton from '@components/AppButton';
import AppHeader from '@components/AppHeader';
import AppText from '@components/AppText';
import { MyIcon } from '@components/Icon';
import ModalDate from '@components/ModalDate';
import ModalDropDown from '@components/ModalDropDown';
import ModalDropDownMultiple from '@components/ModalDropDownMultiple';
import color from '@helpers/color';
import { decimalOneInput, decimalOneInputOperator, FilterScreenType, filterType } from '@helpers/constants';
import { device, padding } from '@helpers/index';
import { getConditionFilter, getFilterList } from '@redux/actions/leadAction';
import { RootState } from '@redux/reducers';
import { apiPost } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import dayjs from 'dayjs';
import { Formik, FormikProps } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Modalize } from 'react-native-modalize';
import { useDispatch, useSelector } from 'react-redux';
import Yup from 'yup';
import FilterItems from './FilterItems';
import ModalFilterList from './ModalFilterList';
import ModalSaveFilter from './ModalSaveFilter';
import { styles } from './styles';
import uuid from 'react-native-uuid';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { changeBodyFilter as changeBodyFilterContact } from '@redux/actions/contactAction';
import { changeBodyFilter as changeBodyFilterDeal } from '@redux/actions/dealActions';
import { changeBodyFilter as changeBodyFilterLead } from '@redux/actions/leadAction';
import { changeBodyFilter as changeBodyFilterInterprise } from '@redux/actions/interpriseActions';
import { Host } from 'react-native-portalize';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { isEmpty } from 'lodash';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { screenHeight } from 'react-native-calendars/src/expandableCalendar/commons';
import { isIOS } from 'react-native-elements/dist/helpers';
export interface Props { }

export default (props: Props) => {
  const { t } = useTranslation();
  const filterListRef = useRef<any>();
  const conditionRef = useRef<any>();
  const bottomSheetModalRef = useRef<Modalize>(null);

  const leadReducer = useSelector((state: RootState) => state.leadReducers);
  const contactReducers = useSelector((state: RootState) => state.contactReducers);
  const dealReducers = useSelector((state: RootState) => state.dealReducers);
  const interpriseReducers = useSelector((state: RootState) => state.interpriseReducers);
  const [arrError, setArrError] = useState<string[]>([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const getDefaultFilter = (): any => {
    switch (route?.params.type) {
      case FilterScreenType.leads:
        return {
          filter: leadReducer.filter,
          action: changeBodyFilterLead,
          item: leadReducer.currentOrganization,
          label: t('label:filter_lead'),
        };
      case FilterScreenType.contacts:
        return {
          filter: contactReducers.filter,
          action: changeBodyFilterContact,
          item: contactReducers.currentOrganization,
          label: t('label:filter_contact'),
        };
      case FilterScreenType.deals:
        return {
          filter: dealReducers.filter,
          action: changeBodyFilterDeal,
          item: dealReducers.currentOrganization,
          label: t('label:filter_deal'),
        };
      default:
        return {
          filter: interpriseReducers.filter,
          action: changeBodyFilterInterprise,
          item: interpriseReducers.currentOrganization,
          label: t('label:filter_interprise'),
        };
    }
  };

  const [chooseConditions, setChooseConditions] = useState<any>([]);
  const [chooseOneCondition, setChooseOneCondition] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [typeModal, setTypeModal] = useState<any>({});
  const [modalType, setModalType] = useState<
    | 'ModalDropDown'
    | 'ModalDropDownMultiple'
    | 'ModalSelectStart'
    | 'ModalSelectEnd'
    | 'ModalValues'
    | 'ModalSaveFilter'
  >();
  const [showModal, setShowModal] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const validationSchema = Yup?.object().shape({
    values: Yup.number().typeError(t('common:errorNumber')).required(t('common:required')),
  });


  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    const filterData = JSON.parse(getDefaultFilter()?.filter?.filter || '[]');
    const conditions = filterData.map((el: any) => {
      const item = dataFilterLead.find((elm: any) => elm.key === el.Key || elm.id === el.Key);
      return {
        ...item,
        values: el.Values,
        start: el.Start,
        end: el.End,
        operator: el.Operator,
        // type: item.type,
      };
    });
    setChooseConditions([...conditions]);
  }, [getDefaultFilter()?.filter?.filter]);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const dataConditions = [
    {
      key: t('lead:equal'),
      type: 'equal',
    },
    {
      key: t('lead:not_equal'),
      type: 'notEqual',
    },
    {
      key: t('lead:contain'),
      type: 'include',
    },
    {
      key: t('lead:not_contain'),
      type: 'notInclude',
    },
  ];

  const openModal = (
    type:
      | 'ModalDropDown'
      | 'ModalDropDownMultiple'
      | 'ModalSelectStart'
      | 'ModalSelectEnd'
      | 'ModalValues'
      | 'ModalSaveFilter',
  ) => {
    setModalType(type);
    bottomSheetModalRef.current?.open();
  };

  const clearFilter = () => {
    const action = getDefaultFilter().action;
    const filterParams = {
      maxResultCount: 20,
      filterType: 0,
      skipCount: 1,
      filter: JSON.stringify([]),
      organizationItem: getDefaultFilter().item,
    };
    dispatch(action(filterParams));
    navigation.goBack();
  };
  const applyFilter = () => {
    // eslint-disable-next-line quotes
    const defaultFilter = getDefaultFilter().filter;
    const action = getDefaultFilter().action;
    const errors: string[] = [];
    const filterCondition = chooseConditions.map((el: any) => {
      if (el.type == filterType.date) {
        if (!el?.start || !el?.end) {
          errors.push(t('error:filter_validate'));
        } else {
          errors.push('');
        }
      } else {
        if (isEmpty(el.values)) {
          errors.push(t('error:filter_validate'));
        } else {
          errors.push('');
        }
      }

      // @ts-ignore
      const typeString = Object.keys(filterType).find((elm: string) => filterType[elm] === el.type);
      return {
        IsFieldExtension: el.isFieldExtension,
        Type: el.type === 5 ? 'choice' : typeString,
        Operator: el.type === 5 || el.type === 4 ? 'include' : el.type == 3 ? 'fromToWithEqual' : el.operator,
        Values: el.values,
        Key: el.isFieldExtension ? el.id : el.key,
        Start: el.start,
        End: el.end,
      };
    });
    const checkErrors = !isEmpty(errors.filter((e) => e == t('error:filter_validate'))) && !isEmpty(errors);
    if (checkErrors) {
      setArrError([...errors]);
      return;
    }
    setArrError([]);

    const filterParams = {
      maxResultCount: 20,
      filterType: defaultFilter.filterType,
      skipCount: 1,
      filter: JSON.stringify(filterCondition),
      organizationItem: getDefaultFilter().item,
    };
    dispatch(action(filterParams));
    navigation.goBack();
  };

  const handleSearch = (text: string) => {
    const dataFilter = dataFilterLead.filter((el) => el.title.toLowerCase().includes(text.toLowerCase()));
    setDataSearch([...dataFilter]);
  };

  const renderModalContent = (formik: FormikProps<any>) => {
    switch (modalType) {
      case 'ModalDropDown':
        return (
          <ModalDropDown
            header={t('lead:chooseCondition')}
            handleClick={handleChooseOperator}
            modalHeight={device.height / 3}
            selectOne={chooseOneCondition}
            type={typeModal.type}
            data={dataConditions}
          />
        );
      case 'ModalDropDownMultiple':
        return (
          <ModalDropDownMultiple
            header={getDefaultFilter().label}
            handleClick={handleClick}
            data={dataSearch}
            chooseConditions={chooseConditions}
            handleSearch={handleSearch}
          />
        );
      case 'ModalSelectStart':
        return (
          <ModalDate
            handleConfirm={handleConfirm}
            handleCancel={handleCancel}
            date={dayjs(startDate).isValid() ? dayjs(startDate).toDate() : new Date()}
            titleCalendar={t('lead:start_date')}
          />
        );
      case 'ModalSelectEnd':
        return (
          <ModalDate
            handleConfirm={handleEndTimeConfirm}
            handleCancel={handleCancel}
            date={dayjs(endDate).isValid() ? dayjs(endDate).toDate() : new Date()}
            titleCalendar={t('lead:end_date')}
          />
        );
      default:
        break;
    }
  };

  const handleInput = (value: string) => {
    setNameFilter(value);
  };
  const renderButton = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 20,
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingBottom: 15,
          paddingHorizontal: padding.p16,
          backgroundColor: color.lightGray,
        }}>
        <AppButton
          title={t('lead:save_filter')}
          containerStyle={{ flex: 1, marginRight: 10 }}
          cancel
          titleStyle={{ color: color.primary }}
          buttonStyle={{ padding: padding.p12 }}
          disabled={chooseConditions.length === 0}
          onPress={() => {
            const valueEmptyIndex = chooseConditions.findIndex((el: any) => {
              const notEmpty = el.values.filter((elm: string) => !!elm);
              return !notEmpty.length || (decimalOneInputOperator.includes(el.operator) && notEmpty?.length < 2);
            });
            if (valueEmptyIndex > -1) {
              Toast.show({
                type: 'error',
                text1: t('lead:notice'),
                text2: t('lead:input_filter'),
              });
              return;
            }
            setShowModal(!showModal);
          }}
        />
        <AppButton
          onPress={applyFilter}
          title={t('lead:apply')}
          containerStyle={{ flex: 1 }}
          buttonStyle={{ padding: padding.p12 }}
        />
      </View>
    );
  };

  const handleChooseOperator = (operator: string, index: number) => {
    conditionRef.current?.close();
    const array = [...chooseConditions];
    array[index].operator = operator;
    setChooseConditions(array);
  };

  const handleClick = (key: any, index: number, type: any) => {
    const newArray = [...chooseConditions];
    const indexKey = newArray.findIndex((el) => el.key === key);
    if (indexKey >= 0) {
      newArray.splice(indexKey, 1);
      setChooseConditions([...newArray]);
    } else {
      const newData = [...dataSearch];
      newData[index].operator = type == filterType.date ? 'toDay' : 'equal';
      newArray.push(newData[index]);
      setChooseConditions(newArray);
    }
  };

  const handleConfirm = (datePicked: Date) => {
    setStartDate(datePicked);
    setOpen(false);
  };

  const handleEndTimeConfirm = (time: Date) => {
    setEndDate(time);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    bottomSheetModalRef.current?.close();
  };

  const handleDeleteItem = (index: number) => {
    const newArrayListFilter = [...chooseConditions];
    newArrayListFilter.splice(index, 1);
    setChooseConditions(newArrayListFilter);
  };

  const onConfirm = (isFavorite: boolean, filterName: string) => {
    const convertCondition = [...chooseConditions].map((el: any) => {
      return {
        ...el,
        type: Object.keys(filterType).find((elm: string) => {
          // @ts-ignore
          return filterType?.[elm] === el.type;
        }),
      };
    });
    const newFilter = {
      Name: filterName,
      IsFavorite: isFavorite,
      Filter: convertCondition,
      Id: uuid.v4(),
    };
    const newFilters = [...dataFilterList];
    newFilters.map((el: any) => {
      return {
        Name: el.Name,
        IsFavorite: el.IsFavorite,
        Filter: el.Filter,
      };
    });
    setNameFilter('');
    newFilters.unshift(newFilter);
    updateFilterList(newFilters);
  };

  const updateFilterList = (params: any) => {
    const paramsUrl = getApiLabel()?.filterSetting;
    const type = route?.params?.type;

    apiPost(serviceUrls.path.filterList(paramsUrl), params)
      .then((e: any) => {
        if (e?.error) {
          Toast.show({
            type: 'error',
            text1: t('lead:notice'),
            text2: e?.errorMessage || e?.detail || 'ERROR',
          });
        } else {
          Toast.show({
            type: 'success',
            text1: t('lead:notice'),
            text2: t('error:save_filter_success'),
          });
        }
        dispatch(getFilterList(paramsUrl, type));
      })
      .catch((err: Error) => {
        console.log('err onConfirm', err);
      });
  };

  const handleDeleteItemFilter = (index: number) => {
    const newDataFilterList = [...dataFilterList];
    newDataFilterList.splice(index, 1);
    updateFilterList(newDataFilterList);
  };

  const handleFavorite = (id: string) => {
    const newDataFilterList = [...dataFilterList];
    const index = dataFilterList.findIndex((el) => el.Id == id);
    newDataFilterList[index].IsFavorite = !dataFilterList[index].IsFavorite;
    updateFilterList(newDataFilterList);
  };

  const initialValues = {
    isFieldExtension: false,
    type: '',
    operator: '',
    values: [],
    key: '',
    start: '',
    end: '',
  };

  useEffect(() => {
    const type = route?.params?.type;
    dispatch(getFilterList(getApiLabel()?.filterSetting, type));
    dispatch(getConditionFilter(getApiLabel()?.condition, type));
  }, []);
  const route = useRoute<any>();

  const getApiLabel = () => {
    const type = route?.params?.type;
    switch (type) {
      case FilterScreenType.leads:
        return {
          filterSetting: 'FilterSetting.Lead',
          condition: 'lead',
        };
      case FilterScreenType.contacts:
        return {
          filterSetting: 'FilterSetting.Contact',
          condition: 'contact',
        };
      case FilterScreenType.enterprise:
        return {
          filterSetting: 'FilterSetting.Account',
          condition: 'corporate',
        };
      case FilterScreenType.deals:
        return {
          filterSetting: 'FilterSetting.Deal',
          condition: 'deal',
        };

      default:
        return {
          filterSetting: '',
          condition: '',
        };
    }
  };

  const filterListReducer = useSelector((state: RootState) => state.leadReducers);
  const dataFilterList = filterListReducer.dataFilter[route.params.type];
  const conditionFilter = useSelector((state: RootState) => state.leadReducers);
  const dataFilterLead = conditionFilter.listCondition[route.params.type];
  const [dataSearch, setDataSearch] = useState<any[]>([]);
  useEffect(() => {
    if (dataFilterLead) {
      setDataSearch([...dataFilterLead]);
    }
  }, [dataFilterLead]);

  const handleChooseFilter = (item: any) => {
    const tempConditions = item.Filter.map((elm: any) => {
      const filterItem: any = dataFilterLead.find((el) => el.key === elm.Key);
      return {
        ...filterItem,
        operator: elm.Operator,
        values: elm.Values,
        start: elm.Start,
        end: elm.End,
      };
    });
    filterListRef.current?.close();
    setChooseConditions(tempConditions);
  };
  return (
    <Host>
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: color.white }}>
        <Formik
          initialValues={initialValues}
          onSubmit={() => { }}
          validationSchema={validationSchema}
          validateOnChange={false}
          validateOnBlur={false}>
          {(propsFormik) => {
            return (
              <View style={styles.container}>
                <AppHeader
                  // isBack
                  iconLeft={<MyIcon.Close />}
                  iconLeftPress={() => {
                    // setChooseConditions([]);
                    // clearFilter();
                    navigation.goBack();
                  }}
                  title={t('title:filter_with_number', {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    filterLength: chooseConditions.length >= 1 ? ` (${chooseConditions.length})` : '',
                  })}
                  iconRight={<MyIcon.Task />}
                  iconRightPress={() => {
                    filterListRef.current?.open();
                  }}
                  headerContainerStyles={{ paddingBottom: padding.p20 }}
                />
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={styles.content} contentContainerStyle={{ paddingBottom: !isIOS && isKeyboardVisible ? 200 : 0 }}>
                  {chooseConditions.map((el: any, index: number) => {
                    return (
                      <FilterItems
                        error={arrError[index]}
                        key={el.id}
                        content={el?.title}
                        onChooseOperator={(operator) => handleChooseOperator(operator, index)}
                        itemData={el}
                        operator={el.operator}
                        onUpdateValue={(params: any) => {
                          const newArr = [...chooseConditions];
                          const { values, start, end } = params;
                          if (Object.keys(params).includes('values')) {
                            newArr[index].values = values;
                          }
                          if (Object.keys(params).includes('start')) {
                            newArr[index].start = start;
                          }
                          if (Object.keys(params).includes('end')) {
                            newArr[index].end = end;
                          }
                          setChooseConditions(newArr);
                        }}
                        values={{ values: el.values, start: el.start, end: el.end }}
                        type={el.type}
                        onDeleteItem={() => handleDeleteItem(index)}
                      />
                    );
                  })}
                  <TouchableOpacity
                    style={styles.addFilterCondition}
                    onPress={() => openModal('ModalDropDownMultiple')}>
                    <Icon name="pluscircleo" type="antdesign" size={16} color={color.primary} />
                    <AppText style={styles.text} value={t('label:add_filter_condition').toString()} />
                  </TouchableOpacity>
                </KeyboardAwareScrollView>
                {renderButton()}
                <Modalize
                  scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
                  adjustToContentHeight
                  withHandle={false}
                  ref={bottomSheetModalRef}>
                  <View style={{ height: isIOS ? undefined : screenHeight * 0.7 }}>
                    {renderModalContent(propsFormik)}
                  </View>
                </Modalize>
                <ModalFilterList
                  ref={filterListRef}
                  onFavorite={handleFavorite}
                  onDelete={handleDeleteItemFilter}
                  onChoose={handleChooseFilter}
                  dataFilterList={dataFilterList}
                />

              </View>
            );
          }}
        </Formik>
        <ModalSaveFilter
          header={t('lead:save_filter')}
          title={'Tên bộ lọc'}
          visible={showModal}
          onCloseModal={() => {
            setShowModal(false);
          }}
          onConfirm={onConfirm}
        />

      </SafeAreaView>
    </Host>
  );
};
