import React, {useLayoutEffect, useEffect} from 'react';
import {View, Alert} from 'react-native';
import {Icon} from 'react-native-elements';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import PF1BasicScreen from './pet form screens/PF1Basic';
import PF2MedicalScreen from './pet form screens/PF2Medical';
import PF3TagsScreen from './pet form screens/PF3Tags';
import {moderateScale} from '../assets/dimensions';
import {Spacing} from '../assets/styles';

const PetForm = ({navigation, route}) => {
  const {root, pet} = route.params;

  const Stack = createNativeStackNavigator();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: pet ? 'Edit Pet' : 'Add Pet',
      headerLeft: () => (
        <View style={Spacing.smallLeftSpacing}>
          <Icon name='close' type='ionicon' size={moderateScale(24)} onPress={handleBackButton} />
        </View>
      ),
    });
  }, []);

  const handleBackButton = () => {
    Alert.alert('Discard Changes?', 'Are you sure you want to leave? Your progress will be lost.', [{text: 'Cancel'}, {text: "Yes, I'm sure", onPress: () => navigation.goBack()}], {
      cancelable: true,
    });
  };

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
