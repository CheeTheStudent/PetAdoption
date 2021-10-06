import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import MapView from 'react-native-maps';

import FirebaseMessage from '../utils/FirebaseMessage';

const Testing = () => {
  const firebaseMessage = FirebaseMessage();
  useEffect(() => {
    firebaseMessage.getConvos(convoData => console.log('got it'));
    // return () => {
    //   firebaseMessage.off();
    // };
  }, []);

  return <View style={styles.body}></View>;
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
