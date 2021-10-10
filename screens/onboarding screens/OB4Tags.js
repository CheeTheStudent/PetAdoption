import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Tag from '../components/Tag';
import LongRoundButton from '../components/LongRoundButton';
import {scale, verticalScale, moderateScale, SCREEN} from '../../assets/dimensions';
import {TextStyles, Spacing} from '../../assets/styles';
import colours from '../../assets/colours';

const personalities = ['Playful', 'Curious', 'Obedient', 'Active', 'Sociable', 'Loving', 'Alert', 'Lazy', 'Gentle'];

const appearances = ['Cute', 'Elegant', 'Handsome', 'Pretty', 'Beautiful', 'Colourful', 'Big', 'Medium', 'Small'];

const OB4Tags = ({navigation}) => {
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
    const user = {preferredTags: selectedPersonalities.concat(selectedAppearances)};

    try {
      await AsyncStorage.mergeItem('onboardUser', JSON.stringify(user));
    } catch (error) {
      console.log(error);
    }
    handleNavigate();
  };

  const handleNavigate = async () => {
    const onboardUser = await AsyncStorage.getItem('onboardUser');
    if (JSON.parse(onboardUser).role === 'Shelter') {
      navigation.navigate('OB6Shelter');
    } else {
      navigation.navigate('OB5Screening');
    }
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
      <View style={styles.bottomContainer}>
        <Text onPress={handleNavigate} style={styles.skipText}>
          SKIP
        </Text>
        <LongRoundButton title='NEXT' disabled={selectedPersonalities.length == 0 && selectedAppearances.length == 0} onPress={handleNext} />
      </View>
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bottomContainer: {
    width: SCREEN.WIDTH,
    flexDirection: 'row',
    position: 'absolute',
    paddingHorizontal: scale(24),
    bottom: verticalScale(32),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipText: {
    marginHorizontal: scale(8),
    fontSize: moderateScale(12),
    textDecorationLine: 'underline',
  },
});

export default OB4Tags;
