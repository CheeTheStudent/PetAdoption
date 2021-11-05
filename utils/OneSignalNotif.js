import OneSignal from 'react-native-onesignal';
import * as RootNavigation from './RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {oneSignalAppId, oneSignalServerKey} from '../assets/bimil';

const OneSignalNotif = () => {
  const init = () => {
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId(oneSignalAppId);
  };

  const setUserNotificationId = userUID => {
    OneSignal.setExternalUserId(userUID);
  };

  // Put on logout method
  const removeUserNotificationId = () => {
    OneSignal.removeExternalUserId();
  };

  const onForegroundListener = () => {
    OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
      let notification = notificationReceivedEvent.getNotification();
      const data = notification.additionalData;
      if (data.type === 'chat') notificationReceivedEvent.complete(null);
      else notificationReceivedEvent.complete(notification);
    });
  };

  const onNotificationOpen = () => {
    OneSignal.setNotificationOpenedHandler(notification => {
      const {type, convoId, convoData, postId, postData} = notification.notification.additionalData;
      if (type === 'chat') {
        RootNavigation.navigate('Chat', {convo: {id: convoId, ...convoData}});
      }
      if (type === 'post') {
        RootNavigation.navigate('Post', {postId});
      }
    });
  };

  const sendNotification = data => {
    let headers = {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Basic ${oneSignalServerKey}`,
    };

    let endpoint = 'https://onesignal.com/api/v1/notifications';

    let params = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        app_id: oneSignalAppId,
        name: data.name,
        include_external_user_ids: [data.playerId],
        channel_for_external_user_ids: 'push',
        android_channel_id: data.channelId,
        headings: {en: data.headings},
        contents: {en: data.contents},
        data: data.data,
      }),
    };
    fetch(endpoint, params);
  };

  const sendChatNotification = (receiverId, message, threadId, convoData) => {
    const data = {
      playerId: receiverId,
      data: {type: 'chat', convoId: threadId, convoData},
      contents: message.text,
      headings: message.user.name,
      channelId: convoData.requestAccepted ? '33884a9c-fd88-4273-854d-50fd23e100f9' : '9049dbf8-8c01-4d1b-8cae-39db595f26a1',
    };
    sendNotification(data);
  };

  const sendLikeNotification = (receiverId, postId, caption) => {
    const data = {
      playerId: receiverId,
      data: {type: 'post', postId, caption},
      contents: `Someone liked your post: ${caption}`,
      headings: 'You got a like!',
      channelId: 'bf0f0927-e001-4567-b785-7e9d369a7cf0',
    };
    sendNotification(data);
  };

  const sendCommentNotification = (receiverId, comment, postId) => {
    const data = {
      playerId: receiverId,
      data: {type: 'post', postId},
      contents: `${comment.user.name} commented : ${comment.comment}`,
      headings: comment.user.name,
      channelId: 'bf0f0927-e001-4567-b785-7e9d369a7cf0',
    };
    sendNotification(data);
  };

  return {init, setUserNotificationId, onForegroundListener, onNotificationOpen, sendChatNotification, sendLikeNotification, sendCommentNotification, removeUserNotificationId};
};

export default OneSignalNotif;
