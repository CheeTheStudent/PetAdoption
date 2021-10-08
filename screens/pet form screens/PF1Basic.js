import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, TouchableOpacity, Image, ImageBackground, FlatList, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';
import NumericInput from 'react-native-numeric-input';

import LongRoundButton from '../components/LongRoundButton';
import SquareButton from '../components/SquareButton';
import Textinput from '../components/TextInput';
import MultiLineInput from '../components/MultiLineInput';
import MediaPicker from '../components/MediaPicker';
import {scale, verticalScale, moderateScale} from '../../assets/dimensions';
import {TextStyles, Spacing} from '../../assets/styles';
import colours from '../../assets/colours';
import {dogAPIkey, catAPIkey} from '../../assets/bimil';

import Dog from '../../assets/images/dog.svg';
import Cat from '../../assets/images/cat.svg';
import Rabbit from '../../assets/images/rabbit.svg';
import Mouse from '../../assets/images/mouse.svg';
import Turtle from '../../assets/images/turtle.svg';
import Bird from '../../assets/images/bird.svg';

const animals = [
  {
    index: 0,
    title: 'Dogs',
    image: <Dog width={scale(59)} height={scale(59)} />,
  },
  {
    index: 1,
    title: 'Cats',
    image: <Cat width={scale(60)} height={scale(60)} />,
  },
  {
    index: 2,
    title: 'Rabbits',
    image: <Rabbit width={scale(46)} height={scale(46)} />,
  },
  {
    index: 3,
    title: 'Rodents',
    image: <Mouse width={scale(51)} height={scale(44)} />,
  },
  {
    index: 4,
    title: 'Reptiles',
    image: <Turtle width={scale(48)} height={scale(48)} />,
  },
  {
    index: 5,
    title: 'Birds',
    image: <Bird width={scale(51)} height={scale(51)} />,
  },
];
const locations = ['Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu'];

