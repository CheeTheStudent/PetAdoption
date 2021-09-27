import React, { useLayoutEffect, useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, Button, ImageBackground, Image, StyleSheet, Animated, PanResponder } from 'react-native';
import { Icon } from 'react-native-elements';
import database from '@react-native-firebase/database';

import AdoptionCard from './components/AdoptionCard';
import ActionButton from './components/ActionButton';
import colours from '../assets/colours';
import { CARD, ACTION_OFFSET, SCREEN, scale, verticalScale } from '../assets/dimensions';
import { TextStyles } from '../assets/styles';

const Home = ({ navigation, route }) => {

  const swipeAway = route.params?.swipeAway;

  const petRef = database().ref('pets');
  const [pets, setPets] = useState([]);
  const [queries, setQueries] = useState();
  const swipe = useRef(new Animated.ValueXY()).current;
  const tiltPoint = useRef(new Animated.Value(1)).current;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Pet Adoption',
      headerTitleStyle: TextStyles.h1,
      headerRight: () => (
        <View style={styles.headerStyle}>
          <Icon name="notifications" type="Ionicons" size={24} color={colours.black} style={styles.iconStyle} />
          <Icon name="search" type="Ionicons" size={24} color={colours.black} onPress={handleOpenFilter} style={styles.iconStyle} />
        </View>
      ),
      headerLeft: () => <></>,
    });
  }, [navigation]);

  useEffect(() => {
    // Try this to limit cards on homepage
    let petQuery = petRef;

    if (queries && queries.length > 0) {
      const query = queries[0];
      if (query.field === "age") {
        petQuery = petRef.orderByChild('ageYear').startAt(query.startAge).endAt(query.endAge).limitToFirst(20);
      } else if (query.field === "name") {
        petQuery = petRef.orderByChild(query.field).startAt(query.property).endAt(`${query.property}\uf8ff`).limitToFirst(20);
      } else {
        petQuery = petRef.orderByChild(query.field).equalTo(query.property).limitToFirst(20);
      }
    }
    petQuery.on('value', snapshot => {
      const data = snapshot.val() ? snapshot.val() : {};
      let pets = [];
      Object.entries(data).map(value => pets.push({ id: value[0], ...value[1] }));
      if (queries && queries.length > 1)
        filterResults(pets);
      else
        setPets(pets);
    });

    return () => petRef.off();
  }, [queries]);

  useEffect(() => {
    if (swipeAway) {
      if (swipeAway === "like") {
        swipeAnimation(1, 100);
      } else if (swipeAway === "dislike") {
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
      const { field, property, startAge, endAge } = query;
      if (index != 0) {
        if (field === "age") {
          if (index == 1)
            filteredPets = filteredPets.filter(el => el.ageYear >= startAge && el.ageYear <= endAge);
          else
            filteredPets = filteredPets.filter(el => el.ageYear >= startAge && el.ageYear <= endAge);
        } else {
          if (index == 1)
            filteredPets = filteredPets.filter(el => el[field] === property);
          else
            filteredPets = filteredPets.filter(el => el[field] === property);
        }
      }
    });
    setPets(filteredPets);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx, dy, y0 }) => {
      // change y: 0 to y: dy if you want free movement
      swipe.setValue({ x: dx, y: 0 });
      tiltPoint.setValue(y0 > CARD.HEIGHT / 2 ? 1 : -1);
    },
    onPanResponderRelease: (_, { dx, dy }) => {
      const direction = Math.sign(dx);
      const isActionActive = Math.abs(dx) > ACTION_OFFSET;

      if (isActionActive) {
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
    }
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
    setPets((prevState) => prevState.slice(1));
    swipe.setValue({ x: 0, y: 0 });
  }, [swipe]);

  const handleOpenFilter = () => {
    navigation.navigate('FilterModal', {
      setQueries: setQueries,
    });
  };

  const handleOpenProfile = () => {
    navigation.navigate('PetProfile', {
      pet: pets[0],
    });
  };

  return (
    <View style={styles.body}>
      {pets && pets.length > 0 ? (
        <>
          {pets.map((pet, index) => {
            const isFirst = index === 0;
            const dragHandlers = isFirst ? panResponder.panHandlers : {};

            return (<AdoptionCard key={pet.id} pet={pet} isFirst={isFirst} swipe={swipe} tiltPoint={tiltPoint} {...dragHandlers} navigation={navigation} />);
          }).reverse()}
          <View style={styles.iconButtonsContainer}>
            <ActionButton name="thumb-down" onPress={() => swipeAnimation(-1, 100)} />
            <ActionButton name="chevron-down" containerStyle={{ top: CARD.HEIGHT * 0.02 }} onPress={handleOpenProfile} />
            <ActionButton name="thumb-up" onPress={() => swipeAnimation(1, 100)} />
          </View>
        </>
      ) : (<Text>Nothing to see here</Text>)}
    </View >
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
  iconStyle: {
    margin: 4,
  },
  text: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent"
  },
  infoContainer: {
    backgroundColor: 'white'
  },
  iconButtonsContainer: {
    width: SCREEN.WIDTH,
    flexDirection: 'row',
    position: 'absolute',
    justifyContent: 'space-evenly',
    bottom: CARD.HEIGHT * 0.04,
  }
});

export default Home;




// <Swiper
//               cards={pets}
//               renderCard={(card) => { return (<AdoptionCard card={card} />); }}
//               onSwiped={(cardIndex) => { console.log(cardIndex); }}
//               onSwipedAll={() => { console.log('onSwipedAll'); }}
//               onSwipedTop={() => setShowInfo(true)}
//               verticalSwipe={true}
//               cardIndex={0}
//               stackSize={3}
//               backgroundColor={'white'}
//               containerStyle={styles.containerStyle}
//             >
//             </Swiper>

// containerStyle: {
//   flex: 1,
// },