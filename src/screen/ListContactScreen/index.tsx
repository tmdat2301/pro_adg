import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, TouchableOpacity, View } from 'react-native';
import { color, fontSize, padding } from '@helpers/index';
import { AppConfirm, AppText, SelectButton } from '@components/index';
import { MyIcon } from '@components/Icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { changeBodyFilter } from '@redux/actions/contactAction';
import { RootState } from '@redux/reducers';
import actionTypes from '@redux/actionTypes';
import { useTranslation } from 'react-i18next';
import styles from './styles';
import ListContactItem from './components/ListContactItem';
import ItemMenuContact from './components/ItemMenuContact';
import { ContactItem } from '@interfaces/contact.interface';
import { getListContactRequest } from '@redux/actions/contactAction';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import { Modalize } from 'react-native-modalize';
import { ItemOrganization, ItemOrganizationList } from '@interfaces/dashboard.interface';
import AppFilterByOrganizationUnit from '@components/AppFilterByOrganizationUnit';
import { AppContext, TabBarVisibilityContext } from '@contexts/index';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { AppRoutes } from '@navigation/appRoutes';
import { FilterScreenType, TypeCriteria, TypeFieldExtension, TypeSearch } from '@helpers/constants';
import { ItemAppMenuProps } from '@components/AppMenu';
import { ResponseReturn } from '@interfaces/response.interface';
import { apiDelete } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import _, { isArray } from 'lodash';
import NoteScreen from '@screen/NoteScreen';
import Toast from 'react-native-toast-message';
import ModalInfo from '@screen/DashboardScreen/components/ModalInfo';
import { logout } from '@redux/actions/userActions';
import { formatPhone, setTimeOut } from '@helpers/untils';
import NetInfo from '@react-native-community/netinfo';

