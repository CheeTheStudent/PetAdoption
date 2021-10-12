import React, {useLayoutEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import PF1BasicScreen from './pet form screens/PF1Basic';
import PF2MedicalScreen from './pet form screens/PF2Medical';
import PF3TagsScreen from './pet form screens/PF3Tags';

const PetForm = ({navigation, route}) => {
  const {root, pet} = route.params;

  const Stack = createNativeStackNavigator();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: pet ? 'Edit Pet' : 'Add Pet',
    });
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
        headerShown: false,
      }}>
      <Stack.Screen name='Add Pet' children={props => <PF1BasicScreen pet={pet} {...props} />} />
      <Stack.Screen name='Medical' children={props => <PF2MedicalScreen pet={pet} {...props} />} />
      <Stack.Screen name='Tags' children={props => <PF3TagsScreen rootNavigation={root} pet={pet} {...props} />} />
    </Stack.Navigator>
  );
};

export default PetForm;
