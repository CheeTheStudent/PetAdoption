import React from 'react';
import {View, Text, TouchableOpacity, ImageBackground, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {scale} from '../../assets/dimensions';
import {Spacing, TextStyles} from '../../assets/styles';

const SmallPetCard = ({name, image, onPress}) => {
  return (
    <TouchableOpacity key={name} onPress={onPress} style={Spacing.superSmallRightSpacing}>
      <ImageBackground source={image ? {uri: image} : require('../../assets/images/placeholder.png')} style={styles.imageContainer} imageStyle={styles.image}>
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.linearGradient} />
        <View style={styles.card}>
          <Text style={[TextStyles.h4, styles.text]}>{name}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: scale(100),
    aspectRatio: 1,
    justifyContent: 'flex-end',
    padding: scale(8),
  },
  imageContainer: {
    width: scale(100),
    aspectRatio: 1,
  },
  image: {
    borderRadius: scale(5),
  },
  linearGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: scale(50),
    borderRadius: scale(5),
  },
  text: {
    color: 'white',
  },
});

export default SmallPetCard;
