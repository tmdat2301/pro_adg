import React from 'react';
import { View } from 'react-native';
import { LeadSummaryModel } from '@interfaces/dashboard.interface';
import { childStyles } from './styles';
import AppText from '@components/AppText';
import { color, fontSize, padding } from '@helpers/index';
import { useTranslation } from 'react-i18next';

export interface LineChartProps {
  data: LeadSummaryModel;
}
const LeadSummary = (props: LineChartProps) => {
  const { data } = props;
  const { t } = useTranslation();
  const TitleView = (title: string, fs?: number) => {
    return (
      <View style={childStyles.titleView}>
        <AppText value={title} color={color.text} fontSize={fs || fontSize.f12} numberOfLines={1} />
      </View>
    );
  };
  return (
    <View style={[childStyles.container, childStyles.mr8]}>
      <View style={childStyles.titleView}>
        <AppText
          value={t('business:leads').toString()}
          color={color.text}
          fontSize={fontSize.f14}
          fontWeight={'semibold'}
          style={{ marginBottom: padding.p8 }}
        />
      </View>

      <View style={childStyles.viewInfo}>
        {TitleView(t('business:potential_customer'))}
        <AppText
          value={data.potentialLead.toString()}
          color={color.primary}
          fontSize={fontSize.f16}
          fontWeight={'bold'}
        />
      </View>
      <View style={childStyles.lineSeperator} />
      <View style={childStyles.viewRowInfo}>
        <View style={childStyles.viewInfo}>
          {TitleView(t('business:new_lead'), fontSize.f10)}
          <AppText value={data.newLead.toString()} color={color.text} fontSize={fontSize.f14} fontWeight={'semibold'} />
        </View>
        <View style={childStyles.viewInfo}>
          {TitleView(t('business:swap_lead'), fontSize.f10)}
          <AppText
            value={data.conversionLead.toString()}
            color={color.text}
            fontSize={fontSize.f14}
            fontWeight={'semibold'}
          />
        </View>
      </View>
    </View>
  );
};

export default LeadSummary;
