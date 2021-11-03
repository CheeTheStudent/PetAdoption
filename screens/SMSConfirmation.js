import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, ToastAndroid, ActivityIndicator} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import LongRoundButton from './components/LongRoundButton';
import TextInput from './components/TextInput';
import {scale, verticalScale, moderateScale, SCREEN} from '../assets/dimensions';
import {Spacing, TextStyles} from '../assets/styles';

import SMS from '../assets/images/sms.svg';
import colours from '../assets/colours';

const SMSConfirmation = ({navigation, route}) => {
  const {phoneNumber} = route.params;
  const userUID = auth().currentUser.uid;
  const userRef = database().ref(`/users/${userUID}`);

  const [confirm, setConfirm] = useState('');
  const [code, setCode] = useState('');
  const [success, setSuccess] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    const testNumber = '+16085550185'; // Number for testing purposes
    const confirmation = await auth().verifyPhoneNumber(testNumber);
    setConfirm(confirmation.verificationId);
    ToastAndroid.show('SMS Sent!', ToastAndroid.SHORT);
  }, []);

  const verifyCode = async () => {
    if (!confirm) return;
    setLoading(true);
    try {
      const credential = auth.PhoneAuthProvider.credential(confirm, code);
      await auth().currentUser.updatePhoneNumber(credential);
      ToastAndroid.show('Phone Number verified!', ToastAndroid.SHORT);
      await userRef.update({verified: true});
      setLoading(false);
      handleNavigate();
    } catch (error) {
      setLoading(false);
      if (error.code === 'auth/credential-already-in-use') ToastAndroid.show('Phone Number is already associated with another account!', ToastAndroid.SHORT);
      else ToastAndroid.show('An error occured. Please try again later.', ToastAndroid.SHORT);
    }
  };

  const handleSkip = () => {
    userRef.update({verified: false});
    handleNavigate();
  };

  const handleNavigate = () => {
    navigation.navigate('AppNavigation');
  };

  return (
    <ScrollView style={styles.body}>
      <ActivityIndicator animating={loading} size={50} color='blue' style={styles.loading} />
      <View style={styles.container}>
        <Text style={TextStyles.h1}>Almost there!</Text>
        <Text style={TextStyles.h3}>Please enter the verification code sent to {phoneNumber}</Text>
        <View style={styles.contentContainer}>
          <SMS width={scale(262)} height={verticalScale(170)} />
          <OTPInputView
            style={styles.otpInput}
            pinCount={6}
            code={code}
            onCodeChanged={code => setCode(code)}
            autoFocusOnLoad
            selectionColor='black'
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
          />
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <LongRoundButton title='VERIFY' onPress={verifyCode} containerStyle={styles.button} />
        <Text onPress={handleNavigate} style={styles.skipText}>
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
  otpInput: {
    width: '90%',
    height: verticalScale(130),
    color: 'black',
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: colours.lightGray,
    color: 'black',
  },
  underlineStyleHighLighted: {
    borderBottomColor: 'black',
  },
  bottomContainer: {
    marginTop: verticalScale(58),
    alignItems: 'center',
  },
  skipText: {
    marginTop: verticalScale(8),
    fontSize: moderateScale(12),
    textDecorationLine: 'underline',
  },
  loading: {
    position: 'absolute',
    top: SCREEN.HEIGHT / 2 - 25,
    left: SCREEN.WIDTH / 2 - 25,
  },
});

export default SMSConfirmation;
