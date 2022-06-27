import AppText from '@components/AppText';
import React, { useState } from 'react';
import { TouchableOpacityProps, TouchableOpacity } from 'react-native';
interface AppButtonProps extends TouchableOpacityProps {
    onPress?: () => void;
    children?: any;
    disabled?: boolean;
    style?: any;
}
const AppButtonDelay = (props: AppButtonProps) => {
    const [disableDelay, setDisableDelay] = useState(false);
    const { onPress, children, disabled, style } = props;
    const pressButtonDisabled = () => {
        setDisableDelay(true);
        // enable after 1 second
        setTimeout(() => {
            setDisableDelay(false);
        }, 1000);
    };

    return (
        <TouchableOpacity
            {...props}
            style={style}
            disabled={disabled || disableDelay}
            onPress={() => {
                onPress && onPress();
                pressButtonDisabled();
            }}>
            {children}
        </TouchableOpacity>
    );
};
export default AppButtonDelay;
