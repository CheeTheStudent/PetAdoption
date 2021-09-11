import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Linking } from 'react-native';
import { Input, Button, CheckBox } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

import { TextStyles } from '../assets/constants/styles';
import colours from '../assets/colours/colours';

const screenWidth = Dimensions.get('window').width;

const SignUp = ({ navigation }) => {

  const passwordInput = useRef();
  const rePasswordInput = useRef();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [pswd, setPswd] = useState('');
  const [pswdError, setPswdError] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [rePswd, setRePswd] = useState('');
  const [rePswdError, setRePswdError] = useState('');
  const [showRePassword, setShowRePassword] = useState(true);
  const [policyCheck, setPolicyCheck] = useState(false);
  const [policyError, setPolicyError] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleRePasswordToggle = () => {
    setShowRePassword(!showRePassword);
  };

  const handlePolicyLink = () => {
    Linking.openURL('https://pet-adoption.flycricket.io/privacy.html');
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

  const rePswdChecker = (input: String) => {
    setRePswd(input);

    if (input.trim() == "") {
      setRePswdError(null);
      return false;
    }

    if (input !== pswd) {
      setRePswdError("Password does not match above password.");
      return false;
    }
    setRePswdError(null);
    return true;
  };

  const handleSignUp = () => {
    if (!(emailChecker(email) && pswdChecker(pswd) && rePswdChecker(rePswd) && policyCheck)) {
      if (!policyCheck)
        setPolicyError(true);
      return;
    }

    auth()
      .createUserWithEmailAndPassword(email, pswd)
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          setEmailError('That email address is already in use');
        }

        if (error.code === 'auth/invalid-email') {
          setEmailError('That email address is invalid');
        }
        console.error(error);
      });
  };

  return (
    <View style={styles.body}>
      <Text style={styles.title}>Create an Account</Text>
      <Input
        placeholder="Enter your email"
        returnKeyLabel="next"
        onChangeText={email => emailChecker(email)}
        defaultValue={email}
        errorMessage={emailError}
        onSubmitEditing={() => passwordInput.current.focus()}
        blurOnSubmit={false}
        inputContainerStyle={styles.textInput}
        errorStyle={styles.textInputError} />
      <Input
        ref={passwordInput}
        placeholder="Enter your password"
        secureTextEntry={showPassword}
        returnKeyLabel="next"
        onChangeText={pswd => pswdChecker(pswd)}
        defaultValue={pswd}
        errorMessage={pswdError}
        rightIcon={<Icon name="eye" size={30} color={colours.mediumGray} onPress={handlePasswordToggle} />}
        onSubmitEditing={() => rePasswordInput.current.focus()}
        blurOnSubmit={false}
        inputContainerStyle={styles.textInput}
        errorStyle={styles.textInputError} />
      <Input
        ref={rePasswordInput}
        placeholder="Re-type password"
        secureTextEntry={showRePassword}
        returnKeyLabel="go"
        onChangeText={rePswd => rePswdChecker(rePswd)}
        defaultValue={rePswd}
        errorMessage={rePswdError}
        rightIcon={<Icon name="eye" size={30} color={colours.mediumGray} onPress={handleRePasswordToggle} />}
        inputContainerStyle={styles.textInput}
        errorStyle={styles.textInputError} />
      <View style={styles.policyContainer}>
        <Text>I have read the </Text>
        <Text style={styles.privacyPolicyText} onPress={handlePolicyLink}>Privacy Policy</Text>
        <Text style={[styles.privacyPolicyError, policyError ? { opacity: 1 } : { opacity: 0 }]}> *</Text>
        <CheckBox
          checked={policyCheck}
          onPress={() => {
            setPolicyCheck(!policyCheck);
            setPolicyError(null);
          }}
          containerStyle={styles.checkBox}
        />
      </View>
      <Button title="CREATE ACCOUNT" buttonStyle={styles.button} titleStyle={styles.buttonText} containerStyle={styles.buttonContainer} onPress={handleSignUp} />
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
  policyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 32,
    marginBottom: 32,
  },
  privacyPolicyText: {
    fontWeight: 'bold',
  },
  checkBox: {
    padding: 0,
  },
  privacyPolicyError: {
    fontWeight: 'bold',
    color: 'red',
  },
  button: {
    height: 48,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colours.mediumGray,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    color: colours.black,
  },
  buttonContainer: {
    marginHorizontal: 32,
    borderRadius: 30,
  }

});

export default SignUp;