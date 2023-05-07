import React, {useCallback, useEffect, useReducer} from 'react';
import {FlatList, ListRenderItemInfo} from 'react-native';
import {RootStackNavigation} from '@/navigator/index';
import {connect, ConnectedProps} from 'react-redux';
import {IFound} from '@/models/found';
import Item from './Item';

const connector = connect();

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {
  navigation: RootStackNavigation;
}

interface IState {
  list: IFound[];
  currentId: string;
}

enum Action {
  LIST,
  CURRENTID,
}

type IAction =
  | {type: Action.LIST; list: IFound[]}
  | {type: Action.CURRENTID; currentId: string};

function reducer(state: IState, action: IAction) {
  switch (action.type) {
    case Action.LIST:
      return {...state, list: action.list};
    case Action.CURRENTID:
      return {...state, currentId: action.currentId};
    default:
      return state;
  }
}

function Found(props: IProps) {
  const intialState = {
    list: [],
    currentId: '',
  };
  const [state, _dispatch] = useReducer(reducer, intialState);
  const {dispatch} = props;
  useEffect(() => {
    dispatch({
      type: 'found/fetchList',
      callback: (data: IFound[]) => {
        _dispatch({type: Action.LIST, list: data});
      },
    });
  }, [dispatch]);

  const setCurrentId = useCallback(
    (id: string) => {
      _dispatch({type: Action.CURRENTID, currentId: id});
      if (id) {
        dispatch({
          type: 'player/pause',
        });
      }
    },
    [dispatch],
  );

  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<IFound>) => {
      const paused = item.id !== state.currentId;
      return <Item data={item} paused={paused} setCurrentId={setCurrentId} />;
    },
    [state.currentId, setCurrentId],
  );

  const {list} = state;
  console.log('------found--list', list);
  return (
    <FlatList data={list} renderItem={renderItem} extraData={state.currentId} />
  );
}

export default connector(Found);
