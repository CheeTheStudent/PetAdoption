import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import database from '@react-native-firebase/database';

import M1Pets from './manage screens/M1Pets';
import M2Jobs from './manage screens/M2Jobs';
import { TextStyles } from '../assets/styles';


const Manage = ({ navigation, route }) => {

  // const { owner } = route.params;
  const [manageScreenNavigationOptions, setManageScreenNavigationOptions] = useState();
  const userRef = database().ref('users/qeI2Xvzew4RhFZA7wyXyTojxBr43');
  const [owner, setOwner] = useState();
  const [loading, setLoading] = useState(true);

  const Tab = createMaterialTopTabNavigator();

  useLayoutEffect(() => {
    navigation.setOptions(
      manageScreenNavigationOptions
    );
  }, [navigation, manageScreenNavigationOptions]);

  useEffect(() => {
    userRef.on('value', snapshot => {
      const data = snapshot.val() ? snapshot.val() : {};
      setOwner(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      {!loading &&
        <Tab.Navigator>
          <Tab.Screen name="Pets" children={(props) => <M1Pets owner={owner} setManageScreenNavigationOptions={setManageScreenNavigationOptions} {...props} />} />
          <Tab.Screen name="Jobs" children={(props) => <M2Jobs owner={owner} {...props} />} />
        </Tab.Navigator>
      }
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Manage;