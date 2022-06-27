import styles from './styles';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FlatList, Modal, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { detailsLeadNoteRequest, setRefreshingLeadNote } from '@redux/actions/detailsActions';
import { RootState } from '@redux/reducers';
import { ItemNote } from '@components/Item/Details/index';
import AppText from '@components/AppText';
import { useTranslation } from 'react-i18next';
import { color, fontSize } from '@helpers/index';
import { AppEmptyViewList, AppConfirm } from '@components/index';
import { ItemDetailsNote } from '@interfaces/lead.interface';
import NoteBottomSheet from '@components/Details/NoteBottomSheet';
import { Modalize } from 'react-native-modalize';
import NoteScreen from '@screen/NoteScreen';
import serviceUrls from '@services/serviceUrls';
import Toast from 'react-native-toast-message';
import { ResponseReturn } from '@interfaces/response.interface';
import { apiDelete } from '@services/serviceHandle';
import { AppContext } from '@contexts/index';
import { Portal } from 'react-native-portalize';
import { setTimeOut } from '@helpers/untils';
interface INoteTab {}

const NoteTab = (props: INoteTab) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const bottomSheetModalRef = useRef<Modalize>();
  const appContext = useContext(AppContext);
  const [openModalNote, setOpenModalNote] = useState(false);
  const [openModalConfirmNote, setOpenModalConfirmNote] = useState(false);
  const [typeViewNote, setTypeViewNote] = useState<'create' | 'update' | 'read'>('read');
  const [modalType, setModalType] = useState<'ModalItem' | 'ModalDetails'>('ModalItem');
  const [selectedNote, setSelecteNote] = useState<ItemDetailsNote | null>(null);
  const { objNote, leadId } = useSelector((state: RootState) => state.detailsLeadReducer);

  const openModal = (
    item: ItemDetailsNote,
    typeNote: 'create' | 'update' | 'read',
    typeModal: 'ModalItem' | 'ModalDetails',
  ) => {
    setTypeViewNote(typeNote);
    setSelecteNote(item);
    if (typeNote === 'read') {
      setOpenModalNote(true);
    } else {
      setModalType(typeModal);
      bottomSheetModalRef.current?.open();
    }
  };

  const renderBottomContent = () => {
    switch (modalType) {
      case 'ModalItem':
        return (
          <NoteBottomSheet
            onPress={(id: number) => {
              bottomSheetModalRef.current?.close();
              if (id === -99) {
                setOpenModalConfirmNote(true);
              } else {
                setTypeViewNote('update');
                setOpenModalNote(true);
              }
            }}
          />
        );
    }
  };
  const deleteNote = async (id: string) => {
    try {
      appContext.setLoading(true);
      const url = `${serviceUrls.path.leadDetailsNote}?noteid=${id}`;
      const response: ResponseReturn<boolean> = await apiDelete(url, {});
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
        appContext.setLoading(false);
        Toast.show({
          type: 'success',
          text1: t('lead:notice'),
          text2: t('lead:delete_note_success'),
        });
        setTimeout(() => {
          dispatch(setRefreshingLeadNote(true));
        }, setTimeOut());
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
    if (objNote.load.isRefreshing) {
      dispatch(detailsLeadNoteRequest(leadId ?? ''));
    }
  }, [objNote.load.isRefreshing, leadId]);

  return (
    <View style={styles.container}>
      <View style={styles.viewFilter}>
        <AppText
          value={`${t('lead:private_note')} (${objNote.arrNote.length})`}
          color={color.subText}
          fontSize={fontSize.f12}
        />
      </View>
      <FlatList
        refreshing={objNote.load.isRefreshing}
        onRefresh={() => {
          dispatch(setRefreshingLeadNote(true));
        }}
        ListEmptyComponent={() => {
          return (
            <AppEmptyViewList
              isRefreshing={objNote.load.isRefreshing}
              isErrorData={objNote.load.isError}
              onReloadData={() => dispatch(setRefreshingLeadNote(true))}
            />
          );
        }}
        data={objNote.arrNote}
        extraData={objNote.arrNote}
        keyExtractor={(item, index) => item.id}
        renderItem={({ item, index }) => (
          <ItemNote
            item={item}
            onOption={() => {
              openModal(item, 'update', 'ModalItem');
            }}
            onPress={() => {
              openModal(item, 'read', 'ModalDetails');
            }}
          />
        )}
      />
      <Modal visible={openModalConfirmNote} transparent animationType="fade">
        <AppConfirm
          title={t('lead:delete_note')}
          content={`${t('lead:confirm_delete_note_quest')}`}
          subContent={`${selectedNote && selectedNote.content ? selectedNote.content : ''}?`}
          colorSubContent={color.black}
          onPressLeft={() => setOpenModalConfirmNote(false)}
          onPressRight={() => {
            setOpenModalConfirmNote(false);
            setTimeout(() => {
              if (selectedNote && selectedNote.id) {
                deleteNote(selectedNote.id);
              }
            }, setTimeOut());
          }}
        />
      </Modal>
      <Modal visible={openModalNote} transparent animationType="fade">
        <NoteScreen
          typeView={typeViewNote}
          onPressOne={() => setOpenModalNote(false)}
          onPressExtra={() => {
            setOpenModalNote(false);
            dispatch(setRefreshingLeadNote(true));
          }}
          idCrnt={leadId || -99}
          itemNote={typeViewNote === 'create' ? null : selectedNote}
          typeAPI="lead"
        />
      </Modal>
      <Portal>
        <Modalize adjustToContentHeight ref={bottomSheetModalRef}>
          {renderBottomContent()}
        </Modalize>
      </Portal>
    </View>
  );
};

export default NoteTab;
