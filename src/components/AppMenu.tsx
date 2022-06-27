import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle, ReactChild, memo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  I18nManager,
  StyleProp,
  ViewStyle,
  TextStyle,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { color } from '@helpers/index';
import AppText from './AppText';
import { isIos } from 'react-native-calendars/src/expandableCalendar/commons';
const { height } = Dimensions.get('window');

const DROPDOWN_MAX_HEIGHT = height * 0.4;
const DROPDOWN_ITEM_WIDTH = 170;

export interface ItemAppMenuProps {
  title: string;
  icon?: ReactChild;
  function: () => void;
  titleStyle?: StyleProp<TextStyle>;
}

interface AppMenuProps {
  data: ItemAppMenuProps[];
  disabled?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  statusBarTranslucent?: boolean;
  dropdownStyle?: StyleProp<any>;
  rowStyle?: StyleProp<any>;
  children?: React.ReactNode;
  onPressExtra?: () => void;
  position?: 'left' | 'right';
}

const AppMenu = forwardRef((props: AppMenuProps, ref: React.ForwardedRef<unknown>) => {
  const {
    data,
    disabled = false,
    buttonStyle,
    statusBarTranslucent,
    dropdownStyle,
    rowStyle,
    position = 'left',
  } = props;
  useImperativeHandle(ref, () => ({
    openDropdown: () => {
      openDropdown();
    },
    closeDropdown: () => {
      closeDropdown();
    },
  }));
  const calculateDropdownHeight = () => {
    if (dropdownStyle && dropdownStyle.height) {
      return dropdownStyle.height;
    } else {
      if (!data || data.length === 0) {
        return 150;
      } else {
        if (rowStyle && rowStyle.height) {
          const height = rowStyle.height * data.length;
          return height < DROPDOWN_MAX_HEIGHT ? height : DROPDOWN_MAX_HEIGHT;
        } else {
          const height = 35 * data.length;
          return height < DROPDOWN_MAX_HEIGHT ? height : DROPDOWN_MAX_HEIGHT;
        }
      }
    }
  };
  ///////////////////////////////////////////////////////
  const DropdownButton = useRef<any | null>(); // button ref to get positions
  const [isVisible, setIsVisible] = useState(false); // dropdown visible ?
  const [dropdownPX, setDropdownPX] = useState(0); // position x
  const [dropdownPY, setDropdownPY] = useState(0); // position y
  const [dropdownHEIGHT, setDropdownHEIGHT] = useState(() => {
    return calculateDropdownHeight();
  }); // dropdown height
  const [dropdownWIDTH, setDropdownWIDTH] = useState(DROPDOWN_ITEM_WIDTH); // dropdown width
  ///////////////////////////////////////////////////////
  /* ********************* Style ********************* */
  const styles = StyleSheet.create({
    dropdownButton: {},
    dropdownItemButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomColor: color.grayLine,
      borderBottomWidth: 1,
      height: 35,
      alignItems: 'center',
      paddingHorizontal: 8,
    },
    //////////////////////////////////////
    dropdownOverlay: {
      width: '100%',
      height: '100%',
    },
    dropdownOverlayView: {
      backgroundColor: color.white,
    },
    dropdownOverlayViewForce: {
      position: 'absolute',
      top: dropdownPY,
      height: dropdownHEIGHT,
      width: dropdownWIDTH,
      borderRadius: 5,
    },
    dropdownOverlayViewForceRTL: I18nManager.isRTL ? { right: dropdownPX } : { left: dropdownPX },
    shadow: {
      shadowColor: color.grayShadow,
      shadowOpacity: 0.25,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 8,
      elevation: 3,
    },
  });

  useEffect(() => {
    setDropdownHEIGHT(calculateDropdownHeight());
  }, [dropdownStyle, data]);

  const openDropdown = () => {
    if (DropdownButton.current != null) {
      DropdownButton.current.measure((fx: number, fy: number, w: number, h: number, px: number, py: number) => {
        const leftSpace = position === 'right' ? 0 : dropdownWIDTH;
        const paddingTop = position === 'right' ? 0 : 8;
        if (height - 24 < py + h + Number(dropdownHEIGHT)) {
          setDropdownPX(px - leftSpace);
          setDropdownPY(py - paddingTop - dropdownHEIGHT - (isIos ? 0 : 24));
        } else {
          setDropdownPX(px - leftSpace);
          setDropdownPY(py + h - paddingTop - (isIos ? 0 : 24));
        }
        setDropdownWIDTH(dropdownStyle?.width || DROPDOWN_ITEM_WIDTH);
      });
    }
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  };
  const closeDropdown = () => {
    setIsVisible(false);
  };

  const renderDropdown = () => {
    return (
      isVisible && (
        <Modal
          supportedOrientations={['portrait', 'landscape']}
          animationType="none"
          transparent={true}
          statusBarTranslucent={statusBarTranslucent ? statusBarTranslucent : false}
          visible={isVisible}>
          <TouchableOpacity activeOpacity={1} style={[styles.dropdownOverlay]} onPress={() => closeDropdown()} />
          <View
            style={[
              styles.dropdownOverlayView,
              styles.shadow,
              dropdownStyle,
              styles.dropdownOverlayViewForce,
              styles.dropdownOverlayViewForceRTL,
            ]}>
            <ScrollView style={{ flex: 1 }}>
              {data.map((item, index) => (
                <TouchableOpacity
                  key={index.toString()}
                  onPress={() => {
                    closeDropdown();
                    item.function();
                  }}
                  style={[styles.dropdownItemButton, rowStyle]}>
                  <AppText style={item.titleStyle}>{item.title || ''}</AppText>
                  {!!item.icon && item.icon}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modal>
      )
    );
  };
  if (props.children) {
    return (
      <TouchableOpacity
        ref={DropdownButton}
        activeOpacity={0.5}
        onPress={() => {
          if (props.onPressExtra) {
            props.onPressExtra();
          }
          openDropdown();
        }}>
        {renderDropdown()}
        {props.children}
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      hitSlop={{ top: 16, left: 8, right: 8, bottom: 8 }}
      disabled={disabled}
      ref={DropdownButton}
      activeOpacity={0.5}
      style={[styles.dropdownButton, buttonStyle]}
      onPress={() => openDropdown()}>
      {renderDropdown()}
      <Icon name="options-vertical" size={13} color={color.icon} />
    </TouchableOpacity>
  );
});

export default memo(AppMenu);
