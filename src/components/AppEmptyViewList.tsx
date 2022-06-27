import React from 'react';
import { padding } from '@helpers/index';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { AppButton, AppText } from '.';
import { color } from '@helpers/index';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';

export interface IEmptyView {
  isRefreshing: boolean;
  isErrorData: boolean;
  onReloadData: () => void;
}

const AppEmptyViewList = (props: IEmptyView) => {
  const { t } = useTranslation();
  const { isRefreshing, isErrorData, onReloadData } = props;
  if (isRefreshing) {
    return null;
  }
  return (
    <View style={styles.loading}>
      {isErrorData ? (
        <AppButton title={t('lead:reload')} onPress={() => onReloadData()} buttonStyle={styles.btn} />
      ) : null}
      <AppText value={isErrorData ? t('lead:error_data').toString() : t('lead:no_data').toString()} />
    </View>
  );
};

export default AppEmptyViewList;

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    paddingVertical: padding.p16,
    flex: 1,
    backgroundColor: color.white,
    height: ScreenHeight,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ScreenWidth / 2,
  },
});
