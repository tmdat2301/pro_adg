/* eslint-disable react/react-in-jsx-scope */
import AppText from '@components/AppText';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { color, padding } from '.';
export const toastConfig = {
    /*
        Overwrite 'success' type,
        by modifying the existing `BaseToast` component
      */
    success: (props: any) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: color.green500 }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 15,
                fontWeight: '400',
            }}
        />
    ),
    /*
        Overwrite 'error' type,
        by modifying the existing `ErrorToast` component
      */
    // error: (props: any) => (
    //     <ErrorToast
    //         {...props}
    //         text1Style={{
    //             fontSize: 17,
    //         }}
    //         text2Style={{
    //             fontSize: 15,
    //         }}
    //     />
    // ),
    /*
        Or create a completely new type - `tomatoToast`,
        building the layout from scratch.
  
        I can consume any custom `props` I want.
        They will be passed when calling the `show` method (see below)
      */
    error: ({ text1, text2 }: any) => (
        <View
            style={[styles.errorFullStyle, styles.boxShadow]}>
            <AppText style={{ fontWeight: 'bold', fontSize: padding.p12 }}>{text1}</AppText>
            <AppText style={{ fontSize: padding.p12 }} numberOfLines={4} >{text2}</AppText>
        </View>
    ),
};

const styles = StyleSheet.create({
    errorFullStyle: {
        width: '90%',
        minHeight: 60,
        borderLeftColor: color.red,
        backgroundColor: color.white,
        borderStyle: 'solid',
        borderWidth: 0,
        borderLeftWidth: 5,
        borderRadius: 5,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 20,
        paddingRight: 20,
    },
    boxShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    }

});


