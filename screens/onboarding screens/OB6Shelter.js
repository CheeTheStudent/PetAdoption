import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {CheckBox} from 'react-native-elements';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import Tag from '../components/Tag';
import LongRoundButton from '../components/LongRoundButton';
import SquareButton from '../components/SquareButton';
import Textinput from '../components/TextInput';
import MultiLineInput from '../components/MultiLineInput';
import {scale, verticalScale, moderateScale} from '../../assets/dimensions';
import {TextStyles, Spacing} from '../../assets/styles';
import colours from '../../assets/colours';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const OB6Shelter = ({navigation}) => {
  const userUID = auth().currentUser.uid;
  const userRef = database().ref(`/users/${userUID}`);

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [insta, setInsta] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isModalVisible, setModalVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

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

  const renderModal = () => {
    return (
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)} backdropTransitionOutTiming={0}>
        <View style={styles.addHoursModal}>
          <Text style={TextStyles.h2}>Set Opening Hours</Text>
          <Text style={[TextStyles.h3, styles.modalSubtitle]}>Days</Text>
          <View style={styles.tagsContainer}>
            {days.map(day => (
              <Tag title={day.substr(0, 3)} />
            ))}
          </View>
          <Text style={[TextStyles.h3, styles.modalSubtitle]}>Hours</Text>
          <SquareButton title='Time' onPress={() => toggleTimePicker()} />
          <LongRoundButton title='ADD' />
        </View>
      </Modal>
    );
  };

  const renderTimePicker = () => {
    return <DateTimePicker testID='dateTimePicker' value={date} mode='time' is24Hour={true} display='default' onChange={onChangeDate} />;
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setTimePickerVisible(false);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleTimePicker = () => {
    console.log(isTimePickerVisible);
    setTimePickerVisible(!isTimePickerVisible);
  };

  const handleGetLocation = location => {
    setLocation(location);
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
    const prevArr = await AsyncStorage.getItem('onboardUser');
    const user = {...newInfo, ...JSON.parse(prevArr)};

    userRef.set({...user, screening});
  };

  return (
    <View style={styles.body}>
      <ScrollView style={styles.container}>
        <Text style={[TextStyles.h1, Spacing.bigTopSpacing]}>Tell us about your Organization</Text>
        <Text style={TextStyles.h3}>Let adopters know more about who you are and what you do!</Text>
        <Text style={[TextStyles.h3, Spacing.mediumTopSpacing]}>
          Shelter/Organization Name
          <Text style={{color: 'red'}}> *</Text>
        </Text>
        <Text style={TextStyles.desc}>This will be shown on your profile.</Text>
        <Textinput placeholder='Eg. Animal Rescue Association' onChangeText={name => setName(name)} containerStyle={Spacing.superSmallTopSpacing} renderErrorMessage={false} />
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>About The Organization</Text>
        <Text style={TextStyles.desc}>Describe the shelter’s history, purpose, visions and even achievements!</Text>
        <MultiLineInput numberOfLines={5} onChangeText={desc => setDesc(desc)} containerStyle={Spacing.smallTopSpacing} />

        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Address</Text>
        <SquareButton
          title={location ? location.address : 'Add Location'}
          icon={<Icon name='location-sharp' color={colours.darkGray} size={moderateScale(24)} />}
          onPress={() => navigation.navigate('GooglePlacesInputModal', {onGoBack: handleGetLocation})}
          buttonStyle={styles.addItemButton}
          titleStyle={styles.addItemText}
          containerStyle={Spacing.superSmallTopSpacing}
        />
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Opening Hours</Text>
        <SquareButton
          title='Add Hours'
          icon={<Icon name='add-circle' color={colours.darkGray} size={moderateScale(24)} />}
          onPress={toggleModal}
          buttonStyle={styles.addItemButton}
          titleStyle={styles.addItemText}
          containerStyle={Spacing.superSmallTopSpacing}
        />

        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Contact Number</Text>
        <Textinput placeholder='Eg. 01x-xxxxxxxx' onChangeText={value => setPhoneNumber(value)} keyboardType='numeric' containerStyle={Spacing.superSmallTopSpacing} renderErrorMessage={false} />
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Contact Email</Text>
        <Textinput placeholder='Eg. association@email.com' onChangeText={value => setEmail(value)} containerStyle={Spacing.superSmallTopSpacing} renderErrorMessage={false} />
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Facebook Page</Text>
        <Textinput placeholder='Username' onChangeText={value => setFacebook(value)} containerStyle={Spacing.superSmallTopSpacing} renderErrorMessage={false} />
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Twitter Profile</Text>
        <Textinput placeholder='@twitter_handle' onChangeText={value => setTwitter(value)} containerStyle={Spacing.superSmallTopSpacing} renderErrorMessage={false} />
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Instagram Page</Text>
        <Textinput placeholder='@insta_page' onChangeText={value => setInsta(value)} containerStyle={Spacing.superSmallTopSpacing} renderErrorMessage={false} />

        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Set to Private</Text>
        <View style={styles.rowContainer}>
          <CheckBox checked={isPrivate} checkedColor='black' onPress={() => setIsPrivate(!isPrivate)} containerStyle={styles.checkBox} />
          <Text style={[TextStyles.desc, {flex: 1}]}>
            Setting your account to private helps you manage your messages. Messages you haven’t accept will appear in your requests, rather than your main chat list. You can always change this in
            your settings.{' '}
          </Text>
        </View>

        <LongRoundButton title='CONTINUE' disabled={!name} onPress={handleSubmit} containerStyle={styles.button} />
      </ScrollView>
      {renderModal()}
      {isTimePickerVisible ? renderTimePicker() : null}
    </View>
  );
};
{
  /* <View style={styles.tagsContainer}>
          {status.map(type => {
            return <Tag title={type} onSelected={handleStatus} />;
          })}
        </View> */
}
const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    paddingHorizontal: scale(16),
  },
  addItemButton: {
    borderRadius: moderateScale(20),
  },
  addItemText: {
    marginLeft: scale(8),
    color: colours.darkGray,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rowContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(8),
    alignItems: 'center',
  },
  checkBox: {
    padding: 0,
  },
  button: {
    marginTop: verticalScale(24),
    paddingBottom: verticalScale(32),
    alignSelf: 'center',
  },
  addHoursModal: {
    padding: moderateScale(16),
    alignItems: 'center',
    borderRadius: moderateScale(10),
    backgroundColor: 'white',
  },
  modalSubtitle: {
    marginTop: verticalScale(8),
    alignSelf: 'flex-start',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default OB6Shelter;
