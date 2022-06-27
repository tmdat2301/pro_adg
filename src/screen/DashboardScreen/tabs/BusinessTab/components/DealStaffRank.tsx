import AppText from '@components/AppText';
import { color, fontSize, padding } from '@helpers/index';
import { convertMillion } from '@helpers/untils';
import { StaffRankItem } from '@interfaces/dashboard.interface';
import { RootState } from '@redux/reducers';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { useSelector } from 'react-redux';

interface StaffRankProps {
  arrRankStaff: StaffRankItem[];
  onShowModal?: () => void;
}

const DealStaffRank = (props: StaffRankProps) => {
  const { arrRankStaff, onShowModal } = props;
  const { t } = useTranslation();
  const { filterBusiness } = useSelector((state: RootState) => state.filterReducer);
  const setBgNumber = (index: number) => {
    try {
      let bg = color.pink;
      switch (index) {
        case 1:
          bg = color.pink;
          break;
        case 2:
          bg = color.lavenderGrey;
          break;
        case 3:
          bg = color.green500;
          break;
        case 4:
          bg = color.thistle;
          break;
        case 5:
          bg = color.blizzardBlue;
          break;
        default:
          bg = color.pink;
          break;
      }
      return bg;
    } catch (error) {
      return color.white;
    }
  };

  const itemRank = (value: StaffRankItem, index: number) => {
    return (
      <View style={styles.itemView}>
        <View style={[styles.itemCircleIndex, { backgroundColor: setBgNumber(value.index) }]}>
          <AppText value={value.index} fontWeight={'semibold'} fontSize={fontSize.f16} />
        </View>
        <View style={styles.itemInfo}>
          <AppText value={value.fullName} fontSize={fontSize.f14} style={styles.itemName} />
          <AppText value={value.email} style={styles.email} />
        </View>
        <AppText
          value={filterBusiness.criteriaRank === 5 ? convertMillion(value.sumDeal) : value.totalDeal}
          color={color.primary}
          fontWeight={'semibold'}
          fontSize={fontSize.f14}
        />
      </View>
    );
  };

  return (
    <>
      <View style={styles.contentStyles}>
        <AppText
          value={t('business:staff_rank_deal').toString()}
          color={color.text}
          fontWeight={'semibold'}
          fontSize={fontSize.f14}
          style={{ paddingHorizontal: padding.p8 }}
        />
        <TouchableOpacity style={styles.valueStyles} onPress={onShowModal}>
          <AppText
            value={
              filterBusiness.criteriaRank === 5 ? t('business:values').toString() : t('business:quantity').toString()
            }
            style={{ color: color.primary, marginRight: 6 }}
          />
          <Icon name="caretdown" type="antdesign" size={14} color={color.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={arrRankStaff}
        extraData={arrRankStaff}
        ListEmptyComponent={() => {
          return (
            <View style={styles.centerV}>
              <AppText value={t('business:no_data').toString()} color={color.gray} />
            </View>
          );
        }}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({ item, index }) => itemRank(item, index)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: padding.p8,
    marginVertical: padding.p10,
  },
  itemCircleIndex: {
    width: 30,
    height: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    flex: 1,
  },
  centerV: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  email: {
    color: color.subText,
    fontSize: fontSize.f12,
  },
  itemInfo: {
    flex: 1,
    marginLeft: padding.p10,
  },
  contentStyles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: padding.p8,
  },
  valueStyles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: padding.p8,
  },
});

export default DealStaffRank;
