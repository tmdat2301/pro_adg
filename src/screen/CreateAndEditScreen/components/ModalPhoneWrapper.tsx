import React, { useRef } from "react";
import AppText from '@components/AppText';
import { listCountryCode } from '@components/Input/MultiInput/components/ArrayInput';
import { color, padding, fontSize } from '@helpers/index';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { ScreenWidth } from "react-native-elements/dist/helpers";
import { useTranslation } from "react-i18next";
import { Portal } from "react-native-portalize";

const ModalPhoneWrapper = (props: any) => {
    const { t } = useTranslation();
    const { children } = props;
    const bottomModalRef = useRef<Modalize>();
    const refArray = useRef<any>();

    //! Render
    return (
        <View>
            {children({ bottomModalRef, refArray })}
            <Portal>
                <Modalize
                    adjustToContentHeight
                    withHandle={false}
                    ref={bottomModalRef}
                    HeaderComponent={() => {
                        return (
                            <View style={styles.headerBottomSheet}>
                                <AppText value={t('label:phone_select').toString()} fontSize={fontSize.f16} fontWeight="semibold" />
                            </View>
                        );
                    }}>
                    <>
                        {listCountryCode.map((v, i) => {
                            return (
                                <View key={i} style={{ borderTopWidth: i >= 1 ? 1 : 0, borderTopColor: color.grayLine }}>
                                    <TouchableOpacity
                                        style={[styles.button]}
                                        onPress={() => {
                                            refArray &&
                                                refArray.current &&
                                                refArray.current.onUpdateCountry(v, bottomModalRef.current);
                                        }}>
                                        {v.icon}
                                        <AppText fontSize={fontSize.f14} style={{ padding: padding.p12 }}>
                                            {v.label}
                                        </AppText>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </>
                </Modalize>
            </Portal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: color.white,
        paddingBottom: padding.p12,
    },
    scrollInput: {
        flex: 1,
        backgroundColor: color.lightGray,
        // padding: padding.p16,
    },
    headerBottomSheet: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: padding.p24,
    },
    lineItemSepe: {
        width: '100%',
        height: 1,
        backgroundColor: color.hawkesBlue,
    },
    touchItemSheet: {
        width: ScreenWidth - 32,
        marginHorizontal: padding.p16,
    },
    textItemSheet: {
        paddingVertical: padding.p12,
    },
    viewBorder: {
        marginHorizontal: padding.p16,
        padding: padding.p8,
        backgroundColor: color.white,
        marginBottom: padding.p18,
    },
    textTitle: {
        marginHorizontal: padding.p16,
        marginVertical: padding.p6,
    },
    button: {
        paddingHorizontal: padding.p16,
        flexDirection: 'row',
        alignItems: 'center',
    },
});


export default ModalPhoneWrapper;