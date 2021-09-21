import React, { useState } from 'react';
import { View, Text, Image, ScrollView, FlatList, TouchableHighlight, Linking, StyleSheet } from 'react-native';
import { Divider, Icon, SocialIcon } from 'react-native-elements';
import MapView from 'react-native-maps';

import LongRoundButton from '../components/LongRoundButton';
import SmallPetCard from '../components/SmallPetCard';
import SmallJobCard from '../components/SmallJobCard';
import { SCREEN, verticalScale, scale, moderateScale } from '../../assets/dimensions';
import { TextStyles, Spacing } from '../../assets/styles';
import colours from '../../assets/colours';

const daysOfTheWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const O1Home = ({ navigation, owner }) => {

  const renderHorizontalList = type => {
    return <FlatList
      horizontal={true}
      data={[{ title: 'Title Text', key: 'item1' }, {}]}
      renderItem={({ item, index }) => (
        type == "pets" ? <SmallPetCard name="Ron" age="12 months" /> :
          <SmallJobCard title="Volunteer" desc="Bloop bleep beep" />
      )}
      style={Spacing.superSmallTopSpacing}
    />;
  };

  const renderOpeningHours = (day, hours) => {
    return <Text style={TextStyles.text, { fontWeight: 'bold' }}>{daysOfTheWeek[day]} <Text style={{ fontWeight: 'normal' }}>{hours}</Text></Text>;
  };

  const openMaps = () => {
    const url = "geo: 5.437694608336231, 100.30948629999854";
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log('Don\'t know how to open URI: ' + url);
      }
    });
  };

  return (
    <ScrollView>
      <View style={styles.body}>
        <View style={styles.header}>
          <Image source={require('../../assets/images/banner.png')} style={styles.banner} />
          <Image source={require('../../assets/images/dog.png')} style={styles.profilePicture} />
          <Text style={[TextStyles.h2, styles.ownerName, Spacing.superSmallTopSpacing]}>{owner.name}</Text>
        </View>
        <View style={[Spacing.smallTopSpacing, { flexDirection: 'row' }]}>
          <View style={styles.statsBox}>
            <Text style={TextStyles.h2}>Some num</Text>
            <Text style={TextStyles.h4}>Pets for Adoption</Text>
          </View>
          <Divider orientation="vertical" width={1} />
          <View style={styles.statsBox}>
            <Text style={TextStyles.h2}>{owner.petsAdopted}</Text>
            <Text style={TextStyles.h4}>Successfully Adopted</Text>
          </View>
        </View>
        <View style={styles.container}>
          <Text style={[TextStyles.h4, Spacing.superSmallTopSpacing]}>About</Text>
          <Text style={[TextStyles.text, Spacing.superSmallTopSpacing]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras cras mi scelerisque quis arcu luctus lacus id vestibulum. Sollicitudin vestibulum mi elit nulla sed. Faucibus pretium convallis quam enim sed tincidunt adipiscing in enim. Aliquam metus in convallis sodales ornare nisl.</Text>
          <View style={[styles.seeAlllRow, Spacing.superSmallTopSpacing]}>
            <Text style={TextStyles.h4}>Pets For Adoption</Text>
            <Text style={[TextStyles.desc, { alignSelf: 'flex-end' }]} onPress={() => navigation.jumpTo("Pets", { owner: owner })}>See All</Text>
          </View>
          {renderHorizontalList("pets")}
          <View style={[styles.seeAlllRow, Spacing.superSmallTopSpacing]}>
            <Text style={TextStyles.h4}>Join Us</Text>
            <Text style={[TextStyles.desc, { alignSelf: 'flex-end' }]} onPress={() => navigation.jumpTo("Jobs", { owner: owner })}>See All</Text>
          </View>
          {renderHorizontalList("jobs")}
          <Text style={[TextStyles.h4, Spacing.smallTopSpacing]}>Opening Hours</Text>
          <View style={[Spacing.smallTopSpacing, { flexDirection: 'row' }]}>
            <View>
              {daysOfTheWeek.map(day =>
                <Text style={TextStyles.text, { fontWeight: 'bold' }}>{day}</Text>)}
            </View>
            <View style={[Spacing.superSmallLeftSpacing, { justifyContent: 'space-between' }]}>
              {Object.entries(owner.openingHours).map(([day, hours]) =>
                <Text style={TextStyles.text}>{hours}</Text>)}
            </View>
          </View>
          <Text style={[TextStyles.h4, Spacing.smallTopSpacing]}>Location</Text>
          <Text style={[TextStyles.text, Spacing.superSmallTopSpacing]}>{owner.address}</Text>
          <MapView
            initialRegion={{
              latitude: 5.437694608336231,
              longitude: 100.30948629999854,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            pitchEnabled={false}
            rotateEnabled={false}
            zoomEnabled={false}
            scrollEnabled={false}
            onPress={openMaps}
            style={styles.map}
          />
          <Text style={[TextStyles.h4, Spacing.smallTopSpacing]}>Contact</Text>

          <View style={styles.contactRow}>
            <Icon name="phone" type="material-community" size={moderateScale(24)} color={colours.black} style={Spacing.superSmallRightSpacing} />
            <Text style={TextStyles.text}>{owner.phoneNum}</Text>
          </View>
          <View style={styles.contactRow}>
            <Icon name="email" type="material-community" size={moderateScale(24)} color={colours.black} style={Spacing.superSmallRightSpacing} />
            <Text style={TextStyles.text}>{owner.email}</Text>
          </View>
          <View style={styles.contactRow}>
            <SocialIcon type="facebook" iconSize={moderateScale(20)} style={styles.socialIcon} />
            <Text style={TextStyles.text}>{owner.facebookId}</Text>
          </View>
          <View style={styles.contactRow}>
            <SocialIcon type="twitter" iconSize={moderateScale(20)} style={styles.socialIcon} />
            <Text style={TextStyles.text}>{owner.twitterId}</Text>
          </View>
        </View>
        <LongRoundButton title="MESSAGE" containerStyle={styles.messageButton} />
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
    paddingHorizontal: scale(24),
  },
  seeAlllRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  map: {
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
  }
});

export default O1Home;