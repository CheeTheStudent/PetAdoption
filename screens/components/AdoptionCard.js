import React from 'react';
import { View, Text, Image, TouchableWithoutFeedback, Animated, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Tag from '../components/Tag';
import { CARD, ACTION_OFFSET, verticalScale, scale } from '../../assets/dimensions';
import { TextStyles } from '../../assets/styles';
import { useEffect } from 'react';
import { useState } from 'react';

const AdoptionCard = ({ navigation, card, isFirst, swipe, tiltPoint, ...rest }) => {

  const rotate = Animated.multiply(swipe.x, tiltPoint).interpolate({
    inputRange: [-ACTION_OFFSET, 0, ACTION_OFFSET],
    outputRange: ['8deg', '0deg', '-8deg'],
  });

  const animatedCardStyle = {
    transform: [...swipe.getTranslateTransform(), { rotate }],
  };

  const handleOpenProfile = () => {
    navigation.navigate('PetProfile', {
      pet: card,
    });
  };

  return (
    <Animated.View style={[styles.card, isFirst && animatedCardStyle]} {...rest}>
      <Image source={require('../../assets/images/dog.png')} style={styles.image} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.linearGradient} />
      <TouchableWithoutFeedback onPress={handleOpenProfile}>
        <View style={styles.contentContainer} >
          <View style={styles.detailsContainer}>
            <Text style={[TextStyles.h1, styles.name]}>{card.name}</Text>
            <Text style={[TextStyles.h3, styles.age]}>{card.age}</Text>
          </View>
          <View style={styles.tagsContainer}>
            {card.tags ? card.tags.map(tag => <Tag title={tag} type="white" disabled />) : <></>}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: CARD.HEIGHT * 0.04 + verticalScale(18.5),
    top: CARD.HEIGHT * 0.01,
    left: CARD.HEIGHT * 0.02,
    right: CARD.HEIGHT * 0.02,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: CARD.BORDER_RADIUS,
  },
  linearGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: CARD.HEIGHT * 0.25,
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
  }
});

export default AdoptionCard;