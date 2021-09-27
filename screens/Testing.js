import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import MediaPicker from './components/MediaPicker';

const Testing = () => {

  const [chosenMedia, setChosenMedia] = useState();

  const handleChosenMedia = (media) => {
    console.log(media);
  };

  return (
    <View style={styles.body}>
      <MediaPicker setChosenMedia={handleChosenMedia} />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Testing;