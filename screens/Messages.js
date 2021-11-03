import React, {useLayoutEffect, useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import FirebaseMessage from '../utils/FirebaseMessage';

import ConvoScreen from './Convo';
import {TextStyles} from '../assets/styles';
import {scale, SCREEN} from '../assets/dimensions';
import colours from '../assets/colours';

const Messages = ({navigation, route, defaultHeader}) => {
  const Tab = createMaterialTopTabNavigator();

  const userUID = auth().currentUser.uid;
  const firebaseMessage = FirebaseMessage();

  const [convos, setConvos] = useState([]);
  const [chats, setChats] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    firebaseMessage.getConvos(convoData => {
      convoData.sort((x, y) => {
        if (!x.lastMessage && y.lastMessage) return -1;
        else if (x.lastMessage && !y.lastMessage) return 1;
        else if (!x.lastMessage && !y.lastMessage) return 0;
        else return y.lastMessage.timestamp - x.lastMessage.timestamp;
      });

      const filteredChats = convoData.filter(el => el.requestAccepted);
      setChats(filteredChats);
      const filteredRequests = convoData.filter(el => !el.requestAccepted);
      setRequests(filteredRequests);
    });

    return () => firebaseMessage.getConvosListenerOff();
  }, []);

  const navigateToChat = item => {
    navigation.navigate('Chat', {convo: item});
  };

  return (
    <View style={styles.body}>
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: {backgroundColor: 'black', width: SCREEN.WIDTH / 2 / 3, left: SCREEN.WIDTH / 2 / 3},
          tabBarStyle: {elevation: 0, borderBottomWidth: 1, borderBottomColor: colours.lightGray},
        }}>
        <Tab.Screen name='Chats' children={props => <ConvoScreen chats={chats} onConvoPress={navigateToChat} {...props} />} />
        <Tab.Screen name='Requests' children={props => <ConvoScreen chats={requests} onConvoPress={navigateToChat} {...props} />} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default Messages;
