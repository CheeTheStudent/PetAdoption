import React, {useState, useEffect} from 'react';
import {View, FlatList, StyleSheet, ToastAndroid} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import PostCard from './components/PostCard';
import Loading from './components/Loading';
import NoResults from './components/NoResults';
import {scale, verticalScale} from '../assets/dimensions';
import colours from '../assets/colours';

const Bookmarks = ({navigation}) => {
  const userUID = auth().currentUser.uid;
  const userRef = database().ref(`users/${userUID}/savedPosts`);
  const postRef = database().ref('posts');
  const [posts, setPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(async () => {
    let bookmarkedPosts = [];
    const snapshot = await userRef.once('value');
    const data = snapshot.val() ? snapshot.val() : {};
    await Promise.all(
      Object.entries(data).map(async value => {
        const postSnapshot = await postRef.child(value[0]).once('value');
        const postData = postSnapshot.val() ? postSnapshot.val() : {};
        if (Object.keys(postData).length != 0) bookmarkedPosts.push({id: postSnapshot.key, ...postData, bookmarkedTime: value[1]});
      }),
    );
    bookmarkedPosts.sort((x, y) => y.bookmarkedTime - x.bookmarkedTime);
    setPosts(bookmarkedPosts);
    setRefresh(false);
  }, [refresh]);

  useEffect(() => {
    let thisPostRef = postRef.on('child_changed', snapshot => {
      const data = snapshot.val() ? snapshot.val() : {};
      setPosts(prev => prev.map((el, i) => (el.id === snapshot.key ? {id: snapshot.key, ...data} : el)));
    });

    return () => postRef.off('child_changed', thisPostRef);
  }, []);

  const onRefresh = () => setRefresh(true);

  const handleOnLike = post => {
    if (post.likes?.hasOwnProperty(userUID)) return postRef.child(`${post.id}/likes/${userUID}`).remove();
    postRef.child(`${post.id}/likes/${userUID}`).set(userUID);
  };

  const handleOnBookmark = post => {
    if (post.saves?.hasOwnProperty(userUID)) {
      userRef.child(`${post.id}`).remove();
      return postRef.child(`${post.id}/saves/${userUID}`).remove();
    }
    userRef.child(`${post.id}`).set(database.ServerValue.TIMESTAMP);
    postRef.child(`${post.id}/saves/${userUID}`).set(database.ServerValue.TIMESTAMP);
  };

  const handleOpenPost = post => {
    navigation.navigate('Post', {postId: post.id});
  };

  const handleOnDelete = post => {
    postRef.child(post.id).remove();
    ToastAndroid.show('Post deleted!', ToastAndroid.SHORT);
  };

  const renderItemSeparator = () => <View style={styles.lineSeparator} />;

  const renderPost = ({item}) => (
    <PostCard post={item} onLike={() => handleOnLike(item)} onOpenPost={() => handleOpenPost(item)} onBookmark={() => handleOnBookmark(item)} onDelete={() => handleOnDelete(item)} />
  );

  return (
    <View style={styles.body}>
      {posts ? (
        posts.length > 0 ? (
          <FlatList keyExtractor={item => item.id} data={posts} renderItem={renderPost} onRefresh={onRefresh} refreshing={refresh} ItemSeparatorComponent={renderItemSeparator} />
        ) : (
          <NoResults title='No Saved Bookmarks' desc='Head over to Community to discover new posts!' />
        )
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
  lineSeparator: {
    borderBottomColor: colours.lightGray,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default Bookmarks;
