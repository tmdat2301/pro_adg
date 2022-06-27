import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { padding, color, fontSize } from '@helpers/index';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import AppText from '@components/AppText';
import { Icon } from 'react-native-elements/dist/icons/Icon';

interface IItemInfo {
  title: string;
  content: string;
  colorExtra?: string;
  isLast?: boolean;
  isTouch?: boolean;
  onPress?: () => void;
}

const ItemInfo = (props: IItemInfo) => {
  const { content, title, colorExtra, isLast, isTouch, onPress } = props;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          onPress ? onPress() : {};
        }}
        activeOpacity={0.8}
        disabled={!isTouch}
        style={styles.rowView}>
        <View style={{ flex: 1 }}>
          <AppText value={title} color={color.subText} fontSize={fontSize.f12} style={styles.title} />
          <AppText value={content} color={colorExtra || color.black} fontSize={fontSize.f14} style={styles.content} />
        </View>
        {isTouch ? <Icon type="simple-line-icon" name="arrow-right" size={12} /> : null}
      </TouchableOpacity>

      {isLast ? null : <View style={styles.line} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ScreenWidth,
    paddingHorizontal: padding.p16,
    backgroundColor: color.white,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: color.hawkesBlue,
  },
  title: {
    paddingTop: padding.p8,
  },
  content: {
    paddingTop: padding.p2,
    paddingBottom: padding.p6,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ItemInfo;
