import React, { FC, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { color, fontSize, padding } from '@helpers/index';
import { AppText } from '@components/index';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { ItemOrganization } from '@interfaces/dashboard.interface';

export interface ButtonOrganizationProps {
  titleButton: string;
  data: ItemOrganization;
  onPress: (item: ItemOrganization) => void;
  isActive: boolean;
  listChild: ItemOrganization[] | null;
  idActive: string;
  level: number;
  onNext?: (item: ItemOrganization) => void;
}

const ButtonOrganization: FC<ButtonOrganizationProps> = React.memo((props) => {
  const { titleButton, onPress, isActive, listChild, data, idActive, level = 0, onNext } = props;
  const [showDataChild, setShowDataChild] = useState(true);
  const haveChild = !!listChild && listChild.length > 0;
  const isLastLevel = level === 3;
  const haveNextLevel = isLastLevel && haveChild;
  const haveChildAndIsNotLastLevel = !isLastLevel && haveChild;
  const showListChild = haveChild && showDataChild && !isLastLevel;
  const paddingLeft = level * padding.p24;
  const onFilterByOrganization = (item: ItemOrganization) => {
    onPress(item);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          {
            paddingHorizontal: padding.p16,
            backgroundColor: isActive ? color.mainBlue200 : 'transparent',
          },
          styles.button,
        ]}
        onPress={() => onPress(data)}>
        {haveChildAndIsNotLastLevel ? (
          <View style={{ paddingLeft: paddingLeft }}>
            <Icon
              hitSlop={styles.hitSlop}
              onPress={() => setShowDataChild(!showDataChild)}
              name={showDataChild ? 'caretdown' : 'caretright'}
              type="antdesign"
              size={12}
              color={color.subText}
            />
          </View>
        ) : (
          <View style={{ paddingLeft: paddingLeft }} />
        )}
        <AppText
          fontSize={fontSize.f14}
          fontWeight={isActive ? 'semibold' : 'normal'}
          style={{
            padding: padding.p10,
            flex: 1,
            paddingLeft: haveChildAndIsNotLastLevel ? padding.p10 : padding.p4,
            color: isActive ? color.primary : color.text,
          }}>
          {titleButton}
        </AppText>
        {haveNextLevel && (
          <TouchableOpacity onPress={onNext ? () => onNext(data) : undefined} hitSlop={styles.hitSlop}>
            <Icon name={'right'} type="antdesign" size={12} color={color.subText} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {haveChildAndIsNotLastLevel && <View style={styles.borderBottom} />}
      {showListChild &&
        listChild?.map((el) => {
          return (
            <ButtonOrganization
              onNext={onNext ? (item) => onNext(item) : undefined}
              level={level + 1}
              data={el}
              key={el.id}
              idActive={idActive}
              listChild={el.children}
              isActive={idActive === el.id}
              onPress={(item) => onFilterByOrganization(item)}
              titleButton={el.label ?? ''}
            />
          );
        })}
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: padding.p8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleStyles: {
    paddingTop: padding.p24,
    alignItems: 'center',
  },
  borderBottom: { height: 1, marginHorizontal: padding.p16, backgroundColor: color.grayLine },
  hitSlop: {
    top: 16,
    right: 16,
    left: 16,
    bottom: 16,
  },
});
export default ButtonOrganization;
