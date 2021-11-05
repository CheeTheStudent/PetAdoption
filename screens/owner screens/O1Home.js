import React from 'react';
import {View, FlatList, StyleSheet, ToastAndroid} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import PostCard from '../components/PostCard';
import NoResults from '../components/NoResults';
import {scale} from '../../assets/dimensions';
import {Spacing} from '../../assets/styles';
import colours from '../../assets/colours';

const O1Home = ({navigation, posts}) => {
  const userUID = auth().currentUser.uid;
  const postRef = database().ref('/posts');
  const userRef = database().ref(`/users/${userUID}`);

  const handleOnLike = post => {
    if (post.likes?.hasOwnProperty(userUID)) return postRef.child(`${post.id}/likes/${userUID}`).remove();
    postRef.child(`${post.id}/likes/${userUID}`).set(userUID);
  };

  const handleOnBookmark = post => {
    if (post.saves?.hasOwnProperty(userUID)) {
      userRef.child(`savedPosts/${post.id}`).remove();
      return postRef.child(`${post.id}/saves/${userUID}`).remove();
    }
    userRef.child(`savedPosts/${post.id}`).set(database.ServerValue.TIMESTAMP);
    postRef.child(`${post.id}/saves/${userUID}`).set(database.ServerValue.TIMESTAMP);
  };

  const handleOpenPost = post => {
    navigation.navigate('Post', {postId: post.id});
  };

  const handleOnDelete = post => {
    postRef.child(post.id).remove();
    ToastAndroid.show('Post deleted!', ToastAndroid.SHORT);
  };

  if (posts.length <= 0) return <NoResults title='No posts yet!' desc='Create new posts in the Community!' />;

  const renderItem = ({item}) => (
    <PostCard post={item} onLike={() => handleOnLike(item)} onOpenPost={() => handleOpenPost(item)} onBookmark={() => handleOnBookmark(item)} onDelete={() => handleOnDelete(item)} />
  );

  const renderSeparator = () => <View style={styles.lineSeparator} />;

  return <FlatList keyExtractor={item => item.id} data={posts} renderItem={renderItem} ItemSeparatorComponent={renderSeparator} contentContainerStyle={styles.body} />;
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  lineSeparator: {
    borderBottomColor: colours.lightGray,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default O1Home;
