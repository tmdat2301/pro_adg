import React from 'react';
import { View } from 'react-native';
import { DealSummaryModel } from '@interfaces/dashboard.interface';
import { childStyles } from './styles';
import AppText from '@components/AppText';
import { color, fontSize, padding } from '@helpers/index';
import { useTranslation } from 'react-i18next';
import { MyIcon } from '@components/Icon';
import { convertMillion } from '@helpers/untils';
import { Tooltip } from 'react-native-elements/dist/tooltip/Tooltip';

export interface LineChartProps {
  data: DealSummaryModel;
}
const DealSummary = (props: LineChartProps) => {
  const { t } = useTranslation();
  const { data } = props;
  const TitleView = (title: string, fs?: number, icon?: any, popover?: string) => {
    return (
      <View style={childStyles.titleView}>
        <AppText value={title} color={color.text} fontSize={fs || fontSize.f12} numberOfLines={1} />
        <Tooltip
          popover={<AppText style={{ color: color.white, fontSize: fontSize.f12 }}>{popover}</AppText>}
          overlayColor={'transparent'}
          height={80}
          backgroundColor={color.midnight}>
          <View style={{ marginLeft: padding.p4 }}>{icon}</View>
        </Tooltip>
      </View>
    );
  };
  return (
    <View style={[childStyles.container, childStyles.ml8]}>
      <View style={childStyles.titleView}>
        <AppText
          value={t('business:deals').toString()}
          color={color.text}
          fontSize={fontSize.f14}
          fontWeight={'semibold'}
          style={{ marginBottom: padding.p8 }}
        />
      </View>

      <View style={childStyles.viewInfo}>
        {TitleView(t('business:price_undone'))}
        <AppText
          value={convertMillion(data.potentialDealInfo.potentialDealValue)}
          color={color.primary}
          fontSize={fontSize.f16}
          fontWeight={'bold'}
        />
      </View>
      <View style={childStyles.lineSeperator} />
      <View style={childStyles.viewRowInfo}>
        <View style={childStyles.viewInfo}>
          {TitleView(t('business:price_average'), fontSize.f10, <MyIcon.Info />, t('business:valueTB'))}
          <AppText
            value={convertMillion(data.averageValueInfo.averageDealValue)}
            color={color.text}
            fontSize={fontSize.f14}
            fontWeight={'semibold'}
          />
        </View>
        <View style={childStyles.viewInfo}>
          {TitleView(t('business:cycle_average'), fontSize.f10, <MyIcon.Info />, t('business:life_cycle_TB'))}
          <AppText
            value={`${data.averageLifeCircleInfo.days.toString()} ${'Ngày'}`}
            color={color.text}
            fontSize={fontSize.f14}
            fontWeight={'semibold'}
          />
        </View>
      </View>
    </View>
  );
};

export default DealSummary;
