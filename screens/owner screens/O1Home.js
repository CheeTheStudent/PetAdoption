import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import PostCard from '../components/PostCard';
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
    userRef.child(`savedPosts/${post.id}`).set(post.id);
    postRef.child(`${post.id}/saves/${userUID}`).set(userUID);
  };

  const handleOpenPost = post => {
    navigation.navigate('Post', {post: post});
  };

  return (
    <FlatList
      keyExtractor={item => item.id}
      data={posts}
      renderItem={({item, index}) => <PostCard post={item} onLike={() => handleOnLike(item)} onOpenPost={() => handleOpenPost(item)} onBookmark={() => handleOnBookmark(item)} />}
      ItemSeparatorComponent={() => (
        <View
          style={{
            borderBottomColor: colours.lightGray,
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      )}
      contentContainerStyle={styles.body}
    />
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default O1Home;
