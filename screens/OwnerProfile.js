import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, Linking} from 'react-native';
import {Avatar, Button, Icon} from 'react-native-elements';
import {MaterialTabBar} from 'react-native-collapsible-tab-view';
import createCollapsibleNavigator from './components/create-collapsible-navigator';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FirebaseMessage from '../utils/FirebaseMessage';

import O1HomeScreen from './owner screens/O1Home';
import O2PetsScreen from './owner screens/O2Pets';
import O3JobsScreen from './owner screens/O3Jobs';
import Loading from './components/Loading';
import {SCREEN, verticalScale, scale, moderateScale} from '../assets/dimensions';
import {TextStyles, Spacing} from '../assets/styles';
import colours from '../assets/colours';

const OwnerProfile = ({navigation, route}) => {
  const {ownerId} = route.params;
  const userUID = auth().currentUser.uid;
  const firebaseMessage = FirebaseMessage();

  const userRef = database().ref(`users/${ownerId}`);
  const petRef = database().ref(`pets`);
  const jobRef = database().ref(`jobs`);
  const postRef = database().ref(`posts`);
  const [user, setUser] = useState();
  const [owner, setOwner] = useState();
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
    AsyncStorage.getItem('user').then(userData => {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    });

    userRef.on('value', snapshot => {
      const data = snapshot.val() ? snapshot.val() : {};
      setOwner({id: snapshot.key, ...data});
      setLoading(false);
    });

    postRef
      .orderByChild('user/id')
      .equalTo(ownerId)
      .on('value', snapshot => {
        const data = snapshot.val() ? snapshot.val() : {};
        let postData = [];
        Object.entries(data).map(value => postData.push({id: value[0], ...value[1]}));
        setPosts(postData);
        setPostLoading(false);
      });

    petRef
      .orderByChild('ownerId')
      .equalTo(ownerId)
      .on('value', snapshot => {
        const data = snapshot.val() ? snapshot.val() : {};
        let petData = [];
        Object.entries(data).map(value => petData.push({id: value[0], ...value[1]}));
        setPets(petData);
        setPetLoading(false);
      });

    jobRef
      .orderByChild('ownerId')
      .equalTo(ownerId)
      .on('value', snapshot => {
        const data = snapshot.val() ? snapshot.val() : {};
        let jobData = [];
        Object.entries(data).map(value => jobData.push({id: value[0], ...value[1]}));
        setJobs(jobData);
        setJobLoading(false);
      });

    return () => {
      userRef.off();
      petRef.off();
      jobRef.off();
      postRef.off();
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
      receiver: {id: ownerId, name: owner.name, image: owner.profilePic},
      requestAccepted: owner.private ? false : true,
    };
    const convoId = await firebaseMessage.createConvo(convoInfo);
    navigation.navigate('Chat', {convo: {id: convoId, ...convoInfo}});
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.profileTop}>
          <Image source={require('../assets/images/banner.png')} style={styles.banner} />
          <Avatar rounded size={moderateScale(75)} source={owner.profilePic ? {uri: owner.profilePic} : require('../assets/images/placeholder.png')} containerStyle={styles.profilePicture} />
          <Button title='Message' onPress={handleSendMessage} buttonStyle={styles.profileButton} titleStyle={styles.profileButtonText} containerStyle={styles.profileButtonContainer} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={[TextStyles.h2, Spacing.superSmallTopSpacing]}>{owner.name}</Text>
          {owner.location ? (
            <Text numberOfLines={1} onPress={() => openMaps(owner.location.latitude, owner.location.longitude)} style={TextStyles.desc}>
              <Icon name='location-sharp' type='ionicon' size={moderateScale(12)} />
              {owner.location.address}
            </Text>
          ) : (
            <Text style={styles.lightText}>{owner.role}</Text>
          )}
          {owner.description ? (
            <Text numberOfLines={3} style={[Spacing.superSmallTopSpacing]}>
              {owner.description}
            </Text>
          ) : null}
          <View style={[styles.rowContainer, Spacing.superSmallTopSpacing]}>
            <Text style={styles.lightText}>
              <Text style={styles.darkText}>{pets.length - owner.petsAdopted}</Text> For Adoption
            </Text>
            <Text style={[styles.lightText, Spacing.smallLeftSpacing, {flex: 1}]}>
              <Text style={styles.darkText}>{owner.petsAdopted}</Text> Successfully Adopted
            </Text>
            <Icon name={showContact ? 'chevron-up' : 'chevron-down'} type='ionicon' size={moderateScale(16)} onPress={() => setShowContact(prev => !prev)} />
          </View>
          {showContact ? (
            <>
              <Text style={[TextStyles.h4, Spacing.superSmallTopSpacing]}>Contact Us</Text>
              {owner.phoneNum ? (
                <View style={styles.contactRow}>
                  <Icon name='call' type='ionicon' size={moderateScale(20)} style={Spacing.superSmallRightSpacing} />
                  <Text style={TextStyles.desc}>{owner.phoneNum}</Text>
                </View>
              ) : null}
              {owner.email ? (
                <View style={styles.contactRow}>
                  <Icon name='mail' type='ionicon' size={moderateScale(20)} style={Spacing.superSmallRightSpacing} />
                  <Text style={TextStyles.desc}>{owner.email}</Text>
                </View>
              ) : null}
              {owner.facebookId ? (
                <View style={styles.contactRow}>
                  <Icon name='logo-facebook' type='ionicon' size={moderateScale(20)} style={Spacing.superSmallRightSpacing} />
                  <Text style={TextStyles.desc}>{owner.facebookId}</Text>
                </View>
              ) : null}
              {owner.twitterId ? (
                <View style={styles.contactRow}>
                  <Icon name='logo-twitter' type='ionicon' size={moderateScale(20)} style={Spacing.superSmallRightSpacing} />
                  <Text style={TextStyles.desc}>{owner.twitterId}</Text>
                </View>
              ) : null}
            </>
          ) : null}
        </View>
        <TouchableOpacity style={styles.fab} onPress={() => navigation.goBack()}>
          <Icon name='arrow-back' type='ionicon' size={moderateScale(24)} color='white' />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <Tab.Navigator
        collapsibleOptions={{
          headerHeight: SCREEN.HEIGHT * 0.42,
          headerContainerStyle: {elevation: 0},
          renderTabBar: props => (
            <MaterialTabBar
              indicatorStyle={{backgroundColor: 'black', width: (SCREEN.WIDTH / 3) * 0.7, left: (SCREEN.WIDTH / 3) * 0.15}}
              tabStyle={{elevation: 0, borderBottomWidth: 1, borderBottomColor: colours.lightGray}}
              {...props}
            />
          ),
          renderHeader,
        }}>
        <Tab.Screen name='Home' children={props => <O1HomeScreen posts={posts} {...props} />} />
        <Tab.Screen name='Pets' children={props => <O2PetsScreen pets={pets} {...props} />} />
        <Tab.Screen name='Jobs' children={props => <O3JobsScreen jobs={jobs} {...props} />} />
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
