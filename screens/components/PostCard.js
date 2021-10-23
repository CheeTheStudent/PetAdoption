import React from 'react';
import {View, Text, TouchableOpacity, Image, Pressable, StyleSheet} from 'react-native';
import {Avatar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import {LinkPreview} from '@flyerhq/react-native-link-preview';
import auth from '@react-native-firebase/auth';

import {getTimeFromNow} from '../../utils/utils';
import {moderateScale, scale, verticalScale} from '../../assets/dimensions';
import {Spacing, TextStyles} from '../../assets/styles';
import colours from '../../assets/colours';

const PostCard = ({post, onLike, onOpenPost, onBookmark, disabled, style}) => {
  const userUID = auth().currentUser.uid;
  const {id: postId, caption, createdAt, location, media, mediaType, user, likes: likesData, comments: commentsData, saves: savesData} = post;

  let liked = false;
  let saved = false;
  const likes = [];
  const saves = [];
  const comments = [];

  if (likesData) {
    Object.entries(likesData).map(value => likes.push(value[0]));
    if (likes.indexOf(userUID) >= 0) liked = true;
  }

  if (commentsData) Object.entries(commentsData).map(value => comments.push(value[0]));

  if (savesData) {
    Object.entries(savesData).map(value => saves.push(value[0]));
    if (saves.indexOf(userUID) >= 0) saved = true;
  }

  return (
    <TouchableOpacity onPress={onOpenPost} disabled={disabled} style={[styles.body, style]}>
      <View style={styles.rowContainer}>
        <Avatar source={user.profilePic ? {uri: user.profilePic} : require('../../assets/images/placeholder.png')} size={moderateScale(44)} rounded containerStyle={Spacing.superSmallRightSpacing} />
        <View>
          <Text style={TextStyles.h4}>{user.name}</Text>
          {location ? <Text style={TextStyles.desc}>{location.name}</Text> : null}
        </View>
        <Icon name='ellipsis-vertical' size={moderateScale(20)} color={colours.darkGray} style={{marginLeft: 'auto'}} />
      </View>
      <Text style={[TextStyles.h4, Spacing.superSmallTopSpacing]}>{caption}</Text>
      {media && mediaType === 'image' ? (
        <Image source={media ? {uri: media} : require('../../assets/images/placeholder.png')} style={[styles.media, Spacing.smallTopSpacing]} />
      ) : mediaType === 'video' ? (
        <Video source={{uri: media}} muted={true} resizeMode='cover' repeat style={[styles.media, Spacing.smallTopSpacing]} />
      ) : mediaType === 'link' ? (
        <LinkPreview text={media} renderText={() => null} metadataContainerStyle={{marginTop: 0}} containerStyle={[styles.linkPreviewContainer, Spacing.smallTopSpacing]} />
      ) : null}
      <Text style={[TextStyles.desc, , Spacing.superSmallTopSpacing]}>{getTimeFromNow(createdAt)}</Text>
      <View style={[styles.rowContainer, Spacing.smallTopSpacing]}>
        <Pressable onPress={onLike} style={styles.rowContainer}>
          <Icon name={liked ? 'heart' : 'heart-outline'} size={moderateScale(20)} color={liked ? 'red' : colours.darkGray} />
          <Text style={[TextStyles.text, Spacing.smallRightSpacing, styles.actionText]}>{likes.length}</Text>
        </Pressable>
        <Pressable onPress={onOpenPost} style={styles.rowContainer}>
          <Icon name='chatbubble-outline' size={moderateScale(18)} color={colours.darkGray} />
          <Text style={[TextStyles.text, styles.actionText]}>{comments.length}</Text>
        </Pressable>
        <Icon name={saved ? 'bookmark' : 'bookmark-outline'} size={moderateScale(18)} onPress={onBookmark} color={colours.darkGray} style={{marginLeft: 'auto'}} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  body: {
    marginVertical: verticalScale(8),
    marginHorizontal: scale(16),
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  media: {
    width: 'auto',
    height: verticalScale(212),
    borderRadius: moderateScale(10),
  },
  linkPreviewContainer: {
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: colours.lightGray,
    borderRadius: moderateScale(10),
  },
  actionText: {
    marginLeft: scale(8),
    color: colours.darkGray,
  },
});

export default PostCard;
