import React, {useState, useEffect, createRef} from 'react';
import {Text} from 'react-native';
import {NavigationContainer, DefaultTheme, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OneSignalNotif from './utils/OneSignalNotif';

import {navigationRef} from './utils/RootNavigation';
import DrawerNavigation from './screens/DrawerNavigation';
import AuthScreen from './screens/Auth';
import AppNavigation from './screens/AppNavigation';
import LoginScreen from './screens/Login';
import SignUpScreen from './screens/SignUp';
import ResetPasswordScreen from './screens/ResetPassword';
import OnboardingScreen from './screens/Onboarding';
import PetProfileScreen from './screens/PetProfile';
import JobScreen from './screens/Job';
import OwnerProfileScreen from './screens/OwnerProfile';
import PetFormScreen from './screens/PetForm';
import JobFormScreen from './screens/JobForm';
import PostScreen from './screens/Post';
import PostFormScreen from './screens/PostForm';
import ConvoScreen from './screens/Convo';
import ChatScreen from './screens/Chat';
import PermissionsScreen from './screens/Permissions';
import VerifyScreen from './screens/Verify';
import SMSConfirmationScreen from './screens/SMSConfirmation';
import GalleryViewModal from './screens/components/GalleryView';
import FilterModal from './screens/components/Filter';
import GooglePlacesInputModal from './screens/components/GooglePlacesInput';
import Loading from './screens/components/Loading';
import Testing from './screens/Testing';

const App = () => {
  const oneSignalNotif = OneSignalNotif();
  const [showOnboard, setShowOnboard] = useState();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const Stack = createStackNavigator();
  oneSignalNotif.init();
  oneSignalNotif.onForegroundListener();
  oneSignalNotif.onNotificationOpen(useNavigation);

  const handleIsNewUser = async () => {
    if (!auth().currentUser) return;
    const userUID = auth().currentUser.uid;
    const userRef = database().ref(`/users/${userUID}`);
    oneSignalNotif.setUserNotificationId(userUID);

    userRef.on('value', snapshot => {
      const data = snapshot.val() ? snapshot.val() : null;
      if (!data) setShowOnboard(true);
      else {
        AsyncStorage.setItem('user', JSON.stringify(data)).catch(err => console.log(err));
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
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!user ? (
          <>
            <Stack.Screen name='Authentication' component={AuthScreen} />
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='SignUp' component={SignUpScreen} />
            <Stack.Screen name='ResetPassword' component={ResetPasswordScreen} />
          </>
        ) : (
          <>
            {showOnboard ? (
              <Stack.Screen name='Onboarding' component={OnboardingScreen} />
            ) : (
              <>
                <Stack.Screen name='DrawerNavigation' component={DrawerNavigation} />
                {/* <Stack.Screen name='AppNavigation' component={AppNavigation} /> */}
                <Stack.Screen name='PetProfile' component={PetProfileScreen} />
                <Stack.Screen name='Job' component={JobScreen} />
                <Stack.Screen name='OwnerProfile' component={OwnerProfileScreen} />
                <Stack.Screen name='PetForm' component={PetFormScreen} options={{headerShown: true}} />
                <Stack.Screen name='JobForm' component={JobFormScreen} options={{headerShown: true}} />
                <Stack.Screen name='Post' component={PostScreen} options={{headerShown: true}} />
                <Stack.Screen name='PostForm' component={PostFormScreen} options={{headerShown: true}} />
                <Stack.Group screenOptions={{...TransitionPresets.SlideFromRightIOS, gestureEnabled: true}}>
                  <Stack.Screen name='GalleryModal' component={GalleryViewModal} />
                  <Stack.Screen name='FilterModal' component={FilterModal} />
                  <Stack.Screen name='GooglePlacesInputModal' component={GooglePlacesInputModal} options={{headerShown: true}} />
                  <Stack.Screen name='Chat' component={ChatScreen} options={{headerShown: true}} />
                  <Stack.Screen name='Permissions' component={PermissionsScreen} />
                  <Stack.Screen name='Verify' component={VerifyScreen} />
                  <Stack.Screen name='SMSConfirmation' component={SMSConfirmationScreen} />
                </Stack.Group>
                <Stack.Screen name='Testing' component={Testing} />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
