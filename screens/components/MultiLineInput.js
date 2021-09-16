import React from 'react';
import { StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';

import { verticalScale, scale } from '../../assets/dimensions';
import colours from '../../assets/colours';

const MultiLineInput = ({ placeholder, returnKeyType, defaultValue, numberOfLines, onChangeText, onSubmitEditing,
  blurOnSubmit, inputStyle, inputContainerStyle, containerStyle, ...rest }) => {

  return (
    <Input
      placeholder={placeholder}
      returnKeyType={returnKeyType}
      defaultValue={defaultValue}
      multiline
      numberOfLines={numberOfLines}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      blurOnSubmit={blurOnSubmit}
      inputStyle={[styles.inputText, inputStyle]}
      containerStyle={[styles.container, containerStyle]}
      inputContainerStyle={[styles.inputContainer, inputContainerStyle]}
      textAlignVertical={"top"}
      renderErrorMessage={false}
      {...rest} />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  inputContainer: {
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

export default MultiLineInput;