import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PF1BasicScreen from './pet form screens/PF1Basic';
import PF2MedicalScreen from './pet form screens/PF2Medical';
import PF3TagsScreen from './pet form screens/PF3Tags';

const PetForm = ({ navigation, route }) => {

  const { root } = route.params;

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{
      animation: "slide_from_right"
    }}>
      <Stack.Screen name="Add Pet" component={PF1BasicScreen} />
      <Stack.Screen name="Medical" component={PF2MedicalScreen} />
      <Stack.Screen name="Tags" children={(props) => <PF3TagsScreen rootNavigation={root} {...props} />} />
    </Stack.Navigator >
  );
};

export default PetForm;