import React from 'react';
import { PanResponder } from 'react-native';

const SWIPE_THRESHOLD = 30;
export type HorizontalDirection = 'RIGHT' | 'LEFT';

export function usePanResponder({ onSwipeHorizontal }: { onSwipeHorizontal?: (d: HorizontalDirection) => void }) {
  const [panHandled, setPanHandled] = React.useState(false);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, { dx, dy }) => {
          return dx > 2 || dx < -2 || dy > 2 || dy < -2;
        },
        onPanResponderMove: (_, { dy, dx }) => {
          if (dy < -1 * SWIPE_THRESHOLD || SWIPE_THRESHOLD < dy || panHandled) {
            return;
          }
          if (dx < -1 * SWIPE_THRESHOLD) {
            onSwipeHorizontal && onSwipeHorizontal('LEFT');
            setPanHandled(true);
            return;
          }
          if (dx > SWIPE_THRESHOLD) {
            onSwipeHorizontal && onSwipeHorizontal('RIGHT');
            setPanHandled(true);
            return;
          }
        },
        onPanResponderEnd: () => {
          setPanHandled(false);
        },
      }),
    [panHandled, onSwipeHorizontal],
  );

  return panResponder;
}
