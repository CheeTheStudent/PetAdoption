import {StyleSheet} from 'react-native';

import {moderateScale, verticalScale, scale} from './dimensions';
import colours from './colours';

export const TextStyles = StyleSheet.create({
  h1: {
    fontFamily: 'Roboto-Regular',
    fontSize: moderateScale(24),
  },
  h2: {
    fontFamily: 'Roboto-Regular',
    fontSize: moderateScale(20),
  },
  h3: {
    fontFamily: 'Roboto-Regular',
    fontSize: moderateScale(16),
  },
  h4: {
    fontFamily: 'Roboto-Regular',
    fontSize: moderateScale(14),
  },
  text: {
    fontFamily: 'Roboto-Regular',
    fontSize: moderateScale(12),
  },
  button: {
    fontFamily: 'Roboto-Medium',
    fontSize: moderateScale(12),
    color: 'black',
  },
  desc: {
    fontFamily: 'Roboto-Regular',
    fontSize: moderateScale(12),
    color: colours.darkGray,
  },
});

export const Spacing = StyleSheet.create({
  superSmallRightSpacing: {
    marginRight: scale(8),
  },
  superSmallLeftSpacing: {
    marginLeft: scale(8),
  },
  superSmallTopSpacing: {
    marginTop: verticalScale(8),
  },
  superSmallBottomSpacing: {
    marginBottom: verticalScale(8),
  },
  superSmallHorizontalSpacing: {
    marginHorizontal: verticalScale(8),
  },
  smallTopSpacing: {
    marginTop: scale(16),
  },
  smallBottomSpacing: {
    marginBottom: scale(16),
  },
  smallHorizontalSpacing: {
    marginHorizontal: scale(16),
  },
  smallRightSpacing: {
    marginRight: scale(16),
  },
  smallLeftSpacing: {
    marginLeft: scale(16),
  },
  mediumVerticalSpacing: {
    marginVertical: verticalScale(24),
  },
  mediumTopSpacing: {
    marginTop: verticalScale(24),
  },
  mediumBottomSpacing: {
    marginBottom: verticalScale(24),
  },
  bigTopSpacing: {
    marginTop: verticalScale(32),
  },
});
