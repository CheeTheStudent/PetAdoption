import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, ToastAndroid} from 'react-native';
import {Avatar, Icon, Input} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PostCard from './components/PostCard';
import OneSignalNotif from '../utils/OneSignalNotif';
import Loading from './components/Loading';
import {getTimeFromNow} from '../utils/utils';
import {verticalScale, moderateScale, scale} from '../assets/dimensions';
import {Spacing, TextStyles} from '../assets/styles';
import colours from '../assets/colours';

const Post = ({navigation, route}) => {
  const userUID = auth().currentUser.uid;
  const {postId} = route.params;
  const postRef = database().ref(`/posts/${postId}`);
  const userRef = database().ref(`/users/${userUID}`);
  const oneSignalNotif = OneSignalNotif();

  const [user, setUser] = useState();
  const [post, setPost] = useState();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('user').then(userData => {
      const user = JSON.parse(userData);
      setUser(user);
    });

    let thisPostRef = postRef.on('value', snapshot => {
      const data = snapshot.val() ? snapshot.val() : {};
      setPost({id: snapshot.key, ...data});

      let retrievedComments = [];
      if (data.comments) Object.entries(data.comments).map(value => retrievedComments.push({id: value[0], ...value[1]}));
      retrievedComments.sort((x, y) => y.createdAt - x.createdAt);
      setComments(retrievedComments);
    });

    return () => postRef.off('value', thisPostRef);
  }, []);

  const handleOnLike = () => {
    if (post.likes?.hasOwnProperty(userUID)) return postRef.child(`likes/${userUID}`).remove();
    postRef.child(`likes/${userUID}`).set(userUID);
    oneSignalNotif.sendLikeNotification(post.user.id, post.id, post.caption);
  };

  const handleOnComment = () => {
    if (comment) {
      const newComment = {
        comment,
        user,
        createdAt: database.ServerValue.TIMESTAMP,
      };
      postRef.child('comments').push(newComment);
      setComment('');
      oneSignalNotif.sendCommentNotification(post.user.id, newComment, post.id);
    }
  };

  const handleOnBookmark = () => {
    if (post.saves?.hasOwnProperty(userUID)) {
      userRef.child(`savedPosts/${postId}`).remove();
      return postRef.child(`saves/${userUID}`).remove();
    }
    userRef.child(`savedPosts/${postId}`).set(database.ServerValue.TIMESTAMP);
    postRef.child(`saves/${userUID}`).set(database.ServerValue.TIMESTAMP);
  };

  const handleOnDelete = () => {
    navigation.goBack();
    postRef.remove();
    ToastAndroid.show('Post deleted!', ToastAndroid.SHORT);
  };

  const renderHeaderComponent = () => <PostCard post={post} disabled onLike={handleOnLike} onBookmark={handleOnBookmark} onDelete={handleOnDelete} />;

  return (
    <View style={styles.body}>
      {post ? (
        <>
          <FlatList
            data={comments}
            keyExtractor={item => item.id}
            ListHeaderComponent={renderHeaderComponent()}
            ListHeaderComponentStyle={styles.horizontalLine}
            renderItem={({item, index}) => (
              <View style={styles.commentRowContainer}>
                <Avatar
                  source={item.user.profilePic ? {uri: item.user.profilePic} : require('../assets/images/placeholder.png')}
                  size={moderateScale(44)}
                  rounded
                  containerStyle={[Spacing.superSmallRightSpacing, Spacing.superSmallTopSpacing]}
                />
                <View style={styles.commentContainer}>
                  <View style={styles.commentInfoContainer}>
                    <Text style={[TextStyles.h4, Spacing.superSmallRightSpacing, {fontWeight: 'bold'}]}>{item.user.name}</Text>
                    <Text style={TextStyles.desc}>{getTimeFromNow(item.createdAt)}</Text>
                  </View>
                  <Text style={styles.commentText}>{item.comment}</Text>
                </View>
              </View>
            )}
          />
          <View style={styles.bottomContainer}>
            <Avatar
              source={user?.profilePic ? {uri: user.profilePic} : require('../assets/images/placeholder.png')}
              size={moderateScale(36)}
              rounded
              containerStyle={[Spacing.superSmallRightSpacing]}
            />
            <Input
              placeholder='Write your comment here'
              value={comment}
              onChangeText={value => setComment(value)}
              renderErrorMessage={false}
              containerStyle={styles.inputContainer}
              inputContainerStyle={styles.input}
              inputStyle={TextStyles.h4}
            />
            <Icon name='send' type='material-community' size={moderateScale(30)} onPress={handleOnComment} style={Spacing.superSmallLeftSpacing} />
          </View>
        </>
      ) : (
        <Loading type='paw' />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  horizontalLine: {
    marginVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: colours.lightGray,
  },
  commentRowContainer: {
    flexDirection: 'row',
    marginHorizontal: scale(16),
  },
  commentContainer: {
    flex: 1,
    padding: scale(8),
    marginBottom: verticalScale(8),
    borderWidth: 1,
    borderColor: colours.lightGray,
    borderRadius: moderateScale(8),
  },
  commentInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentText: {
    flexWrap: 'wrap',
  },
  bottomContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colours.lightGray,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    fontSize: 12,
    borderBottomWidth: 0,
  },
});

export default Post;
