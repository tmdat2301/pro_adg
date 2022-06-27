import { color } from '@helpers/index';
import React from 'react';
import { Icon } from 'react-native-elements/dist/icons/Icon';

export interface IItemOptionsProps {
  id: -1 | -99 | 50 | 1;
}

const ItemIconById = (props: IItemOptionsProps) => {
  const { id } = props;
  if (id === -99) {
    return <Icon type="antdesign" name="delete" color={color.red} />;
  }
  if (id === 1) {
    return <Icon type="antdesign" name="edit" color={color.icon} />;
  }
  if (id === 50) {
    return <Icon type="antdesign" name="swap" color={color.icon} />;
  }
  if (id === -1) {
    return <Icon type="antdesign" name="plus" color={color.icon} />;
  }
  return null;
};

export default ItemIconById;
