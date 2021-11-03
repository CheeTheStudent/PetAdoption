import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ToastAndroid, Alert, BackHandler, ActivityIndicator} from 'react-native';
import {Avatar, Button, Icon} from 'react-native-elements';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

import OB5Screening from './onboarding screens/OB5Screening';
import OB6Shelter from './onboarding screens/OB6Shelter';
import MediaPicker from './components/MediaPicker';
import {SCREEN, verticalScale, scale, moderateScale} from '../assets/dimensions';
import {TextStyles, Spacing} from '../assets/styles';
import colours from '../assets/colours';

const ProfileForm = ({navigation, route}) => {
  const {user} = route.params || {};
  const userUID = auth().currentUser.uid;
  const userRef = database().ref(`users/${userUID}`);
  const userStore = storage().ref(`users/${userUID}`);

  const [profilePic, setProfilePic] = useState(user.profilePic ? [user.profilePic] : null);
  const [banner, setBanner] = useState(user.banner ? [user.banner] : null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => backHandler.remove();
  }, []);

  const handleBackButton = () => {
    Alert.alert('Discard Changes?', 'Are you sure you want to leave? Your progress will be lost.', [{text: 'Cancel'}, {text: "Yes, I'm sure", onPress: () => navigation.goBack()}], {
      cancelable: true,
    });
    return true;
  };

  const handleSaveProfile = async info => {
    setLoading(true);
    await userRef.update(info);

    const existingProfile = await userStore.listAll();
    if (existingProfile.items.length > 0) {
      if (!profilePic) {
        const existingProfilePic = existingProfile.items.find(pic => pic.fullPath.includes('profilePic'));
        if (existingProfilePic) {
          storage().ref(existingProfilePic.fullPath).delete();
          userRef.child('profilePic').remove();
        }
      }
      if (!banner) {
        const existingBanner = existingProfile.items.find(pic => pic.fullPath.includes('banner'));
        if (existingBanner) {
          storage().ref(existingBanner.fullPath).delete();
          userRef.child('banner').remove();
        }
      }
    }

    const profilePicStore = userStore.child('profilePic');
    if (profilePic) {
      if (!profilePic[0].startsWith('https://firebasestorage')) {
        await profilePicStore.putFile(profilePic[0]);
        const url = await profilePicStore.getDownloadURL();
        await userRef.update({
          profilePic: url,
        });
      }
    }

    const bannerStore = userStore.child('banner');
    if (banner) {
      if (!banner[0].startsWith('https://firebasestorage')) {
        await bannerStore.putFile(banner[0]);
        const url = await bannerStore.getDownloadURL();
        await userRef.update({
          banner: url,
        });
      }
    }
    setLoading(false);
    ToastAndroid.show('Profile Updated!', ToastAndroid.SHORT);
    navigation.goBack();
  };

  return (
    <View style={styles.body}>
      <ScrollView style={styles.body}>
        <View style={styles.header}>
          <View style={styles.profileTop}>
            <Image source={banner ? {uri: banner[0]} : require('../assets/images/banner.png')} style={styles.banner} />
            <View style={[styles.banner, styles.bannerOverlay]}>
              <MediaPicker profilePicture profilePictureSize={moderateScale(32)} setChosenMedia={setBanner} />
            </View>
            <Avatar rounded size={moderateScale(75)} source={profilePic ? {uri: profilePic[0]} : require('../assets/images/placeholder.png')} containerStyle={styles.profilePicture} />
            <View style={[styles.profilePicture, styles.profilePicOverlay]}>
              <MediaPicker profilePicture setChosenMedia={setProfilePic} />
            </View>
          </View>
          <TouchableOpacity style={styles.fab} onPress={handleBackButton}>
            <Icon name='arrow-back' type='ionicon' size={moderateScale(24)} color='white' />
          </TouchableOpacity>
        </View>
        {user.role === 'Shelter' || user.role === 'Rescuer' ? <OB6Shelter navigation={navigation} user={user} onSave={handleSaveProfile} /> : <OB5Screening user={user} onSave={handleSaveProfile} />}
      </ScrollView>
      <ActivityIndicator animating={loading} size={50} color='black' style={styles.loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: 'white',
  },
  profileTop: {
    height: SCREEN.HEIGHT * 0.2 + verticalScale(37.5),
  },
  banner: {
    height: SCREEN.HEIGHT * 0.2,
    width: SCREEN.WIDTH,
  },
  bannerOverlay: {
    height: SCREEN.HEIGHT * 0.2,
    width: SCREEN.WIDTH,
    position: 'absolute',
    backgroundColor: colours.blackTransparent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicture: {
    position: 'absolute',
    bottom: 0,
    left: scale(12),
    borderWidth: moderateScale(2),
    borderColor: 'white',
  },
  profilePicOverlay: {
    width: moderateScale(75),
    aspectRatio: 1,
    borderRadius: moderateScale(37.5),
    backgroundColor: colours.blackTransparent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    width: verticalScale(32),
    aspectRatio: 1,
    position: 'absolute',
    top: verticalScale(16),
    left: scale(16),
    justifyContent: 'center',
    borderRadius: verticalScale(16),
    backgroundColor: colours.blackTransparent,
  },
  loading: {
    position: 'absolute',
    bottom: SCREEN.HEIGHT / 2 - 25,
    left: SCREEN.WIDTH / 2 - 25,
  },
});

export default ProfileForm;
