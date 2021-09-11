import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';

import colours from '../../assets/colours/colours';

const SquareButton = ({ title, icon, buttonStyle, onPress, ...rest }) => {

  return (
    <Button
      title={title}
      buttonStyle={[styles.button, buttonStyle]}
      titleStyle={styles.buttonText}
      icon={icon}
      onPress={onPress}
      {...rest} />
  );
};

const styles = StyleSheet.create({
  button: {
    width: 78,
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
