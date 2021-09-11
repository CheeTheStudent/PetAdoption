import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

import AuthScreen from './screens/Auth';
import AppNavigation from './screens/AppNavigation';
import LoginScreen from './screens/Login';
import SignUpScreen from './screens/SignUp';
import ResetPasswordScreen from './screens/ResetPassword';
import PetProfileScreen from './screens/PetProfile';
import Testing from './screens/Testing';

const App = () => {
  const [showOnboard, setShowOnboard] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const Stack = createNativeStackNavigator();

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('onboard');
      if (value !== null) {
        setShowOnboard(!Boolean(value));
      }
    } catch (e) {
      console.log(e);
    }
  };
  getData();

  const handleOnboardFinish = async () => {
    try {
      setShowOnboard(false);
      await AsyncStorage.setItem('onboard', 'true');
    } catch (err) {
      console.log(err);
    }
  };

  const onAuthStateChanged = user => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribes on unmount
  }, []);

  if (initializing) return null;

  return (

    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ?
          <>
            <Stack.Screen name='Authentication' component={AuthScreen} />
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='SignUp' component={SignUpScreen} />
            <Stack.Screen name='ResetPassword' component={ResetPasswordScreen} />
          </>
          :
          <>
            <Stack.Screen name='AppNavigation' component={AppNavigation} />
            <Stack.Screen name='PetProfile' component={PetProfileScreen} />
          </>}
      </Stack.Navigator>
    </NavigationContainer >

  );
};

export default App;
