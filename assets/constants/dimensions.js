const { Dimensions } = require('react-native');

const { width, height } = Dimensions.get('screen');

export const SCREEN = {
  WIDTH: width,
  HEIGHT: height,
};

export const CARD = {
  WIDTH: width * 0.9,
  HEIGHT: height * 0.8,
  BORDER_RADIUS: 20,
  OUT_OF_SCREEN: width * 1.5,
};

export const ACTION_OFFSET = 100;