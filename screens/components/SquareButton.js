import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';

import colours from '../../assets/colours';

const SquareButton = ({ title, icon, titleStyle, buttonStyle, containerStyle, onPress, ...rest }) => {

  return (
    <Button
      title={title}
      titleStyle={[styles.buttonText, titleStyle]}
      buttonStyle={[styles.button, buttonStyle]}
      containerStyle={containerStyle}
      icon={icon}
      onPress={onPress}
      {...rest} />
  );
};

const styles = StyleSheet.create({
  button: {
    // width: 78,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colours.mediumGray,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: colours.black,
  },
});

export default SquareButton;
