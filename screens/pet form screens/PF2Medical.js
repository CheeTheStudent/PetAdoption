import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

import TextInput from '../components/TextInput';
import SquareButton from '../components/SquareButton';
import LongRoundButton from '../components/LongRoundButton';
import MultiLineInput from '../components/MultiLineInput';
import {verticalScale, scale, moderateScale} from '../../assets/dimensions';
import {TextStyles, Spacing} from '../../assets/styles';
import colours from '../../assets/colours';

const PF2Medical = ({navigation, route, pet}) => {
  const {petInfo} = route.params;

  const [weight, setWeight] = useState(pet ? pet.weight : '');
  const [height, setHeight] = useState(pet ? pet.height : '');
  const [vaccine, setVaccine] = useState(pet ? pet.vaccinated : 'None');
  const [spayed, setSpayed] = useState(pet ? pet.spayed : false);
  const [desc, setDesc] = useState(pet ? pet.illnessDescription : '');

  const handleSubmit = async () => {
    const updatedPetInfo = {
      ...petInfo,
      weight,
      height,
      vaccinated: vaccine,
      spayed,
      illnessDescription: desc,
    };

    navigation.navigate('Tags', {petInfo: updatedPetInfo});
  };

  return (
    <View style={styles.body}>
      <ScrollView style={{paddingHorizontal: scale(16)}}>
        <View style={styles.rowContainer}>
          <Text style={TextStyles.h3}>Weight</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              placeholder='0.00'
              keyboardType='numeric'
              maxLength={4}
              defaultValue={weight}
              onChangeText={value => setWeight(value)}
              renderErrorMessage={false}
              inputContainerStyle={{height: verticalScale(40)}}
              containerStyle={[Spacing.smallRightSpacing, {width: scale(60)}]}
            />
            <Text style={TextStyles.h4}>kg</Text>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <Text style={TextStyles.h3}>Height</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              placeholder='0.00'
              keyboardType='numeric'
              maxLength={4}
              defaultValue={height}
              onChangeText={value => setHeight(value)}
              renderErrorMessage={false}
              inputContainerStyle={{height: verticalScale(40)}}
              containerStyle={[Spacing.smallRightSpacing, {width: scale(60)}]}
            />
            <Text style={TextStyles.h4}>cm</Text>
          </View>
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Vaccination Status</Text>
        <View style={styles.rowContainer}>
          <SquareButton
            title='None'
            containerStyle={styles.squareLeftButton}
            buttonStyle={[vaccine === 'None' && styles.squareButtonPressed, styles.squareButton]}
            titleStyle={vaccine === 'None' && styles.squareButtonTextPressed}
            onPress={() => setVaccine('None')}
          />
          <SquareButton
            title='Half'
            containerStyle={styles.squareLeftButton}
            buttonStyle={[vaccine === 'Half' && styles.squareButtonPressed, styles.squareButton]}
            titleStyle={vaccine === 'Half' && styles.squareButtonTextPressed}
            onPress={() => setVaccine('Half')}
          />
          <SquareButton
            title='Full'
            containerStyle={styles.squareRightButton}
            buttonStyle={[vaccine === 'Full' && styles.squareButtonPressed, styles.squareButton]}
            titleStyle={vaccine === 'Full' && styles.squareButtonTextPressed}
            onPress={() => setVaccine('Full')}
          />
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>{petInfo.gender ? 'Spayed' : 'Neutered'}</Text>
        <View style={styles.rowContainer}>
          <SquareButton
            title='No'
            containerStyle={styles.squareLeftButton}
            buttonStyle={[!spayed && styles.squareButtonPressed, styles.squareButton]}
            titleStyle={!spayed && styles.squareButtonTextPressed}
            onPress={() => setSpayed(false)}
          />
          <SquareButton
            title='Yes'
            containerStyle={styles.squareRightButton}
            buttonStyle={[spayed && styles.squareButtonPressed, styles.squareButton]}
            titleStyle={spayed && styles.squareButtonTextPressed}
            onPress={() => setSpayed(true)}
          />
        </View>
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Health Issues</Text>
        <Text style={TextStyles.desc}>If your pet has any illnesses or allergies, write them down here!</Text>
        <MultiLineInput numberOfLines={5} defaultValue={desc} onChangeText={desc => setDesc(desc)} containerStyle={Spacing.smallTopSpacing} />
        <View style={styles.bottomContainer}>
          <Text onPress={() => navigation.goBack()} style={styles.skipText}>
            {'BACK'}
          </Text>
          <LongRoundButton title={'CONTINUE'} onPress={handleSubmit} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(16),
  },
  squareButton: {
    height: verticalScale(40),
  },
  squareLeftButton: {
    flex: 1,
    marginRight: scale(8),
  },
  squareRightButton: {
    flex: 1,
  },
  squareButtonPressed: {
    backgroundColor: colours.black,
  },
  squareButtonTextPressed: {
    color: colours.white,
  },
  bottomContainer: {
    marginTop: verticalScale(24),
    marginBottom: verticalScale(32),
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  skipText: {
    marginHorizontal: scale(8),
    fontSize: moderateScale(12),
    textDecorationLine: 'underline',
  },
});

export default PF2Medical;
