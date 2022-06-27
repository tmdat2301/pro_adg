import { color, fontSize, padding } from '@helpers/index';
import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import AppText from '@components/AppText';
import dayjs, { Dayjs } from 'dayjs';
import { DATE_TIME, DATE_TIME2, TIME_FORMAT_24 } from '@helpers/constants';
import { convertMillion, formatPhone } from '@helpers/untils';
import { useTranslation } from 'react-i18next';
import AppMenu, { ItemAppMenuProps } from '@components/AppMenu';
import Day from 'react-native-calendars/src/calendar/day';


export interface ItemInterpriseProps {
    interpriseName: string;
    interprisePhoneNumber: string;
    interpriseTime: Date;
    interpriseID: string;
    interpriseJobName: string;
    interpriseStatus: number;
    onPress: () => void;
    listAction: ItemAppMenuProps[];
}
const ListInterprisetItem: FC<ItemInterpriseProps> = React.memo(

    ({
        interpriseName = '',
        interprisePhoneNumber = '',
        interpriseTime = '',
        interpriseJobName = '',
        interpriseID = '',
        interpriseStatus,
        onPress,
        listAction = [],
    }) => {
        const { t } = useTranslation();
        const numbers = interpriseStatus;

        const renderFormatDate = (time: Date | string) => {
            let times = dayjs(time).format(TIME_FORMAT_24).toString();
            if (!dayjs(time).isSame(new Date(), 'dates')) {
                times = dayjs(time).format(DATE_TIME2).toString();
            }
            return times;
        };
        return (
            <TouchableOpacity style={styles.container} onPress={onPress}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={styles.formItemLeft}>
                        <AppText
                            style={styles.itemName}
                            numberOfLines={1}
                            fontWeight='semibold'>
                            {interpriseName}
                        </AppText>
                        <AppText style={styles.itemPhone} numberOfLines={1}>
                            {formatPhone(interprisePhoneNumber)}
                        </AppText>

                    </View>
                    <View style={styles.formItemRight}>
                        <View style={{ alignItems: 'flex-end', flex: 1 }}>
                            <AppText style={styles.itemId}>
                                {interpriseID}
                            </AppText>
                            <AppText numberOfLines={1} style={styles.itemJobName}>
                                {interpriseJobName}
                            </AppText>
                        </View>
                        <AppMenu buttonStyle={styles.formIconItem} data={listAction} />
                    </View>
                </View>
                <View style={styles.formItemDatePrice}>
                    <AppText style={styles.itemTime}>
                        {renderFormatDate(interpriseTime)}
                    </AppText>
                    <AppText style={styles.itemPrice} numberOfLines={1}>{t('title:deals_not_yet')}{`${convertMillion(numbers, 'Tr')} VNĐ`}</AppText>
                </View>
            </TouchableOpacity>
        );
    },
);
export default ListInterprisetItem;
const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        backgroundColor: color.white,
        paddingHorizontal: padding.p16,
        marginBottom: padding.p4,
    },
    formItemLeft: {
        flex: 1,
        paddingTop: padding.p12
    },
    itemName: {
        lineHeight: fontSize.f18,
        fontSize: fontSize.f13,
        color: color.black
    },
    itemPhone: {
        lineHeight: fontSize.f18,
        paddingVertical: padding.p4,
        fontSize: fontSize.f13,
        color: color.text
    },
    itemTime: {
        lineHeight: fontSize.f18,
        fontSize: fontSize.f13,
        color: color.subText

    },
    formItemRight: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: padding.p12
    },
    itemId: {
        lineHeight: fontSize.f18,
        fontSize: fontSize.f13,
        color: color.black
    },
    itemJobName: {
        lineHeight: fontSize.f18,
        paddingVertical: padding.p4,
        fontSize: fontSize.f13,
        color: color.text,
    },
    formIconItem: {
        paddingBottom: padding.p12,
        marginLeft: padding.p8,
        alignSelf: 'flex-end',
    },
    formInterpriseStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconInterpriseStatus: {
        width: 6,
        height: 6,
        borderRadius: padding.p6,
        marginRight: padding.p6
    },
    formItemDatePrice: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: padding.p12
    },
    itemPrice: {
        alignSelf: 'center',
        marginRight: padding.p18

    }
});