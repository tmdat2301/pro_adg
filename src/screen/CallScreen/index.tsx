import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Linking, StatusBar, TouchableOpacity, View } from 'react-native';
import { color, fontSize, isIos, padding } from '@helpers/index';
import { AppText } from '@components/index';
import { MyIcon } from '@components/Icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StringeeCall, StringeeClient } from 'stringee-react-native';

import { apiGet } from '@services/serviceHandle';
import dayjs from 'dayjs';
import { TIME_FORMAT_SECONDS } from '@helpers/constants';
import utc from 'dayjs/plugin/utc';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import BackgroundTimer from 'react-native-background-timer';
import { ResponseReturn } from '@interfaces/response.interface';
import Toast from 'react-native-toast-message';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { isIOS } from 'react-native-elements/dist/helpers';

let timeout: any = null;
dayjs.extend(utc);

const CallScreen = (props: { clientId: any }) => {
  const stringeeClient = useRef(null);
  const route = useRoute();
  const params = route.params as { name: string; phone: string; phoneShow: string };
  // const mainPhone = params.phones.find((item) => item.isMain)?.phoneE164 || params?.phones[0]?.phoneE164;
  const stringeeCall = useRef(null);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [dataCall, setDataCall] = useState<{ clientId: string } | null>(null);
  const [userId, setUserId] = useState(null);
  const [isMute, setMute] = useState<boolean>(false);
  const [isPause, setPause] = useState<boolean>(false);
  const [callId, setCallId] = useState<string | null>(null);
  const [isSpeakerphoneOn, setSpeakerphoneOn] = useState<boolean>(false);
  const [isCalling, setCallStatus] = useState<boolean>(false);
  const [second, setSecond] = useState(0);

  const clientEventHandlers = {
    onConnect: (data: any) => {
      console.log('connecttttttttttt', data);
      setUserId(data.userId);
    },
    onDisConnect: () => {
      navigation.goBack();
    },
    onFailWithError: (e) => {
      console.log('fail connecttttttttttt', e);
    },
    onRequestAccessToken: () => {
      console.log('request connecttttttttttt');
    },
    onIncomingCall: () => {},
    onIncomingCall2: () => {},
    onCustomMessage: () => {},
  };

  const callEventHandlers = {
    onChangeSignalingState: ({ callId, code, description }) => {
      console.log('const onChangeSignalingState: ', { callId, code, description });
      if (code === 4) {
        navigation.goBack();
      }
      if (code === 3) {
        Toast.show({
          type: 'error',
          text1: t('lead:notice'),
          text2: t('error:reject_call'),
        });
        navigation.goBack();
      }
      if (code === 2) {
        setCallStatus(true);
      }
    },
    onChangeMediaState: ({ callId, code, description }) => {
      console.log('const onChangeMediaState: ', code);
    },
    onReceiveLocalStream: ({ callId, code, description }) => {
      console.log('const onReceiveLocalStream: ', code);
    },
    onReceiveRemoteStream: ({ callId, code, description }) => {
      console.log('const onReceiveRemoteStream: ', code);
    },
    onReceiveCallInfo: ({ callId, code, description }) => {
      console.log('const onReceiveCallInfo: ', code);
    },
    onHandleOnAnotherDevice: ({ callId, code, description }) => {
      console.log('const onHandleOnAnotherDevice: ', code);
    },
    // onAudioDeviceChange: _didAudioDeviceChange, ///only available on android
  };
  const handleAppStateChange = (nextAppState: string) => {
    if (nextAppState === 'inactive') {
      try {
        stringeeCall?.current.hangup(callId, (status: boolean, code: number, message: string) => {});
      } catch (error) {}
    }
  };

  const onRNCallKitPerformAnswerCallAction = ({ callUUID: string }) => {
    console.log('onRNCallKitPerformAnswerCallAction ' + callUUID);
    // Người dùng ấn answer ở màn hình native incoming call. Lúc này AudioSession sẽ được active => khi active xong mới answer stringeeCall
  };

  const onRNCallKitPerformEndCallAction = (data: any) => {
    console.log('onRNCallKitPerformEndCallAction');
    /* Người dùng ấn endcall ở màn hình incoming call, outgoing call hoặc đang nghe...
        ==> Trường hợp reject call hay end call thì đều gọi hàm này
        ==> Cần phân biệt để goi hàm cho đúng
    */

    onHangup();
  };

  const onRNCallKitDidActivateAudioSession = (data: any) => {
    // AudioSession đã được active, có thể phát nhạc chờ nếu là outgoing call, answer call nếu là incoming call.
    console.log('DID ACTIVE AUDIO');
  };

  useEffect(() => {
    const requestPermission = async () => {
      return await request(isIOS ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO);
    };
    const onGetTokenCall = async () => {
      try {
        const response: ResponseReturn<{ token: string; businessId: string }> = await apiGet(
          '/api/app/oncaller/user-token-by-current-user',
          {},
        );
        if (response.errorMessage || response.detail) {
          Toast.show({
            type: 'error',
            text1: t('lead:notice'),
            text2: response.errorMessage || response.detail || t('error:some_thing_wrong'),
          });
          return;
        }
        if (response.response?.data?.token != null) {
          if (stringeeClient?.current != null && !!response?.response?.data.token) {
            await stringeeClient?.current.connect(response?.response?.data.token);
            setDataCall({ clientId: stringeeClient?.current.getId() });
          }
        } else {
          Toast.show({ type: 'error', text1: t('lead:notice'), text2: t('label:no_permission_call') });
          navigation.goBack();
        }
      } catch (error) {
        Toast.show({ type: 'error', text1: t('lead:notice'), text2: t('error:some_thing_wrong') });
        navigation.goBack();
      }
    };
    const requestPermissionLocation = async () => {
      check(isIOS ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO).then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            Alert.alert('Error', 'This feature is not available (on this device / in this context)', [
              {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => {},
              },
            ]);
            break;
          case RESULTS.DENIED:
            requestPermission();
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            break;
          case RESULTS.BLOCKED:
            Alert.alert(t('title:the_permission_is_denied'), t('label:permission_micro_request'), [
              {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => {
                  setTimeout(() => {
                    Linking.openSettings();
                  }, 1000);
                },
              },
            ]);
            break;
        }
      });
    };

    requestPermissionLocation();
    // const options = {
    //   ios: {
    //     appName: 'OnCRM',
    //   },
    //   android: {
    //     alertTitle: 'Permissions required',
    //     alertDescription: 'This application needs to access your phone accounts',
    //     cancelButton: 'Cancel',
    //     okButton: 'ok',
    //     imageName: 'phone_account_icon',
    //     additionalPermissions: [PermissionsAndroid.PERMISSIONS.example],
    //     foregroundService: {
    //       channelId: 'com.oncrm',
    //       channelName: 'Foreground service for my app',
    //       notificationTitle: 'My app is running on background',
    //       notificationIcon: 'Path to the resource icon of the notification',
    //     },
    //   },
    // };
    // try {
    //   // Chú ý khi cấu hình hàm này cần gọi 1 lần duy nhất.
    //   RNCallKit.setup(options);
    // } catch (err) {
    //   console.log('error:', err.message);
    // }
    // RNCallKit.addEventListener('answerCall', onRNCallKitPerformAnswerCallAction);
    // RNCallKit.addEventListener('endCall', onRNCallKitPerformEndCallAction);
    // RNCallKit.addEventListener('didActivateAudioSession', onRNCallKitDidActivateAudioSession);
    onGetTokenCall();
    return () => {
      BackgroundTimer.stop();
      BackgroundTimer.clearInterval(timeout);

      // RNCallKit.removeEventListener('answerCall');
      // RNCallKit.removeEventListener('endCall');
      // RNCallKit.removeEventListener('didActivateAudioSession');
    };
  }, []);

  useEffect(() => {
    if (isCalling === true) {
      if (isIos) {
        BackgroundTimer.start();
      }
      timeout = BackgroundTimer.setInterval(() => {
        setSecond(second + 1000);
      }, 1000);
    }
    return () => {
      BackgroundTimer.clearInterval(timeout);
    };
  }, [isCalling, second]);

  useEffect(() => {
    if (userId) {
      const myObj = {
        from: 'ADAPTIVENUMBER',
        to: params.phone,
        isVideoCall: false,
      };
      const parameters = JSON.stringify(myObj);
      if (stringeeCall.current) {
        stringeeCall?.current.makeCall(parameters, (status: boolean, code: number, message: string, callId: string) => {
          if (status === true || code === 0) {
            setCallId(callId);
          } else {
            navigation.goBack();
          }
          console.log('status-' + status + ' code-' + code + ' message-' + message + callId);
        });
      }
    }
  }, [userId]);

  const onSetSpeakerphoneOn = useCallback(() => {
    stringeeCall?.current.setSpeakerphoneOn(
      callId,
      !isSpeakerphoneOn,
      (status: boolean, code: number, message: string) => {
        if (status === true) {
          setSpeakerphoneOn(!isSpeakerphoneOn);
        }
      },
    );
  }, [stringeeCall, callId, isSpeakerphoneOn]);

  const onMute = () => {
    stringeeCall?.current.mute(callId, !isMute, (status: boolean, code: number, message: string) => {
      if (status === true) {
        setMute(!isMute);
      }
    });
  };

  const onHangup = async () => {
    if (callId) {
      stringeeCall?.current.hangup(callId, (status: boolean, code: number, message: string) => {
        if (!isIos) {
          navigation.goBack();
        }
      });
    } else {
      stringeeClient?.current.disconnect();
    }
  };
  console.log('dataCall?.clientId', dataCall?.clientId);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        style={styles.formContent}
        locations={[1, 0.73, 1]}
        colors={[color.resolutionBlue800, color.resolutionBlue, color.resolutionBlue800]}>
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <AppText
            style={{ width: '80%', textAlign: 'center' }}
            numberOfLines={2}
            fontSize={padding.p26}
            fontWeight="semibold"
            color={color.white}>
            {params?.name || ''}
          </AppText>
          <AppText
            numberOfLines={1}
            fontSize={padding.p16}
            fontWeight="semibold"
            color={color.white}
            style={{ paddingVertical: padding.p8 }}>
            {params.phoneShow || ''}
          </AppText>
          <AppText
            fontSize={fontSize.f13}
            fontWeight="semibold"
            style={{ lineHeight: padding.p18 }}
            color={color.white}>
            {isCalling ? dayjs(second).utc().format(TIME_FORMAT_SECONDS) : t('title:calling')}
          </AppText>
        </View>

        <View>
          <View style={styles.formIconCall}>
            <TouchableOpacity style={[styles.boxIcon, isMute && { backgroundColor: color.white }]} onPress={onMute}>
              {isMute ? (
                <Icon size={36} name="mic-off" type="material" color={color.black} />
              ) : (
                <Icon size={36} name="mic-off" type="material" color={color.white} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.boxIcon, isSpeakerphoneOn && { backgroundColor: color.white }]}
              onPress={onSetSpeakerphoneOn}>
              {!isSpeakerphoneOn ? (
                <Icon size={36} name="volume-up" type="material" color={color.white} />
              ) : (
                <Icon name="volume-up" size={36} type="material" color={color.black} />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{ alignItems: 'center', paddingVertical: padding.p26 }} onPress={onHangup}>
            <MyIcon.CallOff />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <StringeeClient ref={stringeeClient} eventHandlers={clientEventHandlers} />
      {!!dataCall?.clientId && (
        <StringeeCall ref={stringeeCall} clientId={dataCall?.clientId} eventHandlers={callEventHandlers} />
      )}
    </SafeAreaView>
  );
};
export default CallScreen;
