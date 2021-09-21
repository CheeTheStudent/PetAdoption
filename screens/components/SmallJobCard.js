import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { scale, verticalScale, moderateScale } from '../../assets/dimensions';
import { Spacing, TextStyles } from '../../assets/styles';
import colours from '../../assets/colours';

const SmallJobCard = ({ title, desc, onPress }) => {

  return (
    <TouchableOpacity
      key={title}
      onPress={() => console.log("pressed on hori item")}
      style={Spacing.superSmallRightSpacing}>
      <View style={styles.card}>
        <Text style={TextStyles.h4}>{title}</Text>
        <Text ellipsizeMode="tail" numberOfLines={6} style={[TextStyles.text, styles.text]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras cras mi scelerisque quis arcu luctus lacus id vestibulum. Sollicitudin vestibulum mi elit nulla sed. Faucibus pretium convallis quam enim sed tincidunt adipiscing in enim. Aliquam metus in convallis sodales ornare nislfvfeweddeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeesfeefwefwefrtgtrgt</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: scale(290),
    height: verticalScale(125),
    padding: scale(16),
    borderWidth: 1,
    borderColor: colours.lightGray,
    borderRadius: moderateScale(10),
  },
});

export default SmallJobCard;