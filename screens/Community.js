import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import PostCard from './components/PostCard';
import Loading from './components/Loading';
import {SCREEN, verticalScale, scale} from '../assets/dimensions';
import {TextStyles, Spacing} from '../assets/styles';
import colours from '../assets/colours';

const Community = ({navigation}) => {
  const userUID = auth().currentUser.uid;
  const postRef = database().ref('/posts');
  const userRef = database().ref(`/users/${userUID}`);

  const [posts, setPosts] = useState();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    postRef.limitToFirst(20).once('value', snapshot => {
      const data = snapshot.val() ? snapshot.val() : {};
      let posts = [];
      Object.entries(data).map(value => posts.push({id: value[0], ...value[1]}));
      setPosts(posts);
      setRefresh(false);
    });
  }, [refresh]);

  useEffect(() => {
    postRef.on('child_changed', snapshot => {
      const data = snapshot.val() ? snapshot.val() : {};
      setPosts(prev => prev.map((el, i) => (el.id === snapshot.key ? {id: snapshot.key, ...data} : el)));
    });

    return () => postRef.off('child_changed');
  }, []);

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
    <View style={styles.body}>
      <FlatList
        keyExtractor={item => item.id}
        data={posts}
        renderItem={({item, index}) => <PostCard post={item} onLike={() => handleOnLike(item)} onOpenPost={() => handleOpenPost(item)} onBookmark={() => handleOnBookmark(item)} />}
        onRefresh={() => setRefresh(true)}
        refreshing={refresh}
        ItemSeparatorComponent={() => (
          <View
            style={{
              borderBottomColor: colours.lightGray,
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('PostForm')}>
        <Icon name='plus' type='material-community' size={30} color='white' />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  fab: {
    width: verticalScale(50),
    height: verticalScale(50),
    borderRadius: verticalScale(25),
    backgroundColor: 'black',
    justifyContent: 'center',
    position: 'absolute',
    bottom: verticalScale(16),
    right: scale(16),
    elevation: 10,
  },
});

export default Community;