const ListContactScreen = React.memo((onPressAvatar, userName = '') => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const appContext = useContext(AppContext);
  const bottomSheetModalRef = useRef<Modalize>(null);
  const { setVisible } = useContext(TabBarVisibilityContext);
  const [contactId, setContactId] = useState<number | string | null>(null);
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
  const netInfo = NetInfo.useNetInfo();

  const listMenu = [
    {
      id: 1,
      title: t('title:allContact'),
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
      const response: ResponseReturn<boolean> = await apiDelete(`${serviceUrls.path.getListContact}`, {
        contactId: id,
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

  const onCall = useCallback((item: ContactItem) => {
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

  const renderItem = ({ item, index }: { item: ContactItem; index: number }) => {
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
          setContactId(item.id);
        },
      },
      {
        title: t('title:missionModal'),
        icon: <MyIcon.MissionModal />,
        function: () => {
          navigation.navigate(AppRoutes.CREATE_AND_EDIT_TASK, {
            id: item.id,
            name: item.fullName,
            menuId: TypeCriteria.contact,
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
            menuId: TypeCriteria.contact,
          });
        },
      },
      {
        title: t('title:editModal'),
        icon: <MyIcon.EditModal />,
        function: () => {
          navigation.navigate(AppRoutes.CREATE_AND_EDIT_LCCD, {
            type: TypeFieldExtension.contact,
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
      <ListContactItem
        listAction={dataAction}
        contactName={item.fullName ?? '---'}
        contactPhoneNumber={item.mobile || '---'}
        contactTime={item.creationTime ?? '---'}
        contactID={item.contactCode ?? '---'}
        contactJobName={item.ownerName ?? '---'}
        contactStatus={item.expectationValue ?? '---'}
        onPress={() => {
          navigation.navigate(AppRoutes.DETAIL_CONTACT, { key: item.id, isGoback: true });
        }}
      />
    );
  };
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(true);
  const limit = 10;
  const [dataContact, setDataContact] = useState<any[]>([]);
  const contactReducer = useSelector((state: RootState) => state.contactReducers);
  const userReducer = useSelector((state: RootState) => state.userReducer);
  const filterReducer = useSelector((state: RootState) => state.filterReducer);
  const filterCondition = contactReducer.filter.filter;

  const navigation = useNavigation();

  const renderFooter = () => {
    return isLoading && !refreshing ? (
      <View>
        <ActivityIndicator size="large" color={color.grayShaft} />
      </View>
    ) : null;
  };
  const handelLoadMore = () => {
    const newDataLength = contactReducer.arrContact.length;
    if (newDataLength == limit && !isLoading && !refreshing) {
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
      let organizationUnitId = contactReducer.filter.OrganizationUnitId;
      if (organizationUnitId === '') {
        organizationUnitId =
          filterReducer?.arrOrganizationDropDown != null && filterReducer?.arrOrganizationDropDown?.length > 0
            ? filterReducer?.arrOrganizationDropDown[0].id
            : null;
      }
      dispatch(
        getListContactRequest({
          maxResultCount: limit,
          skipCount: 1,
          organizationUnitId: organizationUnitId,
          filterType: contactReducer.filter.filterType,
          filter: contactReducer.filter.filter,
        }),
      );
    }
  };

  useEffect(() => {
    if (
      contactReducer.type == actionTypes.GET_DATA_LIST_CONTACT_FAILED ||
      contactReducer.type == actionTypes.GET_DATA_LIST_CONTACT_SUCCESS
    ) {
      setRefreshing(false);
      setIsLoading(false);
      if (contactReducer.type == actionTypes.GET_DATA_LIST_CONTACT_SUCCESS) {
        if (page === 1) {
          setDataContact(contactReducer.arrContact);
        } else {
          setDataContact([...dataContact, ...contactReducer.arrContact]);
        }
      }
    }
    if (contactReducer.type == actionTypes.FILTER_lIST_CONTACT) {
      if (page !== 1) {
        setPage(1);
      } else {
        dispatch(
          getListContactRequest({
            maxResultCount: limit,
            skipCount: page,
            organizationUnitId: contactReducer.filter.OrganizationUnitId,
            filterType: contactReducer.filter.filterType,
            filter: contactReducer.filter.filter,
          }),
        );
      }
    }
  }, [contactReducer]);

  useEffect(() => {
    if (isFocused && netInfo.isConnected === true) {
      flatListRef.current && flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
      let organizationUnitId = contactReducer.filter.OrganizationUnitId;
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
          getListContactRequest({
            maxResultCount: limit,
            skipCount: page,
            organizationUnitId: contactReducer.filter.OrganizationUnitId,
            filterType: contactReducer.filter.filterType,
            filter: contactReducer.filter.filter,
          }),
        );
      }
    }
  }, [isFocused, netInfo.isConnected]);

  useEffect(() => {
    let organizationUnitId = contactReducer.filter.OrganizationUnitId;
    if (organizationUnitId === '') {
      organizationUnitId =
        filterReducer?.arrOrganizationDropDown != null && filterReducer?.arrOrganizationDropDown?.length > 0
          ? filterReducer?.arrOrganizationDropDown[0].id
          : null;
    }
    dispatch(
      getListContactRequest({
        maxResultCount: limit,
        skipCount: page,
        organizationUnitId: organizationUnitId,
        filterType: contactReducer.filter.filterType,
        filter: contactReducer.filter.filter,
      }),
    );
  }, [page]);

  useEffect(() => {
    if (netInfo.isConnected === true) {
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
    }
  }, [netInfo.isConnected]);

  const changeFilter = (index: number) => {
    setRefreshing(true);
    dispatch(
      changeBodyFilter({
        filterType: index,
        organizationItem: contactReducer.currentOrganization,
        filter: filterCondition,
      }),
    );
  };
  const renderNoData = () => {
    return !refreshing && !isLoading ? (
      <View style={{ height: ScreenHeight * 0.5, alignItems: 'center', justifyContent: 'center' }}>
        <AppText>{t('title:no_data')}</AppText>
      </View>
    ) : (
        <View />
      );
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
            {t('title:contact')}
          </AppText>
          <View style={styles.formIconHead}>
            <TouchableOpacity
              onPress={() => navigation.navigate(AppRoutes.FILTER, { type: FilterScreenType.contacts })}>
              <MyIcon.Fillter fill={contactReducer.filter.filter !== '[]' ? color.navyBlue : color.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginLeft: padding.p20 }}
              onPress={() => {
                navigation.navigate(AppRoutes.SEARCH_LEAD, { type: TypeSearch.contacts });
              }}>
              <MyIcon.Search />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.menuHead}>
          {listMenu.map((item, index) => (
            <ItemMenuContact
              key={item.id}
              onPress={() => changeFilter(index)}
              isActive={contactReducer.filter.filterType === index}
              menuName={item.title}
            />
          ))}
        </View>
        <View style={styles.footerHead}>
          <SelectButton
            title={contactReducer.currentOrganization?.label || ''}
            onPress={() => openModal('ModalFilterByOrganizationUnit')}
            themeColor={color.text}
            titleStyle={{ color: color.text }}
          />
          <AppText style={{ color: color.greyChateau }}>
            {contactReducer.totalCount}
            {t('title:contactTotal')}
          </AppText>
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        keyExtractor={(item, index) => item.id.toString()}
        style={{ flex: 1, backgroundColor: color.lightGray }}
        contentContainerStyle={{ paddingTop: padding.p4 }}
        data={dataContact}
        ListEmptyComponent={renderNoData}
        extraData={dataContact.length}
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
      <Modal visible={!!contactId} transparent animationType="fade">
        <NoteScreen
          typeView={'create'}
          onPressOne={() => setContactId(null)}
          idCrnt={contactId ?? ''}
          typeAPI="contact"
        />
      </Modal>
      <Modalize
        HeaderComponent={
          modalType === 'ModalInfo' ? () => renderModalHeader(userReducer.userInfo?.name ?? ' ') : undefined
        }
        adjustToContentHeight
        scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
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
              idActive={contactReducer.currentOrganization?.id ?? ''}
              onSelect={(item: ItemOrganization | ItemOrganizationList, listChildList: ItemOrganization[] | null) => {
                bottomSheetModalRef.current?.close();
                setRefreshing(true);
                dispatch(
                  changeBodyFilter({
                    filterType: contactReducer.filter.filterType,
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

      <Modal visible={dataDelete != null} transparent={true} animationType="fade">
        <AppConfirm
          disabledOverlayPress
          title={t('title:del_Contact')}
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

export default ListContactScreen;
