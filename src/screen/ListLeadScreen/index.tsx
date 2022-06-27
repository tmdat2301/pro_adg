import { ItemAppMenuProps } from '@components/AppMenu';
import { MyIcon } from '@components/Icon';
import { AppConfirm, AppText, SelectButton } from '@components/index';
import { AppContext, TabBarVisibilityContext } from '@contexts/index';
import { FilterScreenType, TypeSearch, TypeCriteria, TypeFieldExtension } from '@helpers/constants';
import { color, fontSize, padding } from '@helpers/index';
import { LeadItem } from '@interfaces/lead.interface';
import { ResponseReturn } from '@interfaces/response.interface';
import { AppRoutes } from '@navigation/appRoutes';
import { useIsFocused, useNavigation } from '@react-navigation/core';
import { changeBodyFilter, getListLeadRequest } from '@redux/actions/leadAction';
import actionTypes from '@redux/actionTypes';
import { RootState } from '@redux/reducers';
import ItemMenuHead from '@screen/ListLeadScreen/components/ItemMenuHead';
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
import { useDispatch, useSelector } from 'react-redux';
import ListLeadItem from './components/ListLeadItem';
import styles from './styles';
import AppFilterByOrganizationUnit from '@components/AppFilterByOrganizationUnit';
import { ItemOrganization, ItemOrganizationList } from '@interfaces/dashboard.interface';
import Toast from 'react-native-toast-message';
import ModalInfo from '@screen/DashboardScreen/components/ModalInfo';
import { logout } from '@redux/actions/userActions';
import { formatPhone, setTimeOut } from '@helpers/untils';
// import { STAGING_BASE_URL, DEV_BASE_URL, } from '@.env';

