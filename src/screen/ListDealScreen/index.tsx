/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, TouchableOpacity, View } from 'react-native';
import { color, fontSize, padding } from '@helpers/index';
import { AppConfirm, AppText, SelectButton } from '@components/index';
import { MyIcon } from '@components/Icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiDelete } from '@services/serviceHandle';
import { useDispatch, useSelector } from 'react-redux';
import { changeBodyFilter, getListDealRequest } from '@redux/actions/dealActions';
import { RootState } from '@redux/reducers';
import actionTypes from '@redux/actionTypes';
import { useTranslation } from 'react-i18next';
import { DealItem } from '@interfaces/deal.interface';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import styles from './styles';
import { useNavigation } from '@react-navigation/core';
import { AppRoutes } from '@navigation/appRoutes';
import ListDealItem from './components/ListDealItem';
import ItemMenuDeal from './components/ItemMenuDeal';
import { Modalize } from 'react-native-modalize';
import { ItemOrganization, ItemOrganizationList } from '@interfaces/dashboard.interface';
import AppFilterByOrganizationUnit from '@components/AppFilterByOrganizationUnit';
import { AppContext, TabBarVisibilityContext } from '@contexts/index';
import { FilterScreenType, TypeSearch, TypeCriteria, TypeFieldExtension } from '@helpers/constants';
import { ItemAppMenuProps } from '@components/AppMenu';
import _, { isArray } from 'lodash';
import serviceUrls from '@services/serviceUrls';
import { ResponseReturn } from '@interfaces/response.interface';
import NoteScreen from '@screen/NoteScreen';
import Toast from 'react-native-toast-message';
import { logout } from '@redux/actions/userActions';
import ModalInfo from '@screen/DashboardScreen/components/ModalInfo';
import { findPhoneNumbersInText } from 'libphonenumber-js';
import { formatPhone, setTimeOut } from '@helpers/untils';
import { useIsFocused } from '@react-navigation/native';

