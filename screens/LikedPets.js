import React, {useState, useEffect} from 'react';
import {View, FlatList, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import Loading from './components/Loading';
import NoResults from './components/NoResults';
import {calcPetAge} from '../utils/utils';
import {scale, verticalScale} from '../assets/dimensions';
import {Spacing, TextStyles} from '../assets/styles';

const LikedPets = ({navigation}) => {
  const userUID = auth().currentUser.uid;
  const userDataRef = database().ref(`userData/${userUID}`);
  const petRef = database().ref('pets');
  const [pets, setPets] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(async () => {
    let likedPets = [];
    const snapshot = await userDataRef.orderByChild('liked').equalTo(true).once('value');
    const data = snapshot.val() ? snapshot.val() : {};
    await Promise.all(
      Object.entries(data).map(async value => {
        const petSnapshot = await petRef.child(value[0]).once('value');
        const petData = petSnapshot.val() ? petSnapshot.val() : {};
        if (Object.keys(petData).length != 0) likedPets.push({id: petSnapshot.key, ...petData, likedTime: value[1].createdAt});
      }),
    );
    likedPets.sort((x, y) => y.likedTime - x.likedTime);
    setPets(likedPets);
    setRefresh(false);
  }, [refresh]);

  return (
    <View style={styles.body}>
      {pets ? (
        pets.length > 0 ? (
          <FlatList
            keyExtractor={item => item.id}
            numColumns={2}
            data={pets}
            onRefresh={() => setRefresh(true)}
            refreshing={refresh}
            renderItem={({item, index}) => (
              <TouchableOpacity onPress={() => navigation.navigate('PetProfile', {pet: item})}>
                <Image source={item.media ? {uri: item.media[0]} : require('../assets/images/placeholder.png')} style={styles.image} />
                <Text style={[TextStyles.h4, Spacing.superSmallLeftSpacing, {marginTop: verticalScale(4)}]}>{item.name}</Text>
                <Text style={[TextStyles.desc, Spacing.superSmallLeftSpacing]}>{calcPetAge(item.ageYear, item.ageMonth)}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={styles.rowContainer}
          />
        ) : (
          <NoResults title='No Liked Pets!' desc='Discover new pets and start swiping now!' />
        )
      ) : (
        <Loading type='paw' />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },
  rowContainer: {
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
  },
  image: {
    width: scale(156),
    height: scale(156),
    borderRadius: scale(5),
  },
});

export default LikedPets;
