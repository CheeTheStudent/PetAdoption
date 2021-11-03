import React, {useLayoutEffect, useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import MOverview from './manage screens/MOverview';
import M1Pets from './manage screens/M1Pets';
import M2Jobs from './manage screens/M2Jobs';
import Loading from './components/Loading';
import {TextStyles} from '../assets/styles';
import {scale, SCREEN} from '../assets/dimensions';
import colours from '../assets/colours';

const Manage = ({navigation, route, defaultHeader}) => {
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
    navigation.setOptions(manageScreenNavigationOptions ? manageScreenNavigationOptions : defaultHeader);
  }, [navigation, manageScreenNavigationOptions]);

  useEffect(() => {
    let thisPetRref = petRef
      .orderByChild('ownerId')
      .equalTo(userUID)
      .on('value', snapshot => {
        console.log('Manage listening');
        const data = snapshot.val() ? snapshot.val() : {};
        let petData = [];
        Object.entries(data).map(value => petData.push({id: value[0], ...value[1]}));
        setPets(petData);
        setPetLoading(false);
      });

    let thisJobRef = jobRef
      .orderByChild('ownerId')
      .equalTo(userUID)
      .on('value', snapshot => {
        const data = snapshot.val() ? snapshot.val() : {};
        let jobData = [];
        Object.entries(data).map(value => jobData.push({id: value[0], ...value[1]}));
        setJobs(jobData);
        setJobLoading(false);
      });

    return () => {
      petRef.off('value', thisPetRref);
      jobRef.off('value', thisJobRef);
    };
  }, []);

  return (
    <View style={styles.body}>
      {petLoading || jobLoading ? (
        <Loading type='paw' />
      ) : (
        <Tab.Navigator
          screenOptions={{
            tabBarIndicatorStyle: {backgroundColor: 'black', width: (SCREEN.WIDTH / 3) * 0.7, left: (SCREEN.WIDTH / 3) * 0.15},
            tabBarStyle: {elevation: 0, borderBottomWidth: 1, borderBottomColor: colours.lightGray},
          }}>
          <Tab.Screen name='Overview' children={props => <MOverview pets={pets} {...props} />} />
          <Tab.Screen name='Pets' children={props => <M1Pets pets={pets} setManageScreenNavigationOptions={setManageScreenNavigationOptions} {...props} />} />
          <Tab.Screen name='Jobs' children={props => <M2Jobs jobs={jobs} {...props} />} />
        </Tab.Navigator>
      )}
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
  },
});

export default Manage;
