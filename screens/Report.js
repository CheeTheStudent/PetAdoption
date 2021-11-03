import React, {useState} from 'react';
import {View, Text, StyleSheet, ToastAndroid} from 'react-native';
import {ButtonGroup} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import LongRoundButton from './components/LongRoundButton';
import {scale, verticalScale} from '../assets/dimensions';
import {Spacing, TextStyles} from '../assets/styles';
import colours from '../assets/colours';

const postIssues = ['It is offensive or contains hateful speech.', 'It contains inappropriate or unrelated content.', 'It is suspicious or spam.', 'It does not bring benefit to the community.'];
const userIssues = ['They are being offensive or disrespectful.', 'They are sending inappropriate or unrelated content.', 'They are suspicious or spam.', 'They are misusing the application.'];

const Report = ({navigation, route}) => {
  const {issueId, issueType} = route.params || {};
  const userUID = auth().currentUser.uid;
  const reportRef = database().ref('reports');
  const [issue, setIssue] = useState();

  const handleSendReport = () => {
    const reportInfo = {
      userId: userUID,
      issueId,
      issueType,
      desc: issueType === 'post' ? postIssues[issue] : userIssues[issue],
      createdAt: database.ServerValue.TIMESTAMP,
    };
    reportRef.push(reportInfo);
    ToastAndroid.show('Report sent! We will review the issue.', ToastAndroid.LONG);
    navigation.goBack();
  };

  return (
    <View style={styles.body}>
      <Text style={[TextStyles.h2, Spacing.smallLeftSpacing]}>Tell us what's wrong.</Text>
      <Text style={[TextStyles.h3, Spacing.smallLeftSpacing]}>Choose an issue associated with the {issueType}.</Text>
      <ButtonGroup
        vertical
        selectedIndex={issue}
        onPress={value => setIssue(value)}
        buttons={issueType === 'post' ? postIssues : userIssues}
        buttonStyle={styles.button}
        selectedButtonStyle={styles.selectedButton}
        selectedTextStyle={styles.selectedText}
        containerStyle={styles.container}
      />
      <LongRoundButton title='Report' onPress={handleSendReport} containerStyle={styles.reportButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingVertical: verticalScale(16),
    backgroundColor: 'white',
  },
  container: {
    flex: 0.5,
    marginHorizontal: 0,
    ...Spacing.mediumTopSpacing,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderRadius: 0,
  },
  selectedButton: {
    backgroundColor: colours.lightGray,
  },
  selectedText: {
    color: colours.darkGray,
  },
  button: {
    alignItems: 'flex-start',
    paddingLeft: scale(16),
    borderLeftWidth: 0,
  },
  reportButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: verticalScale(24),
  },
});

export default Report;
