import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Chip} from 'react-native-elements';

import colours from '../../assets/colours';
import {TextStyles} from '../../assets/styles';
import {moderateScale, scale, verticalScale} from '../../assets/dimensions';

const Tag = ({title, type, disabled, onSelected, onSingleSelected, containerStyle, ...rest}) => {
  const [pressed, setPressed] = useState(false);

  const handleOnPress = ({target}) => {
    if (onSelected) {
      setPressed(!pressed);
      onSelected(title, !pressed);
    } else if (onSingleSelected) {
      onSingleSelected(title);
    }
  };

  const buttonStyle = type => {
    switch (type) {
      case 'white':
        return {backgroundColor: colours.white};
      case 'white-outline':
        return {backgroundColor: colours.white, borderColor: colours.black};
      case 'black':
        return {backgroundColor: colours.black, borderColor: colours.white};
      default:
        return {backgroundColor: colours.lightGray};
    }
  };

  const textStyle = type => {
    switch (type) {
      case 'black':
        return {color: 'white'};
      case 'white':
      case 'white-outline':
      default:
        return {color: 'black'};
    }
  };

  return (
    <Chip
      title={title}
      disabled={disabled}
      titleStyle={[TextStyles.h4, pressed ? styles.textPressed : textStyle(type)]}
      buttonStyle={[styles.button, pressed ? styles.buttonPressed : buttonStyle(type)]}
      containerStyle={[styles.container, containerStyle]}
      disabledStyle={[styles.button, buttonStyle(type)]}
      disabledTitleStyle={textStyle(type)}
      onPress={handleOnPress}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  textPressed: {
    color: 'white',
  },
  button: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12),
    borderWidth: 1,
    borderColor: 'transparent',
  },
  buttonPressed: {
    backgroundColor: 'black',
  },
  container: {
    marginRight: scale(8),
    marginTop: verticalScale(8),
    borderRadius: moderateScale(24),
  },
});

export default Tag;
