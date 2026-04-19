import { PropsWithChildren, useRef } from "react";
import {
  Animated,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle
} from "react-native";

type InteractiveCardProps = PropsWithChildren<
  PressableProps & {
    style?: StyleProp<ViewStyle>;
  }
>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function InteractiveCard({
  children,
  style,
  onPressIn,
  onPressOut,
  ...props
}: InteractiveCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      tension: 220,
      friction: 18,
      useNativeDriver: true
    }).start();
  };

  return (
    <AnimatedPressable
      {...props}
      onPressIn={(event) => {
        animateTo(0.985);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        animateTo(1);
        onPressOut?.(event);
      }}
      style={[
        style,
        {
          transform: [{ scale }]
        }
      ]}
    >
      {children}
    </AnimatedPressable>
  );
}
