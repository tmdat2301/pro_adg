import AppText from '@components/AppText';
import { MyInput } from '@components/Input';
import color from '@helpers/color';
import fontSize from '@helpers/fontSize';
import padding from '@helpers/padding';
import { DataResult } from '@interfaces/profile.interface';
import { ResponseReturn } from '@interfaces/response.interface';
import { apiGet } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import _ from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import AppHeader from './AppHeader';

export interface ModalIndustryClassificationProps {
  onSelect: (data: DataResult) => void;
  title: string;
  onClose?: () => void;
}
const ModalIndustryClassification: FC<ModalIndustryClassificationProps> = React.memo((props) => {
  const { onSelect, onClose, title } = props;
  const { t } = useTranslation();
  const [resultData, setResultData] = useState<DataResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const onGetData = async () => {
      setIsLoading(true)
      try {
        const response: ResponseReturn<DataResult[]> = await apiGet(serviceUrls.path.industryClassification, {});
        if (response.error && !_.isEmpty(response.detail)) {
        } else {
          setResultData(response.response?.data || []);
        }
      } catch (error) { }
      finally {
        setIsLoading(false)
      }
    };
    onGetData();
  }, []);



  const onChooseItem = (item: DataResult) => {
    onSelect(item);
  };

  const renderUserItem = (item?: any, index?: number) => {
    return (
      <TouchableOpacity
        key={item.label.toString()}
        onPress={() => {
          onChooseItem(item);
        }}
        style={{ paddingHorizontal: padding.p16 }}>
        <View style={[styles.textContainer, { backgroundColor: 'transparent' }]}>
          <View style={{ flex: 1 }}>
            <AppText color={color.text} fontSize={fontSize.f14} style={{ marginVertical: padding.p4 }}>
              {item?.value || item?.label || ''}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const renderLoading = () => {
    return isLoading ? (
      <View style={{ paddingTop: 8 }}>
        <ActivityIndicator size="small" color={color.grayShaft} />
      </View>
    ) : null;
  };
  return (
    <View style={{ paddingTop: 8, height: ScreenHeight * 0.85 }}>
      <AppHeader
        headerContainerStyles={{ paddingVertical: 8, paddingBottom: 16 }}
        title={title}
        iconRightPress={onClose && onClose}

      />
      {renderLoading()}
      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }} nestedScrollEnabled>
        {resultData.map((item, index) => {
          return renderUserItem(item, index);
        })}
      </ScrollView>
    </View>
  );
});

export default ModalIndustryClassification;

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: padding.p16,
    borderBottomWidth: 1,
    borderBottomColor: color.grayLine,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleStyles: {
    paddingVertical: padding.p16,
    fontSize: fontSize.f16,
    textAlign: 'center',
  },
});
