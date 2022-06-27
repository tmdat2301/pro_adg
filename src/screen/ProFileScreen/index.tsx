import { AppHeader, AppText } from '@components/index';
import { TabBarVisibilityContext } from '@contexts/index';
import { padding } from '@helpers/index';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '@redux/reducers';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import styles from './styles';

const ProFileScreen = React.memo(() => {
  const { t } = useTranslation();
  const userReducer = useSelector((state: RootState) => state.userReducer);

  const navigation = useNavigation();

  const { setVisible } = useContext(TabBarVisibilityContext);

  useEffect(() => {
    setVisible(false);
    return () => {
      setVisible(true);
    };
  }, []);

  const renderItem = (label: string, value: string) => {
    return (
      <View style={{ paddingHorizontal: padding.p15 }}>
        <AppText style={styles.label}>{label}</AppText>
        <AppText style={styles.value}>{value}</AppText>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.wrapHeader}>
      <AppHeader
        titleStyles={styles.titleHeader}
        title={t('label:profile')}
        isBack
      />
      <ScrollView>
        {renderItem(t('label:name'), userReducer.userInfo?.name || '---')}
        {renderItem(t('label:userName'), userReducer.userInfo?.userName || '---')}
        {renderItem(t('label:email'), userReducer.userInfo?.email)}
        {renderItem(t('label:idStaff'), userReducer.userInfo?.code || '---')}
        {renderItem(t('label:unit'), userReducer.userInfo?.organizationUnitName || '---')}
        {renderItem(t('label:role'), userReducer.userInfo?.roleName || '---')}
        {renderItem(t('label:manager'), userReducer.userInfo?.parentName || '---')}
      </ScrollView>
    </SafeAreaView>
  );
});

export default ProFileScreen;
