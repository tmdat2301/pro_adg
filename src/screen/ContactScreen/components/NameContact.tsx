import React from 'react';
import { StyleSheet, TouchableOpacity, View, } from 'react-native';
import { color, fontSize, padding } from '@helpers/index';
import { AppText } from '@components/index';
import { Icon } from 'react-native-elements';

const NameContact = ((props: { nameContact: string, onNavigation: () => void }) => {
    const { nameContact, onNavigation } = props;
    return (
        <TouchableOpacity onPress={onNavigation} style={styles.formNameContact}>
            <AppText style={styles.textName}>{nameContact}</AppText>
            <Icon name='right' type='antdesign' size={14} color={color.white} />
        </TouchableOpacity>
    )
})
const styles = StyleSheet.create({
    formNameContact: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: padding.p18,
    },
    textName: {
        fontSize: fontSize.f16,
        lineHeight: padding.p19,
        paddingRight: padding.p8,
        color: color.white,
        fontWeight: '500',
    },
})
export default NameContact;