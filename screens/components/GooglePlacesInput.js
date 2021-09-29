import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { googleAPIkey } from '../../assets/bimil';

const GooglePlacesInput = ({ onLocationSelected }) => {

  const handleOnPress = (data, details) => {
    const { geometry } = details;
    console.log(geometry);
  };

  return (
    <GooglePlacesAutocomplete
      placeholder='Search'
      fetchDetails={true}
      returnKeyType={'search'}
      nearbyPlacesAPI='GooglePlacesSearch'
      // currentLocation={true}
      // currentLocationLabel="Current location"
      query={{
        key: googleAPIkey,
        language: 'en',
        components: 'country:my',
      }}
      // GoogleReverseGeocodingQuery={{
      //   key: googleAPIkey,
      //   language: 'en',
      // }}
      onFail={err => console.log(err)}
      onPress={handleOnPress}
    />
  );
};

export default GooglePlacesInput;