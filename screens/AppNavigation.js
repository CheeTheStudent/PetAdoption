import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tab, TabView, Icon } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './Home';
import ProfileScreen from './Profile';
import ManageScreen from './Manage';
import colours from '../assets/colours';
import TextStyles from '../assets/styles';

const AppNavigation = () => {

  const [index, setIndex] = useState(0);
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: 'white', elevation: 0 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconType = 'ionicon';

          if (route.name === 'Home') {
            iconName = focused
              ? 'home-heart'
              : 'home-outline';
            iconType = 'material-community';
          } else if (route.name === 'Help') {
            iconName = focused ? 'hand-left' : 'hand-left-outline';
          } else if (route.name === 'Community') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Manage') {
            iconName = focused ? 'paw' : 'paw-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} type={iconType} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarItemStyle: { margin: 5 },
        tarBarStyle: {
          flex: 1,
          labelStyle: {
            fontSize: 10,
            margin: 0,
            padding: 0,
          }
        }
      })}>
      <Tab.Screen name='Home' component={HomeScreen} options={{ tabBarLabel: 'Adoption' }} />
      <Tab.Screen name='Help' component={HomeScreen} options={{ tabBarLabel: 'Help' }} />
      <Tab.Screen name='Community' component={HomeScreen} options={{ tabBarLabel: 'Community' }} />
      <Tab.Screen name='Manage' component={ManageScreen} options={{ tabBarLabel: 'Manage' }} />
      <Tab.Screen name='Profile' component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomTab: {
    height: 56,
    padding: 0,
  },
  tabContainer: {
  },
  tabTitle: {
    fontSize: 8,
  },
  tabView: {
    width: '100%',
  }
});

export default AppNavigation;