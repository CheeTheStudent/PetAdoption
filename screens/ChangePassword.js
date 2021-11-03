import React, {useState, useRef, useEffect, useLayoutEffect} from 'react';
import {View, Text, ToastAndroid, StyleSheet, ActivityIndicator} from 'react-native';
import {Icon} from 'react-native-elements';
import auth from '@react-native-firebase/auth';

import TextInput from './components/TextInput';
import LongRoundButton from './components/LongRoundButton';
import {TextStyles, Spacing} from '../assets/styles';
import {moderateScale, scale, verticalScale, SCREEN} from '../assets/dimensions';
import colours from '../assets/colours';

const ChangePassword = ({navigation}) => {
  const newPasswordInput = useRef();
  const rePasswordInput = useRef();

  const [currPassword, setCurrPassword] = useState('');
  const [newPswd, setNewPswd] = useState('');
  const [rePswd, setRePswd] = useState('');
  const [currPswdError, setCurrPswdError] = useState('');
  const [newPswdError, setNewPswdError] = useState('');
  const [rePswdError, setRePswdError] = useState('');
  const [showCurrPassword, setShowCurrPassword] = useState(true);
  const [showNewPswd, setShowNewPswd] = useState(true);
  const [showRePswd, setShowRePswd] = useState(true);
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={Spacing.smallLeftSpacing}>
          <Icon name='arrow-left' type='material-community' size={moderateScale(24)} onPress={() => navigation.navigate('Settings')} />
        </View>
      ),
    });
  }, []);

  const pswdChecker = (input: String) => {
    setNewPswd(input);

    if (input.trim() == '') {
      setNewPswdError(null);
      return false;
    }

    if (input.length < 8 || input.length > 16) {
      setNewPswdError('Password should be 8-16 characters long');
      return false;
    }
    setNewPswdError(null);
    return true;
  };

  const rePswdChecker = (input: String) => {
    setRePswd(input);

    if (input.trim() == '') {
      setRePswdError(null);
      return false;
    }

    if (input !== newPswd) {
      setRePswdError('Password does not match above password.');
      return false;
    }
    setRePswdError(null);
    return true;
  };

  const handleChangePassword = () => {
    if (!(currPassword && pswdChecker(newPswd) && rePswdChecker(rePswd))) return;
    setLoading(true);
    const credentials = auth.EmailAuthProvider.credential(auth().currentUser.email, currPassword);

    auth()
      .currentUser.reauthenticateWithCredential(credentials)
      .then(() => {
        auth().currentUser.updatePassword(newPswd);
        ToastAndroid.show('Successfully changed!', ToastAndroid.SHORT);
        navigation.navigate('Settings');
      })
      .catch(error => {
        ToastAndroid.show('Password change failed, try again.', ToastAndroid.SHORT);
        console.error(error);
      });
    setLoading(false);
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Text style={TextStyles.h4}>Current Password</Text>
        <TextInput
          placeholder='Enter current password'
          secureTextEntry={showCurrPassword}
          returnKeyType='next'
          onChangeText={value => setCurrPassword(value)}
          errorMessage={currPswdError}
          rightIcon={<Icon name='eye' type='ionicon' size={moderateScale(30)} color={colours.mediumGray} onPress={() => setShowCurrPassword(!showCurrPassword)} />}
          onSubmitEditing={() => newPasswordInput.current.focus()}
          blurOnSubmit={false}
          inputContainerStyle={styles.inputContainer}
        />
        <Text style={TextStyles.h4}>New Password</Text>
        <TextInput
          compRef={newPasswordInput}
          placeholder='Enter new password'
          secureTextEntry={showNewPswd}
          returnKeyType='next'
          onChangeText={value => pswdChecker(value)}
          errorMessage={newPswdError}
          rightIcon={<Icon name='eye' type='ionicon' size={moderateScale(30)} color={colours.mediumGray} onPress={() => setShowNewPswd(!showNewPswd)} />}
          onSubmitEditing={() => rePasswordInput.current.focus()}
          blurOnSubmit={false}
          inputContainerStyle={styles.inputContainer}
        />
        <Text style={TextStyles.h4}>Re-type Password</Text>
        <TextInput
          compRef={rePasswordInput}
          placeholder='Re-type password'
          secureTextEntry={showRePswd}
          returnKeyType='done'
          onChangeText={value => rePswdChecker(value)}
          errorMessage={rePswdError}
          rightIcon={<Icon name='eye' type='ionicon' size={moderateScale(30)} color={colours.mediumGray} onPress={() => setShowRePswd(!showRePswd)} />}
          inputContainerStyle={styles.inputContainer}
        />
      </View>
      <LongRoundButton title='SAVE CHANGES' onPress={handleChangePassword} containerStyle={styles.button} />
      <ActivityIndicator animating={loading} size={50} color='black' style={styles.loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
  },
  text: {
    alignSelf: 'center',
    textAlign: 'center',
    marginHorizontal: scale(16),
    marginBottom: verticalScale(24),
  },
  inputContainer: {
    ...Spacing.superSmallTopSpacing,
  },
  button: {
    alignSelf: 'center',
  },
  loading: {
    position: 'absolute',
    top: SCREEN.HEIGHT / 2 - 25 - 50,
    left: SCREEN.WIDTH / 2 - 25,
  },
});

export default ChangePassword;
