import React, { createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStackScreen from '@navigation/index';
import { store, persistor } from '../store';
import { LogBox, StatusBar, View } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { I18nextProvider } from 'react-i18next';
import { i18n } from './context/locales';
import { LoadingContext } from './interfaces/loading.interface';
import Spinner from 'react-native-loading-spinner-overlay';
import { color, padding } from './helpers';
import { AppContext } from '@contexts/index';
import dayjs from 'dayjs';
import en from 'dayjs/locale/en';
import linking from '@navigation/linking';
import { LocaleConfig } from 'react-native-calendars';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Text } from 'react-native-elements';
import { AppText } from './components';
import { toastConfig } from '@helpers/configToast';

LocaleConfig.locales.vn = {
  monthNames: [
    'Tháng Một',
    'Tháng Hai',
    'Tháng Ba',
    'Tháng Bốn',
    'Tháng Năm',
    'Tháng Sáu',
    'Tháng Bảy',
    'Tháng Tám',
    'Tháng Chín',
    'Tháng Mười',
    'Tháng Mười Một',
    'Tháng Mười Hai',
  ],
  monthNamesShort: ['Thg1.', 'Thg2', 'Thg3', 'Thg4', 'Thg5', 'Thg6', 'Thg7', 'Thg8', 'Thg9', 'Thg10', 'Thg11', 'Thg12'],
  dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: 'Hôm nay',
};
LocaleConfig.locales.en = LocaleConfig.locales[''];

LocaleConfig.defaultLocale = 'vn';

dayjs.locale({
  ...en,
  weekStart: 1,
});
LogBox.ignoreLogs([
  'Remote debugger is in a background tab which may cause apps to perform slowly',
  'DevTools failed to load SourceMap',
]);

export default () => {
  const [isLoadScreen, setIsLoadScreen] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const setLoadingState = (value: boolean) => {
    setLoading(value);
  };
  const loadingStore: LoadingContext = {
    loading,
    setLoading: setLoadingState,
  };
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoadScreen(false);
      SplashScreen.hide();
    }, 800);
  }, []);

  if (isLoadScreen) {
    return null;
  }


  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContext.Provider value={loadingStore}>
          <I18nextProvider i18n={i18n}>
            <NavigationContainer linking={linking}>
              <StatusBar backgroundColor="transparent" translucent={true} />
              <RootStackScreen />
              <Spinner visible={loading} animation="slide" color={color.primary} />
              <Toast position={'bottom'} config={toastConfig} />
            </NavigationContainer>
          </I18nextProvider>
        </AppContext.Provider>
      </PersistGate>
    </Provider>
  );
};
