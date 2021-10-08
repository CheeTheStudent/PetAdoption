import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LongRoundButton from '../components/LongRoundButton';
import {scale, verticalScale, moderateScale} from '../../assets/dimensions';
import {TextStyles} from '../../assets/styles';
import colours from '../../assets/colours';

const roles = [
  {
    title: 'Adopter',
    desc: 'I’m here to provide a forever home!',
  },
  {
    title: 'Volunteer',
    desc: 'I’m here to help out!',
  },
  {
    title: 'Rescuer',
    desc: 'I’m here to find a loving home for an animal.. or two!',
  },
  {
    title: 'Shelter',
    desc: "We're here to find a good home for the animals!",
  },
];

const OB2Introduce = ({navigation}) => {
  const [selected, setSelected] = useState('');

  const renderBox = role => {
    return (
      <TouchableOpacity style={[styles.box, selected === role.title && styles.boxPressed]} onPress={() => setSelected(role.title)}>
        <Text style={TextStyles.h3}>{role.title}</Text>
        <Text style={[TextStyles.text, styles.text]}>{role.desc}</Text>
      </TouchableOpacity>
    );
  };

  const handleNext = async () => {
    const user = {role: selected};
    try {
      await AsyncStorage.setItem('onboardUser', JSON.stringify(user));
    } catch (error) {
      console.log(error);
    }
    navigation.navigate('OB3Animal');
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Text style={TextStyles.h1}>Introduce Yourself</Text>
        <Text style={TextStyles.h3}>Which one of these are you? Don’t worry, you can always change it later on.</Text>
        <View style={{marginTop: verticalScale(56)}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: verticalScale(16)}}>
            {renderBox(roles[0])}
            {renderBox(roles[1])}
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            {renderBox(roles[2])}
            {renderBox(roles[3])}
          </View>
        </View>
      </View>
      <LongRoundButton title='NEXT' onPress={handleNext} disabled={!selected} containerStyle={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    marginTop: verticalScale(32),
    paddingHorizontal: scale(24),
  },
  box: {
    width: scale(148),
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(24),
    elevation: moderateScale(3),
    backgroundColor: 'white',
  },
  boxPressed: {
    backgroundColor: '#0000001F',
    elevation: 1,
  },
  text: {
    textAlign: 'center',
  },
  button: {
    position: 'absolute',
    bottom: verticalScale(32),
    alignSelf: 'center',
  },
});

export default OB2Introduce;