const ListDealScreen = React.memo(() => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const appContext = useContext(AppContext);
  const bottomSheetModalRef = useRef<Modalize>(null);
  const { setVisible } = useContext(TabBarVisibilityContext);
  const [dealId, setDealId] = useState<number | string | null>(null);
  const isFocused = useIsFocused();
  const flatListRef = useRef<FlatList>(null);
  const [mainLayout, setMainLayout] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 120,
  });
  const [dataDelete, setDataDelete] = useState<{
    id: number;
    name: string | null;
  } | null>(null);
  const listOrganizationChild = useRef<ItemOrganization[] | null>(null);

  const listMenu = [
    {
      id: 1,
      title: t('title:allDeal'),
    },
    {
      id: 2,
      title: t('title:own'),
    },
    {
      id: 3,
      title: t('title:to_shared'),
    },
  ];
  const closeModal = () => {
    setVisible(true);
  };

  const delItemList = async (id: number) => {
    appContext.setLoading(true);
    try {
      const response: ResponseReturn<boolean> = await apiDelete(`${serviceUrls.path.getListDeal}`, { recordId: id });
      if (response.error || !_.isEmpty(response.detail)) {
        if (response.code === 403) {
          return Toast.show({ type: 'error', text1: t('lead:notice'), text2: t('error:no_permission') });
        }
        Toast.show({ type: 'error', text1: t('lead:notice'), text2: response.errorMessage });
      } else {
        Toast.show({ type: 'success', text1: t('lead:notice'), text2: t('label:delete_success') });
        handelRefresh();
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: t('lead:notice'), text2: JSON.stringify(error) });
    } finally {
      appContext.setLoading(false);
    }
  };
  const onCall = useCallback((item: DealItem) => {
    if (!!item?.listContactPhoneNumber && isArray(item?.listContactPhoneNumber)) {
      const phones = item?.listContactPhoneNumber;
      if (isArray(phones)) {
        let index = 0;
        const mainPhoneIndex = phones.findIndex((elm) => elm.isMain);
        if (mainPhoneIndex !== -1) {
          index = mainPhoneIndex;
        }
        const phoneFormat = isArray(findPhoneNumbersInText(phones[index]?.phoneNumber, 'VN'))
          ? findPhoneNumbersInText(phones[index]?.phoneNumber, 'VN')[0].number
          : null;
        if (phoneFormat) {
          const phone = `${phoneFormat.countryCallingCode.toString() || ''}${
            phoneFormat.nationalNumber.toString() || ''
          }`;
          const phoneShow = formatPhone(phoneFormat.number.toString());
          navigation.navigate(AppRoutes.CALL, { name: item?.contactName || '', phone: phone, phoneShow: phoneShow });
        }
      }
    }
  }, []);

  const renderItem = ({ item, index }: { item: DealItem; index: number }) => {
    const dataAction: ItemAppMenuProps[] = [
      {
        title: t('title:callModal'),
        icon: <MyIcon.CallModal />,
        function: () => onCall(item),
      },
      {
        title: t('title:noteModal'),
        icon: <MyIcon.NoteModal />,
        function: () => {
          setDealId(item.id);
        },
      },
      {
        title: t('title:missionModal'),
        icon: <MyIcon.MissionModal />,
        function: () => {
          navigation.navigate(AppRoutes.CREATE_AND_EDIT_TASK, {
            id: item.id,
            name: item.name,
            menuId: TypeCriteria.deal,
          });
        },
      },
      {
        title: t('title:dating'),
        icon: <MyIcon.CalendarActivity size={12} fill={color.icon} />,
        function: () => {
          navigation.navigate(AppRoutes.CREATE_AND_EDIT_APPOINTMENT, {
            id: item.id,
            name: item.name,
            menuId: TypeCriteria.deal,
          });
        },
      },
      {
        title: t('title:editModal'),
        icon: <MyIcon.EditModal />,
        function: () => {
          navigation.navigate(AppRoutes.CREATE_AND_EDIT_LCCD, {
            type: TypeFieldExtension.deal,
            idUpdate: item.id,
          });
        },
      },
      {
        title: t('title:deleteModal'),
        titleStyle: { color: 'red' },
        icon: <MyIcon.DeleteModal />,
        function: () => {
          setDataDelete({
            id: item.id,
            name: item.name,
          });
        },
      },
    ];
    return (
      <ListDealItem
        listAction={dataAction}
        dealType={item.id ?? '---'}
        dealName={item.name ?? '---'}
        dealId={item.dealCode ?? '---'}
        dealTime={item.creationTime ?? '---'}
        dealPrice={item.expectationValue ?? '---'}
        dealJobName={item.contactName ?? '---'}
        dealColorStatus={item.pipelinePositionId ?? ''}
        dealTextStatus={item.pipelineName ?? '---'}
        onPress={() => {
          navigation.navigate(AppRoutes.DETAIL_DEAL, { key: item.id, isGoback: true });
        }}
      />
    );
  };
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(true);
  const limit = 10;
  const [dataDeal, setDataDeal] = useState<any[]>([]);
  const dealReducer = useSelector((state: RootState) => state.dealReducers);
  const userReducer = useSelector((state: RootState) => state.userReducer);
  const filterReducer = useSelector((state: RootState) => state.filterReducer);
  const filterCondition = dealReducer.filter.filter;
  const [modalType, setModalType] = useState<'ModalInfo' | 'ModalFilterByOrganizationUnit'>('ModalInfo');

  const renderFooter = () => {
    return isLoading && !refreshing ? (
      <View>
        <ActivityIndicator size="large" color={color.grayShaft} />
      </View>
    ) : null;
  };
  const handelLoadMore = () => {
    const newDataLength = dealReducer.arrDeal.length;
    if (newDataLength === limit && !isLoading && !refreshing) {
      setIsLoading(true);
      setPage(page + 1);
      setRefreshing(false);
    }
  };
  const handelRefresh = () => {
    setRefreshing(true);
    if (page !== 1) {
      setPage(1);
    } else {
      dispatch(
        getListDealRequest({
          maxResultCount: limit,
          skipCount: 1,
          organizationUnitId: dealReducer.filter.OrganizationUnitId,
          filterType: dealReducer.filter.filterType,
          filter: dealReducer.filter.filter,
        }),
      );
    }
  };

  useEffect(() => {
    if (
      dealReducer.type == actionTypes.GET_DATA_LIST_DEAL_FAILED ||
      dealReducer.type == actionTypes.GET_DATA_LIST_DEAL_SUCCESS
    ) {
      setRefreshing(false);
      setIsLoading(false);
      if (dealReducer.type == actionTypes.GET_DATA_LIST_DEAL_SUCCESS) {
        if (page === 1) {
          setDataDeal(dealReducer.arrDeal);
        } else {
          setDataDeal([...dataDeal, ...dealReducer.arrDeal]);
        }
      }
    }
    if (
      dealReducer.type == actionTypes.FILTER_lIST_DEAL ||
      dealReducer.type === actionTypes.CONFIRM_DEAL_CONVERT_SUCCESS
    ) {
      if (page !== 1) {
        setPage(1);
      } else {
        dispatch(
          getListDealRequest({
            maxResultCount: limit,
            skipCount: page,
            organizationUnitId: dealReducer.filter.OrganizationUnitId,
            filterType: dealReducer.filter.filterType,
            filter: dealReducer.filter.filter,
          }),
        );
      }
    }
  }, [dealReducer]);

  useEffect(() => {
    if (isFocused) {
      flatListRef.current && flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
      let organizationUnitId = dealReducer.filter.OrganizationUnitId;
      if (organizationUnitId === '') {
        organizationUnitId =
          filterReducer?.arrOrganizationDropDown != null && filterReducer?.arrOrganizationDropDown?.length > 0
            ? filterReducer?.arrOrganizationDropDown[0].id
            : null;
      } else {
        setRefreshing(true);
      }
      if (page !== 1) {
        setPage(1);
      } else {
        dispatch(
          getListDealRequest({
            maxResultCount: limit,
            skipCount: page,
            organizationUnitId: dealReducer.filter.OrganizationUnitId,
            filterType: dealReducer.filter.filterType,
            filter: dealReducer.filter.filter,
          }),
        );
      }
    }
  }, [isFocused]);

  useEffect(() => {
    let organizationUnitId = dealReducer.filter.OrganizationUnitId;
    if (organizationUnitId === '') {
      organizationUnitId =
        filterReducer?.arrOrganizationDropDown != null && filterReducer?.arrOrganizationDropDown?.length > 0
          ? filterReducer?.arrOrganizationDropDown[0].id
          : null;
    }
    dispatch(
      getListDealRequest({
        maxResultCount: limit,
        skipCount: page,
        organizationUnitId: organizationUnitId,
        filterType: dealReducer.filter.filterType,
        filter: dealReducer.filter.filter,
      }),
    );
  }, [page]);

  useEffect(() => {
    dispatch(
      changeBodyFilter({
        filterType: 0,
        organizationItem:
          filterReducer?.arrOrganizationDropDown != null && filterReducer?.arrOrganizationDropDown?.length > 0
            ? filterReducer?.arrOrganizationDropDown[0]
            : null,
        filter: filterCondition,
      }),
    );
  }, []);

  const changeFilter = (index: number) => {
    setRefreshing(true);
    dispatch(
      changeBodyFilter({
        filterType: index,
        organizationItem: dealReducer.currentOrganization,
        filter: filterCondition,
      }),
    );
  };
  const renderNoData = () => {
    return !refreshing && !isLoading ? (
      <View style={{ height: ScreenHeight * 0.5, alignItems: 'center', justifyContent: 'center' }}>
        <AppText>{t('title:no_data')}</AppText>
      </View>
    ) : null;
  };
  const openModal = (type: 'ModalInfo' | 'ModalFilterByOrganizationUnit') => {
    setModalType(type);
    setVisible(false);
    bottomSheetModalRef.current?.open();
  };
  const renderModalHeader = (name: string) => {
    return (
      <View style={styles.modalHeader}>
        <AppText fontSize={fontSize.f24}>{name[0].toLocaleUpperCase() ?? ''}</AppText>
      </View>
    );
  };
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.body}>
        <View style={styles.topHead}>
          <TouchableOpacity style={styles.avatar} onPress={() => openModal('ModalInfo')}>
            <AppText>{userReducer?.userInfo?.name ? userReducer?.userInfo?.name[0].toLocaleUpperCase() : ''}</AppText>
          </TouchableOpacity>
          <AppText fontWeight="semibold" style={styles.textTopHead}>
            {t('title:deal')}
          </AppText>
          <View style={styles.formIconHead}>
            <TouchableOpacity onPress={() => navigation.navigate(AppRoutes.FILTER, { type: FilterScreenType.deals })}>
              <MyIcon.Fillter fill={dealReducer.filter.filter !== '[]' ? color.navyBlue : color.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(AppRoutes.SEARCH_LEAD, { type: TypeSearch.deals });
              }}
              style={{ marginLeft: padding.p20 }}>
              <MyIcon.Search />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.menuHead}>
          {listMenu.map((item, index) => (
            <ItemMenuDeal
              key={item.id}
              onPress={() => changeFilter(index)}
              isActive={dealReducer.filter.filterType == index}
              menuName={item.title}
            />
          ))}
        </View>
        <View style={styles.footerHead}>
          <SelectButton
            title={dealReducer.currentOrganization?.label || ''}
            onPress={() => openModal('ModalFilterByOrganizationUnit')}
            themeColor={color.text}
            titleStyle={{ color: color.text }}
          />
          <AppText style={{ color: color.greyChateau }}>
            {dealReducer.totalCount}
            {t('title:dealTotal')}
          </AppText>
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        keyExtractor={(item, index) => item.id.toString()}
        style={{ flex: 1, backgroundColor: color.lightGray }}
        contentContainerStyle={{ paddingTop: padding.p4 }}
        data={dataDeal}
        ListEmptyComponent={renderNoData}
        extraData={dataDeal.length}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        onEndReached={handelLoadMore}
        onRefresh={handelRefresh}
        refreshing={refreshing}
        onEndReachedThreshold={0.5}
        maxToRenderPerBatch={10}
        initialNumToRender={6}
        updateCellsBatchingPeriod={500}
      />
      <Modal visible={!!dealId} transparent animationType="fade">
        <NoteScreen typeView={'create'} onPressOne={() => setDealId(null)} idCrnt={dealId ?? ''} typeAPI="deal" />
      </Modal>
      <Modalize
        HeaderComponent={
          modalType === 'ModalInfo' ? () => renderModalHeader(userReducer?.userInfo?.name ?? ' ') : undefined
        }
        adjustToContentHeight
        withHandle={false}
        scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
        onClose={closeModal}
        ref={bottomSheetModalRef}>
        {modalType === 'ModalInfo' ? (
          <ModalInfo
            mail={userReducer?.data?.email ?? ''}
            onLogout={() => {
              dispatch(logout());
            }}
            onNavigate={(screenName) => {
              navigation.navigate(screenName);
              bottomSheetModalRef.current?.close();
            }}
            title={userReducer?.userInfo?.name ?? ''}
          />
        ) : (
          <AppFilterByOrganizationUnit
            listOrganization={filterReducer.organizationList || []}
            arrOrganizationDropDown={filterReducer.arrOrganizationDropDown}
            idActive={dealReducer.currentOrganization?.id ?? ''}
            onSelect={(item: ItemOrganization | ItemOrganizationList, listChildList: ItemOrganization[] | null) => {
              bottomSheetModalRef.current?.close();
              setRefreshing(true);
              dispatch(
                changeBodyFilter({
                  filterType: dealReducer.filter.filterType,
                  organizationItem: item,
                  filter: filterCondition,
                }),
              );
              listOrganizationChild.current = listChildList;
            }}
            title={t('title:select_organization')}
            height={ScreenHeight - mainLayout.height}
            listOrganizationChild={listOrganizationChild.current}
          />
        )}
      </Modalize>

      <Modal visible={dataDelete != null} transparent animationType="fade">
        <AppConfirm
          disabledOverlayPress
          title={t('title:del_Deal')}
          content={`${t('title:confirm_delete')}`}
          subContent={`${dataDelete && dataDelete.name ? dataDelete.name : ''}?`}
          colorSubContent={color.black}
          onPressLeft={() => setDataDelete(null)}
          onPressRight={() => {
            setDataDelete(null);
            if (dataDelete) {
              setTimeout(() => {
                delItemList(dataDelete.id);
              }, setTimeOut());
            }
          }}
        />
      </Modal>
    </SafeAreaView>
  );
});

export default ListDealScreen;
