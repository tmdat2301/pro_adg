import AppText from '@components/AppText';
import { MyInput } from '@components/Input';
import color from '@helpers/color';
import fontSize from '@helpers/fontSize';
import padding from '@helpers/padding';
import { DataRelated } from '@interfaces/profile.interface';
import { apiPost } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import _ from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import { ScrollView } from 'react-native-gesture-handler';

export interface ModalRelatedProps {
  onSelect: (data: DataRelated) => void;
  title?: string;
}
export interface dataModal {
  label: string;
  key: string;
}
const ModalRelated: FC<ModalRelatedProps> = React.memo((props) => {
  const { onSelect, title } = props;

  const { t } = useTranslation();
  const [text, setText] = useState<string>('');
  const [dataSearch, setDataSearch] = useState<DataRelated[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const onFilter = async () => {
      setIsLoading(true)
      const url = `${serviceUrls.path.findRelated}?maxResultCount=20`;
      try {
        const params = {
          names: text,
        };
        const response = await apiPost(url, params);
        if (response.error && !_.isEmpty(response.detail)) {
        } else {
          setDataSearch(response.response.data || []);
        }
      } catch (error) { }
      finally {
        setIsLoading(false)
      }
    };
    if (text !== '') {
      onFilter();
    }
  }, [text]);

  const onSearch = (value: string) => {
    setText(value);
  };
  const renderUserItem = (item?: any) => {
    return (
      <TouchableOpacity
        key={item?.id.toString()}
        onPress={() => onSelect(item)}
        style={{ paddingHorizontal: padding.p16 }}>
        <View style={[styles.textContainer]}>
          <>
            <AppText color={color.text} fontSize={fontSize.f14} style={{ marginVertical: padding.p4 }}>
              {item?.name || ''}
            </AppText>
          </>
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
      {title && (
        <AppText fontWeight="semibold" style={styles.titleStyles}>
          {title}
        </AppText>
      )}
      <MyInput.Search onChangeText={onSearch} placeholder={t('input:search_input')} />
      {renderLoading()}
      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }} nestedScrollEnabled>
        {dataSearch.map((item, index) => {
          return renderUserItem(item);
        })}
      </ScrollView>
    </View>
  );
});

export default ModalRelated;

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: padding.p16,
    borderBottomWidth: 1,
    borderBottomColor: color.grayLine,
  },
  titleStyles: {
    paddingVertical: padding.p8,
    fontSize: fontSize.f16,
    textAlign: 'center',
  },
});
