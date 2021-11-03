import React, {useState, useLayoutEffect, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ToastAndroid, Alert, ActivityIndicator} from 'react-native';
import {Avatar, Input} from 'react-native-elements';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import {LinkPreview} from '@flyerhq/react-native-link-preview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

import MediaPicker from './components/MediaPicker';
import FullWidthImage from './components/FullWidthImage';
import {moderateScale, scale, verticalScale, SCREEN} from '../assets/dimensions';
import {TextStyles, Spacing} from '../assets/styles';
import colours from '../assets/colours';
import Loading from './components/Loading';

const PostForm = ({navigation}) => {
  const userUID = auth().currentUser.uid;
  const postRef = database().ref('/posts');

  const [user, setUser] = useState();
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState();
  const [media, setMedia] = useState();
  const [link, setLink] = useState();
  const [linkEnabled, setLinkEnabled] = useState(true);
  const [removedLink, setRemovedLink] = useState('');
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Create Post',
      headerTitleAlign: 'center',
      headerLeft: () => <Icon name='close' type='ionicon' size={moderateScale(24)} style={Spacing.smallLeftSpacing} onPress={handleBackButton} />,
      headerRight: () => (
        <Icon name='paper-plane' size={moderateScale(24)} color={!(caption || media || link) ? colours.mediumGray : colours.black} style={Spacing.smallRightSpacing} onPress={handleSubmitPost} />
      ),
    });
  }, [user, caption, location, media, link]);

  useEffect(async () => {
    const userData = await AsyncStorage.getItem('user');
    const user = JSON.parse(userData);
    setUser(user);
  }, []);

  const handleBackButton = () => {
    if (!(caption || media || link)) return navigation.goBack();
    Alert.alert('Unsaved Changes', 'Are you sure you want to discard the post? Your post will be lost.', [{text: 'Cancel'}, {text: "Yes, I'm sure", onPress: () => navigation.goBack()}], {
      cancelable: true,
    });
  };

  const handleOnChangeCaption = text => {
    if (!text.includes(removedLink)) {
      setRemovedLink('');
      setLinkEnabled(true);
    }
    setCaption(text);
  };

  const handleGetLocation = location => {
    setLocation(location);
  };

  const isVideo = url => {
    let n = url.lastIndexOf('.');
    const fileType = url.substring(n + 1);
    return fileType === 'mp4';
  };

  const handleRemoveMedia = () => {
    setMedia(null);
  };

  const handleRemoveLink = () => {
    setRemovedLink(link.link);
    setLink(null);
    setLinkEnabled(false);
  };

  const handleSubmitPost = async () => {
    if (!(caption || media || link)) return;
    setLoading(true);

    let editedCaption = caption;
    if (link) {
      if (caption.endsWith(link.link)) editedCaption = caption.replace(link.link, '');
    }
    const postInfo = {
      caption: editedCaption,
      location,
      media: !media && link ? link.link : undefined,
      mediaType: media ? (isVideo(media[0]) ? 'video' : 'image') : link ? 'link' : undefined,
      user: {
        id: userUID,
        ...user,
      },
      createdAt: database.ServerValue.TIMESTAMP,
    };

    const postKey = await postRef.push(postInfo);

    if (media) {
      let n = media[0].lastIndexOf('/');
      const postStore = storage().ref(`/posts/${postKey.key}/${media[0].substring(n + 1)}`);
      await postStore.putFile(media[0]);
      const url = await postStore.getDownloadURL();
      await postRef.child(postKey.key).update({media: url});
    }

    setLoading(false);
    ToastAndroid.show('Successfully Posted!', ToastAndroid.SHORT);
    navigation.goBack();
  };

  return (
    <View style={styles.body}>
      {user ? (
        <>
          <View style={styles.rowContainer}>
            <Avatar source={user.profilePic ? {uri: user.profilePic} : require('../assets/images/placeholder.png')} size={moderateScale(44)} rounded containerStyle={Spacing.superSmallRightSpacing} />
            <View>
              <Text style={TextStyles.h4}>{user.name}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('GooglePlacesInputModal', {onGoBack: handleGetLocation})} style={styles.rowContainer}>
                <Icon name='location-sharp' size={moderateScale(14)} style={Spacing.superSmallRightSpacing} />
                <Text style={[TextStyles.h4, location ? styles.locationText : styles.locationPlaceholderText]}>{location ? location.name : 'Add Location'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView style={{marginBottom: 20}}>
            <Input
              placeholder='Write your post here'
              multiline
              onChangeText={handleOnChangeCaption}
              inputContainerStyle={{borderBottomWidth: 0}}
              containerStyle={(Spacing.superSmallTopSpacing, {paddingHorizontal: 0})}
            />
            <View>
              <LinkPreview
                text={linkEnabled && !media && caption}
                {...(link ? {previewData: link} : {})}
                onPreviewDataFetched={value => value.link && setLink(value)}
                renderText={() => null}
                metadataContainerStyle={{marginTop: 0}}
                containerStyle={link && styles.linkPreviewContainer}
              />
              {link ? (
                <>
                  <Icon name='close-circle-outline' size={moderateScale(30)} color='white' style={styles.closeIcon} />
                  <Icon name='close-circle' size={moderateScale(30)} style={styles.closeIcon} onPress={handleRemoveLink} />
                </>
              ) : null}
            </View>
            {media ? (
              <View style={styles.mediaContainer}>
                {isVideo(media[0]) ? <Video source={{uri: media[0]}} muted={true} resizeMode='cover' controls style={styles.media} /> : <FullWidthImage source={media[0]} style={styles.media} />}

                <Icon name='close-circle-outline' size={moderateScale(30)} color='white' style={styles.closeIcon} />
                <Icon name='close-circle' size={moderateScale(30)} style={styles.closeIcon} onPress={handleRemoveMedia} />
              </View>
            ) : null}
          </ScrollView>
          {media || link ? null : <MediaPicker singleMedia setChosenMedia={setMedia} style={styles.mediaPicker} />}
        </>
      ) : (
        <Loading type='paw' />
      )}
      <ActivityIndicator animating={loading} size={50} color='black' style={styles.loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: moderateScale(16),
    paddingTop: verticalScale(16),
    backgroundColor: 'white',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: 'black',
    fontWeight: 'bold',
  },
  locationPlaceholderText: {
    color: colours.darkGray,
  },
  mediaContainer: {
    // height: verticalScale(212),
    // aspectRatio: 3 / 2,
    // height: undefined,
    // width: '100%',
  },
  media: {
    flex: 1,
    borderRadius: moderateScale(10),
  },
  mediaPicker: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: verticalScale(16),
  },
  linkPreviewContainer: {
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: colours.lightGray,
    borderRadius: moderateScale(10),
  },
  closeIcon: {
    position: 'absolute',
    top: verticalScale(8),
    right: scale(8),
  },
  loading: {
    position: 'absolute',
    top: SCREEN.HEIGHT / 2 - 25 - 50,
    left: SCREEN.WIDTH / 2 - 25,
  },
});

export default PostForm;
