import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-player';
import ImageColors from 'react-native-image-colors';

import {SCREEN, scale, verticalScale} from '../../assets/dimensions';
import colours from '../../assets/colours';

const GalleryView = ({navigation, route}) => {
  const {media} = route.params;

  const [loading, setLoading] = useState(false);
  const [bgColours, setBgColours] = useState([]);
  const [colourLoading, setColourLoading] = useState(true);

  useEffect(async () => {
    let fetchColours = Array(media.length).fill(colours.darkGray);
    await Promise.all(
      media.map(async (item, i) => {
        if (!isVideo(item)) {
          const bg = await ImageColors.getColors(item, {
            pixelSpacing: 100,
            cache: true,
            key: item,
          });
          fetchColours[i] = bg.average;
        }
      }),
    );
    setBgColours(fetchColours);
    setColourLoading(false);
  }, []);

  const isVideo = url => {
    let n = url.lastIndexOf('?');
    const fileType = url.substring(n - 3, n);
    return fileType === 'mp4';
  };

  const goBack = () => {
    setLoading(false);
    navigation.goBack();
  };

  return (
    <View style={styles.body}>
      {colourLoading ? (
        <ActivityIndicator color={colours.black} style={styles.absoluteCenter} />
      ) : (
        <FlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={media}
          keyExtractor={index => index}
          renderItem={({item, index}) => (
            <View key={index} style={[styles.item, {backgroundColor: bgColours[index]}]}>
              {isVideo(item) ? (
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <VideoPlayer
                    video={{uri: item}}
                    videoWidth={SCREEN.WIDTH}
                    videoHeight={SCREEN.HEIGHT * 0.9}
                    resizeMode='contain'
                    onLoadStart={() => setLoading(true)}
                    onLoad={() => setLoading(false)}
                    style={{backgroundColor: colours.darkGray}}
                  />
                  <ActivityIndicator animating={loading} color={colours.black} style={styles.absoluteCenter} />
                </View>
              ) : (
                <Image source={{uri: item}} resizeMode='contain' style={{flex: 1}} />
              )}
            </View>
          )}
        />
      )}
      <TouchableOpacity onPress={goBack} style={styles.fab}>
        <Icon name='arrow-back' type='ionicon' size={24} color='white' />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
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
    width: verticalScale(32),
    aspectRatio: 1,
    position: 'absolute',
    top: verticalScale(16),
    left: scale(16),
    justifyContent: 'center',
    borderRadius: verticalScale(16),
    backgroundColor: colours.blackTransparent,
  },
});

export default GalleryView;
