import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Input, Slider} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {Picker} from '@react-native-picker/picker';

import Tag from '../components/Tag';
import LongRoundButton from '../components/LongRoundButton';
import SquareButton from '../components/SquareButton';
import Textinput from '../components/TextInput';
import MultiLineInput from '../components/MultiLineInput';
import {scale, verticalScale, moderateScale} from '../../assets/dimensions';
import {TextStyles, Spacing} from '../../assets/styles';
import colours from '../../assets/colours';

const livingConditions = ['Apartment', 'Landed Property'];
const status = ['Employed', 'Part-time', 'Work From Home', 'Student', 'Single', 'Married', 'Family with Children'];
const ageGroups = [
  {label: '< 18 years old', value: 'lt18'},
  {label: '18 - 24 years old', value: '18-24'},
  {label: '25 - 34 years old', value: '25-34'},
  {label: '35 - 44 years old', value: '35-44'},
  {label: '45 - 54 years old', value: '45-54'},
  {label: '55 - 64 years old', value: '55-64'},
  {label: '> 65 years old ', value: 'mt65'},
];
const OB5Screening = ({navigation, user, onSave}) => {
  const userUID = auth().currentUser.uid;
  const userRef = database().ref(`/users/${userUID}`);

  const [name, setName] = useState(user ? user.name : '');
  const [ageGroup, setAgeGroup] = useState(user ? user.screening.age : 'lt18');
  const [selectedlivingConditions, setSelectedLivingConditions] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [numOfPets, setNumOfPets] = useState(user ? user.screening.numOfPetsOwned : 0);
  const [vaccinated, setVaccinated] = useState(user ? user.screening.petsVaccinated : false);
  const [spayed, setSpayed] = useState(user ? user.screening.petsSpayed : false);
  const [desc, setDesc] = useState(user ? user.screening.description : '');

  useEffect(() => {
    if (user) {
      let prevLivingConditions = [];
      let prevStatuses = [];

      user.screening.livingCondition.map(tag => {
        livingConditions.map(el => (el === tag ? prevLivingConditions.push(tag) : null));
      });
      user.screening.status.map(tag => {
        status.map(el => (el === tag ? prevStatuses.push(tag) : null));
      });
      setSelectedLivingConditions(prevLivingConditions);
      setStatuses(prevStatuses);
    }
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

  const handleSubmit = async () => {
    const screening = {
      age: ageGroup,
      status: statuses,
      livingCondition: selectedlivingConditions,
      numOfPetsOwned: numOfPets,
      petsVaccinated: vaccinated,
      petsSpayed: spayed,
      description: desc,
    };
    const newInfo = {
      name: name,
    };
    if (user) return onSave({name, screening});
    else {
      const prevArr = await AsyncStorage.getItem('onboardUser');
      const user = {...newInfo, ...JSON.parse(prevArr)};

      userRef.set({...user, screening});
    }
  };

  const handleSkip = async () => {
    const newInfo = {
      name: 'Guest',
    };
    const prevArr = await AsyncStorage.getItem('onboardUser');
    const user = {...newInfo, ...JSON.parse(prevArr)};
    userRef.set(user);
  };

  return (
    <View style={styles.body}>
      <ScrollView style={styles.container}>
        {!user ? (
          <>
            <Text style={[TextStyles.h1, Spacing.bigTopSpacing]}>Tell us about yourself</Text>
            <Text style={TextStyles.h3}>A complete profile will allow you to make a better impression!</Text>
          </>
        ) : null}
        <Text style={[TextStyles.h3, Spacing.mediumTopSpacing]}>
          Name
          <Text style={{color: 'red'}}> *</Text>
        </Text>
        <Text style={TextStyles.desc}>This will be shown on your profile.</Text>
        <Textinput placeholder='Eg. Joan Arc' value={name} onChangeText={name => setName(name)} containerStyle={Spacing.superSmallTopSpacing} renderErrorMessage={false} />
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Age</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={ageGroup} onValueChange={(value, index) => setAgeGroup(value)}>
            {ageGroups.map(type => {
              return <Picker.Item label={type.label} value={type.value} style={styles.pickerItem} />;
            })}
          </Picker>
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Living Condition</Text>
        <View style={styles.tagsContainer}>
          {livingConditions.map(type => {
            return <Tag title={type} type={selectedlivingConditions.indexOf(type) >= 0 && 'black'} onSelected={handleLivingCondition} />;
          })}
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Status</Text>
        <Text style={TextStyles.desc}>Choose the roles relevant to you.</Text>
        <View style={styles.tagsContainer}>
          {status.map(type => {
            return <Tag title={type} type={statuses.indexOf(type) >= 0 && 'black'} onSelected={handleStatus} />;
          })}
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Number of Pets</Text>
        <Text style={TextStyles.desc}>How many pets do you currently own?</Text>
        <View style={styles.rowContainer}>
          <Slider value={numOfPets} onValueChange={value => setNumOfPets(value)} minimumValue={0} maximumValue={6} step={1} thumbStyle={styles.sliderThumb} style={{flex: 9}} />
          <Text style={styles.counterContainer}>{numOfPets < 6 ? numOfPets : '> 5'}</Text>
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Are your pets vaccinated?</Text>
        <View style={styles.rowContainer}>
          <SquareButton
            title='Yes'
            containerStyle={styles.squareYesButton}
            buttonStyle={vaccinated && styles.squareButtonPressed}
            titleStyle={vaccinated && styles.squareButtonTextPressed}
            onPress={() => setVaccinated(true)}
          />
          <SquareButton
            title='No'
            containerStyle={styles.squareNoButton}
            buttonStyle={!vaccinated && styles.squareButtonPressed}
            titleStyle={!vaccinated && styles.squareButtonTextPressed}
            onPress={() => setVaccinated(false)}
          />
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Are your pets neutered/spayed?</Text>
        <View style={styles.rowContainer}>
          <SquareButton
            title='Yes'
            containerStyle={styles.squareYesButton}
            buttonStyle={spayed && styles.squareButtonPressed}
            titleStyle={spayed && styles.squareButtonTextPressed}
            onPress={() => setSpayed(true)}
          />
          <SquareButton
            title='No'
            containerStyle={styles.squareNoButton}
            buttonStyle={!spayed && styles.squareButtonPressed}
            titleStyle={!spayed && styles.squareButtonTextPressed}
            onPress={() => setSpayed(false)}
          />
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Short Description</Text>
        <Text style={TextStyles.desc}>Tell us a bit more about yourself. Your experience with animals, your passion, anything!</Text>
        <MultiLineInput numberOfLines={5} defaultValue={desc} onChangeText={desc => setDesc(desc)} containerStyle={Spacing.smallTopSpacing} />
        <View style={styles.bottomContainer}>
          {
            <Text onPress={handleSkip} style={styles.skipText}>
              {user ? 'CANCEL' : 'SKIP'}
            </Text>
          }
          <LongRoundButton title={user ? 'SAVE' : 'CONTINUE'} disabled={!name} onPress={handleSubmit} />
        </View>
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sliderThumb: {
    width: scale(16),
    height: verticalScale(16),
    backgroundColor: 'black',
  },
  rowContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(8),
  },
  counterContainer: {
    flex: 1,
    marginLeft: scale(8),
    textAlign: 'center',
    textAlignVertical: 'center',
    borderWidth: 1,
    borderColor: colours.mediumGray,
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
  bottomContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(24),
    paddingHorizontal: scale(8),
    paddingBottom: verticalScale(32),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipText: {
    marginHorizontal: scale(8),
    fontSize: moderateScale(12),
    textDecorationLine: 'underline',
  },
});

export default OB5Screening;
