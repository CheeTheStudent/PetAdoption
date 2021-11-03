import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, Linking} from 'react-native';
import {Avatar, Button, Icon} from 'react-native-elements';
import {MaterialTabBar} from 'react-native-collapsible-tab-view';
import createCollapsibleNavigator from './components/create-collapsible-navigator';
import OptionsMenu from 'react-native-option-menu';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FirebaseMessage from '../utils/FirebaseMessage';

import O1HomeScreen from './owner screens/O1Home';
import O2PetsScreen from './owner screens/O2Pets';
import O3JobsScreen from './owner screens/O3Jobs';
import O4Screening from './owner screens/O4Screening';
import Loading from './components/Loading';
import {SCREEN, verticalScale, scale, moderateScale} from '../assets/dimensions';
import {TextStyles, Spacing} from '../assets/styles';
import colours from '../assets/colours';

const OwnerProfile = ({navigation, route}) => {
  const {ownerId} = route.params || {};
  const userUID = auth().currentUser.uid;
  const profileId = ownerId ? ownerId : userUID;
  const firebaseMessage = FirebaseMessage();

  const userRef = database().ref(`users/${userUID}`);
  const profileRef = database().ref(`users/${profileId}`);
  const petRef = database().ref(`pets`);
  const jobRef = database().ref(`jobs`);
  const postRef = database().ref(`posts`);
  const [user, setUser] = useState();
  const [profile, setProfile] = useState();
  const [isOwner, setIsOwner] = useState();
  const [pets, setPets] = useState();
  const [jobs, setJobs] = useState();
  const [posts, setPosts] = useState();
  const [showContact, setShowContact] = useState(false);
  const [loading, setLoading] = useState(true);
  const [petLoading, setPetLoading] = useState(true);
  const [jobLoading, setJobLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(true);

  const Tab = createCollapsibleNavigator();

  useEffect(() => {
    let thisUserRef = userRef.on('value', snapshot => {
      const userData = snapshot.val() ? snapshot.val() : {};
      setUser({id: snapshot.key, ...userData});
    });

    let thisProfileRef = profileRef.on('value', snapshot => {
      const profileData = snapshot.val() ? snapshot.val() : {};
      setProfile({id: snapshot.key, ...profileData});
      if (profileData.role === 'Shelter' || profileData.role === 'Rescuer') setIsOwner(true);
      else setIsOwner(false);
      setLoading(false);
    });

    let thisPostRef = postRef
      .orderByChild('user/id')
      .equalTo(profileId)
      .on('value', snapshot => {
        const data = snapshot.val() ? snapshot.val() : {};
        let postData = [];
        Object.entries(data).map(value => postData.push({id: value[0], ...value[1]}));
        setPosts(postData);
        setPostLoading(false);
      });

    let thisPetRef = petRef
      .orderByChild('ownerId')
      .equalTo(profileId)
      .on('value', snapshot => {
        if (!snapshot.exists()) return setPetLoading(false);
        else {
          const data = snapshot.val() ? snapshot.val() : {};
          let petData = [];
          Object.entries(data).map(value => value[1].status.status === 'Available' && petData.push({id: value[0], ...value[1]}));
          setPets(petData);
          setPetLoading(false);
        }
      });

    let thisJobRef = jobRef
      .orderByChild('ownerId')
      .equalTo(profileId)
      .on('value', snapshot => {
        if (!snapshot.exists()) return setJobLoading(false);
        else {
          const data = snapshot.val() ? snapshot.val() : {};
          let jobData = [];
          Object.entries(data).map(value => jobData.push({id: value[0], ...value[1]}));
          setJobs(jobData);
          setJobLoading(false);
        }
      });

    return () => {
      profileRef.off('value', thisProfileRef);
      userRef.off('value', thisUserRef);
      petRef.off('value', thisPetRef);
      jobRef.off('value', thisJobRef);
      postRef.off('value', thisPostRef);
    };
  }, []);

  if (loading || petLoading || jobLoading || postLoading) return <Loading type='paw' />;

  const openMaps = (lat, lng) => {
    const url = `geo: ${lat}, ${lng}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  };

  const handleSendMessage = async () => {
    const convoInfo = {
      sender: {id: userUID, name: user.name, image: user.profilePic},
      receiver: {id: profileId, name: profile.name, image: profile.profilePic},
      requestAccepted: profile.private ? false : true,
    };
    const convoId = await firebaseMessage.createConvo(convoInfo);
    navigation.navigate('Chat', {convo: {id: convoId, ...convoInfo}});
  };

  const handleEditProfile = () => {
    navigation.navigate('ProfileForm', {user: profile});
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.profileTop}>
          <Image source={profile.banner ? {uri: profile.banner} : require('../assets/images/banner.png')} style={styles.banner} />
          <Avatar rounded size={moderateScale(75)} source={profile.profilePic ? {uri: profile.profilePic} : require('../assets/images/placeholder.png')} containerStyle={styles.profilePicture} />
          <Button
            title={!ownerId || ownerId === userUID ? 'Edit Profile' : 'Message'}
            onPress={!ownerId || ownerId === userUID ? handleEditProfile : handleSendMessage}
            buttonStyle={styles.profileButton}
            titleStyle={styles.profileButtonText}
            containerStyle={styles.profileButtonContainer}
          />
        </View>
        <View style={styles.profileInfo}>
          <Text style={[TextStyles.h2, Spacing.superSmallTopSpacing]}>{profile.name}</Text>
          {profile.location ? (
            <Text numberOfLines={1} onPress={() => openMaps(profile.location.latitude, profile.location.longitude)} style={TextStyles.desc}>
              <Icon name='location-sharp' type='ionicon' size={moderateScale(12)} />
              {profile.location.address}
            </Text>
          ) : (
            <Text style={styles.lightText}>{profile.role}</Text>
          )}
          {profile.description || profile.screening?.description ? (
            <Text numberOfLines={3} style={[Spacing.superSmallTopSpacing]}>
              {profile.description || profile.screening.description}
            </Text>
          ) : null}
          {isOwner ? (
            <View style={[styles.rowContainer, Spacing.superSmallTopSpacing]}>
              <Text style={styles.lightText}>
                <Text style={styles.darkText}>{pets.length - profile.petsAdopted || 0}</Text> For Adoption
              </Text>
              <Text style={[styles.lightText, Spacing.smallLeftSpacing, {flex: 1}]}>
                <Text style={styles.darkText}>{profile.petsAdopted || 0}</Text> Successfully Adopted
              </Text>
              {profile.phoneNum || profile.email || profile.facebookId || profile.twitterId || profile.instaId ? (
                <Icon name={showContact ? 'chevron-up' : 'chevron-down'} type='ionicon' size={moderateScale(16)} onPress={() => setShowContact(prev => !prev)} />
              ) : null}
            </View>
          ) : null}
          {showContact ? (
            <>
              <Text style={[TextStyles.h4, Spacing.superSmallTopSpacing]}>Contact Us</Text>
              {profile.phoneNum ? (
                <View style={styles.contactRow}>
                  <Icon name='call' type='ionicon' size={moderateScale(20)} style={Spacing.superSmallRightSpacing} />
                  <Text style={TextStyles.desc}>{profile.phoneNum}</Text>
                </View>
              ) : null}
              {profile.email ? (
                <View style={styles.contactRow}>
                  <Icon name='mail' type='ionicon' size={moderateScale(20)} style={Spacing.superSmallRightSpacing} />
                  <Text style={TextStyles.desc}>{profile.email}</Text>
                </View>
              ) : null}
              {profile.facebookId ? (
                <View style={styles.contactRow}>
                  <Icon name='logo-facebook' type='ionicon' size={moderateScale(20)} style={Spacing.superSmallRightSpacing} />
                  <Text style={TextStyles.desc}>{profile.facebookId}</Text>
                </View>
              ) : null}
              {profile.twitterId ? (
                <View style={styles.contactRow}>
                  <Icon name='logo-twitter' type='ionicon' size={moderateScale(20)} style={Spacing.superSmallRightSpacing} />
                  <Text style={TextStyles.desc}>{profile.twitterId}</Text>
                </View>
              ) : null}
              {profile.instaId ? (
                <View style={styles.contactRow}>
                  <Icon name='logo-instagram' type='ionicon' size={moderateScale(20)} style={Spacing.superSmallRightSpacing} />
                  <Text style={TextStyles.desc}>{profile.instaId}</Text>
                </View>
              ) : null}
            </>
          ) : null}
        </View>
        <TouchableOpacity style={styles.fab} onPress={() => navigation.goBack()}>
          <Icon name='arrow-back' type='ionicon' size={moderateScale(24)} color='white' />
        </TouchableOpacity>
        {ownerId && ownerId !== userUID ? (
          <OptionsMenu
            customButton={<Icon name='ellipsis-vertical' type='ionicon' size={moderateScale(24)} color='white' />}
            options={['Report', 'Cancel']}
            actions={[() => navigation.navigate('Report', {issueId: profileId, issueType: 'user'})]}
            style={[styles.fab, styles.fabLeft]}
          />
        ) : null}
      </View>
    );
  };

  return (
    <>
      <Tab.Navigator
        collapsibleOptions={{
          headerHeight: SCREEN.HEIGHT * 0.42,
          headerContainerStyle: {elevation: 0},
          renderTabBar: props => {
            const numOfTabs = isOwner ? 3 : 2;
            return (
              <MaterialTabBar
                indicatorStyle={{backgroundColor: 'black', width: (SCREEN.WIDTH / numOfTabs) * 0.7, left: (SCREEN.WIDTH / numOfTabs) * 0.15}}
                tabStyle={{elevation: 0, borderBottomWidth: 1, borderBottomColor: colours.lightGray}}
                {...props}
              />
            );
          },
          renderHeader,
        }}>
        <Tab.Screen name='ProHome' children={props => <O1HomeScreen posts={posts} {...props} />} options={{title: 'HOME'}} />
        {isOwner ? (
          <>
            <Tab.Screen name='ProPets' children={props => <O2PetsScreen pets={pets} {...props} />} options={{title: 'PETS'}} />
            <Tab.Screen name='ProJobs' children={props => <O3JobsScreen jobs={jobs} {...props} />} options={{title: 'JOBS'}} />
          </>
        ) : (
          <Tab.Screen name='ProScreening' children={props => <O4Screening user={profile} {...props} />} options={{title: 'SCREENING'}} />
        )}
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    backgroundColor: 'white',
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
  fabLeft: {
    left: null,
    right: scale(16),
  },
  profileTop: {
    height: SCREEN.HEIGHT * 0.2 + verticalScale(37.5),
  },
  banner: {
    height: SCREEN.HEIGHT * 0.2,
    width: SCREEN.WIDTH,
  },
  profilePicture: {
    position: 'absolute',
    bottom: 0,
    left: scale(12),
    borderWidth: moderateScale(2),
    borderColor: 'white',
  },
  profileButtonContainer: {
    position: 'absolute',
    bottom: verticalScale(37.5 - 17),
    right: scale(12),
    borderRadius: moderateScale(8),
  },
  profileButton: {
    height: verticalScale(34),
    paddingHorizontal: moderateScale(12),
    borderWidth: 1,
    borderColor: colours.mediumGray,
    borderRadius: moderateScale(8),
    backgroundColor: 'white',
  },
  profileButtonText: {
    ...TextStyles.h4,
    color: colours.darkGray,
  },
  profileInfo: {
    paddingHorizontal: scale(16),
  },
  rowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  darkText: {
    ...TextStyles.h4,
    color: 'black',
    fontWeight: 'bold',
  },
  lightText: {
    ...TextStyles.h4,
    color: colours.darkGray,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
});

export default OwnerProfile;
