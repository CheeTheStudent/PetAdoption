import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';

import ActionButton from './components/ActionButton';
import SquareButton from './components/SquareButton';
import { TextStyles, Spacing } from '../assets/constants/styles';
import { SCREEN } from '../assets/constants/dimensions';

const PetProfile = ({ navigation, route }) => {

  const { pet } = route.params;

  const handleGoBack = () => {
    navigation.goBack();
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
                <Text style={[TextStyles.h1, Spacing.superSmallRightSpacing]}>{pet.name}</Text>
                <Text style={TextStyles.h2}>{pet.age}</Text>
              </View>
              <Text style={[TextStyles.h2, Spacing.superSmallTopSpacing]}>{pet.breed}</Text>
              <View style={[styles.tagContainer, Spacing.mediumVerticalSpacing]}>
                {pet.tags ? pet.tags.map(tag => <Text style={[TextStyles.h3, styles.tag]}>{tag}</Text>) : <></>}
              </View>
              <View style={styles.healthContainer}>
                <View >
                  <Text style={TextStyles.h2}>Weight</Text>
                  <Text style={[TextStyles.h2, Spacing.superSmallTopSpacing]}>Height</Text>
                  <Text style={[TextStyles.h2, Spacing.superSmallTopSpacing]}>Vaccinated</Text>
                  <Text style={[TextStyles.h2, Spacing.superSmallTopSpacing]}>Neutered</Text>
                </View>
                <View style={styles.healthValuesContainer}>
                  <Text style={TextStyles.h2}>1.5kg</Text>
                  <Text style={[TextStyles.h2, Spacing.superSmallTopSpacing]}>1.5kg</Text>
                  <Icon name="checkmark-circle" type="ionicon" size={30} color="black" style={Spacing.superSmallTopSpacing} />
                  <Icon name="checkmark-circle" type="ionicon" size={30} color="black" style={Spacing.superSmallTopSpacing} />
                </View>
              </View>
              <Text style={[TextStyles.h2, Spacing.superSmallTopSpacing]}>About</Text>
              <Text style={[TextStyles.text, Spacing.superSmallTopSpacing]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras cras mi scelerisque quis arcu luctus lacus id vestibulum. Sollicitudin vestibulum mi elit nulla sed. Faucibus pretium convallis quam enim sed tincidunt adipiscing in enim. Aliquam metus in convallis sodales ornare nisl.</Text>
              <Text style={[TextStyles.h2, Spacing.superSmallTopSpacing]}>Owner</Text>
              <View style={[styles.ownerContainer, Spacing.superSmallTopSpacing, Spacing.superSmallBottomSpacing]}>
                <Image source={require('../assets/images/dog.png')} style={[styles.ownerImage, Spacing.smallRightSpacing]} />
                <View style={[styles.shelterInfoContainer, Spacing.superSmallRightSpacing]}>
                  <Text style={[TextStyles.h2, Spacing.superSmallBottomSpacing]} numberOfLines={1}>Jung Shelter Gwanju ung Shelter Gwanju</Text>
                  <Text style={TextStyles.text}>Shelter</Text>
                </View>
                <SquareButton title="View" />
              </View>
              <View style={[styles.actionButtonsContainer, Spacing.superSmallTopSpacing]}>
                < SquareButton buttonStyle={styles.buttonStyle} containerStyle={styles.buttonContainerStyle} icon={<Icon name="thumb-down" type="material-community" color="black" />} />
                <SquareButton buttonStyle={styles.buttonStyle} containerStyle={styles.buttonContainerStyle} icon={<Icon name="thumb-up" type="material-community" color="black" />} />
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
  container: {
    flex: 0.6,
    padding: 24,
  },
  basicInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  image: {
    height: SCREEN.HEIGHT / 2,
    width: SCREEN.WIDTH,
  },
  actionUpButton: {
    position: 'absolute',
    top: SCREEN.HEIGHT / 2 - 25,
    left: SCREEN.WIDTH / 2 - 25
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'black',
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
  buttonContainerStyle: {
    flexGrow: 1,
  }
});

export default PetProfile;