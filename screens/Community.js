import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet, ToastAndroid} from 'react-native';
import {Icon} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import PostCard from './components/PostCard';
import NoResults from './components/NoResults';
import OneSignalNotif from '../utils/OneSignalNotif';
import Loading from './components/Loading';
import {SCREEN, verticalScale, scale} from '../assets/dimensions';
import {TextStyles, Spacing} from '../assets/styles';
import colours from '../assets/colours';

const Community = ({navigation}) => {
  const userUID = auth().currentUser.uid;
  const postRef = database().ref('/posts');
  const userRef = database().ref(`/users/${userUID}`);
  const oneSignalNotif = OneSignalNotif();

  const [posts, setPosts] = useState();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    postRef.limitToFirst(20).once('value', snapshot => {
      const data = snapshot.val() ? snapshot.val() : {};
      let posts = [];
      Object.entries(data).map(value => posts.push({id: value[0], ...value[1]}));
      posts.sort((x, y) => y.createdAt - x.createdAt);
      setPosts(posts);
      setRefresh(false);
    });
  }, [refresh]);

  useEffect(() => {
    let thisPostRef = postRef.on('child_changed', snapshot => {
      const data = snapshot.val() ? snapshot.val() : {};
      setPosts(prev => prev.map((el, i) => (el.id === snapshot.key ? {id: snapshot.key, ...data} : el)));
    });

    return () => postRef.off('child_changed', thisPostRef);
  }, []);

  const handleOnLike = post => {
    if (post.likes?.hasOwnProperty(userUID)) return postRef.child(`${post.id}/likes/${userUID}`).remove();
    postRef.child(`${post.id}/likes/${userUID}`).set(userUID);
    oneSignalNotif.sendLikeNotification(post.user.id, post.id, post.caption);
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

  return (
    <View style={styles.body}>
      {posts ? (
        posts.length > 0 ? (
          <FlatList
            keyExtractor={item => item.id}
            data={posts}
            renderItem={({item, index}) => (
              <PostCard post={item} onLike={() => handleOnLike(item)} onOpenPost={() => handleOpenPost(item)} onBookmark={() => handleOnBookmark(item)} onDelete={() => handleOnDelete(item)} />
            )}
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
        ) : (
          <NoResults title='No post available now!' desc='Create a post to start the party!' />
        )
      ) : (
        <Loading type='paw' />
      )}
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
