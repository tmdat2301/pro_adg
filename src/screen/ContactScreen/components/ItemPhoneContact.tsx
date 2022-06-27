import React from 'react';
import { StyleSheet, TouchableOpacity, View, } from 'react-native';
import { color, fontSize, padding } from '@helpers/index';
import { AppText } from '@components/index';
import { formatPhone } from '@helpers/untils';


const ItemPhoneContact = ((props: { phoneContact: string }) => {
    const { phoneContact } = props;
    return (
        <View style={styles.formPhoneContent}>
            <TouchableOpacity style={styles.phoneContact}>
                <AppText color={color.primary} style={styles.textPhone}>{formatPhone(phoneContact)}</AppText>
            </TouchableOpacity>
        </View>
    )
})
const styles = StyleSheet.create({
    formPhoneContent: {
        paddingLeft: padding.p38,
    },
    phoneContact: {
        marginBottom: padding.p15
    },
    textPhone: {
        fontSize: fontSize.f14
    }
})
export default ItemPhoneContact;