import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import LongRoundButton from '../components/LongRoundButton';
import { TextStyles } from '../../assets/styles';
import { scale, verticalScale } from '../../assets/dimensions';

const OB1Welcome = ({ navigation }) => {

  const handleNext = () => {
    navigation.navigate("OB2Introduce");
  };

  return (
    <View style={styles.body}>
      <View style={styles.textContainer}>
        <Text style={TextStyles.h1}>Welcome to Puppers!</Text>
        <Text style={[TextStyles.h3, styles.desc]}>Are you ready to step into the world of fluffly cute animals? Let’s go!</Text>
      </View>
      <LongRoundButton title="GET STARTED" onPress={handleNext} containerStyle={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(48),
    marginHorizontal: scale(56),
  },
  desc: {
    textAlign: 'center',
    marginTop: verticalScale(16),
  },
  button: {
    position: 'absolute',
    bottom: verticalScale(32),
    alignSelf: 'center',
  }
});

export default OB1Welcome;