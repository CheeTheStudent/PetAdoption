import React, { useLayoutEffect, useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, Button, ImageBackground, Image, StyleSheet, Animated, PanResponder } from 'react-native';
import { Icon } from 'react-native-elements';
// import Swiper from 'react-native-deck-swiper';
import firebaseDB from '@react-native-firebase/database';

import AdoptionCard from './components/AdoptionCard';
import ActionButton from './components/ActionButton';
import colours from '../assets/colours/colours';
import { CARD, ACTION_OFFSET, SCREEN } from '../assets/constants/dimensions';
import { TextStyles } from '../assets/constants/styles';

const Home = ({ navigation }) => {

  const petRef = firebaseDB().ref('pets');
  const [pets, setPets] = useState([]);
  const swipe = useRef(new Animated.ValueXY()).current;
  const tiltPoint = useRef(new Animated.Value(1)).current;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Pet Adoption',
      headerTitleStyle: TextStyles.h1,
      headerRight: () => (
        <View style={styles.headerStyle}>
          <Icon name="notifications" type="Ionicons" size={24} color={colours.black} style={styles.iconStyle} />
          <Icon name="search" type="Ionicons" size={24} color={colours.black} style={styles.iconStyle} />
        </View>
      ),
      headerLeft: () => <></>,
    });
  }, [navigation]);

  useEffect(() => {
    petRef.on('value', snapshot => {
      const data = snapshot.val() ? snapshot.val() : {};
      const pets = data.filter(x => x !== null);
      setPets(pets);
    });
  }, []);

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

  const handleOpenProfile = () => {
    navigation.navigate('PetProfile', {
      pet: pets[0],
    });
  };

  return (
    <View style={styles.body}>
      {pets.length > 0 ? (
        <>
          {pets.map((pet, index) => {
            const isFirst = index === 0;
            const dragHandlers = isFirst ? panResponder.panHandlers : {};

            return (<AdoptionCard card={pet} isFirst={isFirst} swipe={swipe} tiltPoint={tiltPoint} {...dragHandlers} navigation={navigation} />);
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
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerStyle: {
    flexDirection: 'row',
    paddingHorizontal: 16,
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
    top: CARD.HEIGHT - CARD.HEIGHT * 0.02,
  },
  iconButton: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: 'white',
    shadowColor: 'black',
    elevation: 10,
  },
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