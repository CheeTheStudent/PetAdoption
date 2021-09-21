import React from 'react';
import { View, FlatList, Image, Text, StyleSheet, ScrollView } from 'react-native';
import { scale, verticalScale } from '../../assets/dimensions';
import { Spacing, TextStyles } from '../../assets/styles';

const O2Pets = () => {

  return (
    <ScrollView style={styles.body}>
      <FlatList
        numColumns={2}
        data={[{}, {}, {}, {}, {}, {}, {}]}
        renderItem={({ item, index }) => (
          <View>
            <Image source={require('../../assets/images/dog.png')} style={styles.image} />
            <Text style={[TextStyles.h4, Spacing.superSmallLeftSpacing, { marginTop: verticalScale(4) }]}>Ron</Text>
            <Text style={[TextStyles.desc, Spacing.superSmallLeftSpacing]}>12 months old</Text>
          </View>
        )}
        columnWrapperStyle={styles.rowContainer}
        style={Spacing.mediumBottomSpacing}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
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
  }
});

export default O2Pets;