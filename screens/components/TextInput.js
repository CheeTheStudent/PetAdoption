import React from 'react';
import { StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';

import { verticalScale, scale } from '../../assets/dimensions';
import colours from '../../assets/colours';

const TextInput = ({ compRef, placeholder, returnKeyType, defaultValue, onChangeText, onSubmitEditing,
  blurOnSubmit, inputStyle, inputContainerStyle, containerStyle, errorMessage, errorStyle, ...rest }) => {

  return (
    <Input
      ref={compRef}
      placeholder={placeholder}
      returnKeyType={returnKeyType}
      defaultValue={defaultValue}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      blurOnSubmit={blurOnSubmit}
      inputStyle={[styles.inputText, inputStyle]}
      containerStyle={[styles.container, containerStyle]}
      inputContainerStyle={[styles.inputContainer, inputContainerStyle]}
      errorMessage={errorMessage}
      errorStyle={[styles.error, errorStyle]}
      {...rest} />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  inputContainer: {
    height: verticalScale(48),
    paddingHorizontal: scale(8),
    borderWidth: 1,
    borderRadius: 4,
    borderColor: colours.mediumGray,
  },
  inputText: {
    fontSize: 16,
  },
  error: {
    marginHorizontal: 16,
  },
});

export default TextInput;