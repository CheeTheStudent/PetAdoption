import React, { useState } from 'react';
import { View, FlatList, Image, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import Video from 'react-native-video';

import { SCREEN, scale, verticalScale } from '../../assets/dimensions';
import colours from '../../assets/colours';

const GalleryView = ({ navigation, route }) => {

  const { media } = route.params;

  const [loading, setLoading] = useState(false);

  const isVideo = url => {
    let n = url.lastIndexOf('?');
    const fileType = url.substring(n - 3, n);
    return fileType === 'mp4';
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.body}>
      {loading && <ActivityIndicator color={colours.black} style={styles.absoluteCenter} />}
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={media}
        renderItem={({ item, index }) =>
          <View key={index} style={styles.item}>
            {isVideo(item) ?
              <Video source={{ uri: item }}
                resizeMode="cover"
                controls
                muted={true}
                onLoadStart={() => setLoading(true)}
                onLoad={() => setLoading(false)}
                style={{ flex: 1, backgroundColor: colours.darkGray }} />
              : <Image
                source={{ uri: item }}
                style={{ flex: 1 }}
              />}
          </View>
        }
      />
      <TouchableOpacity onPress={goBack} style={styles.fab} >
        <Icon name='arrow-left' type='material-community' size={25} color='black' />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1
  },
  item: {
    width: SCREEN.WIDTH,
    height: SCREEN.HEIGHT,
  },
  absoluteCenter: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
  },
  fab: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: verticalScale(25),
    backgroundColor: colours.white,
    justifyContent: 'center',
    position: 'absolute',
    top: verticalScale(16),
    left: scale(16),
    elevation: 30,
  }
});

export default GalleryView;