const PF1Basic = ({navigation}) => {
  const [dogBreeds, setDogBreeds] = useState();
  const [catBreeds, setCatBreeds] = useState();
  const [name, setName] = useState('');
  const [ageYear, setAgeYear] = useState(0);
  const [ageMonth, setAgeMonth] = useState(0);
  const [gender, setGender] = useState(true);
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [location, setLocation] = useState('Penang');
  const [desc, setDesc] = useState('');
  const [chosenMedia, setChosenMedia] = useState([]);

  useEffect(async () => {
    fetch('https://api.thedogapi.com/v1/breeds', {
      headers: {'x-api-key': dogAPIkey},
    })
      .then(res => res.json())
      .then(
        results => {
          let extractedBreeds = [];
          results.map(breed => extractedBreeds.push(breed.name));
          setDogBreeds(extractedBreeds);
        },
        error => {
          console.log(error);
        },
      );

    fetch('https://api.thecatapi.com/v1/breeds', {
      headers: {'x-api-key': catAPIkey},
    })
      .then(res => res.json())
      .then(
        results => {
          let extractedBreeds = [];
          results.map(breed => extractedBreeds.push(breed.name));
          setCatBreeds(extractedBreeds);
        },
        error => {
          console.log(error);
        },
      );
  }, []);

  const handleLivingCondition = (value, include) => {
    if (include) {
      setSelectedLivingConditions(prev => [...prev, value]);
    } else {
      let newArr = selectedlivingConditions.filter(e => e !== value);
      setSelectedLivingConditions(newArr);
    }
  };

  const handleStatus = (value, include) => {
    if (include) {
      setStatuses(prev => [...prev, value]);
    } else {
      let newArr = statuses.filter(e => e !== value);
      setStatuses(newArr);
    }
  };

  const renderBox = (animal, index) => {
    return (
      <TouchableOpacity key={index} style={[styles.box, species === animal.title && styles.boxPressed]} onPress={() => setSpecies(animal.title)}>
        <View style={{flex: 8, justifyContent: 'center'}}>{animal.image}</View>
        <Text style={[TextStyles.h3, styles.text]}>{animal.title}</Text>
      </TouchableOpacity>
    );
  };

  const handleRemoveChosenMedia = item => {
    let newArr = chosenMedia.filter(e => e !== item); // only include NOT value
    setChosenMedia(newArr);
  };

  const handleSubmit = () => {
    if (!name || (ageYear == 0 && ageMonth == 0) || !species) return;

    const petBasicInfo = {
      name,
      ageYear,
      ageMonth,
      gender,
      species,
      breed,
      location,
      desc,
      media: chosenMedia,
    };

    navigation.navigate('Medical', {petInfo: petBasicInfo});
  };

  return (
    <View style={styles.body}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={[TextStyles.h3, Spacing.mediumTopSpacing]}>Name</Text>
          <Text style={TextStyles.desc}>Write your pet's name here.</Text>
          <Textinput placeholder='Eg. Rex' onChangeText={name => setName(name)} containerStyle={Spacing.superSmallTopSpacing} renderErrorMessage={false} />
          <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Age</Text>
          <View style={[styles.rowContainer, {justifyContent: 'space-between'}]}>
            <View style={styles.ageRowContainer}>
              <Text style={[TextStyles.h4, Spacing.smallRightSpacing]}>Years</Text>
              <NumericInput value={ageYear} onChange={value => setAgeYear(value)} maxValue={99} minValue={0} rounded totalWidth={scale(100)} totalHeight={verticalScale(35)} />
            </View>
            <View style={styles.ageRowContainer}>
              <Text style={[TextStyles.h4, Spacing.smallRightSpacing]}>Months</Text>
              <NumericInput value={ageMonth} onChange={value => setAgeMonth(value)} maxValue={99} minValue={0} rounded totalWidth={scale(100)} totalHeight={verticalScale(35)} />
            </View>
          </View>
          <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Gender</Text>
          <View style={styles.rowContainer}>
            <SquareButton
              title='Female'
              containerStyle={styles.squareYesButton}
              buttonStyle={gender && styles.squareButtonPressed}
              titleStyle={gender && styles.squareButtonTextPressed}
              onPress={() => setGender(true)}
            />
            <SquareButton
              title='Male'
              containerStyle={styles.squareNoButton}
              buttonStyle={!gender && styles.squareButtonPressed}
              titleStyle={!gender && styles.squareButtonTextPressed}
              onPress={() => setGender(false)}
            />
          </View>
          <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Species</Text>
          <View style={[Spacing.superSmallTopSpacing, {flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}]}>
            {animals.map((animal, index) => renderBox(animals[index], index))}
          </View>
          <Text style={[TextStyles.h3, Spacing.mediumTopSpacing]}>Breed</Text>
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
          <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Location</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={location} onValueChange={(value, index) => setLocation(value)}>
              {locations.map(type => {
                return <Picker.Item key={type} label={type} value={type} style={styles.pickerItem} />;
              })}
            </Picker>
          </View>
          <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Short Description</Text>
          <Text style={TextStyles.desc}>Tell us about your pet! You can put in additional information here.</Text>
          <MultiLineInput numberOfLines={5} onChangeText={desc => setDesc(desc)} containerStyle={Spacing.smallTopSpacing} />
          <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Media</Text>
          <Text style={TextStyles.desc}>Attach images and videos to better showcase your pet’s qualities! Adopters are more likely to be interested if more photos are available.</Text>
          {chosenMedia && chosenMedia.length > 0 && (
            <FlatList
              horizontal
              data={chosenMedia}
              style={Spacing.smallTopSpacing}
              renderItem={({item, index}) => {
                return (
                  <View style={styles.cameraPics}>
                    <Image source={{uri: item}} style={styles.cameraPics} />
                    <Icon name='close-circle-outline' type='material-community' size={moderateScale(30)} color='white' containerStyle={styles.closeIcon} />
                    <Icon name='close-circle' type='material-community' size={moderateScale(30)} containerStyle={styles.closeIcon} onPress={() => handleRemoveChosenMedia(item)} />
                  </View>
                );
              }}
            />
          )}
          {chosenMedia && chosenMedia.length > 0 ? <MediaPicker setChosenMedia={setChosenMedia} buttons /> : <MediaPicker setChosenMedia={setChosenMedia} />}
        </View>
        <LongRoundButton title='CONTINUE' onPress={handleSubmit} containerStyle={styles.button} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    paddingHorizontal: scale(16),
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
    marginTop: verticalScale(8),
  },
  ageRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  squareYesButton: {
    flex: 1,
    marginRight: scale(8),
  },
  squareNoButton: {
    flex: 1,
  },
  squareButtonPressed: {
    backgroundColor: colours.black,
  },
  squareButtonTextPressed: {
    color: colours.white,
  },
  box: {
    width: scale(105),
    aspectRatio: 1,
    marginBottom: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
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
  cameraButton: {
    height: verticalScale(105),
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colours.lightGray,
    borderRadius: moderateScale(3),
  },
  cameraPics: {
    width: verticalScale(105),
    height: verticalScale(105),
    marginRight: scale(8),
    borderRadius: moderateScale(3),
  },
  button: {
    marginTop: verticalScale(24),
    marginBottom: verticalScale(32),
    alignSelf: 'center',
  },
  closeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default PF1Basic;
