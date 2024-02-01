import {
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  Image,
  Platform,
} from 'react-native';
import React, {
  FC,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Gesture,
  GestureDetector,
  ScrollView,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
type BottomSheetProps = {
  children?: React.ReactNode;
};
const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const HEADER_HEIGHT = 55;
let SCREEN_HEIGHTS = 100;
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

const CustomBottomSheet: FC<BottomSheetProps> = ({children}) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHight, setKeyboardHeight] = useState(0);
  SCREEN_HEIGHTS = keyboardVisible ? 100 : 60;
  let max_hight = SCREEN_HEIGHT - keyboardHight;
  const context = useSharedValue({y: 0});
  const translateY = useSharedValue(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const _keyboardDidShow = (event: KeyboardEvent) => {
    setKeyboardVisible(true);
    setKeyboardHeight(event?.endCoordinates?.height);
  };

  const _keyboardDidHide = (event: KeyboardEvent) => {
    // Handle keyboard hide event
    setKeyboardVisible(false);
    setKeyboardHeight(event?.endCoordinates?.height);
    translateY.value = -0;
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = {y: translateY.value};
    })
    .onUpdate(event => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, -max_hight);
    })
    .onEnd(() => {
      if (
        translateY.value > 0 ||
        Math.abs(translateY.value) + SCREEN_HEIGHTS < max_hight / 3
      ) {
        translateY.value = withTiming(0);
      } else if (
        Math.abs(translateY.value) + SCREEN_HEIGHTS < max_hight / 2 ||
        Math.abs(translateY.value) + SCREEN_HEIGHTS < max_hight / 1.5
      ) {
        translateY.value = withSpring(-(max_hight / 2 - SCREEN_HEIGHTS), {
          damping: 50,
        });
      } else if (
        Math.abs(translateY.value) + SCREEN_HEIGHTS >
        max_hight / 1.5
      ) {
        translateY.value = withSpring(
          -max_hight + SCREEN_HEIGHTS + HEADER_HEIGHT,
          {
            damping: 50,
          },
        );
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [0, -max_hight + SCREEN_HEIGHTS + 20],
      [10, 2],
      Extrapolate.CLAMP,
    );
    if (translateY.value > 0) {
      return;
    }

    return {
      borderRadius,
      height: Math.abs(translateY.value) + SCREEN_HEIGHTS,
    };
  });
  const gesture1 = Gesture.Pan();
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
        {keyboardVisible && <View style={styles.line} />}
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

export default CustomBottomSheet;

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHTS,
    width: '100%',
    backgroundColor: '#333333',
    position: 'absolute',
    // top: SCREEN_HEIGHT * 0.8,
    bottom: 0,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#555555',
    // paddingBottom: 20,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 5,
    borderRadius: 2,
  },
});
