import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Icon} from 'react-native-elements';

import {CARD, SCREEN, verticalScale, scale} from '../../assets/dimensions';
import colours from '../../assets/colours';

const ActionButton = ({name, containerStyle, iconStyle, onPress}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.iconButton, containerStyle]}>
        <Icon name={name} type='material-community' color={colours.black} {...iconStyle} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  iconButtonsContainer: {
    width: SCREEN.WIDTH,
    flexDirection: 'row',
    position: 'absolute',
    justifyContent: 'space-evenly',
    top: CARD.HEIGHT - CARD.HEIGHT * 0.02,
  },
  iconButton: {
    height: verticalScale(37),
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: 'white',
    shadowColor: 'black',
    elevation: 10,
  },
});

export default ActionButton;
