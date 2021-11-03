import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, StyleSheet, ToastAndroid, Alert, Linking} from 'react-native';
import {Switch} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import OneSignalNotif from '../utils/OneSignalNotif';
import LongRoundButton from './components/LongRoundButton';
import colours from '../assets/colours';
import {scale, verticalScale} from '../assets/dimensions';
import {Spacing, TextStyles} from '../assets/styles';

const Settings = ({navigation, user}) => {
  const {settings} = user;
  const userUID = auth().currentUser.uid;
  const userRef = database().ref(`users/${userUID}`);

  const [isPrivate, setIsPrivate] = useState(user ? user.private : false);
  const [showLiked, setShowLiked] = useState(settings ? settings.showLiked : false);
  const [showDisliked, setShowDisliked] = useState(settings ? settings.showDisliked : false);
  const [messagesNotif, setMessagesNotif] = useState(settings ? settings.messagesNotif : false);
  const [requestsNotif, setRequestsNotif] = useState(settings ? settings.requestsNotif : false);
  const [postsNotif, setPostsNotif] = useState(settings ? settings.postsNotif : false);

  const verifyAccount = () => {
    if (user.verified) {
      ToastAndroid.show('You are already verified!', ToastAndroid.SHORT);
    } else navigation.navigate('Verify');
  };

  const updateSettings = (settings, state) => {
    userRef.child(`settings/${settings}`).set(state);
  };

  const handlePolicyLink = () => {
    Linking.openURL('https://pet-adoption.flycricket.io/privacy.html');
  };

  const handleUpdateApp = () => {
    ToastAndroid.show('You are on the latest version!', ToastAndroid.SHORT);
  };

  const onLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {text: 'Cancel'},
        {
          text: 'Yes',
          onPress: () => {
            OneSignalNotif().removeUserNotificationId();
            auth().signOut();
          },
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  return (
    <ScrollView style={styles.body}>
      <View style={styles.container}>
        <Text style={styles.category}>Account</Text>
        <Text style={[styles.label, Spacing.smallTopSpacing]}>Email</Text>
        <Text style={styles.desc}>{auth().currentUser.email}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')}>
          <Text style={[styles.label, Spacing.smallTopSpacing]}>Password</Text>
          <Text style={styles.desc}>Change your account password.</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={verifyAccount}>
          <Text style={[styles.label, Spacing.smallTopSpacing]}>Account Verification</Text>
          <Text style={styles.desc}>Verify your account to get a badge.</Text>
        </TouchableOpacity>
        <Text style={styles.category}>General</Text>
        <View style={styles.rowContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Private Account</Text>
            <Text style={styles.desc}>Set your account to private to filter messages.</Text>
          </View>
          <Switch
            value={isPrivate}
            onValueChange={() => {
              setIsPrivate(!isPrivate);
              userRef.child(`private`).set(!isPrivate);
            }}
            color='black'
            trackColor={{false: colours.mediumGray, true: colours.darkGray}}
            thumbColor={isPrivate ? colours.black : colours.lightGray}
          />
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Show Liked Pets</Text>
            <Text style={styles.desc}>Pets you already liked show up again.</Text>
          </View>
          <Switch
            value={showLiked}
            onValueChange={() => {
              setShowLiked(!showLiked);
              updateSettings('showLiked', !showLiked);
            }}
            color='black'
            trackColor={{false: colours.mediumGray, true: colours.darkGray}}
            thumbColor={showLiked ? colours.black : colours.lightGray}
          />
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Show Disliked Pets</Text>
            <Text style={styles.desc}>Pets you already disliked show up again.</Text>
          </View>
          <Switch
            value={showDisliked}
            onValueChange={() => {
              setShowDisliked(!showDisliked);
              updateSettings('showDisliked', !showDisliked);
            }}
            trackColor={{false: colours.mediumGray, true: colours.darkGray}}
            thumbColor={showDisliked ? colours.black : colours.lightGray}
          />
        </View>
        <Text style={styles.category}>Notifications</Text>
        <TouchableOpacity onPress={() => Linking.openSettings()}>
          <Text style={[styles.label, Spacing.smallTopSpacing]}>Manage Notifications</Text>
          <Text style={styles.desc}>Decide what we notify you about.</Text>
        </TouchableOpacity>
        <Text style={styles.category}>About</Text>
        <TouchableOpacity onPress={handlePolicyLink}>
          <Text style={[styles.label, Spacing.smallTopSpacing]}>Terms and Policy</Text>
          <Text style={styles.desc}>Read our terms and policy.</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleUpdateApp}>
          <Text style={[styles.label, Spacing.smallTopSpacing]}>App Version</Text>
          <Text style={styles.desc}>Version 1.0</Text>
        </TouchableOpacity>
      </View>
      <LongRoundButton title='LOGOUT' onPress={onLogout} containerStyle={styles.button} />
    </ScrollView>
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
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    ...Spacing.smallTopSpacing,
  },
  textContainer: {
    flex: 1,
  },
  category: {
    ...TextStyles.h3,
    ...Spacing.smallTopSpacing,
    fontWeight: 'bold',
  },
  label: {
    ...TextStyles.h4,
  },
  desc: {
    ...TextStyles.h4,
    color: colours.mediumGray,
  },
  button: {
    ...Spacing.mediumVerticalSpacing,
    alignSelf: 'center',
  },
});

export default Settings;
