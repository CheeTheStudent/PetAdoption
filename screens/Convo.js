import React, {useState, useEffect, useLayoutEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {Button, Icon, Image} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import moment from 'moment';

import {TextStyles, Spacing} from '../assets/styles';
import {scale, moderateScale, verticalScale} from '../assets/dimensions';
import colours from '../assets/colours';

const Convo = ({chats, onConvoPress}) => {
  const userUID = auth().currentUser.uid;

  const getFriend = convo => {
    if (userUID === convo.sender.id) return convo.receiver;
    else return convo.sender;
  };

  const getLastMessageTime = timestamp => {
    const momentSent = moment(timestamp);
    const today = moment().startOf('day');
    if (momentSent.isSame(today, 'd')) {
      return momentSent.format('LT');
    } else {
      return momentSent.calendar('do MMM YY');
    }
  };

  const newMessage = item => {
    if (item.lastMessage) {
      if (item.lastMessage.user._id !== userUID && !item.lastMessage.received) return true;
    }
    return false;
  };

  return (
    <View style={styles.body}>
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <TouchableOpacity onPress={() => onConvoPress(item)} style={styles.card}>
            <Image source={getFriend(item).image ? {uri: getFriend(item).image} : require('../assets/images/placeholder.png')} style={styles.profilePic} />
            <View style={[Spacing.smallHorizontalSpacing, {flex: 1}]}>
              <Text style={TextStyles.h3}>{getFriend(item).name}</Text>
              <Text ellipsizeMode='tail' numberOfLines={1} style={[TextStyles.h4, newMessage(item) ? {fontWeight: 'bold'} : null]}>
                {item.lastMessage ? item.lastMessage.text : 'This is the start of the conversation'}
              </Text>
            </View>
            <Text style={[TextStyles.desc, {position: 'absolute', right: 0, top: 0}]}>{item.lastMessage ? getLastMessageTime(item.lastMessage.timestamp) : ''}</Text>
            {newMessage(item) ? <Icon name='circle-medium' type='material-community' size={moderateScale(24)} /> : null}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  card: {
    flexDirection: 'row',
    marginVertical: verticalScale(16),
    alignItems: 'center',
  },
  button: {
    width: scale(130),
    paddingVertical: verticalScale(8),
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colours.mediumGray,
  },
  buttonPressed: {
    backgroundColor: colours.black,
  },
  leftButton: {
    borderTopLeftRadius: moderateScale(8),
    borderBottomLeftRadius: moderateScale(8),
  },
  rightButton: {
    borderTopRightRadius: moderateScale(8),
    borderBottomRightRadius: moderateScale(8),
  },
  buttonText: {
    fontSize: moderateScale(14),
    color: colours.black,
  },
  buttonTextPressed: {
    color: colours.white,
  },
  profilePic: {
    height: verticalScale(50),
    aspectRatio: 1,
    borderRadius: verticalScale(25),
  },
});

export default Convo;
