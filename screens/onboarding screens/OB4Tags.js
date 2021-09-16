import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Tag from '../components/Tag';
import LongRoundButton from '../components/LongRoundButton';
import { scale, verticalScale, moderateScale } from '../../assets/dimensions';
import { TextStyles, Spacing } from '../../assets/styles';
import colours from '../../assets/colours';

const personalities = [
  "Playful", "Curious", "Obedient", "Active", "Sociable", "Loving", "Alert", "Lazy", "Gentle",
];

const appearances = [
  "Cute", "Elegant", "Handsome", "Pretty", "Beautiful", "Colourful", "Big", "Medium", "Small",
];


const OB4Tags = ({ navigation }) => {

  const [selectedPersonalities, setSelectedPersonalities] = useState([]);
  const [selectedAppearances, setSelectedAppearances] = useState([]);

  const handleOnSelectedPersonalities = (value, include) => {
    if (include) {
      setSelectedPersonalities(prev => [...prev, value]);
    } else {
      let newArr = selectedPersonalities.filter(e => e !== value); // only include NOT value
      setSelectedPersonalities(newArr);
    }
  };

  const handleOnSelectedAppearances = (value, include) => {
    if (include) {
      setSelectedAppearances(prev => [...prev, value]);
    } else {
      let newArr = selectedAppearances.filter(e => e !== value); // only include NOT value
      setSelectedAppearances(newArr);
    }
  };

  const handleNext = async () => {

    const user = { preferredTags: selectedPersonalities.concat(selectedAppearances) };

    try {
      await AsyncStorage.mergeItem('user', JSON.stringify(user));
    } catch (error) {
      console.log(error);
    }

    navigation.navigate("OB5Screening");
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Text style={TextStyles.h1}>Specifics, specifics..</Text>
        <Text style={TextStyles.h3}>Choose the tags that describe the pet you would like to adopt</Text>
        <Text style={[TextStyles.h3, Spacing.mediumTopSpacing]}>Personality</Text>
        <View style={styles.tagsContainer}>
          {personalities.map(type => {
            return <Tag title={type} onSelected={handleOnSelectedPersonalities} />;
          })}
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Appearances</Text>
        <View style={styles.tagsContainer}>
          {appearances.map(type => {
            return <Tag title={type} onSelected={handleOnSelectedAppearances} />;
          })}
        </View>
      </View>
      <LongRoundButton title="NEXT" onPress={handleNext} containerStyle={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    marginTop: 56,
    paddingHorizontal: scale(24),
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  button: {
    position: 'absolute',
    bottom: verticalScale(32),
    alignSelf: 'center',
  },
});

export default OB4Tags;