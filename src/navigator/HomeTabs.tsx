import React from 'react';
import {StyleSheet} from 'react-native';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import ViewPagerAdapter from 'react-native-tab-view-viewpager-adapter';
import Home from '@/pages/Home';
import TopTabBarWrapper from '@/pages/views/TopTabBarWrapper';
import {RootState} from '../models';
import {useSelector} from 'react-redux';
import {ICategory} from '@/models/category';
import {createHomeModel} from '@/config/dva';

export type HomeParamList = {
  [key: string]: {
    namespace: string;
  };
};

const Tab = createMaterialTopTabNavigator<HomeParamList>();

const mapStateToProps = ({category}: RootState) => {
  return category.myCategorys;
};

function HomeTabs() {
  const myCategorys = useSelector(mapStateToProps);
  const renderTabBar = (props: MaterialTopTabBarProps) => {
    return <TopTabBarWrapper {...props} />;
  };

  const renderScreen = (item: ICategory) => {
    createHomeModel(item.id);
    return (
      <Tab.Screen
        key={item.id}
        name={item.id}
        component={Home}
        options={{tabBarLabel: item.name}}
        initialParams={{
          namespace: item.id,
        }}
      />
    );
  };

  return (
    <Tab.Navigator
      lazy
      tabBar={renderTabBar}
      pager={props => <ViewPagerAdapter {...props} />}
      sceneContainerStyle={styles.sceneContainer}
      tabBarOptions={{
        scrollEnabled: true,
        tabStyle: {
          width: 80,
          padding: 0,
        },
        indicatorStyle: {
          height: 4,
          width: 20,
          marginLeft: 30,
          borderRadius: 2,
          backgroundColor: '#f86442',
        },
        activeTintColor: '#f86442',
        inactiveTintColor: '#333',
      }}>
      {myCategorys.map(renderScreen)}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  sceneContainer: {
    backgroundColor: 'transparent',
  },
});

export default HomeTabs;
