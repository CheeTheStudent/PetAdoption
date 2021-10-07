import React, {useEffect, useCallback, useState, useLayoutEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar, Icon, Image} from 'react-native-elements';
import {GiftedChat, Bubble, Time, Send, Composer, InputToolbar} from 'react-native-gifted-chat';
import OptionsMenu from 'react-native-option-menu';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import FirebaseMessage from '../utils/FirebaseMessage';
import moment from 'moment';

import Loading from './components/Loading';
import SquareButton from './components/SquareButton';
import {verticalScale, scale, moderateScale, SCREEN} from '../assets/dimensions';
import {TextStyles, Spacing} from '../assets/styles';
import colours from '../assets/colours';

const Chat = ({navigation, route}) => {
  const {convo} = route.params;
  const {id: convoId, sender, receiver, interest: interestId, interestType, lastMessage} = convo;

  const userUID = auth().currentUser.uid;
  const firebaseMessage = FirebaseMessage(convoId);

  const [messages, setMessages] = useState([]);
  const [interest, setInterest] = useState();

  const getFriend = () => {
    if (userUID === sender.id) return receiver;
    else return sender;
  };

  useLayoutEffect(() => {
    const friend = userUID === sender.id ? receiver : sender;
    navigation.setOptions({
      title: '',
      headerTitle: () => (
        <View style={{flexDirection: 'row', paddingVertical: verticalScale(8), alignItems: 'center', marginLeft: scale(-20)}}>
          <Avatar rounded size={moderateScale(44)} source={{uri: getFriend().image}} containerStyle={Spacing.superSmallRightSpacing} />
          <Text style={TextStyles.h2}>{getFriend().name}</Text>
        </View>
      ),
      headerRight: () => (
        <OptionsMenu
          customButton={<Icon name='dots-vertical' type='material-community' size={moderateScale(24)} style={Spacing.superSmallRightSpacing} />}
          destructiveIndex={1}
          options={['View Profile', 'Block', 'Cancel']}
          // actions={[editPost, deletePost]}
        />
      ),
    });
  }, []);

  // Retrieve interest data
  useEffect(async () => {
    if (interestType === 'pets') {
      const snapshot = await database().ref(`pets/${interestId}`).once('value');
      const petData = snapshot.val() ? snapshot.val() : {};
      setInterest({item: petData, title: petData.name, image: petData.media[0], desc: `${petData.gender ? 'Female' : 'Male'}, ${petData.breed}`});
    } else if (interestType === 'jobs') {
      const snapshot = await database().ref(`jobs/${interestId}`).once('value');
      const jobData = snapshot.val() ? snapshot.val() : {};
      setInterest({item: jobData, title: jobData.title, image: jobData.image});
    }
  }, []);

  // First time load messages
  useEffect(async () => {
    setMessages([]);
    setMessages(await firebaseMessage.getMessages(lastMessage));
  }, []);

  // Listen for new messages
  useEffect(() => {
    firebaseMessage.messageListener(incoming => setMessages(previousMessages => GiftedChat.append(previousMessages, incoming)));
    firebaseMessage.messageChangesListener(updatedMessage => setMessages(previousMessages => previousMessages.map(m => (m._id === updatedMessage._id ? updatedMessage : m))));

    return () => {
      firebaseMessage.messageListenerOff();
      firebaseMessage.messageChangesListenerOff();
    };
  }, []);

  const renderBubble = props => {
    const {currentMessage: current, nextMessage: next} = props;

    const momentCur = moment(current.createdAt);
    const momentNext = moment(next.createdAt);
    let sameDayMessage = momentCur.isSame(momentNext, 'date');
    let currentUserMessage = userUID == current.user._id;
    let isLastMessage = true;

    if (next.user !== undefined && next.user) {
      next.user._id === current.user._id ? (isLastMessage = false) : (isLastMessage = true);
    }

    return (
      <View>
        <View style={[currentUserMessage ? styles.messageContainerRight : styles.messageContainerLeft, isLastMessage ? styles.messageContainer : null]}>
          <Bubble
            {...props}
            textStyle={{
              right: styles.messageText,
              left: styles.messageText,
            }}
            wrapperStyle={{
              right: [styles.messageTextContainer, styles.messageTextContainerRight],
              left: [styles.messageTextContainer, styles.messageTextContainerLeft],
            }}
          />
          {isLastMessage || !sameDayMessage ? (
            <View style={styles.belowBubbleContainer}>
              <Text style={TextStyles.desc}>{momentCur.format('LT')}</Text>
              {currentUserMessage ? (
                currentUserMessage && current.received ? (
                  <Icon name='check-all' type='material-community' size={moderateScale(14)} color='black' style={styles.tick} />
                ) : currentUserMessage && current.sent ? (
                  <Icon name='check' type='material-community' size={moderateScale(14)} color='black' style={styles.tick} />
                ) : (
                  <Icon name='clock-time-seven' type='material-community' size={moderateScale(14)} color='black' style={styles.tick} />
                )
              ) : null}
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  const navigateToInterest = () => {
    if (interestType === 'pets') navigation.navigate('PetProfile', {pet: interest.item});
    else if (interestType === 'jobs') navigation.navigate('Job', {job: interest.item});
  };

  return (
    <View style={styles.body}>
      {messages ? (
        <GiftedChat
          messages={messages}
          alwaysShowSend
          scrollToBottom
          onSend={messages => firebaseMessage.sendMessage(messages, convoId)}
          renderAvatar={null}
          user={{
            _id: userUID,
            name: sender.id === userUID ? sender.name : receiver.name,
          }}
          renderBubble={renderBubble}
          renderTicks={() => null}
          renderTime={() => null}
          renderInputToolbar={props => <InputToolbar {...props} containerStyle={styles.inputToolbarContainer} />}
          renderSend={props => (
            <Send {...props} containerStyle={styles.sendContainer}>
              <Icon name='send' type='material-community' size={moderateScale(30)} />
            </Send>
          )}
          minComposerHeight={verticalScale(45)}
          minInputToolbarHeight={verticalScale(50)}
          renderComposer={props => <Composer {...props} textInputStyle={styles.composerText} />}
        />
      ) : (
        <Loading />
      )}
      {interest ? (
        <View style={styles.interestContainer}>
          <Image source={{uri: interest.image}} style={styles.interestImage} />
          <View style={[Spacing.superSmallLeftSpacing, {flex: 1}]}>
            <Text>{interest.title}</Text>
            <Text style={TextStyles.desc}>{interest.desc}</Text>
          </View>
          <SquareButton title='View' onPress={navigateToInterest} />
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  interestContainer: {
    width: SCREEN.WIDTH,
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: colours.mediumGray,
    backgroundColor: 'white',
  },
  interestImage: {
    height: verticalScale(44),
    width: scale(60),
    borderRadius: moderateScale(8),
  },
  messageContainerRight: {
    alignItems: 'flex-end',
    marginRight: scale(16),
  },
  messageContainerLeft: {
    marginLeft: scale(16),
  },
  messageContainer: {
    marginBottom: verticalScale(16),
  },
  messageTextContainer: {
    padding: scale(4),
    elevation: moderateScale(5),
    borderRadius: moderateScale(20),
  },
  messageTextContainerRight: {
    backgroundColor: 'black',
  },
  messageTextContainerLeft: {
    backgroundColor: 'white',
  },
  messageText: {
    fontSize: moderateScale(14),
  },
  belowBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(4),
  },
  tick: {
    marginLeft: scale(4),
  },
  inputToolbarContainer: {
    minHeight: verticalScale(50),
    borderTopWidth: 0,
    marginVertical: verticalScale(8),
  },
  sendContainer: {
    height: verticalScale(50),
    width: scale(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
  composerText: {
    minHeight: verticalScale(45),
    padding: 8,
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: colours.mediumGray,
  },
});
export default Chat;
