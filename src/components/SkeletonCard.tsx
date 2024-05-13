import React, { useEffect } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const styles = StyleSheet.create({
  root: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  cardImage: {
    width: '100%',
    aspectRatio: 1.33,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  cardInfo: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    height: 20,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  cardLikes: {
    width: '20%',
    height: 20,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
});

export interface SkeletonCardProps { }

const SkeletonCard: React.FC<SkeletonCardProps & ViewProps> = ({
  style,
  ...props
}) => {
  const opacity = useSharedValue(0.5);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 1000, easing: Easing.linear }), -1, true);
  }, []);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });
  return (
    <Animated.View style={[styles.root, style, animatedStyle]} {...props}>
      <View style={styles.cardImage} />
      <View style={styles.cardInfo}>
        <View
          style={[styles.cardTitle, { width: `${20 + Math.random() * 30}%` }]}
        />
        <View style={styles.cardLikes} />
      </View>
    </Animated.View>
  );
};

export default SkeletonCard;
