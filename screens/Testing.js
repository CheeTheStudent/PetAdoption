import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import MapView from 'react-native-maps';

import FirebaseMessage from '../utils/FirebaseMessage';

const Testing = () => {
  const location = {latitude: 3.1116619409358566, longitude: 101.66592645489287};

  return (
    <View style={styles.body}>
      <MapView
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        // pitchEnabled={false}
        // rotateEnabled={false}
        // zoomEnabled={false}
        // scrollEnabled={false}
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
  },
});

export default Testing;
