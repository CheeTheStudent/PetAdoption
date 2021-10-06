import React from 'react';
import {View, Text, Image, TouchableWithoutFeedback, Animated, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';

import Tag from '../components/Tag';
import {CARD, ACTION_OFFSET, verticalScale, scale} from '../../assets/dimensions';
import {TextStyles} from '../../assets/styles';
import {useEffect} from 'react';
import {useState} from 'react';
import colours from '../../assets/colours';

const AdoptionCard = ({navigation, pet, isFirst, swipe, tiltPoint, ...rest}) => {
  const rotate = Animated.multiply(swipe.x, tiltPoint).interpolate({
    inputRange: [-ACTION_OFFSET, 0, ACTION_OFFSET],
    outputRange: ['8deg', '0deg', '-8deg'],
  });

  const animatedCardStyle = {
    transform: [...swipe.getTranslateTransform(), {rotate}],
  };

  const calcPetAge = () => {
    let ageLabel = '';
    if (pet.ageYear == 0) {
      ageLabel = pet.ageMonth + ' months';
    } else if (pet.ageMonth == 0) {
      ageLabel = pet.ageYear + ' years';
    } else if (pet.ageYear > 0 && pet.ageMonth > 0) {
      ageLabel = pet.ageYear + ' years ' + pet.ageMonth + ' months';
    } else {
      ageLabel = 'Age Unspecified';
    }
    return ageLabel;
  };

  const isVideo = () => {
    if (!pet.media) return;
    let n = pet.media[0].lastIndexOf('?');
    const fileType = pet.media[0].substring(n - 3, n);
    return fileType === 'mp4';
  };

  const handleOpenProfile = () => {
    navigation.navigate('PetProfile', {
      pet: pet,
    });
  };

  return (
    <Animated.View style={[styles.card, isFirst && animatedCardStyle]} {...rest}>
      {pet.media &&
        (isVideo() ? <Video source={{uri: pet.media[0]}} resizeMode='cover' repeat={true} muted={true} style={styles.backgroundVideo} /> : <Image source={{uri: pet.media[0]}} style={styles.image} />)}
      <LinearGradient colors={['transparent', 'rgba(0,0,0,1)']} style={styles.linearGradient} />
      {isVideo() && <LinearGradient colors={['rgba(0,0,0,1)', 'transparent']} locations={[0.05, 1]} style={styles.linearGradientTop} />}
      <TouchableWithoutFeedback onPress={handleOpenProfile}>
        <View style={styles.contentContainer}>
          <View style={styles.detailsContainer}>
            <Text style={[TextStyles.h1, styles.name]}>{pet.name}</Text>
            <Text style={[TextStyles.h3, styles.age]}>{calcPetAge()}</Text>
          </View>
          <View style={styles.tagsContainer}>{pet.tags ? pet.tags.map(tag => <Tag title={tag} type='white' disabled />) : <></>}</View>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: CARD.HEIGHT * 0.04 + verticalScale(18.5),
    top: CARD.HEIGHT * 0.03,
    left: CARD.HEIGHT * 0.02,
    right: CARD.HEIGHT * 0.02,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: CARD.BORDER_RADIUS,
  },
  backgroundVideo: {
    flex: 1,
    marginVertical: CARD.BORDER_RADIUS,
    backgroundColor: colours.mediumGray,
  },
  linearGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: CARD.HEIGHT * 0.3,
    borderRadius: CARD.BORDER_RADIUS,
  },
  linearGradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: CARD.HEIGHT * 0.3,
    borderRadius: CARD.BORDER_RADIUS,
  },
  contentContainer: {
    position: 'absolute',
    bottom: verticalScale(32),
    left: scale(16),
    right: scale(16),
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  name: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
  },
  age: {
    color: 'white',
  },
  tag: {
    marginRight: 8,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 25,
  },
});

export default AdoptionCard;
