import { PropsWithChildren, useEffect, useRef } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

type FadeInViewProps = PropsWithChildren<{
  delay?: number;
  style?: StyleProp<ViewStyle>;
}>;

export function FadeInView({
  children,
  delay = 0,
  style
}: FadeInViewProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        delay,
        useNativeDriver: true
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 420,
        delay,
        useNativeDriver: true
      })
    ]).start();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
          transform: [{ translateY }]
        }
      ]}
    >
      {children}
    </Animated.View>
  );
}
