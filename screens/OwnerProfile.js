import React, {useLayoutEffect, useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import database from '@react-native-firebase/database';

import O1HomeScreen from './owner screens/O1Home';
import O2PetsScreen from './owner screens/O2Pets';
import O3JobsScreen from './owner screens/O3Jobs';
import {TextStyles} from '../assets/styles';
import {SCREEN} from '../assets/dimensions';
import colours from '../assets/colours';

const OwnerProfile = ({navigation, route}) => {
  const {ownerId, ownerName} = route.params;

  const userRef = database().ref(`users/${ownerId}`);
  const [owner, setOwner] = useState();
  const [loading, setLoading] = useState(true);

  const Tab = createMaterialTopTabNavigator();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: ownerName,
      headerTitleStyle: TextStyles.h2,
    });
  }, [navigation]);

  useEffect(() => {
    userRef.on('value', snapshot => {
      const data = snapshot.val() ? snapshot.val() : {};
      setOwner({id: snapshot.key, ...data});
      setLoading(false);
    });
  }, []);

  return (
    <>
      {!loading && (
        <Tab.Navigator
          screenOptions={{
            tabBarIndicatorStyle: {backgroundColor: 'black', width: SCREEN.WIDTH / 3 / 3, left: SCREEN.WIDTH / 3 / 3},
            tabBarStyle: {elevation: 0, borderBottomWidth: 1, borderBottomColor: colours.lightGray},
          }}>
          <Tab.Screen name='Home' children={props => <O1HomeScreen owner={owner} {...props} />} />
          <Tab.Screen name='Pets' children={props => <O2PetsScreen owner={owner} {...props} />} />
          <Tab.Screen name='Jobs' children={props => <O3JobsScreen owner={owner} {...props} />} />
        </Tab.Navigator>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default OwnerProfile;
