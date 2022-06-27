import React, { useEffect } from 'react';
import AppImage from '@components/AppImage';
import AppText from '@components/AppText';
import { Alert, Linking, Platform, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import images from '@assets/images';
import { Button } from 'react-native-elements/dist/buttons/Button';
import { useTranslation } from 'react-i18next';
import NetInfo from '@react-native-community/netinfo';

const ErrorCard = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.errorContainer}>
      <StatusBar barStyle={'dark-content'} />
      <View>
        <AppImage source={images.networkError} style={styles.img} />
      </View>
      <View style={styles.textContainer}>
        <AppText style={styles.errorHead}>Mất kết nối mạng</AppText>
        <AppText style={styles.subText}>Hãy kiểm tra lại kết nối mạng</AppText>
      </View>
      {/* <View style={{ flexDirection: 'row', width: '100%', marginTop:24 }}>
        <AppText color="" style={{paddingHorizontal:16}}>{'Thoats'}</AppText>
        <AppText style={{paddingHorizontal:16}}>{'Thuwr laij'}</AppText>
      </View> */}
    </View>
  );
};

export default ErrorCard;

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    flexDirection: 'column',
  },
  errorContainer: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    paddingBottom: 30,
    justifyContent: 'center',
  },
  rootContainer: { justifyContent: 'flex-start', padding: 10 },
  img: { height: 120, width: 120 },
  textContainer: {
    alignItems: 'center',
  },
  title: { marginBottom: 10, fontSize: 20, fontWeight: 'bold' },
  errorHead: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 50,
    textAlign: 'center',
  },
});
