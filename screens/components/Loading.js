import React from 'react';
import LottieView from 'lottie-react-native';

import {scale} from '../../assets/dimensions';

const Loading = ({type, style}) => {
  switch (type) {
    case 'paw':
      return <LottieView source={require('../../assets/images/loader_paw.json')} autoPlay loop style={[{flex: 1}, style]} />;
    default:
      return <LottieView source={require('../../assets/images/loader_cat.json')} autoPlay loop style={[{flex: 1}, style]} />;
  }
};

export default Loading;
