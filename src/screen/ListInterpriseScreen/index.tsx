import AppFilterByOrganizationUnit from '@components/AppFilterByOrganizationUnit';
import { ItemAppMenuProps } from '@components/AppMenu';
import { MyIcon } from '@components/Icon';
import { AppConfirm, AppText, SelectButton } from '@components/index';
import { AppContext, TabBarVisibilityContext } from '@contexts/index';
import { FilterScreenType, TypeSearch, TypeCriteria, TypeFieldExtension } from '@helpers/constants';
import { color, fontSize, padding } from '@helpers/index';
import { formatPhone, setTimeOut } from '@helpers/untils';
import { ItemOrganization, ItemOrganizationList } from '@interfaces/dashboard.interface';
import { InterpriseItem } from '@interfaces/interprise.interface';
import { ResponseReturn } from '@interfaces/response.interface';
import { AppRoutes } from '@navigation/appRoutes';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { changeBodyFilter, getListInterpriseRequest } from '@redux/actions/interpriseActions';
import { logout } from '@redux/actions/userActions';
import actionTypes from '@redux/actionTypes';
import { RootState } from '@redux/reducers';
import ModalInfo from '@screen/DashboardScreen/components/ModalInfo';
import NoteScreen from '@screen/NoteScreen';
import { apiDelete } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import _, { isArray } from 'lodash';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Modal, TouchableOpacity, View } from 'react-native';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import { Modalize } from 'react-native-modalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import ItemMenuInterprise from './components/ItemMenuInterprise';
import ListInterpriseItem from './components/ListInterpriseItem';
import styles from './styles';

