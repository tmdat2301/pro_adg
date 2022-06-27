import React, { useContext, useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View, Animated, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, fontSize, padding } from '@helpers/index';
import { AppButton, AppImage, AppText } from '@components/index';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/reducers';
import actionTypes from '@redux/actionTypes';
import styles from './styles';
import { getTenantByNameRequest, loginRequest } from '@redux/actions/userActions';
import { AppContext } from '@contexts/index';
import Images from '@assets/images';
import { Input, Icon } from 'react-native-elements';
import { TOP_LEVEL_DOMAIN } from '@helpers/constants';
import { apiGet, setToken } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import _ from 'lodash';
import Toast from 'react-native-toast-message';

const SignInScreen = React.memo(() => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const userReducer = useSelector((state: RootState) => state.userReducer);
  const dispatch = useDispatch();
  const appContext = useContext(AppContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [domain, setDomain] = useState('adgstaging');
  const [errorDomain, setErrorDomain] = useState('');
  const [dataLogin, setDataLogin] = useState({ tenantName: '', logoLink: '' });
  const isMemorized = true;
  //!_.isEmpty(dataLogin.tenantName);

  useEffect(() => {
    const onValidateToken = async (token: string) => {
      appContext.setLoading(true);
      setToken(token);
      dispatch(loginRequest({ code: token }, true));
    };
    const listener = Linking.addListener('url', (res) => {
      const url = res.url as string;
      if (url) {
        if (url.includes('fail=')) {
          const start = url.indexOf('fail=') + 5;
          const errorMessage = decodeURIComponent(url.substr(start));
          Toast.show({
            type: 'error',
            text1: t('lead:notice'),
            text2: errorMessage,
          });
          return;
        }
        const start = url.indexOf('=') + 1;
        onValidateToken(url.substr(start));
      }
    });
    return () => {
      listener.remove();
    };
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (
      userReducer.type === actionTypes.LOGIN_SUCCESS ||
      userReducer.type === actionTypes.LOGIN_FAILED ||
      userReducer.type === actionTypes.GET_TENANT_BY_NAME_FAILED ||
      userReducer.type === actionTypes.GET_TENANT_BY_NAME_SUCCESS
    ) {
      appContext.setLoading(false);

      if (userReducer.type === actionTypes.GET_TENANT_BY_NAME_FAILED) {
        Toast.show({
          type: 'error',
          text1: t('lead:notice'),
          text2: t('error:domain_undefined'),
        });
      }

      if (userReducer.type === actionTypes.GET_TENANT_BY_NAME_SUCCESS) {
        setDataLogin({
          logoLink: userReducer.tenantInfo.tenantLogo,
          tenantName: userReducer.tenantInfo.tenantName,
        });
      }
    }
  }, [userReducer]);

  const onGeDomainInfo = () => {
    if (domain.length === 0) {
      return setErrorDomain(t('input:domain_name_empty'));
    }
    appContext.setLoading(true);
    dispatch(getTenantByNameRequest({ tenantName: domain + TOP_LEVEL_DOMAIN }));
    setErrorDomain(t(''));
  };

  const onChangeDomain = () => {
    setDataLogin({ tenantName: '', logoLink: '' });
  };

  const onLoginBySSO = async () => {
    appContext.setLoading(true);
    try {
      const response = await apiGet(`${serviceUrls.path.getLinkLoginSSO}/?type=deeplink`, {});
      if (!_.isEmpty(response.response.data)) {
        Linking.canOpenURL(response.response.data).then((supported) => {
          if (supported) {
            Linking.openURL(response.response.data);
          } else {
            Toast.show({
              type: 'error',
              text1: t('lead:notice'),
              text2: t('error:can_not_open_URL'),
            });
          }
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('lead:notice'),
        text2: t('error:can_not_open_URL'),
      });
    } finally {
      appContext.setLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <AppImage source={Images.loginHeader} style={styles.imageHeader} />
      {isMemorized && (
        <Animated.View style={[styles.boxLogo, { opacity: fadeAnim }]}>
          <AppImage
            source={
              Images.logoAdg
              //   {
              //   uri: dataLogin.logoLink,
              // }
            }
            resizeMode="contain"
            style={styles.logo}
          />
        </Animated.View>
      )}

      <View style={styles.boxTitle}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <AppText fontWeight="semibold" fontSize={fontSize.f24}>
            {t('title:login')}
          </AppText>
        </Animated.View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: Math.min(insets.top, padding.p16) }]}>
      {renderHeader()}
      <View style={styles.contentContainer}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Input
            disabled={isMemorized}
            value={domain}
            onChangeText={(text) => setDomain(text)}
            containerStyle={{ paddingHorizontal: 0 }}
            placeholder={t('input:domain')}
            placeholderTextColor={color.subText}
            inputContainerStyle={{ borderBottomColor: color.backgroundColor }}
            inputStyle={styles.inputStyle}
            // leftIcon={<Icon name="earth" type="antdesign" color={color.icon} />}
            errorMessage={errorDomain}
            rightIcon={
              <AppText fontSize={fontSize.f14} style={{ lineHeight: fontSize.f19 }} color={color.subText}>
                {TOP_LEVEL_DOMAIN}
              </AppText>
            }
          />
          <AppButton
            onPress={isMemorized ? onLoginBySSO : onGeDomainInfo}
            buttonStyle={styles.buttonLoginStyle}
            title={isMemorized ? t('button:login_by_sso', { companyName: 'ADG' }) : t('button:next')}
            titleStyle={styles.textButton}
          />
          {/* {isMemorized && (
            <TouchableOpacity onPress={onChangeDomain}>
              <AppText style={styles.subText}> {t('button:change_domain')}</AppText>
            </TouchableOpacity>
          )} */}
        </Animated.View>
      </View>
    </View>
  );
});

export default SignInScreen;
