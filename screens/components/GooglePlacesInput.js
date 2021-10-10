import React, {useState, useLayoutEffect, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import {googleAPIkey} from '../../assets/bimil';
import {scale, verticalScale, moderateScale} from '../../assets/dimensions';
import {TextStyles, Spacing} from '../../assets/styles';
import colours from '../../assets/colours';

const GooglePlacesInput = ({navigation, route}) => {
  const {onGoBack} = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Search Location',
      headerTitleStyle: TextStyles.h2,
      headerShadowVisible: false,
    });
  }, []);

  const handleOnPress = (data, details) => {
    const {location} = details.geometry;
    const {description} = data;
    const {address_components} = details;
    const state = address_components.filter((el, i) => el.types[0] === 'administrative_area_level_1');
    navigation.goBack();
    onGoBack({address: description, latitude: location.lat, longitude: location.lng, state: state[0].long_name});
  };

  return (
    <GooglePlacesAutocomplete
      placeholder='Search'
      fetchDetails={true}
      returnKeyType={'search'}
      nearbyPlacesAPI='GooglePlacesSearch'
      minLength={3}
      enablePoweredByContainer={false}
      query={{
        key: googleAPIkey,
        language: 'en',
        components: 'country:my',
      }}
      onFail={err => console.log(err)}
      onPress={handleOnPress}
      renderRow={props => (
        <View>
          <Text style={{fontWeight: 'bold'}}>{props.structured_formatting.main_text}</Text>
          <Text>{props.structured_formatting.secondary_text}</Text>
        </View>
      )}
      renderLeftButton={() => <Icon name='search' color={colours.darkGray} size={moderateScale(24)} />}
      styles={styles}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: scale(16),
  },
  textInputContainer: {
    marginVertical: verticalScale(8),
    paddingHorizontal: scale(8),
    borderRadius: moderateScale(15),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colours.lightGray,
  },
  textInput: {
    marginBottom: 0,
  },
});

export default GooglePlacesInput;
