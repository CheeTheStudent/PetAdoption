import React, {useEffect, useState} from 'react';
import {Dimensions, Image} from 'react-native';

const FullWidthImage = ({source, style}) => {
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();

  useEffect(() => {
    Image.getSize(source, (srcWidth, srcHeight) => {
      const maxHeight = Dimensions.get('window').height * 0.6;
      const maxWidth = Dimensions.get('window').width - 32;

      const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
      setWidth(maxWidth);
      setHeight(srcHeight * ratio);
    });
  }, []);

  return <Image style={[style, {width: width, height: height}]} source={{uri: source}} />;
};

export default FullWidthImage;
