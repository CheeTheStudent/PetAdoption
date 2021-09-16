import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Welcome from './onboarding screens/OB1Welcome';
import Introduce from './onboarding screens/OB2Introduce';
import Animal from './onboarding screens/OB3Animal';
import Tags from './onboarding screens/OB4Tags';
import Screening from './onboarding screens/OB5Screening';

const Onboarding = () => {

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      animation: "slide_from_right"
    }}>
      <Stack.Screen name="OB1Welcome" component={Welcome} />
      <Stack.Screen name="OB2Introduce" component={Introduce} />
      <Stack.Screen name="OB3Animal" component={Animal} />
      <Stack.Screen name="OB4Tags" component={Tags} />
      <Stack.Screen name="OB5Screening" component={Screening} />
    </Stack.Navigator >
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Onboarding;