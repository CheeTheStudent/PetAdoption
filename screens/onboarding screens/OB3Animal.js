import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LongRoundButton from '../components/LongRoundButton';
import { scale, verticalScale, moderateScale } from '../../assets/dimensions';
import { TextStyles } from '../../assets/styles';
import colours from '../../assets/colours';

import Dog from '../../assets/images/dog.svg';
import Cat from '../../assets/images/cat.svg';
import Rabbit from '../../assets/images/rabbit.svg';
import Mouse from '../../assets/images/mouse.svg';
import Turtle from '../../assets/images/turtle.svg';
import Bird from '../../assets/images/bird.svg';

const animals = [
  {
    index: 0,
    title: "Dogs",
    image: <Dog width={scale(69)} height={scale(69)} />,
  },
  {
    index: 1,
    title: "Cats",
    image: <Cat width={scale(74)} height={scale(74)} />,
  },
  {
    index: 2,
    title: "Rabbits",
    image: <Rabbit width={scale(69)} height={scale(69)} />,
  },
  {
    index: 3,
    title: "Rodents",
    image: <Mouse width={scale(57)} height={scale(49)} />,
  },
  {
    index: 4,
    title: "Reptiles",
    image: <Turtle width={scale(55)} height={scale(55)} />,
  },
  {
    index: 5,
    title: "Birds",
    image: <Bird width={scale(57)} height={scale(57)} />,
  },
];

const OB3Animal = ({ navigation }) => {

  const [selected, setSelected] = useState([false, false, false, false, false, false]);
  const [disabled, setDisabled] = useState(true);

  const handleSelection = (index) => {
    setSelected((prev) => prev.map((el, i) => (i !== index ? el : !el)));
    setDisabled(true);
    selected.map((el, i) => {
      if (i == index) {
        if (!el) {
          setDisabled(false);
        }
      } else if (el) {
        setDisabled(false);
      }
    });
  };

  const renderBox = (animal) => {
    return (
      <TouchableOpacity style={[
        styles.box, selected[animal.index] && styles.boxPressed]}
        onPress={() => handleSelection(animal.index)}>
        <View style={{ flex: 8, justifyContent: 'center' }}>
          {animal.image}
        </View>
        < Text style={[TextStyles.h3, styles.text]}>{animal.title}</Text>
      </TouchableOpacity >
    );
  };

  const handleNext = async () => {
    const preferredAnimals = [];
    selected.map((val, i) => {
      val && preferredAnimals.push(animals[i].title);
    });
    const user = { preferredAnimals: preferredAnimals };

    try {
      await AsyncStorage.mergeItem('user', JSON.stringify(user));
    } catch (error) {
      console.log(error);
    }

    navigation.navigate("OB4Tags");
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Text style={TextStyles.h1}>Choose an animal</Text>
        <Text style={TextStyles.h3}>Choose an animal you’re particularly interested in!</Text>
        <View style={{ marginTop: verticalScale(20) }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: verticalScale(16) }}>{renderBox(animals[0])}{renderBox(animals[1])}</View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: verticalScale(16) }}>{renderBox(animals[2])}{renderBox(animals[3])}</View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>{renderBox(animals[4])}{renderBox(animals[5])}</View>

        </View>
      </View>
      <LongRoundButton title="NEXT" onPress={handleNext} disabled={disabled} containerStyle={styles.button} />
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
  box: {
    width: scale(117),
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // alignContent: 'flex-end',
    elevation: moderateScale(3),
    backgroundColor: 'white',
  },
  boxPressed: {
    backgroundColor: '#0000001F',
    elevation: 1,
  },
  text: {
    flex: 2,
  },
  button: {
    position: 'absolute',
    bottom: verticalScale(32),
    alignSelf: 'center',
  },
});


export default OB3Animal;