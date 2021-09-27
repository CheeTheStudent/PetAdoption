import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';

import Tag from './Tag';
import Textinput from '../components/TextInput';
import SquareButton from './SquareButton';
import LongRoundButton from './LongRoundButton';
import { TextStyles, Spacing } from '../../assets/styles';
import { SCREEN, verticalScale, scale, moderateScale } from '../../assets/dimensions';
import colours from '../../assets/colours';
import { dogAPIkey, catAPIkey } from '../../assets/bimil';

const animals = ["Dogs", "Cats", "Rabbits", "Rodents", "Reptiles", "Birds"];
const locations = ['All', 'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang',
  'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu'];

const Filter = ({ navigation, route }) => {

  const { setQueries } = route.params;

  const [dogBreeds, setDogBreeds] = useState();
  const [catBreeds, setCatBreeds] = useState();
  const [keyword, setKeyword] = useState('');
  const [species, setSpecies] = useState();
  const [breed, setBreed] = useState();
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('All');

  useEffect(async () => {
    fetch('https://api.thedogapi.com/v1/breeds', {
      headers: { 'x-api-key': dogAPIkey }
    })
      .then(res => res.json())
      .then(results => {
        let extractedBreeds = ['All'];
        results.map(breed => extractedBreeds.push(breed.name));
        setDogBreeds(extractedBreeds);
      },
        (error) => {
          console.log(error);
        });

    fetch('https://api.thecatapi.com/v1/breeds', {
      headers: { 'x-api-key': catAPIkey }
    })
      .then(res => res.json())
      .then(results => {
        let extractedBreeds = ['All'];
        results.map(breed => extractedBreeds.push(breed.name));
        setCatBreeds(extractedBreeds);
      },
        (error) => {
          console.log(error);
        });

  }, []);

  const handleSelectedAnimal = (value) => {
    setSpecies(value);
  };

  const handleFilter = () => {
    const filters = [];
    if (keyword)
      filters.push({ field: 'name', property: keyword });
    if (species)
      filters.push({ field: 'species', property: species });
    if (breed)
      filters.push({ field: 'breed', property: breed });
    if (gender)
      filters.push({ field: 'gender', property: gender === "Female" ? true : false });
    if (age) {
      if (age === 'Young')
        filters.push({ field: 'age', startAge: 0, 'endAge': 0 });
      if (age === 'Adult')
        filters.push({ field: 'age', startAge: 1, 'endAge': 7 });
      if (age === 'Senior')
        filters.push({ field: 'age', startAge: 8, 'endAge': 100 });
    }
    if (location !== 'All')
      filters.push({ field: 'location', property: location });

    setQueries(filters);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <View style={[styles.rowContainer, Spacing.smallTopSpacing]}>
          <Icon name='arrow-left' type='material-community' size={25} color='black' onPress={() => navigation.goBack()} style={{ flex: 1 }} />
          <Textinput
            placeholder="Search"
            onChangeText={value => setKeyword(value)}
            inputContainerStyle={styles.searchInputContainer}
            containerStyle={{ flex: 1 }}
            renderErrorMessage={false} />
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Pet Type</Text>
        <View style={styles.speciesContainer}>
          {animals.map(type => {
            return <Tag title={type} onSingleSelected={handleSelectedAnimal} type={species === type ? "black" : ""} />;
          })}
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Breed</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={breed}
            onValueChange={(value, index) => setBreed(value)}>
            {species === 'Dogs' ?
              dogBreeds && dogBreeds.map(type => {
                return <Picker.Item key={type} label={type} value={type} style={styles.pickerItem} />;
              })
              : species === 'Cats' ?
                catBreeds && catBreeds.map(type => {
                  return <Picker.Item key={type} label={type} value={type} style={styles.pickerItem} />;
                })
                : <Picker.Item label="No Breeds" value="" style={styles.pickerItem} />
            }
          </Picker>
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Gender</Text>
        <View style={styles.rowContainer}>
          <SquareButton
            title="Female"
            containerStyle={styles.squareLeftButton}
            buttonStyle={gender === "Female" && styles.squareButtonPressed}
            titleStyle={gender === "Female" && styles.squareButtonTextPressed}
            onPress={() => setGender(prev => prev === "Female" ? null : "Female")} />
          <SquareButton
            title="Male"
            containerStyle={styles.squareRightButton}
            buttonStyle={gender === "Male" && styles.squareButtonPressed}
            titleStyle={gender === "Male" && styles.squareButtonTextPressed}
            onPress={() => setGender(prev => prev === "Male" ? null : "Male")} />
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Age Range</Text>
        <View style={styles.rowContainer}>
          <SquareButton
            title="Young"
            containerStyle={styles.squareLeftButton}
            buttonStyle={[age === "Young" && styles.squareButtonPressed, styles.squareButton]}
            titleStyle={age === "Young" && styles.squareButtonTextPressed}
            onPress={() => setAge(prev => prev === "Young" ? null : "Young")} />
          <SquareButton
            title="Adult"
            containerStyle={styles.squareLeftButton}
            buttonStyle={[age === "Adult" && styles.squareButtonPressed, styles.squareButton]}
            titleStyle={age === "Adult" && styles.squareButtonTextPressed}
            onPress={() => setAge(prev => prev === "Adult" ? null : "Adult")} />
          <SquareButton
            title="Senior"
            containerStyle={styles.squareRightButton}
            buttonStyle={[age === "Senior" && styles.squareButtonPressed, styles.squareButton]}
            titleStyle={age === "Senior" && styles.squareButtonTextPressed}
            onPress={() => setAge(prev => prev === "Senior" ? null : "Senior")} />
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Location</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={location}
            onValueChange={(value, index) => setLocation(value)}>
            {locations.map(type => {
              return <Picker.Item key={type} label={type} value={type} style={styles.pickerItem} />;
            })}
          </Picker>
        </View>
      </View>
      <LongRoundButton title="FILTER" onPress={handleFilter} containerStyle={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    marginHorizontal: scale(24),
  },
  searchInputContainer: {
    marginLeft: scale(8),
    height: verticalScale(40),
  },
  speciesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pickerContainer: {
    marginTop: verticalScale(8),
    paddingLeft: scale(8),
    borderWidth: 1,
    borderColor: colours.mediumGray,
    borderRadius: 4,
  },
  pickerItem: {
    color: colours.darkGray,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  squareLeftButton: {
    flex: 1,
    marginRight: scale(8),
  },
  squareRightButton: {
    flex: 1,
  },
  squareButtonPressed: {
    backgroundColor: colours.black,
  },
  squareButtonTextPressed: {
    color: colours.white,
  },
  button: {
    marginTop: verticalScale(24),
    marginBottom: verticalScale(32),
    alignSelf: 'center',
  },
});

export default Filter;