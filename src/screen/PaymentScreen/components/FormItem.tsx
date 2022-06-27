import AppText from '@components/AppText';
import { MyIcon } from '@components/Icon';
import color from '@helpers/color';
import fontSize from '@helpers/fontSize';
import padding from '@helpers/padding';
import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CheckBox } from 'react-native-elements';

export interface PaymentProps {
    itemMission: string;
    itemName: string;
    itemDate: string;
    itemPrice: string;
    itemNote: string;
    itemId: number;
    checked: boolean;
    onPressBox: (id: number) => void;
}
const FormPayment: FC<PaymentProps> = React.memo(
    ({ itemMission, itemName, itemDate, itemPrice, itemNote, itemId, onPressBox, checked }) => {
        // const [checked, setChecked] = useState(true);
        return (
            <View style={styles.container}>
                <View style={styles.formPaymentLeft}>
                    <CheckBox
                        containerStyle={styles.styleCheckbox}
                        checkedIcon={<MyIcon.FormCheck />}
                        uncheckedIcon={<MyIcon.Check />}
                        checked={checked}
                        onPress={() => {
                            // setChecked(!checked);
                            onPressBox(itemId);
                        }}
                    />
                    <View style={styles.textPaymentLeft}>
                        <AppText numberOfLines={1} style={styles.textMission}>
                            {itemMission}
                        </AppText>
                        <AppText style={styles.textName}>{itemName}</AppText>
                        <AppText style={styles.textDate}>{itemDate}</AppText>
                    </View>
                </View>
                <View style={styles.formPaymentRight}>
                    <AppText style={styles.textPrice}>{itemPrice.toString()}</AppText>
                    <AppText style={styles.textNote}>{itemNote}</AppText>
                    <AppText />
                </View>
            </View>
        );
    },
);
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: padding.p15,
        alignItems: 'flex-start',
    },
    formPaymentLeft: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex: 1,
        paddingTop: padding.p18,
    },
    textPaymentLeft: {
        paddingBottom: padding.p16,
        flex: 1,
    },
    formPaymentRight: {
        paddingTop: padding.p18,
    },
    styleCheckbox: {
        padding: 0,
        margin: 0,
        paddingLeft: padding.p5,
        paddingTop: padding.p3,
    },
    textMission: {
        fontSize: fontSize.f13,
        lineHeight: padding.p18,
    },
    textName: {
        fontSize: fontSize.f12,
        color: color.greyChateau,
        lineHeight: padding.p18,
        paddingVertical: padding.p4,
    },
    textDate: {
        fontSize: fontSize.f12,
        color: color.greyChateau,
        lineHeight: padding.p18,
    },
    textPrice: {
        alignSelf: 'flex-end',
        fontSize: fontSize.f13,
        lineHeight: padding.p18,
    },
    textNote: {
        fontSize: fontSize.f12,
        color: color.greyChateau,
        lineHeight: padding.p18,
        paddingVertical: padding.p4,
        alignSelf: 'flex-end',
    },
});
export default FormPayment;
