import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

import colours from '../../assets/colours';
import { TextStyles } from '../../assets/styles';
import { SCREEN, scale, verticalScale, moderateScale } from '../../assets/dimensions';

const LongRoundButton = ({ title, onPress, containerStyle, ...rest }) => {

  return (
    <Button
      title={title}
      buttonStyle={styles.button}
      titleStyle={TextStyles.button}
      containerStyle={[styles.buttonContainer, containerStyle]}
      onPress={onPress}
      {...rest} />
  );
};

const styles = StyleSheet.create({
  button: {
    height: verticalScale(42),
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colours.mediumGray,
    borderRadius: 30,
  },
  buttonContainer: {
    width: '82%',
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: colours.black,
  },
});

export default LongRoundButton;
