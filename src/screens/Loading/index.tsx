import React from 'react';
import { FlatList, StyleSheet, View, ViewProps, PanResponder, Image } from 'react-native';
import Card from '../../components/Card';
import SkeletonCard from '../../components/SkeletonCard';
import data from '../../assets/data.json';
import Animated, {
  useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, withTiming,
  withDelay,
} from 'react-native-reanimated';
import refreshIcon from '../../assets/images/refresh-icon.png';
import animatedLogo from '../../assets/images/dribbble-logo.gif';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffabe7',
  },
  refreshContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 36,
    height: 36,
    marginTop: -18,
    marginLeft: -18,
    borderRadius: 18,
    objectFit: 'contain',
  },
});

export interface DribbbleShotsProps { }

const DribbbleShots: React.FC<DribbbleShotsProps & ViewProps> = () => {
  const scrollPosition = useSharedValue(0);
  const pullDownPosition = useSharedValue(0);
  const isReadyToRefresh = useSharedValue(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = (done: () => void) => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      done();
    }, 7500);
  };
  const onPanRelease = () => {
    pullDownPosition.value = withTiming(isReadyToRefresh.value ? 75 : 0, {
      duration: 180,
    });

    if (isReadyToRefresh.value) {
      isReadyToRefresh.value = false;

      const onRefreshComplete = () => {
        pullDownPosition.value = withTiming(0, { duration: 180 });
      };
      onRefresh(onRefreshComplete);
    }
  };
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollPosition.value = event.contentOffset.y;
    },
  });
  const pullDownStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: pullDownPosition.value,
        },
      ],
    };
  });
  const panResponderRef = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (event, gestureState) =>
        scrollPosition.value <= 0 && gestureState.dy >= 0,
      onPanResponderMove: (event, gestureState) => {
        const maxDistance = 150;
        pullDownPosition.value = Math.max(Math.min(maxDistance, gestureState.dy), 0);
        if (
          pullDownPosition.value >= maxDistance / 2 &&
          isReadyToRefresh.value === false
        ) {
          isReadyToRefresh.value = true;
          console.log('Ready to refresh');
        }

        if (
          pullDownPosition.value < maxDistance / 2 &&
          isReadyToRefresh.value === true
        ) {
          isReadyToRefresh.value = false;
          console.log('Will not refresh on release');
        }
      },
      onPanResponderRelease: onPanRelease,
      onPanResponderTerminate: onPanRelease,
    })
  );
  const refreshContainerStyles = useAnimatedStyle(() => {
    return {
      height: pullDownPosition.value,
    };
  });
  const refreshIconStyles = useAnimatedStyle(() => {
    const scale = Math.min(1, Math.max(0, pullDownPosition.value / 75));
    return {
      opacity: refreshing
        ? withDelay(100, withTiming(0, { duration: 20 }))
        : Math.max(0, pullDownPosition.value - 25) / 50,
      transform: [
        {
          scaleX: refreshing ? withTiming(0.15, { duration: 120 }) : scale,
        },
        {
          scaleY: scale,
        },
        {
          rotate: `${pullDownPosition.value * 3}deg`,
        },
      ],
      backgroundColor: refreshing ? '#fff' : 'transparent',
    };
  }, [refreshing]);

  return (
    <View
      pointerEvents={refreshing ? 'none' : 'auto'}
      style={{
        flex: 1,
        backgroundColor: '#333',
      }}
    >
      <Animated.View style={[styles.refreshContainer, refreshContainerStyles]}>
        {refreshing && (
          <Image
            source={animatedLogo}
            style={{ width: 280, height: '100%', objectFit: 'cover' }}
          />
        )}
        <Animated.Image
          source={refreshIcon}
          style={[styles.refreshIcon, refreshIconStyles]}
        />
      </Animated.View>

      <Animated.View
        style={[styles.root, pullDownStyles]}
        {...panResponderRef.current.panHandlers}
      >
        <Animated.FlatList
          data={data}
          keyExtractor={(item) => item.id}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          contentContainerStyle={{
            paddingHorizontal: 50,
            paddingVertical: 30,
          }}
          // renderItem={({ item, index }) => (
          //   <Card
          //     loading={refreshing}
          //     index={index}
          //     image={item.image}
          //     title={item.title}
          //     likes={item.likes}
          //   />
          // )}
          renderItem={({ item, index }) => (
            refreshing ? (
              <SkeletonCard />
            ) : (
              <Card
                loading={refreshing}
                index={index}
                image={item.image}
                title={item.title}
                likes={item.likes}
              />
            )
          )}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        />
      </Animated.View>
    </View>
  );
};

export default DribbbleShots;
