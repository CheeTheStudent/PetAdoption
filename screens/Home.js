import React, {useLayoutEffect, useEffect, useState, useRef, useCallback} from 'react';
import {View, Text, Button, ImageBackground, Image, StyleSheet, Animated, PanResponder, TouchableOpacity} from 'react-native';
import {Icon, Badge, Avatar} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import AdoptionCard from './components/AdoptionCard';
import ActionButton from './components/ActionButton';
import Loading from './components/Loading';
import NoResults from './components/NoResults';
import colours from '../assets/colours';
import {CARD, ACTION_OFFSET, SCREEN, scale, moderateScale, verticalScale} from '../assets/dimensions';
import {Spacing, TextStyles} from '../assets/styles';

const Home = ({navigation, route, user}) => {
  const {swipeAway, queries} = route.params || {};
  const {settings} = user || {};

  const userUID = auth().currentUser.uid;
  const userDataRef = database().ref(`userData/${userUID}`);
  const petDataRef = database().ref(`petData`);
  const petRef = database().ref('pets');
  const [pets, setPets] = useState();
  const [loading, setLoading] = useState(true);
  const swipe = useRef(new Animated.ValueXY()).current;
  const tiltPoint = useRef(new Animated.Value(1)).current;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Fido',
      headerTitleAlign: 'center',
      headerTitleStyle: TextStyles.h2,
      headerRight: () => (
        <View style={styles.headerStyle}>
          <TouchableOpacity onPress={handleOpenFilter}>
            <Icon name='options' type='ionicon' size={24} color={colours.black} />
            {queries && queries.length > 0 ? <Badge value={queries.length} badgeStyle={{backgroundColor: 'black'}} containerStyle={{position: 'absolute', right: -4, top: -4}} /> : null}
          </TouchableOpacity>
        </View>
      ),
    });
  }, [queries]);

  useEffect(() => {
    setLoading(true);
    // Retrieve and listen the values
    let homePetRef = petRef
      .orderByChild('status/status')
      .equalTo('Available')
      .limitToFirst(20)
      .on('value', snapshot => {
        const data = snapshot.val() ? snapshot.val() : {};
        let pets = [];
        // Map the id and data into an array
        Object.entries(data).map(value => pets.push({id: value[0], ...value[1]}));
        // Conduct additional filtering
        if (queries && queries.length > 0) pets = filterResults(pets);
        filterSeen(pets);
      });

    // Unsubscribe from listener when screen unmounts
    return () => petRef.off('value', homePetRef);
  }, [queries, user]);

  useEffect(() => {
    if (swipeAway) {
      if (swipeAway === 'like') {
        swipeAnimation(1, 100);
      } else if (swipeAway === 'dislike') {
        swipeAnimation(-1, 100);
      }
      navigation.setParams({
        swipeAway: false,
      });
    }
  }, [swipeAway]);

  const filterResults = data => {
    let filteredPets = data;
    queries.map((query, index) => {
      const {field, property, startAge, endAge} = query;
      if (field === 'age') {
        filteredPets = filteredPets.filter(el => el.ageYear >= startAge && el.ageYear <= endAge);
      } else if (field === 'name') {
        filteredPets = filteredPets.filter(el => el.name.toLowerCase().startsWith(property.toLowerCase()));
      } else {
        filteredPets = filteredPets.filter(el => el[field] === property);
      }
    });
    return filteredPets;
  };

  const filterSeen = async pets => {
    let filteredData = pets;
    if (settings) {
      if (!settings.showLiked) {
        // Retrieve liked pets and filter them out
        const snapshot = await userDataRef.orderByChild('liked').equalTo(true).once('value');
        const likedPets = snapshot.val() ? snapshot.val() : {};
        Object.entries(likedPets).map(value => (filteredData = filteredData.filter(e => e.id !== value[0])));
      }
      if (!settings.showDisliked) {
        // Retrieve disliked pets and filter them out
        const snapshot = await userDataRef.orderByChild('liked').equalTo(false).once('value');
        const dislikedPets = snapshot.val() ? snapshot.val() : {};
        Object.entries(dislikedPets).map(value => (filteredData = filteredData.filter(e => e.id !== value[0])));
      }
    }
    // Randomize position
    let shuffled = filteredData
      .map(value => ({value, sort: Math.random()}))
      .sort((a, b) => a.sort - b.sort)
      .map(({value}) => value);
    // Set to state
    setPets(shuffled);
    setLoading(false);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, {dx, dy, y0}) => {
      // change y: 0 to y: dy if you want free movement
      swipe.setValue({x: dx, y: 0});
      tiltPoint.setValue(y0 > CARD.HEIGHT / 2 ? 1 : -1);
    },
    onPanResponderRelease: (_, {dx, dy}) => {
      const direction = Math.sign(dx);
      const isActionActive = Math.abs(dx) > ACTION_OFFSET;

      if (isActionActive) {
        saveChoice();
        swipeAnimation(direction, dy);
      } else {
        Animated.spring(swipe, {
          toValue: {
            x: 0,
            y: 0,
          },
          useNativeDriver: true,
          friction: 5,
        }).start();
      }
    },
  });

  const swipeAnimation = (direction, dy) => {
    Animated.timing(swipe, {
      duration: 200,
      toValue: {
        x: direction * CARD.OUT_OF_SCREEN,
        y: dy,
      },
      useNativeDriver: true,
    }).start(removeTopCard);
  };

  const removeTopCard = useCallback(() => {
    setPets(prevState => prevState.slice(1));
    swipe.setValue({x: 0, y: 0});
  }, [swipe]);

  const saveChoice = () => {
    const swipeValue = parseInt(JSON.stringify(swipe.x));
    if (swipeValue > 0) {
      const likeInfo = {petId: pets[0].id, userId: userUID, liked: true, createdAt: database.ServerValue.TIMESTAMP};
      userDataRef.child(likeInfo.petId).set(likeInfo);
      petDataRef.child(`${pets[0].ownerId}`).push(likeInfo);
    } else {
      const dislikeInfo = {petId: pets[0].id, userId: userUID, liked: false, createdAt: database.ServerValue.TIMESTAMP};
      userDataRef.child(dislikeInfo.petId).set(dislikeInfo);
      petDataRef.child(`${pets[0].ownerId}`).push(dislikeInfo);
    }
  };

  const handleOpenFilter = () => {
    navigation.navigate('FilterModal', {queries});
  };

  const handleOpenProfile = () => {
    navigation.navigate('PetProfile', {
      pet: pets[0],
      home: true,
    });
  };

  return (
    <View style={styles.body}>
      {!loading && pets ? (
        pets.length > 0 ? (
          <>
            {pets
              .map((pet, index) => {
                const isFirst = index === 0;
                const dragHandlers = isFirst ? panResponder.panHandlers : {};

                return <AdoptionCard key={pet.id} pet={pet} isFirst={isFirst} swipe={swipe} tiltPoint={tiltPoint} {...dragHandlers} navigation={navigation} />;
              })
              .reverse()}
            <View style={styles.iconButtonsContainer}>
              <ActionButton name='close' onPress={() => swipeAnimation(-1, 100)} />
              <ActionButton name='chevron-down' containerStyle={{top: CARD.HEIGHT * 0.02}} onPress={handleOpenProfile} />
              <ActionButton name='heart' onPress={() => swipeAnimation(1, 100)} />
            </View>
          </>
        ) : (
          <NoResults title='No matching pets!' desc='Try a different search.' />
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
  headerStyle: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent',
  },
  infoContainer: {
    backgroundColor: 'white',
  },
  iconButtonsContainer: {
    width: SCREEN.WIDTH,
    flexDirection: 'row',
    position: 'absolute',
    justifyContent: 'space-evenly',
    bottom: CARD.HEIGHT * 0.04,
  },
});

export default Home;
