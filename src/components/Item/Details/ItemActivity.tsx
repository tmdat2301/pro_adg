import { AppText } from '@components/index';
import { padding, fontSize, color } from '@helpers/index';
import { ItemDetailsActivity } from '@interfaces/lead.interface';
import { RootState } from '@redux/reducers';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { useSelector } from 'react-redux';
interface IItemActivity {
  item: ItemDetailsActivity;
}

const ItemActivity = (props: IItemActivity) => {
  const { t } = useTranslation();
  const { author, activityTypeId, time, activityName, additionalActivityName, icon } = props.item;
  const { arrTypeActivity } = useSelector((state: RootState) => state.filterReducer);
  let nameActivity = '';
  let nameExtra = '';
  const split = additionalActivityName
    ? additionalActivityName.split(' - ')
    : activityName
    ? activityName.split(' - ')
    : [];
  if (split.length === 2) {
    nameActivity = split[0];
    nameExtra = split[1];
  } else {
    nameActivity = activityName || additionalActivityName || '';
  }
  const setIcon = () => {
    try {
      if (arrTypeActivity.length > 0) {
        const index = arrTypeActivity.findIndex((x) => x.id === activityTypeId);
        if (index > -1) {
          return (
            <Icon
              type="font-awesome-5"
              name={arrTypeActivity[index].icon.replace('fa-', '')}
              size={fontSize.f16}
              color={color.navyBlue}
            />
          );
        }
      } else {
        return (
          <Icon
            type="font-awesome-5"
            name={icon ? icon.replace('fa-', '') : 'cat'}
            size={fontSize.f16}
            color={color.navyBlue}
          />
        );
      }
    } catch (error) {
      return (
        <Icon
          type="font-awesome-5"
          name={icon ? icon.replace('fa-', '') : 'cat'}
          size={fontSize.f16}
          color={color.navyBlue}
        />
      );
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <View style={styles.iconFileType}>{setIcon()}</View>
        <View style={styles.contentFile}>
          <View style={styles.rowText}>
            <AppText fontSize={fontSize.f14} numberOfLines={2} fontWeight="medium">
              {`${nameActivity ?? ''} ${nameExtra.length > 0 ? ' - ' : ''}`}
              <AppText fontSize={fontSize.f14} numberOfLines={1} color={color.primary} fontWeight="medium">
                {nameExtra}
              </AppText>
            </AppText>
          </View>
          <View style={styles.rowText}>
            <AppText value={author || t('label:emptyName').toString()} fontSize={fontSize.f12} numberOfLines={1} />
            <Icon
              type="simple-line-icon"
              name="clock"
              size={fontSize.f10}
              color={color.icon}
              style={styles.iconClock}
            />
            <AppText value={time} fontSize={fontSize.f12} color={color.subText} numberOfLines={1} />
          </View>
        </View>
      </View>
      <View style={styles.lineSepe} />
    </View>
  );
};

export default ItemActivity;

const styles = StyleSheet.create({
  container: {
    width: ScreenWidth,
    paddingHorizontal: padding.p16,
    backgroundColor: color.white,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconFileType: {
    width: 20,
    alignItems: 'center',
  },
  contentFile: {
    flex: 1,
    margin: padding.p12,
  },
  rowText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconClock: {
    marginHorizontal: padding.p8,
  },
  lineSepe: {
    width: '100%',
    height: 1,
    backgroundColor: color.hawkesBlue,
  },
});
