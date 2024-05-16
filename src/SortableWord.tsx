import React, {ReactElement} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  useDerivedValue,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {
  MARGIN_TOP,
  Offset,
  calculateLayout,
  lastOrder,
  remove,
  reorder,
} from './Layout';
import Placeholder from './Placeholder';
import {between, move, useVector} from 'react-native-redash';

interface SortableWordProps {
  offsets: Offset[];
  children: ReactElement<{id: number}>;
  index: number;
  containerWidth: number;
}

const SortableWord = ({
  offsets,
  index,
  children,
  containerWidth,
}: SortableWordProps) => {
  const offset = offsets[index];

  const isInBank = useDerivedValue(() => offset.order.value == -1);

  const isGestureActive = useSharedValue(false);

  const translation = useVector();

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      if (isInBank.value) {
        translation.x.value = offset.originalX.value;
        translation.y.value = offset.originalY.value + MARGIN_TOP;
      } else {
        translation.x.value = offset.x.value;
        translation.y.value = offset.y.value;
      }

      ctx.x = translation.x.value;
      ctx.y = translation.y.value;

      isGestureActive.value = true;
    },
    onActive: ({translationX, translationY}, ctx: any) => {
      translation.x.value = ctx.x + translationX;
      translation.y.value = ctx.y + translationY;

      if (isInBank.value && translation.y.value < 100) {
        offset.order.value = lastOrder(offsets);
        calculateLayout(offsets, containerWidth);
      } else if (!isInBank.value && translation.y.value > 100) {
        offset.order.value = -1;
        remove(offsets, index);

        calculateLayout(offsets, containerWidth);
      }

      for (let i = 0; i < offsets.length; i++) {
        const o = offsets[i];
        if (i == index && o.order.value !== -1) {
          continue;
        }

        if (
          o.order.value &&
          between(translation.x.value, o.x.value, o.x.value + o.x.value) &&
          between(translation.y.value, o.y.value, o.y.value + o.height.value)
        ) {
          reorder(offsets, offset.order.value, o.order.value);
          calculateLayout(offsets, containerWidth);
          break;
        }
      }
    },
    onEnd: () => {
      isGestureActive.value = false;
      translation.x.value = withSpring(offset.x.value);
      translation.x.value = withSpring(offset.y.value);
    },
  });

  const translateX = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.x.value;
    }

    return withSpring(isInBank.value ? offset.originalX.value : offset.x.value);
  });

  const translateY = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.y.value;
    }
    return withSpring(
      isInBank.value ? offset.originalY.value + MARGIN_TOP : offset.y.value,
    );
  });

  const style = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: isGestureActive.value ? 100 : 0,
      width: offset.width.value,
      height: offset.height.value,
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <>
      <Placeholder offset={offset} />
      <Animated.View style={style}>
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <Animated.View style={StyleSheet.absoluteFill}>
            {children}
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </>
  );
};

export default SortableWord;
