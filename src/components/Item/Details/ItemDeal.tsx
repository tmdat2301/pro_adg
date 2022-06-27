import React from 'react';
import { padding, color, fontSize } from '@helpers/index';
import { ItemDealDetails } from '@interfaces/deal.interface';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { AppText } from '@components/index';
import { convertCurrency } from '@helpers/untils';
import { useNavigation } from '@react-navigation/native';
import { AppRoutes } from '@navigation/appRoutes';

interface IItemDeal {
  item: ItemDealDetails;
}

const ItemDeal = (props: IItemDeal) => {
  const { products, price, pipelinePositionId, name, statusName, ownerName, id, hiddenInfo } = props.item;
  const navigation = useNavigation();
  const setColor = () => {
    try {
      switch (pipelinePositionId) {
        case 1:
          return color.green900;
        case 4:
          return color.red;
        default:
          return color.yellow;
      }
    } catch (error) {
      return color.yellow;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        navigation.navigate(AppRoutes.DETAIL_DEAL, { key: id, isGoback: true });
      }}
      style={styles.itemContainer}>
      <View style={styles.rowContent}>
        <AppText value={name} style={styles.flexContentLeft} fontWeight="semibold" numberOfLines={1} />
        <AppText
          value={hiddenInfo ? '****' : `${convertCurrency(price)}đ`}
          style={styles.flexContentRight}
          numberOfLines={1}
        />
      </View>
      <View style={styles.rowContent}>
        <AppText value={ownerName} style={styles.flexContentLeft} numberOfLines={1} />
        <View style={styles.viewDeal}>
          <View
            style={{ width: 6, height: 6, borderRadius: 6, backgroundColor: setColor(), marginHorizontal: padding.p8 }}
          />
          <AppText value={statusName} style={{ textAlign: 'right' }} numberOfLines={1} color={setColor()} />
        </View>
      </View>
      <AppText value={`SP: ${products}`} color={color.subText} fontSize={fontSize.f14} numberOfLines={1} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: ScreenWidth,
    padding: padding.p16,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexContentLeft: {
    flex: 1,
  },
  flexContentRight: {
    flex: 1,
    textAlign: 'right',
  },
  viewDeal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ItemDeal;
