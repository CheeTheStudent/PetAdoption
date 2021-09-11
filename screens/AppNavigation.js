import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tab, TabView } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from './Home';
import ProfileScreen from './Profile';
import colours from '../assets/colours/colours';
import TextStyles from '../assets/constants/styles';

const AppNavigation = () => {

  const [index, setIndex] = useState(0);
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'heart'
              : 'heart-outline';
          } else if (route.name === 'Help') {
            iconName = focused ? 'hand-left' : 'hand-left-outline';
          } else if (route.name === 'Community') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
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