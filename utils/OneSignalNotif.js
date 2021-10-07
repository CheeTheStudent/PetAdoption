import OneSignal from 'react-native-onesignal';
import * as RootNavigation from './RootNavigation';

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
  const removeUserNotificationId = () => {};

  const onForegroundListener = () => {
    OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
      let notification = notificationReceivedEvent.getNotification();
      const data = notification.additionalData;
      // Complete with null means don't show a notification.
      notificationReceivedEvent.complete(notification);
    });
  };

  const onNotificationOpen = () => {
    OneSignal.setNotificationOpenedHandler(notification => {
      const {type, convoId, convoData} = notification.notification.additionalData;
      if (type === 'chat') {
        RootNavigation.navigate('Chat', {convo: {id: convoId, ...convoData}});
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
    };
    sendNotification(data);
  };

  return {init, setUserNotificationId, onForegroundListener, onNotificationOpen, sendChatNotification, removeUserNotificationId};
};

export default OneSignalNotif;
