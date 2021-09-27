import React, { useState } from 'react';
import { View, Text, StyleSheet, ToastAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

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


const PF3Tags = ({ navigation, route, rootNavigation }) => {

  const { petInfo } = route.params;

  const userUID = auth().currentUser.uid;
  const petRef = database().ref(`/pets`);

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

    const { media, ...otherPetInfo } = petInfo;

    const fullPetInfo = {
      ...otherPetInfo,
      ownerId: userUID,
      status: 'Available',
      tags: selectedPersonalities.concat(selectedAppearances)
    };

    const petId = await petRef.push(fullPetInfo);

    let mediaUrls = [];
    await Promise.all(media.map(async (file, index) => {
      let n = file.lastIndexOf('/');
      const petStore = storage().ref(`/pets/${petId.key}/${file.substring(n + 1)}`);
      await petStore.putFile(file);
      const url = await petStore.getDownloadURL();
      mediaUrls.push(url);
    }));

    await petRef.child(petId.key).update({
      media: mediaUrls,
    });

    ToastAndroid.show("Pet Added!", ToastAndroid.SHORT);

    rootNavigation.navigate("Pets");
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Personality</Text>
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
      <LongRoundButton title="SUBMIT" onPress={handleNext} containerStyle={styles.button} />
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

  button: {
    position: 'absolute',
    bottom: verticalScale(32),
    alignSelf: 'center',
  },
});

export default PF3Tags;