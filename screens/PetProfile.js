import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { Button, Icon } from 'react-native-elements';

import ActionButton from './components/ActionButton';
import Tag from './components/Tag';
import SquareButton from './components/SquareButton';
import { TextStyles, Spacing } from '../assets/styles';
import { SCREEN, verticalScale, scale } from '../assets/dimensions';

const PetProfile = ({ navigation, route }) => {

  const { pet } = route.params;
  const userUID = auth().currentUser.uid;
  const userRef = database().ref(`/users/${userUID}`);

  const [userTags, setUserTags] = useState([]);

  useEffect(async () => {
    userRef.on('value', snapshot => {
      const data = snapshot.val() ? snapshot.val() : null;
      data && setUserTags(data.preferredTags);
    });
  }, []);

  const renderTag = (tag) => {
    let included = false;
    userTags.map(sTag => {
      if (sTag === tag) {
        included = true;
      }
    });
    {/* <Tag title={tag} type="white-outline" disabled /> */ }
    return <Tag title={tag} type={included ? "black" : "white-outline"} disabled />;
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLikePet = () => {
    navigation.navigate('Home', {
      swipeAway: "like",
    });
  };

  const handleDislikePet = () => {
    navigation.navigate('Home', {
      swipeAway: "dislike",
    });
  };

  return (
    <View style={styles.body}>
      <ScrollView>
        {pet ? (
          // Pet info is available
          <>
            <Image source={require('../assets/images/dog.png')} style={styles.image} />
            <ActionButton name="chevron-up" containerStyle={styles.actionUpButton} onPress={handleGoBack} />
            <View style={styles.container}>
              <View style={styles.basicInfoContainer}>
                <Text style={[TextStyles.h2, Spacing.superSmallRightSpacing]}>{pet.name}</Text>
                <Text style={TextStyles.h4}>{pet.age}</Text>
              </View>
              <Text style={[TextStyles.h4, Spacing.superSmallTopSpacing]}>{pet.breed}</Text>
              <View style={[styles.tagContainer, Spacing.smallTopSpacing]}>
                {pet.tags ? pet.tags.map(tag => renderTag(tag)) : <></>}
              </View>
              <View style={[styles.healthContainer, Spacing.smallTopSpacing]}>
                <View >
                  <Text style={TextStyles.h4}>Weight</Text>
                  <Text style={[TextStyles.h4, Spacing.superSmallTopSpacing]}>Height</Text>
                  <Text style={[TextStyles.h4, Spacing.superSmallTopSpacing]}>Vaccinated</Text>
                  <Text style={[TextStyles.h4, Spacing.superSmallTopSpacing]}>Neutered</Text>
                </View>
                <View style={styles.healthValuesContainer}>
                  <Text style={TextStyles.h4}>1.5kg</Text>
                  <Text style={[TextStyles.h4, Spacing.superSmallTopSpacing]}>1.5kg</Text>
                  <Icon name="checkmark-circle" type="ionicon" size={scale(24)} color="black" style={Spacing.superSmallTopSpacing} />
                  <Icon name="checkmark-circle" type="ionicon" size={scale(24)} color="black" style={Spacing.superSmallTopSpacing} />
                </View>
              </View>
              <Text style={[TextStyles.h4, Spacing.superSmallTopSpacing]}>About</Text>
              <Text style={[TextStyles.text, Spacing.superSmallTopSpacing]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras cras mi scelerisque quis arcu luctus lacus id vestibulum. Sollicitudin vestibulum mi elit nulla sed. Faucibus pretium convallis quam enim sed tincidunt adipiscing in enim. Aliquam metus in convallis sodales ornare nisl.</Text>
              <Text style={[TextStyles.h3, Spacing.superSmallTopSpacing]}>Owner</Text>
              <View style={[styles.ownerContainer, Spacing.superSmallTopSpacing, Spacing.superSmallBottomSpacing]}>
                <Image source={require('../assets/images/dog.png')} style={[styles.ownerImage, Spacing.smallRightSpacing]} />
                <View style={[styles.shelterInfoContainer, Spacing.superSmallRightSpacing]}>
                  <Text style={[TextStyles.h4, Spacing.superSmallBottomSpacing]} numberOfLines={1}>Jung Shelter Gwanju Jung Shelter Gwanju</Text>
                  <Text style={TextStyles.text}>Shelter</Text>
                </View>
                <SquareButton title="View" onPress={() => navigation.navigate("OwnerProfile")} />
              </View>
              <View style={[styles.actionButtonsContainer, Spacing.superSmallTopSpacing]}>
                < SquareButton onPress={handleDislikePet} buttonStyle={styles.buttonStyle} containerStyle={styles.dislikeButtonContainerStyle} icon={<Icon name="thumb-down" type="material-community" color="black" />} />
                <SquareButton onPress={handleLikePet} buttonStyle={styles.buttonStyle} containerStyle={styles.likeButtonContainerStyle} icon={<Icon name="thumb-up" type="material-community" color="black" />} />
              </View>
              <SquareButton title="MESSAGE" buttonStyle={styles.buttonStyle} containerStyle={[styles.buttonContainerStyle, Spacing.superSmallTopSpacing]} />
            </View>
          </>
        ) : (
            // Pet info is unavailable
            <Text>Nothing to see here</Text>
          )}
      </ScrollView>
    </View >
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    height: SCREEN.HEIGHT * 0.4,
    width: SCREEN.WIDTH,
  },
  container: {
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(24),
  },
  basicInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  actionUpButton: {
    position: 'absolute',
    top: SCREEN.HEIGHT * 0.4 - 25,
    left: SCREEN.WIDTH / 2 - 25
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  healthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  healthValuesContainer: {
    alignItems: 'center',
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerImage: {
    width: SCREEN.WIDTH / 6,
    height: SCREEN.WIDTH / 6,
    borderRadius: SCREEN.WIDTH / 12,
  },
  shelterInfoContainer: {
    flex: 1,
  },
  actionButtonsContainer: {
    flexDirection: 'row'
  },
  buttonStyle: {
    width: 'auto',
    padding: 12,
  },
  dislikeButtonContainerStyle: {
    flex: 1,
    marginRight: scale(8),
  },
  likeButtonContainerStyle: {
    flex: 1,
  }
});

export default PetProfile;;