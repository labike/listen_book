import React, {memo, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, Animated, Easing} from 'react-native';
import {viewportWidth} from '@/utils/index';
import {IBarrage} from '.';

interface IProps {
  data: IBarrage;
  outside: (data: IBarrage) => void;
  animtedListener: (data: IBarrage) => void;
}

function BarrageItem(props: IProps) {
  const anim = useRef(new Animated.Value(0));

  const {outside, data, animtedListener} = props;
  const width = data.title.length * 15;
  const translateX = anim.current.interpolate({
    inputRange: [0, 10],
    outputRange: [viewportWidth, -width],
  });

  const height = 30;

  useEffect(() => {
    let isFree = false;
    // 监听弹幕动画
    anim.current.addListener(({value}) => {
      if (parseInt(value + '', 10) === 3 && !isFree) {
        isFree = true;
        animtedListener(data);
      }
    });
    const spin = Animated.timing(anim.current, {
      toValue: 10,
      duration: 6000,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    // 启动动画，监听弹幕动画结束
    spin.start(({finished}) => {
      if (finished) {
        outside(data);
      }
    });
  }, [data, animtedListener, outside]);

  const getTop = () => {
    return height * data.trackIndex;
  };

  const renderItem = () => {
    return (
      <View style={styles.item}>
        <Text>{data.title}</Text>
      </View>
    );
  };

  let trackStyle = {
    top: getTop(),
    transform: [{translateX: translateX}],
  };

  return (
    <Animated.View style={[styles.track, trackStyle]}>
      {renderItem()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  track: {
    position: 'absolute',
    flexDirection: 'row',
    transform: [{translateX: viewportWidth}],
  },
  item: {
    margin: 10,
  },
});

export default memo(BarrageItem);
