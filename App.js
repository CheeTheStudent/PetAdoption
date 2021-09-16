import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import AuthScreen from './screens/Auth';
import AppNavigation from './screens/AppNavigation';
import LoginScreen from './screens/Login';
import SignUpScreen from './screens/SignUp';
import ResetPasswordScreen from './screens/ResetPassword';
import OnboardingScreen from './screens/Onboarding';
import PetProfileScreen from './screens/PetProfile';
import Testing from './screens/Testing';

const App = () => {
  const [showOnboard, setShowOnboard] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const Stack = createNativeStackNavigator();

  const handleIsNewUser = async () => {
    if (!auth().currentUser) return;
    const userUID = auth().currentUser.uid;
    const userRef = database().ref(`/users/${userUID}`);

    userRef.on('value', snapshot => {
      const data = snapshot.val() ? snapshot.val() : null;
      if (!data)
        setShowOnboard(true);
      else {
        setShowOnboard(false);
      }
    });
  };

  const onAuthStateChanged = user => {
    setUser(user);
    if (!user) setShowOnboard(true);
    handleIsNewUser();
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
            {showOnboard ?
              <Stack.Screen name='Onboarding' component={OnboardingScreen} />
              :
              <>
                <Stack.Screen name='AppNavigation' component={AppNavigation} />
                <Stack.Screen name='PetProfile' component={PetProfileScreen} />
              </>}
          </>}
      </Stack.Navigator>
    </NavigationContainer >

  );
};

export default App;