const ListInterpriseScreen = React.memo((onPressAvatar, userName = '') => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const bottomSheetModalRef = useRef<Modalize>(null);
  const { setVisible } = useContext(TabBarVisibilityContext);
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
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
  const [modalType, setModalType] = useState<'ModalInfo' | 'ModalFilterByOrganizationUnit'>('ModalInfo');
  const listOrganizationChild = useRef<ItemOrganization[] | null>(null);
  const [corporateId, setCorporateId] = useState<number | string | null>(null);

  const listMenu = [
    {
      id: 1,
      title: t('title:allInterprise'),
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
      const response: ResponseReturn<boolean> = await apiDelete(`${serviceUrls.path.getListInterprise}`, {
        recordId: id,
      });
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
      Toast.show({
        type: 'error',
        text1: t('lead:notice'),
        text2: JSON.stringify(error),
      });
    } finally {
      appContext.setLoading(false);
    }
  };

  const onCall = useCallback((item: InterpriseItem) => {
    if (item?.mobile) {
      const listPhone = item?.mobile.split(',');
      if (isArray(listPhone)) {
        const phone = listPhone[0].replace('+', '');
        const phoneShow = formatPhone(listPhone[0]);
        navigation.navigate(AppRoutes.CALL, { name: item.brandName || '', phone: phone, phoneShow: phoneShow });
      }
    } else {
      Toast.show({ type: 'error', text1: t('lead:notice'), text2: t('label:phoneUndefined') });
    }
  }, []);

  const renderItem = ({ item, index }: { item: InterpriseItem; index: number }) => {
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
          setCorporateId(item.id);
        },
      },
      {
        title: t('title:missionModal'),
        icon: <MyIcon.MissionModal />,
        function: () => {
          navigation.navigate(AppRoutes.CREATE_AND_EDIT_TASK, {
            id: item.id,
            name: item.brandName,
            menuId: TypeCriteria.corporate,
          });
        },
      },
      {
        title: t('title:dating'),
        icon: <MyIcon.CalendarActivity size={12} fill={color.icon} />,
        function: () => {
          navigation.navigate(AppRoutes.CREATE_AND_EDIT_APPOINTMENT, {
            id: item.id,
            name: item.brandName,
            menuId: TypeCriteria.corporate,
          });
        },
      },
      {
        title: t('title:editModal'),
        icon: <MyIcon.EditModal />,
        function: () => {
          navigation.navigate(AppRoutes.CREATE_AND_EDIT_LCCD, {
            type: TypeFieldExtension.corporate,
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
            name: item.brandName,
          });
        },
      },
    ];
    return (
      <ListInterpriseItem
        listAction={dataAction}
        interpriseName={item.brandName ?? '---'}
        interprisePhoneNumber={item.mobile || '---'}
        interpriseTime={item.creationTime ?? '---'}
        interpriseID={item.customerCode ?? '---'}
        interpriseJobName={item.ownerName ?? '---'}
        interpriseStatus={item.dealValue ?? 0}
        onPress={() => {
          navigation.navigate(AppRoutes.DETAIL_CORPORATE, { key: item.id, isGoback: true });
        }}
      />
    );
  };
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(true);
  const limit = 10;
  const [dataInterprise, setDataInterprise] = useState<any[]>([]);
  const interpriseReducer = useSelector((state: RootState) => state.interpriseReducers);
  const userReducer = useSelector((state: RootState) => state.userReducer);
  const filterReducer = useSelector((state: RootState) => state.filterReducer);
  const filterCondition = interpriseReducer.filter.filter;

  const renderFooter = () => {
    return isLoading && !refreshing ? (
      <View>
        <ActivityIndicator size="large" color={color.grayShaft} />
      </View>
    ) : null;
  };
  const handelLoadMore = () => {
    const newDataLength = interpriseReducer.arrInterprise.length;
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
        getListInterpriseRequest({
          maxResultCount: limit,
          skipCount: 1,
          organizationUnitId: interpriseReducer.filter.OrganizationUnitId,
          filterType: interpriseReducer.filter.filterType,
          filter: interpriseReducer.filter.filter,
        }),
      );
    }
  };

  useEffect(() => {
    if (
      interpriseReducer.type === actionTypes.GET_DATA_LIST_INTERPRISE_FAILED ||
      interpriseReducer.type === actionTypes.GET_DATA_LIST_INTERPRISE_SUCCESS
    ) {
      setRefreshing(false);
      setIsLoading(false);
      if (interpriseReducer.type === actionTypes.GET_DATA_LIST_INTERPRISE_SUCCESS) {
        if (page === 1) {
          setDataInterprise(interpriseReducer.arrInterprise);
        } else {
          setDataInterprise([...dataInterprise, ...interpriseReducer.arrInterprise]);
        }
      }
    }
    if (interpriseReducer.type === actionTypes.FILTER_lIST_INTERPRISE) {
      if (page !== 1) {
        setPage(1);
      } else {
        dispatch(
          getListInterpriseRequest({
            maxResultCount: limit,
            skipCount: page,
            organizationUnitId: interpriseReducer.filter.OrganizationUnitId,
            filterType: interpriseReducer.filter.filterType,
            filter: interpriseReducer.filter.filter,
          }),
        );
      }
    }
  }, [interpriseReducer]);

  useEffect(() => {
    if (isFocused === true) {
      flatListRef.current && flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
      let organizationUnitId = interpriseReducer.filter.OrganizationUnitId;
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
          getListInterpriseRequest({
            maxResultCount: limit,
            skipCount: page,
            organizationUnitId: organizationUnitId,
            filterType: interpriseReducer.filter.filterType,
            filter: interpriseReducer.filter.filter,
          }),
        );
      }
    }
  }, [isFocused]);

  useEffect(() => {
    let organizationUnitId = interpriseReducer.filter.OrganizationUnitId;
    if (organizationUnitId === '') {
      organizationUnitId =
        filterReducer?.arrOrganizationDropDown != null && filterReducer?.arrOrganizationDropDown?.length > 0
          ? filterReducer?.arrOrganizationDropDown[0].id
          : null;
    }
    dispatch(
      getListInterpriseRequest({
        maxResultCount: limit,
        skipCount: page,
        organizationUnitId: organizationUnitId,
        filterType: interpriseReducer.filter.filterType,
        filter: interpriseReducer.filter.filter,
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
        organizationItem: interpriseReducer.currentOrganization,
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
            <AppText>
              {userReducer?.userInfo?.name.length > 0 ? userReducer?.userInfo?.name[0].toLocaleUpperCase() : ''}
            </AppText>
          </TouchableOpacity>
          <AppText fontWeight="semibold" style={styles.textTopHead}>
            {t('title:interprise')}
          </AppText>
          <View style={styles.formIconHead}>
            <TouchableOpacity
              onPress={() => navigation.navigate(AppRoutes.FILTER, { type: FilterScreenType.enterprise })}>
              <MyIcon.Fillter fill={interpriseReducer.filter.filter !== '[]' ? color.navyBlue : color.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate(AppRoutes.SEARCH_LEAD, { type: TypeSearch.accounts })}
              style={{ marginLeft: padding.p20 }}>
              <MyIcon.Search />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.menuHead}>
          {listMenu.map((item, index) => (
            <ItemMenuInterprise
              key={item.id}
              onPress={() => changeFilter(index)}
              isActive={interpriseReducer.filter.filterType === index}
              menuName={item.title}
            />
          ))}
        </View>
        <View style={styles.footerHead}>
          <SelectButton
            title={interpriseReducer.currentOrganization?.label || ''}
            onPress={() => openModal('ModalFilterByOrganizationUnit')}
            themeColor={color.text}
            titleStyle={{ color: color.text }}
          />
          <AppText style={{ color: color.greyChateau }}>
            {interpriseReducer.totalCount}
            {t('title:interpriseTotal')}
          </AppText>
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        keyExtractor={(item, index) => item.id.toString()}
        style={{ flex: 1, backgroundColor: color.lightGray }}
        contentContainerStyle={{ paddingTop: padding.p4 }}
        data={dataInterprise}
        ListEmptyComponent={renderNoData}
        extraData={dataInterprise.length}
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
      <Modal visible={!!corporateId} transparent animationType="fade">
        <NoteScreen
          typeView={'create'}
          onPressOne={() => setCorporateId(null)}
          idCrnt={corporateId ?? ''}
          typeAPI="corpo"
        />
      </Modal>
      <Modalize
        scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
        HeaderComponent={
          modalType === 'ModalInfo' ? () => renderModalHeader(userReducer?.userInfo?.name ?? ' ') : undefined
        }
        adjustToContentHeight
        withHandle={false}
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
            idActive={interpriseReducer.currentOrganization?.id ?? ''}
            onSelect={(item: ItemOrganization | ItemOrganizationList, listChildList: ItemOrganization[] | null) => {
              bottomSheetModalRef.current?.close();
              setRefreshing(true);
              dispatch(
                changeBodyFilter({
                  filterType: interpriseReducer.filter.filterType,
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
          title={t('title:del_Interprise')}
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

export default ListInterpriseScreen;
