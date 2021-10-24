import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Image, FlatList, StyleSheet, PermissionsAndroid, Platform} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import Modal from 'react-native-modal';
import CameraRoll from '@react-native-community/cameraroll';
import ImagePicker from 'react-native-image-crop-picker';

import SquareButton from './SquareButton';
import {scale, verticalScale, moderateScale} from '../../assets/dimensions';
import {Spacing} from '../../assets/styles';
import colours from '../../assets/colours';

const MediaPicker = ({singleMedia, imageOnly, profilePicture, profilePictureSize, buttons, setChosenMedia, style}) => {
  const READ_PERMISSION = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

  const [hasPermission, setHasPermission] = useState(false);
  const [recentPics, setRecentPics] = useState();
  const [isModalVisible, setModalVisible] = useState(false);

  const handleRequestPermission = async () => {
    if (!hasPermission) {
      const status = await PermissionsAndroid.request(READ_PERMISSION);
      setHasPermission(status === 'granted');
    }
  };

  useEffect(async () => {
    // Check permissions
    const status = await PermissionsAndroid.check(READ_PERMISSION);
    if (status) {
      setHasPermission(true);
    }

    // Get recent gallery photos
    if (status) {
      CameraRoll.getPhotos({
        first: 10,
        assetType: imageOnly ? 'Photos' : 'All',
      })
        .then(results => {
          let images = ['first', ...results.edges, 'last'];
          setRecentPics(images);
        })
        .catch(err => console.log(err));
    }

    // ImagePicker.clean()
    //   .then(() => {
    //     console.log('removed all tmp images from tmp directory');
    //   })
    //   .catch(e => {
    //     alert(e);
    //   });
  }, [hasPermission]);

  const handleTakePhoto = () => {
    ImagePicker.openCamera({
      mediaType: 'any',
    })
      .then(image => {
        handleCropImage(image);
      })
      .catch(() => setModalVisible(false));
  };

  const handleTakeVideo = () => {
    setModalVisible(false);
    ImagePicker.openCamera({
      mediaType: 'video',
    })
      .then(video => {
        handleChosenMedia(video);
      })
      .catch(() => setModalVisible(false));
  };

  const handleGalleryPicker = () => {
    ImagePicker.openPicker({
      multiple: !singleMedia && !profilePicture,
      mediaType: imageOnly || profilePicture ? 'photo' : 'any,',
    })
      .then(images => {
        if (images.length == 1 && images[0].mime === 'image/jpeg') handleCropImage(images[0]);
        else if (!images.length) handleCropImage(images);
        else handleChosenMedia(images);
      })
      .catch(() => setModalVisible(false));
  };

  const handleCropImage = image => {
    ImagePicker.openCropper({
      path: image.path || image,
      freeStyleCropEnabled: true,
      hideBottomControls: true,
      enableRotationGesture: true,
      cropperActiveWidgetColor: colours.mediumGray,
    })
      .then(image => {
        handleChosenMedia(image);
      })
      .catch(() => setModalVisible(false));
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleRemoveMedia = () => {
    setModalVisible(false);
    setChosenMedia(null);
  };

  const handleChosenMedia = media => {
    let chosenPaths = [];
    if (Array.isArray(media)) {
      media.map(item => chosenPaths.push(item.path));
    } else {
      chosenPaths.push(media.path);
    }
    setModalVisible(false);
    if (profilePicture || singleMedia) return setChosenMedia(chosenPaths);
    setChosenMedia(prev => (prev ? [...prev, ...chosenPaths] : chosenPaths));
  };

  return (
    <View style={style}>
      {recentPics && hasPermission ? (
        profilePicture ? (
          <Icon name='camera-outline' type='material-community' size={profilePictureSize || moderateScale(24)} color='white' onPress={toggleModal} />
        ) : buttons ? (
          <View style={[Spacing.superSmallTopSpacing, {flexDirection: 'row'}]}>
            <SquareButton
              title='Camera'
              containerStyle={Spacing.superSmallRightSpacing}
              icon={<Icon name='camera-outline' type='material-community' size={moderateScale(30)} containerStyle={Spacing.superSmallRightSpacing} />}
              onPress={toggleModal}
            />
            <SquareButton
              title='Gallery'
              icon={<Icon name='image' type='material-community' size={moderateScale(30)} containerStyle={Spacing.superSmallRightSpacing} />}
              onPress={handleGalleryPicker}
            />
          </View>
        ) : (
          <FlatList
            horizontal
            keyExtractor={(item, index) => index}
            data={recentPics}
            style={Spacing.smallTopSpacing}
            renderItem={({item, index}) => {
              if (item === 'first') {
                return (
                  <TouchableOpacity style={[styles.cameraButton, Spacing.superSmallRightSpacing]} onPress={imageOnly ? handleTakePhoto : toggleModal}>
                    <Icon name='camera-outline' type='material-community' size={moderateScale(30)} />
                  </TouchableOpacity>
                );
              } else if (item === 'last') {
                return (
                  <TouchableOpacity style={styles.cameraButton} onPress={handleGalleryPicker}>
                    <Icon name='image' type='material-community' size={moderateScale(30)} />
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity onPress={() => handleCropImage(item.node.image.uri)}>
                    <Image source={{uri: item.node.image.uri}} style={styles.cameraPics} />
                  </TouchableOpacity>
                );
              }
            }}
          />
        )
      ) : profilePicture ? (
        <Icon name='camera-outline' type='material-community' size={profilePictureSize || moderateScale(24)} color='white' onPress={handleRequestPermission} />
      ) : (
        <TouchableOpacity style={[styles.cameraButton, Spacing.smallTopSpacing]} onPress={handleRequestPermission}>
          <Icon name='image' type='material-community' size={moderateScale(30)} />
        </TouchableOpacity>
      )}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)} backdropTransitionOutTiming={0}>
        <View>
          <Button title='Take Photo' onPress={handleTakePhoto} />
          {profilePicture ? (
            <>
              <Button title='Choose Existing Photo' onPress={handleGalleryPicker} />
              <Button title='Remove Photo' onPress={handleRemoveMedia} />
            </>
          ) : (
            <Button title='Take Video' onPress={handleTakeVideo} />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraButton: {
    height: verticalScale(105),
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colours.lightGray,
    borderRadius: moderateScale(3),
  },
  cameraPics: {
    width: verticalScale(105),
    height: verticalScale(105),
    marginRight: scale(8),
    borderRadius: moderateScale(3),
  },
});

export default MediaPicker;
