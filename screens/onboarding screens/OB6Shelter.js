import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {CheckBox} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LongRoundButton from '../components/LongRoundButton';
import SquareButton from '../components/SquareButton';
import Textinput from '../components/TextInput';
import MultiLineInput from '../components/MultiLineInput';
import {scale, verticalScale, moderateScale} from '../../assets/dimensions';
import {TextStyles, Spacing} from '../../assets/styles';
import colours from '../../assets/colours';

const OB6Shelter = ({navigation, user, onSave}) => {
  const userUID = auth().currentUser.uid;
  const userRef = database().ref(`/users/${userUID}`);

  const [name, setName] = useState(user ? user.name : '');
  const [desc, setDesc] = useState(user ? user.description : '');
  const [location, setLocation] = useState(user ? user.location : null);
  const [phoneNumber, setPhoneNumber] = useState(user ? user.phoneNumber : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [facebook, setFacebook] = useState(user ? user.facebookId : '');
  const [twitter, setTwitter] = useState(user ? user.twitterId : '');
  const [insta, setInsta] = useState(user ? user.instaId : '');
  const [isPrivate, setIsPrivate] = useState(user ? user.private : false);

  const handleGetLocation = location => {
    setLocation(location);
  };

  const handleSubmit = async () => {
    const shelter = {
      name,
      location,
      phoneNumber,
      email,
      facebookId: facebook,
      twitterId: twitter,
      instaId: insta,
      private: isPrivate,
      description: desc,
    };
    if (user) return onSave(shelter);
    else {
      const prevArr = await AsyncStorage.getItem('onboardUser');
      const user = {...shelter, ...JSON.parse(prevArr)};

      userRef.set(user);
    }
  };

  return (
    <View style={styles.body}>
      <ScrollView style={styles.container}>
        {!user ? (
          <>
            <Text style={[TextStyles.h1, Spacing.bigTopSpacing]}>Tell us about your Organization</Text>
            <Text style={TextStyles.h3}>Let adopters know more about who you are and what you do!</Text>
          </>
        ) : null}
        <Text style={[TextStyles.h3, Spacing.mediumTopSpacing]}>
          Shelter/Organization Name
          <Text style={{color: 'red'}}> *</Text>
        </Text>
        <Text style={TextStyles.desc}>This will be shown on your profile.</Text>
        <Textinput placeholder='Eg. Animal Rescue Association' defaultValue={name} onChangeText={name => setName(name)} containerStyle={Spacing.superSmallTopSpacing} renderErrorMessage={false} />
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>About The Organization</Text>
        <Text style={TextStyles.desc}>Describe the shelter’s history, purpose, visions and even achievements!</Text>
        <MultiLineInput numberOfLines={5} defaultValue={desc} onChangeText={desc => setDesc(desc)} containerStyle={Spacing.smallTopSpacing} />

        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Address</Text>
        <SquareButton
          title={location ? location.address : 'Add Location'}
          icon={<Icon name='location-sharp' color={colours.darkGray} size={moderateScale(24)} />}
          onPress={() => navigation.navigate('GooglePlacesInputModal', {onGoBack: handleGetLocation})}
          buttonStyle={styles.addItemButton}
          titleStyle={styles.addItemText}
          containerStyle={[Spacing.superSmallTopSpacing, styles.addItemButtonContainer]}
        />

        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Contact Number</Text>
        <Textinput
          placeholder='Eg. 01x-xxxxxxxx'
          defaultValue={phoneNumber}
          onChangeText={value => setPhoneNumber(value)}
          keyboardType='numeric'
          containerStyle={Spacing.superSmallTopSpacing}
          renderErrorMessage={false}
        />
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Contact Email</Text>
        <Textinput placeholder='Eg. association@email.com' defaultValue={email} onChangeText={value => setEmail(value)} containerStyle={Spacing.superSmallTopSpacing} renderErrorMessage={false} />
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Facebook Page</Text>
        <Textinput placeholder='Username' defaultValue={facebook} onChangeText={value => setFacebook(value)} containerStyle={Spacing.superSmallTopSpacing} renderErrorMessage={false} />
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Twitter Profile</Text>
        <Textinput placeholder='@twitter_handle' defaultValue={twitter} onChangeText={value => setTwitter(value)} containerStyle={Spacing.superSmallTopSpacing} renderErrorMessage={false} />
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Instagram Page</Text>
        <Textinput placeholder='@insta_page' defaultValue={insta} onChangeText={value => setInsta(value)} containerStyle={Spacing.superSmallTopSpacing} renderErrorMessage={false} />

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
  addItemButtonContainer: {
    borderRadius: moderateScale(20),
  },
  addItemButton: {
    borderRadius: moderateScale(20),
    paddingHorizontal: scale(9),
  },
  addItemText: {
    marginLeft: scale(8),
    paddingRight: scale(8),
    color: colours.darkGray,
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
    marginBottom: verticalScale(32),
    alignSelf: 'center',
  },
});

export default OB6Shelter;
