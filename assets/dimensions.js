import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

const {Dimensions} = require('react-native');
const {width, height} = Dimensions.get('window');

const guidelineBaseWidth = 360;
const guidelineBaseHeight = 640;

export const SCREEN = {
  WIDTH: width,
  HEIGHT: height,
};

export const scale = size => (width / guidelineBaseWidth) * size;
export const verticalScale = size => (height / guidelineBaseHeight) * size;
export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export const CARD = {
  WIDTH: width * 0.9,
  HEIGHT: height * 0.8,
  BORDER_RADIUS: scale(16),
  OUT_OF_SCREEN: width * 1.5,
};

export const ACTION_OFFSET = 100;
