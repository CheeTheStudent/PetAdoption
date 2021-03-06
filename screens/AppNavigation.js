import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Tab, TabView, Icon, Avatar} from 'react-native-elements';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './Home';
import MessagesScreen from './Messages';
import HelpScreen from './Help';
import ManageScreen from './Manage';
import CommunityScreen from './Community';
import colours from '../assets/colours';
import {Spacing, TextStyles} from '../assets/styles';
import {moderateScale} from '../assets/dimensions';
import Loading from './components/Loading';

const AppNavigation = ({navigation, user}) => {
  const Tab = createBottomTabNavigator();

  useEffect(async () => {
    if (user.verified === undefined) navigation.navigate('Permissions'); // Checks if it's user first-time login
  }, []);

  const defaultHeader = useMemo(() => {
    return {
      headerTitleStyle: [TextStyles.h2, Spacing.superSmallLeftSpacing, {fontFamily: 'Roboto-Medium'}],
      headerLeft: () => (
        <Avatar
          rounded
          size={moderateScale(32)}
          containerStyle={Spacing.smallLeftSpacing}
          onPress={() => navigation.openDrawer()}
          source={
            user.profilePic
              ? {
                  uri: user.profilePic,
                }
              : require('../assets/images/placeholder.png')
          }
        />
      ),
      headerTitle: {},
    };
  }, [user]);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        ...defaultHeader,
        headerStyle: styles.header,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let iconType = 'ionicon';

          if (route.name === 'Home') {
            iconName = focused ? 'home-heart' : 'home-outline';
            iconType = 'material-community';
          } else if (route.name === 'Help') {
            iconName = focused ? 'hand-left' : 'hand-left-outline';
          } else if (route.name === 'Community') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Manage') {
            iconName = focused ? 'paw' : 'paw-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'mail' : 'mail-outline';
          }

          return <Icon name={iconName} type={iconType} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarItemStyle: {margin: 5},
        tarBarStyle: {
          flex: 1,
          labelStyle: {
            fontSize: 10,
            margin: 0,
            padding: 0,
          },
        },
      })}>
      <Tab.Screen name='Home' children={props => <HomeScreen user={user} {...props} />} options={{tabBarLabel: 'Adoption'}} />
      <Tab.Screen name='Help' component={HelpScreen} options={{tabBarLabel: 'Help'}} />
      <Tab.Screen name='Community' component={CommunityScreen} options={{tabBarLabel: 'Community'}} />
      {user.role === 'Shelter' || user.role === 'Rescuer' ? (
        <Tab.Screen name='Manage' children={props => <ManageScreen defaultHeader={defaultHeader} {...props} />} options={{tabBarLabel: 'Manage'}} />
      ) : null}
      <Tab.Screen name='Messages' component={MessagesScreen} options={{tabBarLabel: 'Messages'}} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    elevation: 0,
  },
  bottomTab: {
    height: 56,
    padding: 0,
  },
  tabTitle: {
    fontSize: 8,
  },
  tabView: {
    width: '100%',
  },
});

export default AppNavigation;
