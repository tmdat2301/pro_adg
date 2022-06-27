import React, { FC } from 'react';

import styles from './styles';

import AgendaCalendar from './components/AgendaCalendar';

import { Host } from 'react-native-portalize';
import {  View } from 'react-native';
export interface ActivityTabProps {
  swiperHeight: number;
  isFocused: boolean;
}

const ActivityTab: FC<ActivityTabProps> = React.memo((props) => {
  const { swiperHeight, isFocused } = props;



  return (
    <Host>
      <View style={[styles.tabContainer, { height: swiperHeight }]}>
        <AgendaCalendar isFocused={isFocused} />
      </View>
    </Host>
  );
});

export default ActivityTab;
