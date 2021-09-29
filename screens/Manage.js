import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import M1Pets from './manage screens/M1Pets';
import M2Jobs from './manage screens/M2Jobs';
import { TextStyles } from '../assets/styles';


const Manage = ({ navigation, route }) => {

  const userUID = auth().currentUser.uid;
  const petRef = database().ref(`pets`);
  const jobRef = database().ref(`jobs`);

  const [manageScreenNavigationOptions, setManageScreenNavigationOptions] = useState();
  const [pets, setPets] = useState();
  const [jobs, setJobs] = useState();
  const [petLoading, setPetLoading] = useState(true);
  const [jobLoading, setJobLoading] = useState(true);

  const Tab = createMaterialTopTabNavigator();

  useLayoutEffect(() => {
    navigation.setOptions(
      manageScreenNavigationOptions
        ? manageScreenNavigationOptions
        : {
          headerTitleStyle: TextStyles.h2,
          headerTitleAlign: 'center',
        }
    );
  }, [navigation, manageScreenNavigationOptions]);

  useEffect(() => {
    petRef.orderByChild('ownerId').equalTo(userUID).on('value', snapshot => {
      const data = snapshot.val() ? snapshot.val() : {};
      let petData = [];
      Object.entries(data).map(value => petData.push({ id: value[0], ...value[1] }));
      setPets(petData);
      setPetLoading(false);

    });

    jobRef.orderByChild('ownerId').equalTo(userUID).on('value', snapshot => {
      const data = snapshot.val() ? snapshot.val() : {};
      let jobData = [];
      Object.entries(data).map(value => jobData.push({ id: value[0], ...value[1] }));
      setJobs(jobData);
      setJobLoading(false);
    });

    return () => {
      petRef.off();
      jobRef.off();
    };
  }, []);

  return (
    <View style={styles.body}>
      {petLoading && jobLoading ?
        <ActivityIndicator color="black" style={styles.loading} />
        : <Tab.Navigator>
          <Tab.Screen name="Pets" children={(props) => <M1Pets pets={pets} setManageScreenNavigationOptions={setManageScreenNavigationOptions} {...props} />} />
          <Tab.Screen name="Jobs" children={(props) => <M2Jobs jobs={jobs} {...props} />} />
        </Tab.Navigator>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});

export default Manage;