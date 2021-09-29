import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking } from 'react-native';
import { Image, Icon } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import MapView, { Marker } from 'react-native-maps';

import SquareButton from './components/SquareButton';
import LongRoundButton from './components/LongRoundButton';
import { TextStyles, Spacing } from '../assets/styles';
import { SCREEN, verticalScale, scale, moderateScale } from '../assets/dimensions';
import colours from '../assets/colours';

const Job = ({ navigation, route }) => {

  const { job } = route.params;
  const { title, type, shelterName, desc, salary, salaryType, location, image, ownerId } = job;
  const ownerRef = database().ref(`/users/${ownerId}`);

  const [owner, setOwner] = useState();

  useEffect(() => {
    ownerRef.once('value', snapshot => {
      const data = snapshot.val() ? snapshot.val() : null;
      data && setOwner(data);
    });
  }, []);


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

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.body}>
      <ScrollView>
        <Image source={{ uri: image }} style={styles.image} />
        <TouchableOpacity style={styles.fab} onPress={handleGoBack} >
          <Icon name='arrow-back' type='material' size={moderateScale(24)} color='black' />
        </TouchableOpacity>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={[TextStyles.h1, Spacing.superSmallRightSpacing]}>{title}</Text>
            <Text style={TextStyles.text}>{type}</Text>
          </View>
          <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>About</Text>
          <Text style={[TextStyles.desc, Spacing.superSmallTopSpacing]}>{desc}</Text>
          {salary ?
            <><Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Salary</Text>
              <Text style={[TextStyles.desc, Spacing.superSmallTopSpacing]}>RM{salary} {salaryType}</Text></> : null}

          {owner ?
            <>
              {location ?
                <>
                  <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Location</Text>
                  <Text style={[TextStyles.desc, Spacing.superSmallTopSpacing]}>{location.address}</Text>
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
                        longitude: location.longitude
                      }} />
                  </MapView></> : null}
              <View style={[styles.rowContainer, Spacing.smallTopSpacing]}>
                <Image source={require('../assets/images/dog.png')} style={[styles.ownerImage, Spacing.smallRightSpacing]} />
                <View style={[styles.shelterInfoContainer, Spacing.superSmallRightSpacing]}>
                  <Text style={[TextStyles.h3]} numberOfLines={1}>{owner.name}</Text>
                  <Text style={TextStyles.desc}>{owner.role}</Text>
                </View>
                <SquareButton title="VIEW" onPress={() => navigation.navigate("OwnerProfile")} titleStyle={styles.buttonText} buttonStyle={styles.viewOwnerButton} containerStyle={styles.viewOwnerButtonCon} />
              </View>
            </> : null}
        </View>
        <LongRoundButton title="APPLY" containerStyle={styles.button} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    height: SCREEN.HEIGHT * 0.3,
    width: SCREEN.WIDTH,
  },
  fab: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: verticalScale(20),
    backgroundColor: 'white',
    justifyContent: 'center',
    position: 'absolute',
    top: verticalScale(16),
    left: scale(16),
    elevation: 10,
  },
  container: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(24),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  map: {
    height: SCREEN.HEIGHT * 0.2,
    marginTop: verticalScale(8),
  },
  ownerImage: {
    width: SCREEN.WIDTH / 6,
    height: SCREEN.WIDTH / 6,
    borderRadius: SCREEN.WIDTH / 12,
  },
  shelterInfoContainer: {
    flex: 1,
  },
  viewOwnerButton: {
    width: scale(80),
    padding: moderateScale(10),
    borderRadius: moderateScale(50),
    borderWidth: 1,
    borderColor: colours.mediumGray,
  },
  viewOwnerButtonCon: {
    borderRadius: moderateScale(50),
  },
  buttonText: {
    fontSize: moderateScale(12),
    color: colours.darkGray,
  },
  button: {
    marginTop: verticalScale(8),
    marginBottom: verticalScale(32),
    alignSelf: 'center',
  },
});

export default Job;