import AppText from '@components/AppText';
import color from '@helpers/color';
import {  TypeCriteria } from '@helpers/constants';
import fontSize from '@helpers/fontSize';
import padding from '@helpers/padding';
import { ResponseReturnArray } from '@interfaces/response.interface';
import { apiPost } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import _ from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import AppHeader from './AppHeader';
import { MyInput } from './Input';

export interface ModalCompanyPipelineProps {
  onSelect?: (data: CompanyPipeline) => void;
  title?: string;
  type?: TypeCriteria.deal | TypeCriteria.lead;
  dataSelect?: CompanyPipeline[];
  dataSelected?: CompanyPipeline;
}

export interface CompanyPipeline {
  companyPipelineName: string;
  id: number;
  isDefault: boolean;
  value: string;
}
const ModalCompanyPipeline: FC<ModalCompanyPipelineProps> = React.memo((props) => {
  const { onSelect = () => {}, dataSelected, title, type = TypeCriteria.lead, dataSelect } = props;
  const [resultData, setResultData] = useState<CompanyPipeline[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState<string>('');
  const { t } = useTranslation();
  const [dataSearch, setDataSearch] = useState<CompanyPipeline[]>([]);

  useEffect(() => {
    const onGetData = async (url: string) => {
      setIsLoading(true);
      try {
        const response: ResponseReturnArray<CompanyPipeline[]> = await apiPost(url, {});
        if (response.error && !_.isEmpty(response.detail)) {
        } else {
          setDataSearch(response.response || []);
          setResultData(response.response || []);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    onGetData(
      type === TypeCriteria.lead ? serviceUrls.path.companyPipeLineCurrentL : serviceUrls.path.companyPipeLineCurrent,
    );
  }, []);

  useEffect(() => {
    if (text === '') {
      setDataSearch(resultData);
    } else {
      setDataSearch(
        resultData.filter((item) => item.companyPipelineName.toLocaleLowerCase().includes(text.toLocaleLowerCase())),
      );
    }
  }, [text]);

  useEffect(() => {
    if (dataSelect && dataSelect.length > 0) {
      setDataSearch(dataSelect);
      setResultData(dataSelect);
    }
  }, [dataSelect]);

  const onSearch = (companyPipelineName: string) => {
    setText(companyPipelineName);
  };

  const onChooseItem = (item: CompanyPipeline) => {
    onSelect(item);
  };
  const renderItem = (item: CompanyPipeline, index: number) => {    
    const isActive = dataSelected?.id && dataSelected?.id === item?.id;
    return (
      <TouchableOpacity
        key={index.toString()}
        onPress={() => {
          onChooseItem(item);
        }}
        style={{ paddingHorizontal: padding.p16 }}>
        <View style={[styles.textContainer, { backgroundColor: 'transparent' }]}>
          <View style={{ flex: 1 }}>
            <AppText
              color={isActive ? color.mainBlue : color.text}
              fontSize={fontSize.f14}
              style={{ marginVertical: padding.p4 }}>
              {item?.companyPipelineName || ''}
            </AppText>
          </View>
          {isActive && <Icon name="check" color={color.mainBlue} />}
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
    <View style={{ paddingTop: 16, height: ScreenHeight * 0.85 }}>
      <AppHeader headerContainerStyles={{ paddingBottom: 16 }} title={title ?? ''} />
      <MyInput.Search onChangeText={onSearch} placeholder={t('input:search_input')} />
      {renderLoading()}
      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }} nestedScrollEnabled>
        {dataSearch &&
          dataSearch?.map((item, index) => {
            return renderItem(item, index);
          })}
      </ScrollView>
    </View>
  );
});

export default ModalCompanyPipeline;

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
    paddingVertical: padding.p8,
    fontSize: fontSize.f16,
    textAlign: 'center',
  },
});
