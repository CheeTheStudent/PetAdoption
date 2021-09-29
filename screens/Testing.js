import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

import GooglePlacesInput from './components/GooglePlacesInput';

const Testing = () => {


  return (
    <View style={styles.body}>
      <GooglePlacesInput />
      <MapView
        initialRegion={{
          latitude: 5.456917987777273,
          longitude: 100.3077286,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        pitchEnabled={false}
        rotateEnabled={false}
        zoomEnabled={false}
        scrollEnabled={false}
        style={styles.map}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});

export default Testing;