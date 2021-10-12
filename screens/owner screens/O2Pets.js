import React from 'react';
import {View, FlatList, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {scale, verticalScale} from '../../assets/dimensions';
import {Spacing, TextStyles} from '../../assets/styles';

const O2Pets = ({navigation, pets}) => {
  const calcPetAge = (ageYear, ageMonth) => {
    let ageLabel = '';
    if (ageYear == 0) {
      ageLabel = ageMonth + ' months';
    } else if (ageMonth == 0) {
      ageLabel = ageYear + ' years';
    } else if (ageYear > 0 && ageMonth > 0) {
      ageLabel = ageYear + ' years ' + ageMonth + ' months';
    } else {
      ageLabel = 'Age Unspecified';
    }
    return ageLabel;
  };

  return (
    <View style={styles.body}>
      <FlatList
        numColumns={2}
        data={pets}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <TouchableOpacity onPress={() => navigation.navigate('PetProfile', {pet: item})}>
            <Image source={item.media ? {uri: item.media[0]} : require('../../assets/images/placeholder.png')} style={styles.image} />
            <Text style={[TextStyles.h4, Spacing.superSmallLeftSpacing, {marginTop: verticalScale(4)}]}>{item.name}</Text>
            <Text style={[TextStyles.desc, Spacing.superSmallLeftSpacing]}>{calcPetAge(item.ageYear, item.ageMonth)}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.rowContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },
  rowContainer: {
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
  },
  image: {
    width: scale(156),
    height: scale(156),
    borderRadius: scale(5),
  },
});

export default O2Pets;
