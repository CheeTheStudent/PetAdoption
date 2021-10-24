import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ToastAndroid} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

import Tag from '../components/Tag';
import LongRoundButton from '../components/LongRoundButton';
import {scale, verticalScale, moderateScale} from '../../assets/dimensions';
import {TextStyles, Spacing} from '../../assets/styles';
import colours from '../../assets/colours';

const personalities = ['Playful', 'Curious', 'Obedient', 'Active', 'Sociable', 'Loving', 'Alert', 'Lazy', 'Gentle'];

const appearances = ['Cute', 'Elegant', 'Handsome', 'Pretty', 'Beautiful', 'Colourful', 'Big', 'Medium', 'Small'];

const PF3Tags = ({navigation, route, rootNavigation, pet}) => {
  const {petInfo} = route.params;

  const userUID = auth().currentUser.uid;
  const petRef = database().ref(`/pets`);

  const [selectedPersonalities, setSelectedPersonalities] = useState([]);
  const [selectedAppearances, setSelectedAppearances] = useState([]);

  useEffect(() => {
    if (pet) {
      let prevPersonalities = [];
      let prevAppearances = [];

      pet.tags?.map(tag => {
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
    const {media, ...otherPetInfo} = petInfo;
    const fullPetInfo = {
      ...otherPetInfo,
      ownerId: userUID,
      status: {status: 'Available', createdAt: database.ServerValue.TIMESTAMP},
      tags: selectedPersonalities.concat(selectedAppearances),
    };

    let petKey;
    if (pet) {
      petKey = pet.id;
      await petRef.child(petKey).update(fullPetInfo);

      const existingMedia = await storage().ref(`/pets/${petKey}`).listAll();
      if (existingMedia.items.length > 0) {
        existingMedia.items.map(async em => {
          const dwurl = await em.getDownloadURL();
          if (media.indexOf(dwurl) < 0) {
            storage().ref(em.path).delete();
          }
        });
      }
    } else {
      const newPet = await petRef.push(fullPetInfo);
      petKey = newPet.key;
    }

    let mediaUrls = [];
    await Promise.all(
      media.map(async (file, index) => {
        if (file.startsWith('https://firebasestorage')) return mediaUrls.push(file);
        let n = file.lastIndexOf('/');
        const petStore = storage().ref(`/pets/${petKey}/${file.substring(n + 1)}`);
        await petStore.putFile(file);
        const url = await petStore.getDownloadURL();
        mediaUrls.push(url);
      }),
    );

    await petRef.child(petKey).update({
      media: mediaUrls,
    });

    ToastAndroid.show(pet ? 'Pet Edited!' : 'Pet Added!', ToastAndroid.SHORT);

    rootNavigation.navigate('Pets');
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Personality</Text>
        <View style={styles.tagsContainer}>
          {personalities.map(type => {
            return <Tag title={type} type={selectedPersonalities.indexOf(type) >= 0 && 'black'} onSelected={handleOnSelectedPersonalities} />;
          })}
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Appearances</Text>
        <View style={styles.tagsContainer}>
          {appearances.map(type => {
            return <Tag title={type} type={selectedAppearances.indexOf(type) >= 0 && 'black'} onSelected={handleOnSelectedAppearances} />;
          })}
        </View>
      </View>
      <LongRoundButton title='SUBMIT' onPress={handleNext} containerStyle={styles.button} />
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
