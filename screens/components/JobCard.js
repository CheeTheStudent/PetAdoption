import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import colours from '../../assets/colours';
import { scale, verticalScale, moderateScale } from '../../assets/dimensions';
import { Spacing, TextStyles } from '../../assets/styles';

const JobCard = () => {

  return (
    <View style={styles.card}>
      <Image source={require('../../assets/images/dog.png')} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={[TextStyles.h4, { marginTop: verticalScale(4) }]}>Volunteer</Text>
        <Text ellipsizeMode="tail" numberOfLines={5} style={TextStyles.text}>Gwanju Shelter</Text>
        <Text ellipsizeMode="tail" numberOfLines={5} style={[TextStyles.desc, Spacing.superSmallTopSpacing]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras cras mi scelerisque quis arcu luctus lacus id vestibulum. Sollicitudin vestibulum mi elit nulla sed. Faucibus pretium convallis quam enim sed tincidunt adipiscing in enim. Aliquam metus in convallis sodales ornare nislfvfeweddeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeesfeefwefwefrtgtrg</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    height: verticalScale(125),
    padding: scale(8),
    marginVertical: verticalScale(8),
    borderWidth: 1,
    borderColor: colours.lightGray,
    borderRadius: moderateScale(10),
  },
  image: {
    height: verticalScale(109),
    width: verticalScale(109),
    marginRight: scale(8),
    borderRadius: scale(10),
  }
});

export default JobCard;
