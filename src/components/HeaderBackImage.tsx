import React from 'react';
import {StyleSheet, Animated, Platform} from 'react-native';
import Icon, {IconNames} from '@/assets/iconfont/index';

const styles = StyleSheet.create({
  headerBackImage: {
    marginHorizontal: Platform.OS === 'ios' ? 8 : 0,
    marginVertical: 12,
    color: '#000',
  },
});

function BackIcon(props: IProps) {
  const {name = 'icon-back'} = props;
  return (
    <Icon
      name={name}
      size={25}
      color={props.color}
      style={styles.headerBackImage}
    />
  );
}

const AnimatedIcon = Animated.createAnimatedComponent(BackIcon);

interface IProps {
  name?: IconNames;
  color: Animated.AnimatedInterpolation | string;
}

function HeaderBackImage(props: IProps) {
  return <AnimatedIcon {...props} />;
}

export default HeaderBackImage;
