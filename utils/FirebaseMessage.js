import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {useEffect} from 'react';
import {Alert} from 'react-native';

const SYSTEM_MESSAGE = [
  {
    text: 'This is the start of your conversation.',
    timestamp: database.ServerValue.TIMESTAMP,
    system: true,
  },
];

const FirebaseMessage = convoId => {
  const userUID = auth().currentUser.uid;

  const userRef = database().ref(`users/${userUID}/convos`);
  const convosRef = database().ref(`convos`);
  const threadsRef = database().ref(`threads`);
  const receiverRef = database().ref(`users`);

  const convoRef = database().ref(`convos/${convoId}`);
  const threadRef = database().ref(`threads/${convoId}`);

  const messageListenerRef = threadRef.orderByChild('timestamp').startAt(Date.now());

  const getConvoList = async () => {
    const data = await userRef.once('value');
    return data.val();
  };

  const getConvos = callback => {
    let getConvoMeta = [];
    let convoData = [];
    userRef.on('value', ids => {
      const convoIds = ids.val() ? ids.val() : {};
      Object.entries(convoIds).forEach(convo => {
        const id = convo[0];
        convosRef.child(id).on('value', snapshot => {
          let added = false;
          const data = snapshot.val() ? snapshot.val() : {};
          if (!data.requestAccepted && data.lastMessage) {
            if (data.lastMessage.user._id === data.receiver.id) {
              convosRef.child(id).update({requestAccepted: true});
            }
          }
          convoData.map((dt, i) => {
            if (dt.id === id) {
              convoData[i] = {id: id, ...data};
              added = true;
            }
          });
          if (!added) convoData.push({id: id, ...data});
          callback(convoData);
        });
      });
    });
  };

  const getConvosListenerOff = () => {
    userRef.off('value');
    convosRef.off();
  };

  const createConvo = async data => {
    let convoExist = false;
    let convoId = null;

    const convoList = await getConvoList();
    if (convoList) {
      Object.entries(convoList).forEach(el => {
        if (data.receiver.id === el[1].friendId) {
          convoExist = true;
          convoId = el[0];
        }
      });
    }
    if (!convoExist) {
      const newConvoId = await convosRef.push(data);
      convoId = newConvoId.key;
      await userRef.child(convoId).set({friendId: data.receiver.id});
      await receiverRef.child(`${data.receiver.id}/convos/${convoId}`).set({friendId: userUID});
      await sendMessage(SYSTEM_MESSAGE, convoId, true);
      if (!data.requestAccepted) {
        Alert.alert(
          'Private Owner',
          "This owner is private! You'll have to wait for them to accept your message request before chatting. In the meantime, Be sure to update your Adopter Screening to have a better chance at getting a reply!",
          [{text: 'Okay'}],
          {cancelable: true},
        );
      }
    }
    return convoId;
  };

  const parseMessage = (id, message) => {
    const {user, text, timestamp, sent, received, pending, system} = message;
    const _id = id;
    const createdAt = new Date(timestamp);

    if (system) return {_id, text, createdAt, system: true};
    return {_id, text, user, createdAt, sent, received, pending};
  };

  const getMessages = async lastMessage => {
    let retrievedMessages = [];
    await threadRef.once('value', snapshot => {
      const data = snapshot.val() ? snapshot.val() : {};
      let messagesData = [];
      Object.entries(data).map(value => {
        messagesData.push(parseMessage(value[0], value[1]));
      });
      messagesData.sort((x, y) => y.createdAt - x.createdAt);

      messagesData.map(m => {
        if (m.system) return;
        if (!m.system && m.user._id !== userUID) {
          threadRef.child(`${m._id}`).update({received: true});
        }
      });

      if (lastMessage && lastMessage.user._id !== userUID) {
        convoRef.child(`lastMessage`).update({received: true});
      }
      retrievedMessages = messagesData;
    });
    return retrievedMessages;
  };

  const messageListener = callback => {
    messageListenerRef.on('child_added', snapshot => {
      const data = snapshot.val() ? snapshot.val() : {};
      const message = parseMessage(snapshot.key, data);

      if (!message.system && message.user._id !== userUID) {
        threadRef.child(`${message._id}`).update({received: true});
      }

      if (!message.system) callback(message);
    });

    convoRef.on('child_changed', snapshot => {
      const data = snapshot.val() ? snapshot.val() : {};
      if (data.system) return;
      if (data.user._id !== userUID) {
        convoRef.child(`lastMessage`).update({received: true});
      }
    });
  };

  const messageListenerOff = () => {
    messageListenerRef.off('child_added');
    convoRef.off('child_changed');
  };

  const messageChangesListener = callback => {
    threadRef.on('child_changed', snapshot => {
      const data = snapshot.val() ? snapshot.val() : {};
      const message = parseMessage(snapshot.key, data);

      callback(message);
    });
  };

  const messageChangesListenerOff = () => {
    threadRef.off('child_changed');
  };

  const sendMessage = async (messages, threadId, sys) => {
    messages.forEach(async item => {
      const message = {
        text: item.text,
        user: item.user,
        sent: false,
        received: false,
        pending: true,
        timestamp: database.ServerValue.TIMESTAMP,
      };
      if (sys) {
        return threadsRef.child(threadId).push(messages[0]);
      } else {
        const messageId = await threadsRef.child(threadId).push(message);
        threadsRef.child(`${threadId}/${messageId.key}`).update({sent: true, pending: false});
        convosRef.child(threadId).update({lastMessage: {...message, sent: true}});
      }
    });
  };

  return {getConvos, createConvo, getMessages, sendMessage, messageListener, messageChangesListener, getConvosListenerOff, messageListenerOff, messageChangesListenerOff};
};

export default FirebaseMessage;
