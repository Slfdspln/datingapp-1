import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  withDelay,
  Easing,
  interpolate,
  runOnJS
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Card animation values for the swiper
export const useCardAnimation = (index) => {
  const offset = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotateZ = useSharedValue(0);
  const opacity = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value },
        { rotateZ: `${rotateZ.value}deg` },
        { scale: scale.value }
      ],
      opacity: opacity.value,
    };
  });

  // Reset animation when index changes
  useEffect(() => {
    offset.value = withSpring(0);
    rotateZ.value = withSpring(0);
    scale.value = withSpring(1);
    opacity.value = withTiming(1, { duration: 300 });
  }, [index]);

  // Swipe left animation
  const swipeLeft = (onComplete) => {
    offset.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 500 });
    rotateZ.value = withTiming(-20, { duration: 500 });
    opacity.value = withTiming(0, { duration: 300 }, () => {
      if (onComplete) {
        runOnJS(onComplete)();
      }
    });
  };

  // Swipe right animation
  const swipeRight = (onComplete) => {
    offset.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 500 });
    rotateZ.value = withTiming(20, { duration: 500 });
    opacity.value = withTiming(0, { duration: 300 }, () => {
      if (onComplete) {
        runOnJS(onComplete)();
      }
    });
  };

  return {
    animatedStyles,
    swipeLeft,
    swipeRight,
    offset,
    rotateZ,
    scale,
    opacity
  };
};

// Button press animation
export const useButtonAnimation = () => {
  const scale = useSharedValue(1);
  
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });
  
  const onPressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };
  
  const onPressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };
  
  return {
    animatedStyles,
    onPressIn,
    onPressOut
  };
};

// Modal animation
export const useModalAnimation = () => {
  const translateY = useSharedValue(1000);
  const opacity = useSharedValue(0);
  
  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });
  
  const modalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });
  
  const showModal = () => {
    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withSpring(0, { 
      damping: 20,
      stiffness: 90
    });
  };
  
  const hideModal = (onComplete) => {
    translateY.value = withTiming(1000, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 }, () => {
      if (onComplete) {
        runOnJS(onComplete)();
      }
    });
  };
  
  return {
    overlayStyle,
    modalStyle,
    showModal,
    hideModal
  };
};

// Staggered entrance animation for lists
export const useStaggeredListAnimation = (itemCount) => {
  const itemAnimations = Array(itemCount).fill(0).map(() => useSharedValue(0));
  
  const animatedStyles = itemAnimations.map((animation) => 
    useAnimatedStyle(() => {
      return {
        opacity: animation.value,
        transform: [
          { 
            translateY: interpolate(
              animation.value, 
              [0, 1], 
              [50, 0]
            ) 
          }
        ]
      };
    })
  );
  
  const animateEntrance = () => {
    itemAnimations.forEach((animation, index) => {
      animation.value = withDelay(
        index * 100, 
        withTiming(1, { 
          duration: 500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1)
        })
      );
    });
  };
  
  return {
    animatedStyles,
    animateEntrance
  };
};

// Pulse animation (for notifications, likes, etc.)
export const usePulseAnimation = () => {
  const scale = useSharedValue(1);
  
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });
  
  const pulse = () => {
    scale.value = withTiming(1.2, { duration: 200 }, () => {
      scale.value = withTiming(1, { duration: 200 });
    });
  };
  
  return {
    animatedStyles,
    pulse
  };
};

// Default export for Expo Router compatibility
export default {
  useCardAnimation,
  useButtonAnimation,
  useModalAnimation,
  useStaggeredListAnimation,
  usePulseAnimation
};
