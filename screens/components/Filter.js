import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';

import Tag from './Tag';
import Textinput from '../components/TextInput';
import SquareButton from './SquareButton';
import LongRoundButton from './LongRoundButton';
import {TextStyles, Spacing} from '../../assets/styles';
import {SCREEN, verticalScale, scale, moderateScale} from '../../assets/dimensions';
import colours from '../../assets/colours';
import {dogAPIkey, catAPIkey} from '../../assets/bimil';

const animals = ['Dogs', 'Cats', 'Rabbits', 'Rodents', 'Reptiles', 'Birds'];
const locations = ['All', 'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu'];

const Filter = ({navigation, route}) => {
  const {queries} = route.params;

  const [dogBreeds, setDogBreeds] = useState(['All']);
  const [catBreeds, setCatBreeds] = useState(['All']);
  const [keyword, setKeyword] = useState('');
  const [species, setSpecies] = useState();
  const [breed, setBreed] = useState();
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('All');
  const [isMounted, setIsMounted] = useState(true);

  useEffect(async () => {
    if (queries) handlePersistFilters();

    await fetch('https://api.thedogapi.com/v1/breeds', {
      headers: {'x-api-key': dogAPIkey},
    })
      .then(res => res.json())
      .then(results => {
        let extractedBreeds = ['All'];
        results.map(breed => extractedBreeds.push(breed.name));
        if (isMounted) setDogBreeds(extractedBreeds);
      });

    await fetch('https://api.thecatapi.com/v1/breeds', {
      headers: {'x-api-key': catAPIkey},
    })
      .then(res => res.json())
      .then(results => {
        let extractedBreeds = ['All'];
        results.map(breed => extractedBreeds.push(breed.name));
        if (isMounted) setCatBreeds(extractedBreeds);
      });

    const breedQuery = queries?.findIndex(query => query.field === 'breed');
    if (breedQuery >= 0) setBreed(queries[breedQuery].property);

    return () => setIsMounted(false);
  }, []);

  const handleSelectedAnimal = value => {
    setSpecies(value);
  };

  const handlePersistFilters = () => {
    queries.map(query => {
      const {field, property, startAge} = query;
      switch (query.field) {
        case 'name':
          setKeyword(property);
          break;
        case 'species':
          setSpecies(property);
          break;
        case 'gender':
          setGender(property ? 'Female' : 'Male');
          break;
        case 'location':
          setLocation(property);
          break;
        case 'age':
          setAge(startAge === 0 ? 'Young' : startAge === 1 ? 'Adult' : 'Senior');
          break;
      }
    });
  };

  const handleFilter = () => {
    const filters = [];
    if (keyword) filters.push({field: 'name', property: keyword});
    if (species) filters.push({field: 'species', property: species});
    if (breed && breed !== 'All') filters.push({field: 'breed', property: breed});
    if (gender) filters.push({field: 'gender', property: gender === 'Female' ? true : false});
    if (age) {
      if (age === 'Young') filters.push({field: 'age', startAge: 0, endAge: 0});
      if (age === 'Adult') filters.push({field: 'age', startAge: 1, endAge: 7});
      if (age === 'Senior') filters.push({field: 'age', startAge: 8, endAge: 100});
    }
    if (location !== 'All') filters.push({field: 'location', property: location});

    navigation.navigate('Home', filters.length > 0 && {queries: filters});
  };

  const clearFilters = () => {
    setKeyword('');
    setSpecies(null);
    setBreed();
    setGender('');
    setAge('');
    setLocation('All');
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <View style={[styles.rowContainer, Spacing.smallTopSpacing]}>
          <Icon name='arrow-left' type='material-community' size={25} color='black' onPress={handleFilter} style={{flex: 1}} />
          <Textinput
            placeholder='Search'
            defaultValue={keyword}
            onChangeText={value => setKeyword(value)}
            inputContainerStyle={styles.searchInputContainer}
            containerStyle={{flex: 1}}
            renderErrorMessage={false}
          />
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Pet Type</Text>
        <View style={styles.speciesContainer}>
          {animals.map(type => {
            return <Tag key={type} title={type} onSingleSelected={handleSelectedAnimal} type={species === type ? 'black' : ''} />;
          })}
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Breed</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={breed} onValueChange={(value, index) => setBreed(value)}>
            {species === 'Dogs' ? (
              dogBreeds &&
              dogBreeds.map(type => {
                return <Picker.Item key={type} label={type} value={type} style={styles.pickerItem} />;
              })
            ) : species === 'Cats' ? (
              catBreeds &&
              catBreeds.map(type => {
                return <Picker.Item key={type} label={type} value={type} style={styles.pickerItem} />;
              })
            ) : (
              <Picker.Item label='No Breeds' value='' style={styles.pickerItem} />
            )}
          </Picker>
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Gender</Text>
        <View style={styles.rowContainer}>
          <SquareButton
            title='Female'
            containerStyle={styles.squareLeftButton}
            buttonStyle={gender === 'Female' && styles.squareButtonPressed}
            titleStyle={gender === 'Female' && styles.squareButtonTextPressed}
            onPress={() => setGender(prev => (prev === 'Female' ? null : 'Female'))}
          />
          <SquareButton
            title='Male'
            containerStyle={styles.squareRightButton}
            buttonStyle={gender === 'Male' && styles.squareButtonPressed}
            titleStyle={gender === 'Male' && styles.squareButtonTextPressed}
            onPress={() => setGender(prev => (prev === 'Male' ? null : 'Male'))}
          />
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Age Range</Text>
        <View style={styles.rowContainer}>
          <SquareButton
            title='Young'
            containerStyle={styles.squareLeftButton}
            buttonStyle={[age === 'Young' && styles.squareButtonPressed, styles.squareButton]}
            titleStyle={age === 'Young' && styles.squareButtonTextPressed}
            onPress={() => setAge(prev => (prev === 'Young' ? null : 'Young'))}
          />
          <SquareButton
            title='Adult'
            containerStyle={styles.squareLeftButton}
            buttonStyle={[age === 'Adult' && styles.squareButtonPressed, styles.squareButton]}
            titleStyle={age === 'Adult' && styles.squareButtonTextPressed}
            onPress={() => setAge(prev => (prev === 'Adult' ? null : 'Adult'))}
          />
          <SquareButton
            title='Senior'
            containerStyle={styles.squareRightButton}
            buttonStyle={[age === 'Senior' && styles.squareButtonPressed, styles.squareButton]}
            titleStyle={age === 'Senior' && styles.squareButtonTextPressed}
            onPress={() => setAge(prev => (prev === 'Senior' ? null : 'Senior'))}
          />
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Location</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={location} onValueChange={(value, index) => setLocation(value)}>
            {locations.map(type => {
              return <Picker.Item key={type} label={type} value={type} style={styles.pickerItem} />;
            })}
          </Picker>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Text onPress={clearFilters} style={styles.skipText}>
          {'CLEAR'}
        </Text>
        <LongRoundButton title='FILTER' onPress={handleFilter} containerStyle={styles.button} />
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
    marginHorizontal: scale(16),
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
  bottomContainer: {
    width: SCREEN.WIDTH,
    flexDirection: 'row',
    marginTop: verticalScale(24),
    paddingHorizontal: scale(24),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipText: {
    marginHorizontal: scale(8),
    fontSize: moderateScale(12),
    textDecorationLine: 'underline',
  },
});

export default Filter;
