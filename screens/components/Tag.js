import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-elements';

import colours from '../../assets/colours';
import { TextStyles } from '../../assets/styles';
import { moderateScale, scale, verticalScale } from '../../assets/dimensions';

const Tag = ({ title, type, disabled, onSelected }) => {

  const [pressed, setPressed] = useState(false);

  const handleOnPress = ({ target }) => {
    setPressed(!pressed);
    onSelected(title, !pressed);
  };

  const buttonStyle = (type) => {
    switch (type) {
      case 'white': return { backgroundColor: colours.white };
      case 'white-outline': return { backgroundColor: colours.white, borderWidth: 1, borderColor: colours.black };
      case 'black': return { backgroundColor: colours.black, borderWidth: 1, borderColor: colours.white };
      default: return { backgroundColor: colours.lightGray };
    }
  };

  const textStyle = (type) => {
    switch (type) {
      case 'black': return { color: 'white' };
      case 'white':
      case 'white-outline':
      default: return { color: 'black' };
    }
  };

  return (
    <Chip
      title={title}
      disabled={disabled}
      titleStyle={[TextStyles.h4, pressed ? styles.textPressed : textStyle(type)]}
      buttonStyle={[pressed ? styles.buttonPressed : buttonStyle(type), styles.button]}
      containerStyle={styles.container}
      disabledStyle={[buttonStyle(type), styles.button]}
      disabledTitleStyle={textStyle(type)}
      onPress={handleOnPress} />
  );
};

const styles = StyleSheet.create({
  textPressed: {
    color: 'white',
  },
  button: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12),
  },
  buttonPressed: {
    backgroundColor: 'black',
  },
  container: {
    marginRight: scale(8),
    marginTop: verticalScale(8),
    borderRadius: moderateScale(24)
  }
});

export default Tag;