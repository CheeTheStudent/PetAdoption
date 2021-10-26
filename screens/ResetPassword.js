import React, {useState} from 'react';
import {View, Text, ToastAndroid, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

import TextInput from './components/TextInput';
import LongRoundButton from './components/LongRoundButton';
import {TextStyles, Spacing} from '../assets/styles';
import {scale, verticalScale} from '../assets/dimensions';
import colours from '../assets/colours';

const ResetPassword = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const emailChecker = (input: String) => {
    setEmail(input);

    if (input.trim() == '') {
      setEmailError(null);
      return false;
    }

    let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!pattern.test(String(input).toLowerCase())) {
      setEmailError('Invalid email');
      return false;
    } else {
      setEmailError(null);
      return true;
    }
  };

  const handleResetPassword = () => {
    if (!emailChecker(email)) return;

    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        ToastAndroid.show('Email sent!', ToastAndroid.SHORT);
        navigation.navigate('Authentication');
      })
      .catch(error => {
        ToastAndroid.show('Email failed to send, try again.', ToastAndroid.SHORT);
        console.error(error);
      });
  };

  return (
    <View style={styles.body}>
      <Text style={[TextStyles.h1, styles.title]}>Password Reset</Text>
      <Text style={[TextStyles.h4, styles.text]}>An email will be sent to you to reset your password</Text>
      <TextInput
        placeholder='Enter your email'
        returnKeyType='next'
        onChangeText={email => emailChecker(email)}
        defaultValue={email}
        errorMessage={emailError}
        inputContainerStyle={styles.inputContainer}
      />
      <LongRoundButton title='RESET PASSWORD' onPress={handleResetPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    alignSelf: 'center',
    marginBottom: verticalScale(8),
  },
  text: {
    alignSelf: 'center',
    textAlign: 'center',
    marginHorizontal: scale(16),
    marginBottom: verticalScale(24),
  },
  inputContainer: {
    marginHorizontal: scale(16),
    marginBottom: verticalScale(16),
  },
});

export default ResetPassword;
