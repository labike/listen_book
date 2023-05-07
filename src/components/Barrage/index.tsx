import React, {useState} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import Item from './Item';

export interface Message {
  id: number;
  title: string;
}

export interface IBarrage extends Message {
  trackIndex: number;
  isFree?: boolean;
}

interface IProps {
  data: Message[];
  maxTrack: number;
  style?: StyleProp<ViewStyle>;
}

interface IState {
  data: Message[];
  list: IBarrage[][];
}

// 添加弹幕
function addBarrage(data: Message[], maxTrack: number, list: IBarrage[][]) {
  for (let i = 0; i < data.length; i++) {
    const trackIndex = getTrackIndex(list, maxTrack);
    if (trackIndex < 0) {
      continue;
    }
    if (!list[trackIndex]) {
      list[trackIndex] = [];
    }
    const barrage = {
      ...data[i],
      trackIndex,
    };
    list[trackIndex].push(barrage);
  }
  return list;
}
/**
 * [
 *  [{id: '', title}],
 *  [{id: '', title}]
 * ]
 * 获取弹幕轨道的下标
 * @param list
 * @param maxTrack
 */
function getTrackIndex(list: IBarrage[][], maxTrack: number) {
  for (let i = 0; i < maxTrack; i++) {
    const barragesOfTrack = list[i];
    if (!barragesOfTrack || barragesOfTrack.length === 0) {
      return i;
    }
    const lastBarragesofTrack = barragesOfTrack[barragesOfTrack.length - 1];
    if (lastBarragesofTrack.isFree) {
      return i;
    }
  }
  return -1;
}

function useDerivedState(cb: Function, data: any) {
  const [prevData, setPrevData] = useState<any>(null);
  if (data !== prevData) {
    cb();
    setPrevData(data);
  }
}

function Barrage(props: IProps) {
  const [list, setList] = useState(() => {
    return [props.data.map(item => ({...item, trackIndex: 0}))];
  });

  useDerivedState(() => {
    setList(addBarrage(props.data, props.maxTrack, list));
  }, props.data);

  const outside = (data: IBarrage) => {
    const newList = list.slice();
    if (newList.length > 0) {
      const {trackIndex} = data;
      newList[trackIndex] = newList[trackIndex].filter(
        item => item.id !== data.id,
      );
      setList(newList);
    }
  };

  const renderItem = (item: IBarrage[]) => {
    return item.map(barrage => {
      return <Item key={barrage.id} data={barrage} outside={outside} />;
    });
  };

  const {style} = props;
  return <View style={[styles.container, style]}>{list.map(renderItem)}</View>;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});

export default Barrage;
