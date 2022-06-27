import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { color, fontSize, padding } from '@helpers/index';
import { AppText } from '@components/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MyInput } from '@components/Input';
import { AutoCompleteResponse, PlaceDetailResponse, Prediction } from '@interfaces/completeSearch';
import { ResponseReturnArray } from '@interfaces/response.interface';
import { apiGet } from '@services/serviceHandle';
import _ from 'lodash';
import serviceUrls from '@services/serviceUrls';
import env from '@config/env';

export interface StructuredFormattingProps {
  height?: number;
  onPress: (item: { placeId: string; latitude: number; longtitude: number; place: string }) => void;
}
const AutoCompleteSearch: FC<StructuredFormattingProps> = React.memo((props) => {
  const { height, onPress } = props;
  const [data, setData] = useState<Prediction[]>([]);
  const [textData, setTextData] = useState<string>('');
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const onSearch = async () => {
      setIsLoading(true);
      const url = `${serviceUrls.goongMapBaseUrl}/Place/AutoComplete`;
      try {
        const params = {
          api_key: env.GOONG_MAP_KEY,
          input: textData,
        };
        const response: ResponseReturnArray<AutoCompleteResponse> = await apiGet(url, params);
        if (response.error && !_.isEmpty(response.detail)) {
        } else {
          setData(response.response?.predictions || []);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    if (textData !== '') {
      const delayDebounceFn = setTimeout(() => {
        onSearch();
      }, 600);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [textData]);

  const getPlaceDetail = async (placeId: string) => {
    const url = `${serviceUrls.goongMapBaseUrl}/Place/Detail`;
    try {
      setIsLoading(true);
      const params = {
        api_key: env.GOONG_MAP_KEY,
        place_id: placeId,
      };
      const response: ResponseReturnArray<PlaceDetailResponse> = await apiGet(url, params);
      if (response.error && !_.isEmpty(response.detail)) {
      } else {
        onPress({
          placeId: response.response?.result.place_id || null,
          latitude: response.response?.result.geometry.location.lat || null,
          longtitude: response.response?.result.geometry.location.lng || null,
          place: response.response?.result.formatted_address || null,
        });
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoading = () => {
    return isLoading ? (
      <View style={{ paddingTop: 8 }}>
        <ActivityIndicator size="small" color={color.grayShaft} />
      </View>
    ) : null;
  };
  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: useSafeAreaInsets().bottom,
          height: height,
        },
      ]}>
      <View style={styles.titleStyles}>
        <AppText fontSize={fontSize.f16} fontWeight="semibold">
          {t('title:place_search')}
        </AppText>
      </View>
      <MyInput.Search onChangeText={(text) => setTextData(text)} placeholder={t('title:inputPlace')} />
      {renderLoading()}
      <View>
        {data.map((item, index) => {
          return (
            <TouchableOpacity
              key={item.place_id}
              style={styles.formItemPlace}
              onPress={() => getPlaceDetail(item.place_id)}>
              <AppText numberOfLines={1} fontWeight="bold">
                {item.structured_formatting.main_text}
              </AppText>
              <AppText numberOfLines={1}>{item.description}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    borderTopLeftRadius: padding.p20,
    borderTopRightRadius: padding.p20,
  },
  titleStyles: {
    paddingTop: padding.p24,
    alignItems: 'center',
    paddingBottom: padding.p8,
  },
  hitSlop: {
    top: padding.p8,
    right: padding.p8,
    left: padding.p8,
    bottom: padding.p8,
  },
  formItemPlace: {
    marginHorizontal: padding.p10,
    borderBottomWidth: 1,
    padding: padding.p8,
    borderColor: color.grayLine,
  },
});
export default AutoCompleteSearch;
