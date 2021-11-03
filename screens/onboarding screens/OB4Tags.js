import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Tag from '../components/Tag';
import LongRoundButton from '../components/LongRoundButton';
import {scale, verticalScale, moderateScale, SCREEN} from '../../assets/dimensions';
import {TextStyles, Spacing} from '../../assets/styles';
import colours from '../../assets/colours';

const personalities = ['Playful', 'Curious', 'Obedient', 'Active', 'Sociable', 'Loving', 'Alert', 'Lazy', 'Gentle'];

const appearances = ['Cute', 'Elegant', 'Handsome', 'Pretty', 'Beautiful', 'Colourful', 'Big', 'Medium', 'Small'];

const OB4Tags = ({navigation, user}) => {
  const userUID = auth().currentUser.uid;
  const userRef = database().ref(`users/${userUID}`);

  const [selectedPersonalities, setSelectedPersonalities] = useState([]);
  const [selectedAppearances, setSelectedAppearances] = useState([]);

  useEffect(() => {
    if (user) {
      let prevPersonalities = [];
      let prevAppearances = [];

      user.preferredTags?.map(tag => {
        personalities.map(el => (el === tag ? prevPersonalities.push(tag) : null));
        appearances.map(el => (el === tag ? prevAppearances.push(tag) : null));
      });
      setSelectedPersonalities(prevPersonalities);
      setSelectedAppearances(prevAppearances);
    }
  }, []);

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
    const userTags = {preferredTags: selectedPersonalities.concat(selectedAppearances)};

    if (user) {
      userRef.update(userTags);
    } else {
      try {
        await AsyncStorage.mergeItem('onboardUser', JSON.stringify(userTags));
      } catch (error) {
        console.log(error);
      }
    }

    handleNavigate();
  };

  const handleNavigate = async () => {
    if (user) return navigation.goBack();

    const onboardUser = await AsyncStorage.getItem('onboardUser');
    const role = JSON.parse(onboardUser).role;
    if (role === 'Shelter' || role === 'Rescuer') {
      navigation.navigate('OB6Shelter');
    } else {
      navigation.navigate('OB5Screening');
    }
  };

  return (
    <View style={styles.body}>
      <View style={[styles.container, user ? Spacing.smallTopSpacing : Spacing.bigTopSpacing]}>
        {!user ? <Text style={TextStyles.h1}>Specifics, specifics..</Text> : null}
        <Text style={TextStyles.h3}>Choose the tags that describe the pet you would like to adopt</Text>
        <Text style={[TextStyles.h3, user ? Spacing.superSmallTopSpacing : Spacing.mediumTopSpacing]}>Personality</Text>
        <View style={styles.tagsContainer}>
          {personalities.map(type => {
            return <Tag key={type} title={type} type={selectedPersonalities.indexOf(type) >= 0 && 'black'} onSelected={handleOnSelectedPersonalities} />;
          })}
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Appearances</Text>
        <View style={styles.tagsContainer}>
          {appearances.map(type => {
            return <Tag key={type} title={type} type={selectedAppearances.indexOf(type) >= 0 && 'black'} onSelected={handleOnSelectedAppearances} />;
          })}
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Text onPress={handleNavigate} style={styles.skipText}>
          {user ? 'CANCEL' : 'SKIP'}
        </Text>
        <LongRoundButton title={user ? 'SAVE' : 'NEXT'} disabled={selectedPersonalities.length == 0 && selectedAppearances.length == 0} onPress={handleNext} />
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
