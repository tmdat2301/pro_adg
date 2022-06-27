import { AppText } from '@components/index';
import { DATE_FORMAT } from '@helpers/constants';
import { fontSize, color, padding } from '@helpers/index';
import { ItemDetailsNote } from '@interfaces/lead.interface';
import { BodyNote } from '@interfaces/params.interface';
import { ResponseReturn } from '@interfaces/response.interface';
import { apiPost, apiPut } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import dayjs from 'dayjs';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import { Input } from 'react-native-elements';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import styles from './styles';
import Toast from 'react-native-toast-message';
import { AppContext } from '@contexts/index';
import { setTimeOut } from '@helpers/untils';
import AppButtonDelay from '@components/AppButtonDelay';
import { screenHeight } from 'react-native-calendars/src/expandableCalendar/commons';

interface INoteScreen {
  onPressOne: () => void;
  onPressExtra?: () => void;
  typeView: 'create' | 'update' | 'read';
  typeAPI: 'lead' | 'deal' | 'corpo' | 'contact';
  idCrnt: number | string;
  itemNote?: ItemDetailsNote | null;
}

const NoteScreen = (props: INoteScreen) => {
  const { t } = useTranslation();
  const appContext = useContext(AppContext);
  const { onPressOne, onPressExtra, typeAPI, typeView, idCrnt, itemNote } = props;
  const [note, setNote] = useState(itemNote && itemNote.content ? itemNote.content : '');
  const [isClickEnable, setIsClickEnable] = useState(false);
  const id = itemNote && itemNote.id ? itemNote.id : null;
  const [error, setError] = useState<string | null>(null);
  const convertTime = () => {
    try {
      const dateNow = dayjs(Date.now());
      if (itemNote && itemNote.lastModificationTime) {
        const durationHour = dateNow.diff(itemNote.lastModificationTime, 'hour');
        if (durationHour < 1) {
          const durationMinute = dateNow.diff(itemNote.lastModificationTime, 'minute');
          if (durationMinute === 1) {
            return `1 ${t('lead:minute_ago')}`;
          }
          if (durationMinute < 1) {
            return ` ${t('lead:seconds_ago')}`;
          }
          return `${durationMinute} ${t('lead:minutes_ago')}`;
        }
        if (durationHour === 1) {
          return t('lead:an_hour_ago');
        }
        if (durationHour > 1 && durationHour < 24) {
          return `${durationHour} ${t('lead:hours_ago')}`;
        }
        return dayjs(itemNote.lastModificationTime).format(DATE_FORMAT);
      }
    } catch (error) {
      return '';
    }
  };
  const urlByType = () => {
    try {
      let url = serviceUrls.path.dealDetailsNote;
      switch (typeAPI) {
        case 'lead':
          url = serviceUrls.path.leadDetailsNote;
          break;
        case 'deal':
          url = serviceUrls.path.dealDetailsNote;
          break;
        case 'corpo':
          url = serviceUrls.path.corporateDetailsNote;
          break;
        case 'contact':
          url = serviceUrls.path.contactDetailsNote;
          break;
        default:
          url = serviceUrls.path.dealDetailsNote;
          break;
      }
      return url;
    } catch (error) {
      return serviceUrls.path.dealDetailsNote;
    }
  };

  const bodyByType = (isUpdate: boolean) => {
    try {
      let objBody: BodyNote | null = null;
      switch (typeAPI) {
        case 'lead':
          objBody = {
            leadId: idCrnt,
            content: note,
            id: isUpdate && id ? id : null,
          };
          break;
        case 'deal':
          objBody = {
            dealId: idCrnt,
            content: note,
            id: isUpdate && id ? id : null,
          };
          break;
        case 'corpo':
          objBody = {
            customerId: idCrnt,
            content: note,
            id: isUpdate && id ? id : null,
          };
          break;
        case 'contact':
          objBody = {
            contactId: idCrnt,
            content: note,
            id: isUpdate && id ? id : null,
          };
          break;
        default:
          objBody = {
            leadId: idCrnt,
            content: note,
            id: isUpdate && id ? id : null,
          };
          break;
      }
      return objBody;
    } catch (error) {
      return {
        leadId: idCrnt,
        content: note,
        id: isUpdate && id ? id : null,
      };
    }
  };

  const actionNote = async (note: string) => {
    try {
      const url = urlByType();
      appContext.setLoading(true);
      if (typeView === 'create') {
        const response: ResponseReturn<boolean> = await apiPost(url, bodyByType(false));
        if (response.error) {
          setError(response.errorMessage || response.detail || '');
          Toast.show({
            type: 'error',
            text1: t('lead:notice'),
            text2: response.errorMessage || response.detail || '',
          });
        } else if (response.response && response.response.data) {
          setError(null);
          Toast.show({
            type: 'success',
            text1: t('lead:notice'),
            text2: t('lead:create_note_success'),
          });
          setNote('');
          if (onPressExtra) {
            onPressExtra();
          }
        }
      } else {
        const response: ResponseReturn<boolean> = await apiPut(url, bodyByType(true));
        if (response.error) {
          Toast.show({
            type: 'error',
            text1: t('lead:notice'),
            text2: response.errorMessage || response.detail || '',
          });
          setError(response.errorMessage || response.detail || '');
        } else if (response.response && response.response.data) {
          setError(null);
          Toast.show({
            type: 'success',
            text1: t('lead:notice'),
            text2: t('lead:edit_note_success'),
          });
          setNote('');
          if (onPressExtra) {
            onPressExtra();
          }
        }
      }
    } catch (error) {
      appContext.setLoading(false);
      Toast.show({
        type: 'error',
        text1: t('lead:notice'),
        text2: JSON.stringify(error),
      });
    } finally {
      setTimeout(() => {
        setIsClickEnable(false);
      }, setTimeOut());
      appContext.setLoading(false);
    }
  };

  return (
    <View style={styles.modalTouch}>
      <View style={[styles.container, typeView !== 'create' && { minHeight: screenHeight * 0.3 }]}>
        <AppText value={t('label:note').toString()} fontSize={fontSize.f16} style={styles.viewTitle} />
        <View style={[{ width: '100%', flex: 1 }]}>
          {typeView === 'read' ? (
            <ScrollView>
              <AppText style={{ padding: padding.p8 }} value={note} />
            </ScrollView>
          ) : (
            <Input
              autoFocus
              value={note}
              multiline={true}
              keyboardType={'default'}
              onChangeText={(text) => setNote(text)}
              style={styles.viewInput}
              inputContainerStyle={styles.containerInput}
              errorStyle={{ height: 0 }}
            />
          )}
        </View>
        {error ? (
          <View style={styles.contentOwned}>
            <AppText value={error} fontSize={fontSize.f12} color={color.red} fontWeight="semibold" />
          </View>
        ) : null}
        {itemNote ? (
          <View style={styles.contentOwned}>
            <AppText value={itemNote.creationName} fontSize={fontSize.f12} color={color.subText} />
            <Icon
              type="simple-line-icon"
              name="clock"
              size={fontSize.f10}
              color={color.icon}
              style={styles.iconClock}
            />
            <AppText value={convertTime()} fontSize={fontSize.f12} color={color.subText} />
          </View>
        ) : null}
        <View style={styles.lineHSepe} />
        {typeView === 'read' ? (
          <View style={styles.viewOneBtn}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                onPressOne();
                setNote('');
              }}
              style={styles.childBtn}>
              <AppText value={t('button:exit').toString()} fontSize={fontSize.f14} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.viewTwoBtn}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                onPressOne();
                setNote('');
              }}
              style={styles.childBtn}>
              <AppText value={t('button:exit').toString()} fontSize={fontSize.f14} />
            </TouchableOpacity>
            <View style={styles.lineVSepe} />
            <AppButtonDelay
              disabled={note.trim().length === 0 || isClickEnable}
              activeOpacity={0.8}
              onPress={() => {
                Keyboard.dismiss();
                setIsClickEnable(true);
                onPressOne();
                setTimeout(() => {
                  actionNote(note);
                }, setTimeOut());
              }}
              style={styles.childBtn}>
              <AppText
                value={t('button:save').toString()}
                fontSize={fontSize.f14}
                color={note.trim().length === 0 || isClickEnable ? color.gray : color.navyBlue}
              />
            </AppButtonDelay>
          </View>
        )}
      </View>
    </View>
  );
};

export default NoteScreen;
