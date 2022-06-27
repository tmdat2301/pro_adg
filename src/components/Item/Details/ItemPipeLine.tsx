import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { PipeLinesDetails } from '@interfaces/lead.interface';
import { padding, color, fontSize } from '@helpers/index';
import AppText from '@components/AppText';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
interface IItemPipeLine {
  item: PipeLinesDetails;
  index: number;
  currentSort: number | number[];
  length: number;
  onAction: (object: PipeLinesDetails) => void;
  isDone?: boolean;
}

const ItemPipeLine = (props: IItemPipeLine) => {
  const { currentSort, index, onAction, isDone } = props;
  const { sort, pipeline1, pipelineSymbol, id } = props.item;
  let isPipeLineActive = currentSort >= sort;
  if (id === -99 && typeof currentSort === 'number' && currentSort + 1 === sort) {
    isPipeLineActive = true;
  }
  return (
    <>
      {index === 0 ? null : (
        <View
          style={[
            styles.lineSepe,
            { backgroundColor: isPipeLineActive ? (isDone ? color.redFailed : color.navyBlue) : color.hawkesBlue },
          ]}
        />
      )}
      <TouchableOpacity activeOpacity={1} onPress={() => onAction(props.item)} style={styles.itemContainer}>
        <AppText value={pipelineSymbol} fontSize={fontSize.f12} />
        {isPipeLineActive ? (
          <View style={styles.mv8}>
            <Icon
              type="antdesign"
              name="checkcircle"
              color={isDone ? color.redFailed : color.navyBlue}
              size={fontSize.f18}
            />
          </View>
        ) : (
          <View style={styles.circle} />
        )}
        {index === props.length - 1 ? <View style={{ width: ScreenWidth * 0.065 }} /> : null}
        <AppText value={pipeline1} numberOfLines={2} fontSize={fontSize.f10} style={{ textAlign: 'center' }} />
      </TouchableOpacity>
    </>
  );
};

export default ItemPipeLine;

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: 'center',
    width: ScreenWidth / 4,
  },
  circle: {
    height: 18,
    width: 18,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: color.icon,
    marginVertical: padding.p8,
  },
  mv8: {
    marginVertical: padding.p8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineSepe: {
    position: 'absolute',
    top: 32,
    right: 72,
    bottom: 0,
    width: 50,
    height: 2,
  },
});
