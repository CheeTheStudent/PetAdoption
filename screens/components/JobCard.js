import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';

import colours from '../../assets/colours';
import { scale, verticalScale, moderateScale } from '../../assets/dimensions';
import { Spacing, TextStyles } from '../../assets/styles';

const JobCard = ({ job, onPress }) => {

  const { title, shelterName, desc, image } = job;

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress} style={styles.card}>
      <Image source={image ? { uri: image } : require('../../assets/images/dog.png')} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={[TextStyles.h3, { marginTop: verticalScale(4) }]}>{title}</Text>
        <Text ellipsizeMode="tail" style={TextStyles.text}>{shelterName}</Text>
        <Text ellipsizeMode="tail" numberOfLines={5} style={[TextStyles.desc]}>{desc}</Text>
      </View>
    </TouchableOpacity>
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
    borderRadius: moderateScale(10),
  },
});

export default JobCard;
