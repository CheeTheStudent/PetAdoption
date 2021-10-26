import React from 'react';
import {Text, View} from 'react-native';
import LottieView from 'lottie-react-native';

import {scale} from '../../assets/dimensions';
import {Spacing, TextStyles} from '../../assets/styles';
import colours from '../../assets/colours';

const NoResults = ({title, desc, style}) => {
  return (
    <View style={[{flex: 1, alignItems: 'center', justifyContent: 'center'}, style]}>
      <LottieView source={require('../../assets/images/empty.json')} autoPlay loop={false} style={{width: scale(300)}} />
      <Text style={[TextStyles.h2, Spacing.superSmallTopSpacing, {color: colours.mediumGray}]}>{title}</Text>
      <Text style={[TextStyles.desc, {color: colours.mediumGray}]}>{desc}</Text>
    </View>
  );
};

export default NoResults;
