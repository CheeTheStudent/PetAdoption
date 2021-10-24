import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {Avatar, Icon} from 'react-native-elements';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import AppNavigation from './AppNavigation';
import OwnerProfile from './OwnerProfile';
import Loading from './components/Loading';
import OneSignalNotif from '../utils/OneSignalNotif';
import {Spacing, TextStyles} from '../assets/styles';
import {moderateScale, verticalScale, scale} from '../assets/dimensions';
import colours from '../assets/colours';

const DrawerNavigation = () => {
  const Drawer = createDrawerNavigator();

  const userUID = auth().currentUser.uid;
  const userRef = database().ref(`users/${userUID}`);
  const [user, setUser] = useState();

  useEffect(() => {
    userRef.on('value', snapshot => {
      const userData = snapshot.val() ? snapshot.val() : {};
      setUser({id: snapshot.key, ...userData});
    });

    return () => userRef.off();
  }, []);

  const navigateTo = screen => {
    console.log(screen);
  };

  const onLogout = () => {
    OneSignalNotif().removeUserNotificationId();
    auth().signOut();
  };

  if (!user) return <Loading />;

  const CustomDrawerContent = props => {
    const {navigation} = props;
    return (
      <DrawerContentScrollView {...props}>
        <Pressable onPress={() => navigation.jumpTo('Profile')} style={styles.header}>
          <View style={styles.rowContainer}>
            <Avatar
              rounded
              size={moderateScale(44)}
              source={
                user.profilePic
                  ? {
                      uri: user.profilePic,
                    }
                  : require('../assets/images/placeholder.png')
              }
            />
            <Icon name='exit-outline' type='ionicon' onPress={onLogout} />
          </View>
          <Text style={TextStyles.h2}>{user.name}</Text>
          <Text style={TextStyles.h4}>{user.role}</Text>
        </Pressable>
        <DrawerItem label='Profile' icon={() => <Icon name='person' type='ionicon' />} onPress={() => navigation.jumpTo('Profile')} />
        <DrawerItem label='Liked Pets' icon={() => <Icon name='heart' type='ionicon' />} onPress={() => navigateTo('LikedPets')} />
        <DrawerItem label='Tags' icon={() => <Icon name='pricetag' type='ionicon' />} onPress={() => navigateTo('Tags')} />
        <DrawerItem label='Screening' icon={() => <Icon name='clipboard-list' type='font-awesome-5' />} onPress={() => navigateTo('Tags')} />
        <DrawerItem label='Settings' icon={() => <Icon name='settings-sharp' type='ionicon' />} onPress={() => navigateTo('Tags')} />
        <DrawerItem label='About' icon={() => <Icon name='info' type='foundation' />} onPress={() => navigateTo('Tags')} />
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer.Navigator screenOptions={{headerShown: false}} drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name='AppNavigation' children={props => <AppNavigation user={user} {...props} />} />
      <Drawer.Screen name='Profile' children={props => <OwnerProfile {...props} />} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(24),
    borderBottomWidth: 1,
    borderBottomColor: colours.mediumGray,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default DrawerNavigation;
