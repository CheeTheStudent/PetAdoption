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
import Loading from './components/Loading';

const OwnerProfile = ({navigation, route}) => {
  const {ownerId, ownerName} = route.params;

  const userRef = database().ref(`users/${ownerId}`);
  const petRef = database().ref(`pets`);
  const jobRef = database().ref(`jobs`);
  const [owner, setOwner] = useState();
  const [pets, setPets] = useState();
  const [jobs, setJobs] = useState();
  const [loading, setLoading] = useState(true);
  const [petLoading, setPetLoading] = useState(true);
  const [jobLoading, setJobLoading] = useState(true);

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

    petRef
      .orderByChild('ownerId')
      .equalTo(ownerId)
      .on('value', snapshot => {
        const data = snapshot.val() ? snapshot.val() : {};
        let petData = [];
        Object.entries(data).map(value => petData.push({id: value[0], ...value[1]}));
        setPets(petData);
        setPetLoading(false);
      });

    jobRef
      .orderByChild('ownerId')
      .equalTo(ownerId)
      .on('value', snapshot => {
        const data = snapshot.val() ? snapshot.val() : {};
        let jobData = [];
        Object.entries(data).map(value => jobData.push({id: value[0], ...value[1]}));
        setJobs(jobData);
        setJobLoading(false);
      });

    return () => {
      userRef.off();
      petRef.off();
      jobRef.off();
    };
  }, []);

  return (
    <>
      {loading || petLoading || jobLoading ? (
        <Loading type='paw' />
      ) : (
        <Tab.Navigator
          screenOptions={{
            tabBarIndicatorStyle: {backgroundColor: 'black', width: SCREEN.WIDTH / 3 / 3, left: SCREEN.WIDTH / 3 / 3},
            tabBarStyle: {elevation: 0, borderBottomWidth: 1, borderBottomColor: colours.lightGray},
          }}>
          <Tab.Screen name='Home' children={props => <O1HomeScreen owner={owner} pets={pets} jobs={jobs} {...props} />} />
          <Tab.Screen name='Pets' children={props => <O2PetsScreen pets={pets} {...props} />} />
          <Tab.Screen name='Jobs' children={props => <O3JobsScreen jobs={jobs} {...props} />} />
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
