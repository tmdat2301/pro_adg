import React, { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { StyleSheet, ViewStyle, Animated } from 'react-native';
import { color, padding } from '@helpers/index';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import Carousel, { Pagination } from 'react-native-snap-carousel';
export interface SwiperViewProps {
  containerStyle?: ViewStyle;
  firstComponent: ReactElement;
  secondComponent: ReactElement;
}
const SwiperView: FC<SwiperViewProps> = React.memo((props) => {
  const { firstComponent, secondComponent, containerStyle, ...restProps } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const carouselRef = useRef<any>(null);
  const sliderWidth = ScreenWidth - padding.p32;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const renderItem = (data: { item: ReactElement; index: number }) => {
    return data.item;
  };
  return (
    <Animated.View style={[styles.container, containerStyle, { opacity: fadeAnim }]}>
      <Carousel
        enableSnap
        ref={carouselRef}
        sliderWidth={sliderWidth}
        itemWidth={sliderWidth - padding.p8}
        onSnapToItem={(index) => setCurrentIndex(index)}
        inactiveSlideScale={0.95}
        useScrollView={true}
        data={[firstComponent, secondComponent]}
        renderItem={renderItem}
        {...restProps}
      />
      <Pagination
        dotsLength={2}
        containerStyle={{ paddingVertical: padding.p12 }}
        activeDotIndex={currentIndex}
        dotColor={color.primary}
        dotStyle={styles.paginationDot}
        inactiveDotColor={color.primary}
        inactiveDotOpacity={0.3}
        inactiveDotScale={1}
        inactiveDotStyle={styles.paginationDot}
        carouselRef={carouselRef.current}
      />
    </Animated.View>
  );
});
const styles = StyleSheet.create({
  container: {
    height: ScreenWidth * 0.89,
    width: ScreenWidth - padding.p32,
    backgroundColor: color.white,
    borderRadius: 8,
    paddingTop: padding.p16,
    shadowColor: color.grayShadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  paginationDot: { width: 8, height: 8 },
});
export default SwiperView;
