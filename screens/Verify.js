import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import LongRoundButton from './components/LongRoundButton';
import TextInput from './components/TextInput';
import {scale, verticalScale, moderateScale, SCREEN} from '../assets/dimensions';
import {Spacing, TextStyles} from '../assets/styles';

import GirlWithPhone from '../assets/images/verification.svg';
import MYFlag from '../assets/images/myFlag.svg';

const Verify = ({navigation}) => {
  const userUID = auth().currentUser.uid;
  const userRef = database().ref(`/users/${userUID}`);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [disabled, setDisabled] = useState(true);

  const checkPhoneNumber = number => {
    let parsedNumber = number.substr(3);
    if (parsedNumber.length >= 9) {
      if (/^\d+$/.test(parsedNumber)) setDisabled(false);
    } else setDisabled(true);
    setPhoneNumber(parsedNumber);
  };

  const handleVerify = () => {
    const countryCode = '+60';
    const parsedNumber = countryCode.concat(phoneNumber);
    navigation.navigate('SMSConfirmation', {phoneNumber: parsedNumber});
  };

  const handleSkip = () => {
    userRef.update({verified: false});
    navigation.navigate('AppNavigation');
  };

  return (
    <ScrollView style={styles.body}>
      <View style={styles.container}>
        <Text style={TextStyles.h1}>Verify yourself, or do it later</Text>
        <Text style={TextStyles.h3}>Enter your phone number and wait for our SMS.</Text>
        <View style={styles.contentContainer}>
          <GirlWithPhone width={scale(187)} height={verticalScale(230)} />
          <View style={styles.rowContainer}>
            <View style={styles.flag}>
              <MYFlag width={scale(28)} height={verticalScale(20)} />
            </View>
            <TextInput
              placeholder='Eg. 011-xxxxxxxx'
              value={`+60${phoneNumber}`}
              onChangeText={value => checkPhoneNumber(value)}
              textContentType='telephoneNumber'
              keyboardType='numeric'
              renderErrorMessage={false}
              containerStyle={{flex: 9}}
            />
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <LongRoundButton title='SEND SMS' onPress={handleVerify} disabled={disabled} containerStyle={styles.button} />
        <Text onPress={handleSkip} style={styles.skipText}>
          SKIP
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    marginTop: verticalScale(32),
    paddingHorizontal: scale(24),
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: verticalScale(32),
  },
  rowContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(24),
    alignItems: 'center',
  },
  flag: {
    flex: 1,
    marginRight: scale(8),
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(10),
    elevation: 1,
    borderRadius: moderateScale(5),
  },
  bottomContainer: {
    marginTop: verticalScale(56),
    alignItems: 'center',
  },
  skipText: {
    marginTop: verticalScale(8),
    fontSize: moderateScale(12),
    textDecorationLine: 'underline',
  },
});

export default Verify;
