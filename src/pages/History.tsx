import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';
import {deleteProgram, IProgram} from '@/config/realm';
import Touchable from '@/components/Touchable';
import Icon from '@/assets/iconfont/index';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {formatTime} from '@/utils/index';
import {ModalStackNavigation} from '@/navigator/index';
import {RootState} from '../models';
import IconDeleteItemCcAndM from '@/assets/iconfont/IconDeleteItemCcAndM';

const mapStateToProps = ({found, loading}: RootState) => {
  return {
    programs: found.programs,
    loading:
      loading.effects['found/fetchPrograms'] !== undefined
        ? loading.effects['found/fetchPrograms']
        : false,
  };
};

interface IProps {
  navigation: ModalStackNavigation;
}

function History(props: IProps) {
  const {navigation} = props;
  const dispatch = useDispatch();
  const {programs, loading} = useSelector(mapStateToProps, shallowEqual);
  useEffect(() => {
    dispatch({
      type: 'found/fetchPrograms',
    });
  }, [dispatch]);

  const onPress = (item: IProgram, index: number) => {
    const previousItem = programs[index - 1];
    const nextItem = programs[index + 1];
    let params = {
      id: item.id,
    };
    dispatch({
      type: 'player/setState',
      payload: {
        currentId: item.id,
        playList: programs.map(i => i.id),
        previousId: previousItem && previousItem.id,
        nextId: nextItem && nextItem.id,
      },
    });
    navigation.navigate('ProgramDetail', params);
  };

  const _delete = (item: IProgram) => {
    deleteProgram(item).then(() => {
      dispatch({
        type: 'found/fetchPrograms',
      });
    });
  };

  const onRefresh = () => {
    dispatch({
      type: 'found/fetchPrograms',
    });
  };

  const renderItem = ({item, index}: ListRenderItemInfo<IProgram>) => {
    return (
      <Touchable style={styles.item} onPress={() => onPress(item, index)}>
        <Image source={{uri: item.thumbnailUrl}} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.contentBottom}>
            <View style={styles.iconView}>
              <Icon name="icon-time" color="#999" size={14} />
              <Text style={styles.text}>{formatTime(item.duration)}</Text>
            </View>

            <Text style={styles.rate}>已播：{item.rate}%</Text>
          </View>
        </View>
        <Touchable onPress={() => _delete(item)} style={styles.delete}>
          <IconDeleteItemCcAndM />
        </Touchable>
      </Touchable>
    );
  };

  return (
    <FlatList
      data={programs}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      onRefresh={onRefresh}
      refreshing={loading}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    marginHorizontal: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 3,
    margin: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
  },
  contentBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#999',
  },
  iconView: {
    flexDirection: 'row',
  },
  text: {
    color: '#999',
    marginLeft: 5,
  },
  rate: {
    marginLeft: 20,
    color: '#f6a624',
  },
  delete: {
    padding: 10,
    justifyContent: 'center',
  },
});

export default History;
