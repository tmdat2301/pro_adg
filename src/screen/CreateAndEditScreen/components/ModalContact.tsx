import AppHeader from '@components/AppHeader';
import { AppFieldI } from '@components/Input/MultiInput/AppField';
import { DataResult } from '@interfaces/profile.interface';
import { ResponseReturn } from '@interfaces/response.interface';
import { apiGet } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

interface ModalFailReasonProps extends AppFieldI {
  idComporate?: number;
}

export default (props: ModalFailReasonProps) => {
  const { idComporate, ...restProps } = props;
  const [options, setOptions] = useState<DataResult[]>([]);
  const [text, setText] = useState<string>('');
  const onFilter = async () => {
    const url = `${serviceUrls.path.contactDropDown}`;
    try {
      const params = {
        name: text,
        customerid: 0,
        skipCount: 1,
        maxResultCount: 20,
      };
      const response: ResponseReturn<DataResult[]> = await apiGet(url, params);
      if (response.error && !_.isEmpty(response.detail)) {
      } else {
        setOptions(response.response?.data || []);
      }
    } catch (error) { }
    finally {
    }
  };

  useEffect(() => {
    onFilter();
  }, [text]);

  const onSearch = (value: string) => {
    setText(value);
  };
  useEffect(() => {
    if (idComporate) {
      setText('');
    }
  }, [idComporate]);

  return (
    <View style={{ paddingTop: 16, height: ScreenHeight * 0.85 }}>
      <AppHeader
        headerContainerStyles={{ paddingBottom: 16 }}
        title={title ?? ''}
        iconRight={
          isMutiSelect && (
            <AppText color={color.mainBlue} fontWeight="semibold">
              {t('button:done')}
            </AppText>
          )
        }
        iconRightPress={onMutiSelect && onSave}
      />
      <MyInput.Search onChangeText={onSearch} placeholder={t('input:search')} />
      {renderLoading()}
      <ScrollView style={{ flex: 1 }} nestedScrollEnabled>
        {dataSearch.map((item, index) => {
          return renderUserItem(item, index);
        })}
      </ScrollView>
    </View>
  );
};
