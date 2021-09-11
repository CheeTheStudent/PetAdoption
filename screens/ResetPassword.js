import React, { useState } from 'react';
import { View, Text, ToastAndroid, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { LoginButton, AccessToken } from 'react-native-fbsdk-next';
import Icon from 'react-native-vector-icons/Ionicons';

import LongRoundButton from './components/LongRoundButton';
import { TextStyles } from '../assets/constants/styles';
import colours from '../assets/colours/colours';

const ResetPassword = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const emailChecker = (input: String) => {
    setEmail(input);

    if (input.trim() == "") {
      setEmailError(null);
      return false;
    }

    let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!pattern.test(String(input).toLowerCase())) {
      setEmailError("Invalid email");
      return false;
    }
    else {
      setEmailError(null);
      return true;
    }
  };

  const handleResetPassword = () => {
    if (!emailChecker(email)) return;

    auth().sendPasswordResetEmail(email)
      .then(() => {
        ToastAndroid.show("Email sent!", ToastAndroid.SHORT);
        navigation.navigate("Authentication");
      })
      .catch(error => {
        ToastAndroid.show("Email failed to send, try again.", ToastAndroid.SHORT);
        console.error(error);
      });
  };

  return (
    <View style={styles.body}>
      <Text style={styles.title}>Password Reset</Text>
      <Text style={[TextStyles.h3, styles.text]}>An email will be sent to you to reset your password</Text>
      <Input
        placeholder="Enter your email"
        returnKeyType="next"
        onChangeText={email => emailChecker(email)}
        defaultValue={email}
        errorMessage={emailError}
        inputContainerStyle={styles.textInput}
        errorStyle={styles.textInputError} />
      <LongRoundButton title="RESET PASSWORD" onPress={handleResetPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    alignSelf: 'center',
    fontSize: 24,
    fontFamily: 'Roboto-Regular',
    marginBottom: 16,
  },
  text: {
    alignSelf: 'center',
    marginBottom: 32,
  },
  textInput: {
    height: 56,
    marginHorizontal: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: colours.mediumGray,
  },
  textInputError: {
    marginHorizontal: 16,
  },
  forgotPasswordText: {
    alignSelf: 'flex-end',
    marginRight: 32,
    marginBottom: 32,
  }
});

export default ResetPassword;