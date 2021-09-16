import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ToastAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { LoginButton, AccessToken } from 'react-native-fbsdk-next';
import Icon from 'react-native-vector-icons/Ionicons';

import TextInput from './components/TextInput';
import LongRoundButton from './components/LongRoundButton';
import colours from '../assets/colours';
import { TextStyles, Spacing } from '../assets/styles';
import { verticalScale, scale } from '../assets/dimensions';

const Login = ({ navigation }) => {

  const passwordInput = useRef();

  const [showPassword, setShowPassword] = useState(true);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [pswd, setPswd] = useState('');
  const [pswdError, setPswdError] = useState('');

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleFocusNext = () => {
    passwordInput.current.focus();
  };

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

  const pswdChecker = (input: String) => {
    setPswd(input);

    if (input.trim() == "") {
      setPswdError(null);
      return false;
    }

    if (input.length < 8 || input.length > 16) {
      setPswdError("Password should be 8-16 characters long");
      return false;
    }
    setPswdError(null);
    return true;
  };

  const handleSignIn = () => {
    if (!(emailChecker(email) && pswdChecker(pswd))) return;

    auth()
      .signInWithEmailAndPassword(email, pswd)
      .then(() => { ToastAndroid.show("Logging in..", ToastAndroid.SHORT); })
      .catch(error => {
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
          setEmailError("Incorrect email or password");
        }
        console.error(error);
      });
  };

  const handleResetPassword = () => {
    navigation.navigate("ResetPassword");
  };

  return (
    <View style={styles.body}>
      <Text style={[TextStyles.h1, styles.title]}>Log In</Text>
      <TextInput
        placeholder="Enter your email"
        returnKeyType="next"
        onChangeText={email => emailChecker(email)}
        defaultValue={email}
        errorMessage={emailError}
        onSubmitEditing={handleFocusNext}
        blurOnSubmit={false}
        inputContainerStyle={Spacing.smallHorizontalSpacing}
        errorStyle={Spacing.smallHorizontalSpacing} />
      <TextInput
        compRef={passwordInput}
        placeholder="Enter your password"
        secureTextEntry={showPassword}
        returnKeyType="go"
        onChangeText={pswd => pswdChecker(pswd)}
        defaultValue={pswd}
        errorMessage={pswdError}
        rightIcon={<Icon name="eye" size={30} color={colours.mediumGray} onPress={handlePasswordToggle} />}
        inputContainerStyle={Spacing.smallHorizontalSpacing}
        errorStyle={Spacing.smallHorizontalSpacing} />
      <Text style={[TextStyles.desc, styles.forgotPasswordText]} onPress={handleResetPassword}>Forgot Password?</Text>
      <LongRoundButton title="LOG IN" onPress={handleSignIn} />
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
    marginBottom: verticalScale(32),
  },
  forgotPasswordText: {
    alignSelf: 'flex-end',
    marginRight: scale(16),
    marginBottom: verticalScale(32),
  }
});

export default Login;