const ListLeadScreen = React.memo(() => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const bottomSheetModalRef = useRef<Modalize>(null);
  const { setVisible } = useContext(TabBarVisibilityContext);
  const [leadId, setLeadId] = useState<number | string | null>(null);
  const [mainLayout, setMainLayout] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 120,
  });
  const [modalType, setModalType] = useState<'ModalInfo' | 'ModalFilterByOrganizationUnit'>('ModalInfo');
  const [dataDelete, setDataDelete] = useState<{
    id: number;
    name: string | null;
  } | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const listOrganizationChild = useRef<ItemOrganization[] | null>(null);

  const listMenu = [
    {
      id: 1,
      title: t('title:allLeads'),
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
      const response: ResponseReturn<boolean> = await apiDelete(`${serviceUrls.path.getListLead}${id}`, {});
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

  const onCall = useCallback((item: LeadItem) => {
    if (item?.mobile) {
      const listPhone = item?.mobile.split(';');
      if (isArray(listPhone)) {
        const phone = listPhone[0].replace('+', '');
        const phoneShow = formatPhone(listPhone[0]);
        navigation.navigate(AppRoutes.CALL, { name: item.fullName || '', phone: phone, phoneShow: phoneShow });
      }
    } else {
      Toast.show({ type: 'error', text1: t('lead:notice'), text2: t('label:phoneUndefined') });
    }
  }, []);

  const renderItem = ({ item, index }: { item: LeadItem; index: number }) => {
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
          setLeadId(item.id);
        },
      },
      {
        title: t('title:missionModal'),
        icon: <MyIcon.MissionModal />,
        function: () => {
          navigation.navigate(AppRoutes.CREATE_AND_EDIT_TASK, {
            id: item.id,
            name: item.fullName,
            menuId: TypeCriteria.lead,
          });
        },
      },
      {
        title: t('title:dating'),
        icon: <MyIcon.CalendarActivity size={12} fill={color.icon} />,
        function: () => {
          navigation.navigate(AppRoutes.CREATE_AND_EDIT_APPOINTMENT, {
            id: item.id,
            name: item.fullName,
            menuId: TypeCriteria.lead,
          });
        },
      },
      {
        title: t('title:editModal'),
        icon: <MyIcon.EditModal />,
        function: () => {
          navigation.navigate(AppRoutes.CREATE_AND_EDIT_LCCD, {
            type: TypeFieldExtension.lead,
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
            name: item.fullName,
          });
        },
      },
    ];
    return (
      <ListLeadItem
        listAction={dataAction}
        leadName={item.fullName ?? '---'}
        leadPhoneNumber={item.mobile || '---'}
        leadTime={item.createdTime ?? '---'}
        leadID={item.leadCode ?? '---'}
        leadJobName={item.ownerName ?? '---'}
        leadColorStatus={item.pipelinePositionId ?? ''}
        leadTextStatus={item.pipeLineName ?? '---'}
        onPress={() => {
          navigation.navigate(AppRoutes.DETAIL_LEAD, { key: item.id, isGoback: true });
        }}
      />
    );
  };
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(true);
  const limit = 10;
  const [dataLead, setDataLead] = useState<any[]>([]);
  const leadReducer = useSelector((state: RootState) => state.leadReducers);
  const userReducer = useSelector((state: RootState) => state.userReducer);
  const filterReducer = useSelector((state: RootState) => state.filterReducer);
  const filterCondition = leadReducer.filter.filter;

  const renderFooter = () => {
    return isLoading && !refreshing ? (
      <View>
        <ActivityIndicator size="large" color={color.grayShaft} />
      </View>
    ) : null;
  };
  const handelLoadMore = () => {
    const newDataLength = leadReducer.arrLead.length;
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
      let organizationUnitId = leadReducer.filter.OrganizationUnitId;
      if (organizationUnitId === '') {
        organizationUnitId =
          filterReducer?.arrOrganizationDropDown != null && filterReducer?.arrOrganizationDropDown?.length > 0
            ? filterReducer?.arrOrganizationDropDown[0].id
            : null;
      }
      dispatch(
        getListLeadRequest({
          maxResultCount: limit,
          skipCount: 1,
          organizationUnitId: organizationUnitId,
          filterType: leadReducer.filter.filterType,
          filter: leadReducer.filter.filter,
        }),
      );
    }
  };

  useEffect(() => {
    if (
      leadReducer.type === actionTypes.GET_DATA_LIST_LEAD_FAILED ||
      leadReducer.type === actionTypes.GET_DATA_LIST_LEAD_SUCCESS
    ) {
      setRefreshing(false);
      setIsLoading(false);
      if (leadReducer.type === actionTypes.GET_DATA_LIST_LEAD_SUCCESS) {
        if (page === 1) {
          setDataLead(leadReducer.arrLead);
        } else {
          setDataLead([...dataLead, ...leadReducer.arrLead]);
        }
      }
    }
    if (leadReducer.type === actionTypes.FILTER_lIST_LEAD) {
      if (page !== 1) {
        setPage(1);
      } else {
        let organizationUnitId = leadReducer.filter.OrganizationUnitId;
        if (organizationUnitId === '') {
          organizationUnitId =
            filterReducer?.arrOrganizationDropDown != null && filterReducer?.arrOrganizationDropDown?.length > 0
              ? filterReducer?.arrOrganizationDropDown[0].id
              : null;
        }
        dispatch(
          getListLeadRequest({
            maxResultCount: limit,
            skipCount: page,
            organizationUnitId: organizationUnitId,
            filterType: leadReducer.filter.filterType,
            filter: leadReducer.filter.filter,
          }),
        );
      }
    }
  }, [leadReducer]);

  useEffect(() => {
    if (isFocused === true) {
      flatListRef.current && flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
      let organizationUnitId = leadReducer.filter.OrganizationUnitId;
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
          getListLeadRequest({
            maxResultCount: limit,
            skipCount: page,
            organizationUnitId: organizationUnitId,
            filterType: leadReducer.filter.filterType,
            filter: leadReducer.filter.filter,
          }),
        );
      }
    }
  }, [isFocused]);
  useEffect(() => {
    let organizationUnitId = leadReducer.filter.OrganizationUnitId;
    if (organizationUnitId === '') {
      organizationUnitId =
        filterReducer?.arrOrganizationDropDown != null && filterReducer?.arrOrganizationDropDown?.length > 0
          ? filterReducer?.arrOrganizationDropDown[0].id
          : null;
    }
    dispatch(
      getListLeadRequest({
        maxResultCount: limit,
        skipCount: page,
        organizationUnitId: organizationUnitId,
        filterType: leadReducer.filter.filterType,
        filter: leadReducer.filter.filter,
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
        organizationItem: leadReducer.currentOrganization,
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
            <AppText>{userReducer.userInfo?.name ? userReducer.userInfo?.name[0].toLocaleUpperCase() : ''}</AppText>
          </TouchableOpacity>
          <AppText fontWeight="semibold" style={styles.textTopHead}>
            {t('title:leads')}
          </AppText>
          <View style={styles.formIconHead}>
            <TouchableOpacity onPress={() => navigation.navigate(AppRoutes.FILTER, { type: FilterScreenType.leads })}>
              <MyIcon.Fillter fill={leadReducer.filter.filter !== '[]' ? color.navyBlue : color.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginLeft: padding.p20 }}
              onPress={() => {
                navigation.navigate(AppRoutes.SEARCH_LEAD, { type: TypeSearch.leads });
              }}>
              <MyIcon.Search />
            </TouchableOpacity>
          </View>
        </View>
        {/* <TabHeader /> */}
        <View style={styles.menuHead}>
          {listMenu.map((item, index) => (
            <ItemMenuHead
              key={item.id}
              onPress={() => changeFilter(index)}
              isActive={leadReducer.filter.filterType === index}
              menuName={item.title}
            />
          ))}
        </View>
        <View style={styles.footerHead}>
          <SelectButton
            title={leadReducer.currentOrganization?.label || ''}
            onPress={() => openModal('ModalFilterByOrganizationUnit')}
            themeColor={color.text}
            titleStyle={{ color: color.text }}
          />
          <AppText style={{ color: color.greyChateau }}>
            {leadReducer.totalCount}
            {t('title:leadTotal')}
          </AppText>
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        keyExtractor={(item, index) => item.id.toString()}
        style={{ flex: 1, backgroundColor: color.lightGray }}
        contentContainerStyle={{ paddingTop: padding.p4 }}
        data={dataLead}
        ListEmptyComponent={renderNoData}
        maxToRenderPerBatch={10}
        extraData={dataLead.length}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        onEndReached={handelLoadMore}
        onRefresh={handelRefresh}
        refreshing={refreshing}
        initialNumToRender={6}
        onEndReachedThreshold={0.5}
        updateCellsBatchingPeriod={500}
      />
      <Modal visible={!!leadId} transparent animationType="fade">
        <NoteScreen typeView={'create'} onPressOne={() => setLeadId(null)} idCrnt={leadId ?? ''} typeAPI="lead" />
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
            idActive={leadReducer.currentOrganization?.id ?? ''}
            onSelect={(item: ItemOrganization | ItemOrganizationList, listChildList: ItemOrganization[] | null) => {
              bottomSheetModalRef.current?.close();
              setRefreshing(true);
              dispatch(
                changeBodyFilter({
                  filterType: leadReducer.filter.filterType,
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
          title={t('title:del_Lead')}
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

export default ListLeadScreen;
