import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, Image, Pressable, Animated, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';

import Tag from '../components/Tag';
import {calcPetAge} from '../../utils/utils';
import {CARD, ACTION_OFFSET, verticalScale, scale, moderateScale} from '../../assets/dimensions';
import {TextStyles} from '../../assets/styles';
import colours from '../../assets/colours';

const AdoptionCard = ({navigation, pet, isFirst, swipe, tiltPoint, ...rest}) => {
  const rotate = Animated.multiply(swipe.x, tiltPoint).interpolate({
    inputRange: [-ACTION_OFFSET, 0, ACTION_OFFSET],
    outputRange: ['8deg', '0deg', '-8deg'],
  });

  const likeOpacity = swipe.x.interpolate({
    inputRange: [10, ACTION_OFFSET],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const dislikeOpacity = swipe.x.interpolate({
    inputRange: [-ACTION_OFFSET, -10],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const animatedCardStyle = {
    transform: [...swipe.getTranslateTransform(), {rotate}],
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
      home: true,
    });
  };

  const renderChoice = useCallback(() => {
    return (
      <>
        <Animated.View style={[styles.choiceContainer, styles.dislikeContainer, {opacity: dislikeOpacity}]}>
          <Icon name='close' type='ionicon' size={moderateScale(40)} />
        </Animated.View>
        <Animated.View style={[styles.choiceContainer, styles.likeContainer, {opacity: likeOpacity}]}>
          <Icon name='heart' type='ionicon' size={moderateScale(40)} />
        </Animated.View>
      </>
    );
  }, []);

  return (
    <Animated.View style={[styles.card, isFirst && animatedCardStyle]} {...rest}>
      {pet.media &&
        (isVideo() ? <Video source={{uri: pet.media[0]}} resizeMode='cover' repeat={true} muted={true} style={styles.backgroundVideo} /> : <Image source={{uri: pet.media[0]}} style={styles.image} />)}
      <LinearGradient colors={['transparent', 'rgba(0,0,0,1)']} style={styles.linearGradient} />
      {isVideo() && <LinearGradient colors={['rgba(0,0,0,1)', 'transparent']} locations={[0.05, 1]} style={styles.linearGradientTop} />}
      <Pressable onPress={handleOpenProfile}>
        <View style={styles.contentContainer}>
          <View style={styles.detailsContainer}>
            <Text style={[TextStyles.h1, styles.name]}>{pet.name}</Text>
            <Text style={[TextStyles.h3, styles.age]}>{calcPetAge(pet.ageYear, pet.ageMonth)}</Text>
          </View>
          <View style={styles.tagsContainer}>{pet.tags ? pet.tags.slice(0, 6).map(tag => <Tag key={tag} title={tag} type='white' disabled />) : <></>}</View>
        </View>
      </Pressable>
      {isFirst ? renderChoice() : null}
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
  choiceContainer: {
    width: moderateScale(70),
    aspectRatio: 1,
    position: 'absolute',
    top: CARD.HEIGHT * 0.1,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: moderateScale(35),
  },
  likeContainer: {
    left: CARD.WIDTH * 0.15,
  },
  dislikeContainer: {
    right: CARD.WIDTH * 0.15,
  },
});

export default AdoptionCard;
