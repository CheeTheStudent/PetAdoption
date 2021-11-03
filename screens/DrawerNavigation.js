import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Pressable, Alert} from 'react-native';
import {Avatar, Icon} from 'react-native-elements';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import AppNavigation from './AppNavigation';
import OwnerProfile from './OwnerProfile';
import LikedPets from './LikedPets';
import Tags from './onboarding screens/OB4Tags';
import Bookmarks from './Bookmarks';
import Settings from './Settings';
import ChangePassword from './ChangePassword';
import Loading from './components/Loading';
import OneSignalNotif from '../utils/OneSignalNotif';
import {Spacing, TextStyles} from '../assets/styles';
import {moderateScale, verticalScale, scale, SCREEN} from '../assets/dimensions';
import colours from '../assets/colours';

const DrawerNavigation = () => {
  const Drawer = createDrawerNavigator();

  const userUID = auth().currentUser.uid;
  const userRef = database().ref(`users/${userUID}`);
  const [user, setUser] = useState();

  useEffect(() => {
    let thisUserRef = userRef.on('value', snapshot => {
      const userData = snapshot.val() ? snapshot.val() : {};
      setUser({id: snapshot.key, ...userData});
    });

    return () => userRef.off('value', thisUserRef);
  }, []);

  const navigateTo = screen => {
    console.log(screen);
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

  if (!user) return <Loading />;

  const CustomDrawerContent = props => {
    const {navigation} = props;
    return (
      <DrawerContentScrollView {...props}>
        <Pressable onPress={() => navigation.navigate('Profile')} style={styles.header}>
          <View style={[styles.rowContainer, Spacing.smallTopSpacing]}>
            <Avatar
              rounded
              size={moderateScale(70)}
              source={
                user.profilePic
                  ? {
                      uri: user.profilePic,
                    }
                  : require('../assets/images/placeholder.png')
              }
            />
          </View>
          <Text style={[TextStyles.h2, Spacing.superSmallTopSpacing]}>{user.name}</Text>
          <Text style={TextStyles.h4}>{user.role}</Text>
        </Pressable>
        <DrawerItem label='Profile' icon={() => <Icon name='person' type='ionicon' />} onPress={() => navigation.navigate('Profile')} />
        <DrawerItem label='Liked Pets' icon={() => <Icon name='heart' type='ionicon' />} onPress={() => navigation.navigate('LikedPets')} />
        <DrawerItem label='Tags' icon={() => <Icon name='pricetag' type='ionicon' />} onPress={() => navigation.navigate('Tags')} />
        <DrawerItem label='Bookmarks' icon={() => <Icon name='bookmark' type='ionicon' />} onPress={() => navigation.navigate('Bookmarks')} />
        <DrawerItem label='Settings' icon={() => <Icon name='settings-sharp' type='ionicon' />} onPress={() => navigation.navigate('Settings')} />
        <DrawerItem label='Log out' icon={() => <Icon name='exit' type='ionicon' />} onPress={onLogout} />
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer.Navigator
      screenOptions={({navigation}) => ({
        headerShown: false,
        headerLeft: () => (
          <View style={Spacing.smallLeftSpacing}>
            <Icon name='arrow-left' type='material-community' size={moderateScale(24)} onPress={() => navigation.goBack()} />
          </View>
        ),
        drawerStyle: {
          width: SCREEN.WIDTH * 0.7,
        },
      })}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name='AppNavigation' children={props => <AppNavigation user={user} {...props} />} options={{unmountOnBlur: false}} />
      <Drawer.Screen name='Profile' component={OwnerProfile} options={{unmountOnBlur: true}} />
      <Drawer.Screen name='LikedPets' component={LikedPets} options={{headerShown: true, title: 'Liked Pets', unmountOnBlur: true}} />
      <Drawer.Screen name='Tags' children={props => <Tags user={user} {...props} />} options={{headerShown: true, title: 'Tags', unmountOnBlur: true}} />
      <Drawer.Screen name='Bookmarks' component={Bookmarks} options={{headerShown: true, unmountOnBlur: true}} />
      <Drawer.Screen name='Settings' children={props => <Settings user={user} {...props} />} options={{headerShown: true, unmountOnBlur: true}} />
      <Drawer.Screen name='ChangePassword' component={ChangePassword} options={{headerShown: true, title: 'Change Password', unmountOnBlur: true}} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(24),
    marginBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: colours.mediumGray,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default DrawerNavigation;
