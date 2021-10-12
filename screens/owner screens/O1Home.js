import React, {useEffect, useState} from 'react';
import {View, Text, Image, ScrollView, FlatList, TouchableHighlight, Linking, StyleSheet} from 'react-native';
import {Divider, Icon, SocialIcon} from 'react-native-elements';
import MapView, {Marker} from 'react-native-maps';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FirebaseMessage from '../../utils/FirebaseMessage';

import LongRoundButton from '../components/LongRoundButton';
import SmallPetCard from '../components/SmallPetCard';
import JobCard from '../components/JobCard';
import {SCREEN, verticalScale, scale, moderateScale} from '../../assets/dimensions';
import {TextStyles, Spacing} from '../../assets/styles';
import colours from '../../assets/colours';

const daysOfTheWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const O1Home = ({navigation, owner, pets, jobs}) => {
  const {id: ownerId, name, description, profilePic, petsAdopted, location, phoneNum, email, facebookId, twitterId, private: ownerPrivate} = owner;

  const userUID = auth().currentUser.uid;
  const firebaseMessage = FirebaseMessage();
  const [user, setUser] = useState();

  useEffect(async () => {
    const userData = await AsyncStorage.getItem('user');
    const user = JSON.parse(userData);
    setUser(user);
  }, []);

  const renderOpeningHours = (day, hours) => {
    return (
      <Text style={(TextStyles.text, {fontWeight: 'bold'})}>
        {daysOfTheWeek[day]} <Text style={{fontWeight: 'normal'}}>{hours}</Text>
      </Text>
    );
  };

  const openMaps = () => {
    const url = 'geo: 5.437694608336231, 100.30948629999854';
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  const handleSendMessage = async () => {
    const convoInfo = {
      sender: {id: userUID, name: user.name, image: user.profilePic},
      receiver: {id: ownerId, name: name, image: profilePic},
      requestAccepted: ownerPrivate ? false : true,
    };
    const convoId = await firebaseMessage.createConvo(convoInfo);
    navigation.navigate('Chat', {convo: {id: convoId, ...convoInfo}});
  };

  return (
    <ScrollView>
      <View style={styles.body}>
        <View style={styles.header}>
          <Image source={require('../../assets/images/banner.png')} style={styles.banner} />
          <Image source={require('../../assets/images/dog.png')} style={styles.profilePicture} />
          <Text style={[TextStyles.h2, styles.ownerName, Spacing.superSmallTopSpacing]}>{name}</Text>
        </View>
        <View style={[Spacing.smallTopSpacing, {flexDirection: 'row'}]}>
          <View style={styles.statsBox}>
            <Text style={TextStyles.h2}>Some num</Text>
            <Text style={TextStyles.h4}>Pets for Adoption</Text>
          </View>
          <Divider orientation='vertical' width={1} />
          <View style={styles.statsBox}>
            <Text style={TextStyles.h2}>{petsAdopted}</Text>
            <Text style={TextStyles.h4}>Successfully Adopted</Text>
          </View>
        </View>
        <View style={styles.container}>
          <Text style={[TextStyles.h4, Spacing.superSmallTopSpacing]}>About</Text>
          <Text style={[TextStyles.text, Spacing.superSmallTopSpacing]}>{description}</Text>
          <View style={[styles.rowContainer, Spacing.superSmallTopSpacing]}>
            <Text style={TextStyles.h4}>Pets For Adoption</Text>
            <Text style={[TextStyles.desc, {alignSelf: 'flex-end'}]} onPress={() => navigation.jumpTo('Pets', {owner: owner})}>
              See All
            </Text>
          </View>
          <View style={[styles.rowContainer, Spacing.superSmallTopSpacing]}>
            {pets.map((pet, index) => {
              if (index > 2) return;
              return <SmallPetCard key={pet.id} name={pet.name} image={pet.media && pet.media[0]} onPress={() => navigation.navigate('PetProfile', {pet: pet})} />;
            })}
          </View>
          <View style={[styles.rowContainer, Spacing.superSmallTopSpacing]}>
            <Text style={TextStyles.h4}>Join Us</Text>
            <Text style={[TextStyles.desc, {alignSelf: 'flex-end'}]} onPress={() => navigation.jumpTo('Jobs', {owner: owner})}>
              See All
            </Text>
          </View>
          <View style={Spacing.superSmallTopSpacing}>{jobs.length > 0 && <JobCard job={jobs[0]} />}</View>
          {location ? (
            <>
              <Text style={[TextStyles.h4, Spacing.smallTopSpacing]}>Location</Text>
              <Text style={[TextStyles.text, Spacing.superSmallTopSpacing]}>{location.address}</Text>
              <MapView
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                pitchEnabled={false}
                rotateEnabled={false}
                zoomEnabled={false}
                scrollEnabled={false}
                onPress={openMaps}
                style={styles.map}>
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                />
              </MapView>
            </>
          ) : null}
          {phoneNum || email || facebookId || twitterId ? <Text style={[TextStyles.h4, Spacing.smallTopSpacing]}>Contact</Text> : null}
          {phoneNum ? (
            <View style={styles.contactRow}>
              <Icon name='phone' type='material-community' size={moderateScale(24)} color={colours.black} style={Spacing.superSmallRightSpacing} />
              <Text style={TextStyles.text}>{phoneNum}</Text>
            </View>
          ) : null}
          {email ? (
            <View style={styles.contactRow}>
              <Icon name='email' type='material-community' size={moderateScale(24)} color={colours.black} style={Spacing.superSmallRightSpacing} />
              <Text style={TextStyles.text}>{email}</Text>
            </View>
          ) : null}
          {facebookId ? (
            <View style={styles.contactRow}>
              <SocialIcon type='facebook' iconSize={moderateScale(20)} style={styles.socialIcon} />
              <Text style={TextStyles.text}>{facebookId}</Text>
            </View>
          ) : null}
          {twitterId ? (
            <View style={styles.contactRow}>
              <SocialIcon type='twitter' iconSize={moderateScale(20)} style={styles.socialIcon} />
              <Text style={TextStyles.text}>{twitterId}</Text>
            </View>
          ) : null}
        </View>
        <LongRoundButton title='MESSAGE' onPress={handleSendMessage} containerStyle={styles.messageButton} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: SCREEN.HEIGHT * 0.2 + verticalScale(46),
  },
  banner: {
    height: SCREEN.HEIGHT * 0.2,
    width: SCREEN.WIDTH,
  },
  profilePicture: {
    height: verticalScale(92),
    width: verticalScale(92),
    position: 'absolute',
    bottom: 0,
    left: scale(16),
    borderRadius: verticalScale(92) / 2,
  },
  ownerName: {
    marginLeft: scale(24) + verticalScale(92),
  },
  statsBox: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    paddingTop: verticalScale(16),
    paddingHorizontal: scale(16),
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  map: {
    flex: 1,
    height: SCREEN.HEIGHT * 0.2,
    marginTop: verticalScale(8),
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  socialIcon: {
    width: moderateScale(24),
    height: moderateScale(24),
    margin: 0,
    marginRight: scale(8),
  },
  messageButton: {
    marginVertical: verticalScale(24),
    alignSelf: 'center',
  },
});

export default O1Home;
