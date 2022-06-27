import { color, fontSize, padding } from '@helpers/index';
import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import AppText from '@components/AppText';
import dayjs from 'dayjs';
import { DATE_TIME, DATE_TIME2, DATE_TIME_FORMAT, TIME_FORMAT_24 } from '@helpers/constants';
import { convertMillion } from '@helpers/untils';
import AppMenu, { ItemAppMenuProps } from '@components/AppMenu';

export enum pipelinePositionId {
    L_1 = 1,
    L_2 = 2,
    L_3 = 3,
    L_4 = 4,
    L_5 = 5,

}
export interface ItemDealProps {
    dealType: number;
    dealName: string;
    dealId: string;
    dealTime: string;
    dealPrice: string;
    dealJobName: string;
    dealColorStatus: pipelinePositionId;
    dealTextStatus: string;
    onPress: () => void;
    listAction: ItemAppMenuProps[];
}
const ListDealItem: FC<ItemDealProps> = React.memo(
    ({
        dealName = '',
        dealId = '',
        dealTime = '',
        dealJobName = '',
        dealPrice = '',
        dealColorStatus,
        dealTextStatus,
        onPress,
        listAction = [],
    }) => {
        const renderStatus = (status: pipelinePositionId) => {
            let colorStatus = color.red;
            switch (status) {
                case pipelinePositionId.L_1:
                    colorStatus = color.green900;
                    break;
                case pipelinePositionId.L_4:
                    colorStatus = color.red;
                    break;
                default:
                    colorStatus = color.yellow;
                    break;
            }
            return (
                <View style={styles.formDealStatus}>
                    <View style={[styles.iconDealStatus, { backgroundColor: colorStatus }]}></View>
                    <AppText value={dealTextStatus} numberOfLines={1} color={colorStatus} />
                </View>
            );
        };
        const numbers = dealPrice;

        const renderFormatDate = (time: Date | string) => {
            let times = dayjs(time).format(TIME_FORMAT_24).toString();
            if (!dayjs(time).isSame(new Date(), 'dates')) {
                times = dayjs(time).format(DATE_TIME2).toString();
            }
            return times;
        };
        return (
            <TouchableOpacity style={styles.container} onPress={onPress}>
                <View style={styles.formItemLeft}>
                    <AppText
                        style={styles.itemName}
                        numberOfLines={1}
                        fontWeight='semibold'>
                        {dealName}
                    </AppText>
                    <AppText style={styles.itemPhone}>
                        {dealId}
                    </AppText>
                    <AppText style={styles.itemTime}>
                        {renderFormatDate(dealTime)}
                    </AppText>
                </View>
                <View style={styles.formItemRight}>
                    <View style={{ alignItems: 'flex-end', flex: 1 }}>
                        <AppText numberOfLines={1} >{`${convertMillion(numbers, 'Tr')} VNĐ`}</AppText>

                        <AppText numberOfLines={1} style={styles.itemJobName}>
                            {dealJobName}
                        </AppText>
                        {renderStatus(dealColorStatus)}
                    </View>
                    <AppMenu buttonStyle={styles.formIconItem} data={listAction} />
                </View>
            </TouchableOpacity>
        );
    },
);
export default ListDealItem;
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: color.white,
        paddingHorizontal: padding.p16,
        marginBottom: padding.p4,
    },
    formItemLeft: {
        flex: 1,
        paddingVertical: padding.p12
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
        alignItems: 'center'
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
        color: color.text
    },
    formIconItem: {
        paddingBottom: padding.p12,
        marginLeft: padding.p8
    },
    formDealStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconDealStatus: {
        width: 6,
        height: 6,
        borderRadius: padding.p6,
        marginRight: padding.p6
    }
});