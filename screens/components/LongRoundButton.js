import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

import colours from '../../assets/colours/colours';

const LongRoundButton = ({ title, onPress, ...rest }) => {

  return (
    <Button
      title={title}
      buttonStyle={styles.button}
      titleStyle={styles.buttonText}
      containerStyle={styles.buttonContainer}
      onPress={onPress}
      {...rest} />
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colours.mediumGray,
    borderRadius: 30,
  },
  buttonContainer: {
    borderRadius: 30,
    marginBottom: 8,
    marginHorizontal: 32,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: colours.black,
  },
});

export default LongRoundButton;
