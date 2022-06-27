import Images from '@assets/images';
import { color, fontSize, padding } from '@helpers/index';
import React, { FC, useState } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, TextProps, Touchable, RecyclerViewBackedScrollViewComponent } from 'react-native';
import AppText from '@components/AppText';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { Value } from 'react-native-reanimated';


export interface ItemMenuContactProps {
    menuName: string;
    onPress: () => void;
    isActive: boolean;
}
const ItemMenuContact: FC<ItemMenuContactProps> = React.memo((props) => {
    const { menuName, isActive = false, onPress } = props;
    return (
        <TouchableOpacity
            style={[styles.formTextMenu, { backgroundColor: isActive ? color.primary : 'transparent' }]}
            onPress={onPress} >
            <AppText
                style={[styles.textMenu, { color: isActive ? color.white : color.greyChateau }, { fontWeight: isActive ? '600' : '400' }]}>
                {menuName}
            </AppText>
        </TouchableOpacity>
    )
})
const styles = StyleSheet.create({
    menuHead: {
        paddingHorizontal: padding.p16,
        backgroundColor: color.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: padding.p12,
    },
    formTextMenu: {
        flex: 1,
        padding: padding.p4,
        backgroundColor: color.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: padding.p5,
    },
    textMenu: {
        color: color.white,
        fontSize: fontSize.f14
    },
})
export default ItemMenuContact;
