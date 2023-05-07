import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import _ from 'lodash';
import {DragSortableView} from 'react-native-drag-sort';
import {RootState} from '@/models/index';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {ICategory} from '@/models/category';
import Item, {parentWidth, itemWidth, itemHeight, margin} from './Item';
import {RootStackNavigation} from '@/navigator/index';
import HeaderRightBtn from './HeaderRightBtn';
import Touchable from '@/components/Touchable';

const mapStateToProps = ({category}: RootState) => {
  return {
    myCategorys: category.myCategorys,
    categorys: category.categorys,
    isEdit: category.isEdit,
  };
};

interface IProps {
  navigation: RootStackNavigation;
}

const fixedItems = [0, 1];

function Category(props: IProps) {
  const {myCategorys, categorys, isEdit} = useSelector(
    mapStateToProps,
    shallowEqual,
  );
  const [_myCategorys, setMyCategorys] = useState(myCategorys);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const dispatch = useDispatch();
  const {navigation} = props;
  useEffect(() => {
    const onSubmit = () => {
      dispatch({
        type: 'category/toggle',
        payload: {
          myCategorys: _myCategorys,
        },
      });

      if (isEdit) {
        navigation.goBack();
      }
    };
    navigation.setOptions({
      headerRight: () => <HeaderRightBtn onSubmit={onSubmit} />,
    });
  }, [dispatch, navigation, isEdit, _myCategorys]);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'category/setState',
        payload: {
          isEdit: false,
        },
      });
    };
  }, [dispatch]);

  const onLongPress = () => {
    dispatch({
      type: 'category/setState',
      payload: {
        isEdit: true,
      },
    });
  };
  const onPress = (item: ICategory, index: number, selected: boolean) => {
    if (isEdit) {
      if (selected) {
        setMyCategorys(
          _myCategorys.filter(selectedItem => selectedItem.id !== item.id),
        );
      } else {
        setMyCategorys(_myCategorys.concat([item]));
      }
    }
  };
  const onClickItem = (data: ICategory[], item: ICategory) => {
    const disabled = fixedItems.indexOf(data.indexOf(item)) > -1;
    if (disabled) return;
    onPress(item, data.indexOf(item), true);
  };
  const onDataChange = (data: ICategory[]) => {
    setMyCategorys(data);
  };

  const renderItem = (item: ICategory, index: number) => {
    const disabled = fixedItems.indexOf(index) > -1;
    return (
      <Item
        key={item.id}
        data={item}
        disabled={disabled}
        isEdit={isEdit}
        selected
      />
    );
  };
  const renderUnSelectedItem = (item: ICategory, index: number) => {
    return (
      <Touchable
        key={item.id}
        onPress={() => onPress(item, index, false)}
        onLongPress={onLongPress}>
        <Item data={item} isEdit={isEdit} selected={false} />
      </Touchable>
    );
  };

  const clasifyGroup = _.groupBy(categorys, item => item.classify);
  return (
    <ScrollView style={styles.container} scrollEnabled={scrollEnabled}>
      <Text style={styles.classifyName}>我的分类</Text>
      <View style={styles.classifyView}>
        <DragSortableView
          dataSource={_myCategorys}
          fixedItems={fixedItems}
          renderItem={renderItem}
          sortable={isEdit}
          keyExtractor={item => item.id}
          onDataChange={onDataChange}
          parentWidth={parentWidth}
          childrenWidth={itemWidth}
          childrenHeight={itemHeight}
          marginChildrenTop={margin}
          onClickItem={onClickItem}
          onDragStart={() => {
            setScrollEnabled(false);
          }}
          onDragEnd={() => {
            setScrollEnabled(true);
          }}
        />
      </View>
      <View>
        {Object.keys(clasifyGroup).map(classify => {
          return (
            <View key={classify}>
              <Text style={styles.classifyName}>{classify}</Text>
              <View style={styles.classifyView}>
                {clasifyGroup[classify].map((item, index) => {
                  if (
                    _myCategorys.find(
                      selectedItem => selectedItem.id === item.id,
                    )
                  ) {
                    return null;
                  }
                  return renderUnSelectedItem(item, index);
                })}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6f6',
  },
  classifyName: {
    fontSize: 16,
    marginTop: 14,
    marginBottom: 8,
    marginLeft: 10,
  },
  classifyView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
  },
});

export default Category;
