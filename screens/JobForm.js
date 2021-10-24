import React, {useState, useLayoutEffect} from 'react';
import {ScrollView, View, Text, Image, ToastAndroid, StyleSheet} from 'react-native';
import {Icon, CheckBox} from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

import LongRoundButton from './components/LongRoundButton';
import SquareButton from './components/SquareButton';
import TextInput from './components/TextInput';
import MultiLineInput from './components/MultiLineInput';
import MediaPicker from './components/MediaPicker';
import {scale, verticalScale, moderateScale} from '../assets/dimensions';
import {TextStyles, Spacing} from '../assets/styles';
import colours from '../assets/colours';

const JobForm = ({navigation, route}) => {
  const {job} = route.params || {};

  const userUID = auth().currentUser.uid;
  const userRef = database().ref(`/users/${userUID}`);
  const jobRef = database().ref(`/jobs`);

  const [title, setTitle] = useState(job ? job.title : '');
  const [type, setType] = useState(job ? job.type : 'Full-time');
  const [isVoluntary, setIsVoluntary] = useState(job ? Boolean(!job.salary) : false);
  const [salary, setSalary] = useState(job ? job.salary : '');
  const [salaryType, setSalaryType] = useState(job ? job.salaryType : '/hour');
  const [desc, setDesc] = useState(job ? job.desc : '');
  const [image, setImage] = useState(job && job.image ? [job.image] : '');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: job ? 'Edit Job' : 'Add Job',
    });
  }, [navigation]);

  const handleSubmit = async () => {
    const snapshot = await userRef.once('value');
    const ownerData = snapshot.val() ? snapshot.val() : null;

    const fullJobInfo = {
      ownerId: userUID,
      title,
      type,
      salary,
      salaryType,
      shelterName: ownerData.name,
      location: ownerData.location,
      desc,
    };

    let jobKey;
    if (job) {
      jobKey = job.id;
      await jobRef.child(jobKey).update(fullJobInfo);

      const existingMedia = await storage().ref(`/jobs/${jobKey}`).listAll();
      if (existingMedia.items.length > 0) {
        const item = existingMedia.items[0];
        const dwurl = await item.getDownloadURL();
        if (image[0] !== dwurl) {
          storage().ref(item.path).delete();
        }
      }
    } else {
      const jobId = await jobRef.push(fullJobInfo);
      jobKey = jobId.key;
    }

    const jobStore = storage().ref(`/jobs/${jobKey}/${jobKey}`);
    if (image) {
      if (!image[0].startsWith('https://firebasestorage')) {
        await jobStore.putFile(image[0]);
        const url = await jobStore.getDownloadURL();
        await jobRef.child(jobKey).update({
          image: url,
        });
      }
    }

    ToastAndroid.show(job ? 'Job Edited!' : 'Job Added!', ToastAndroid.SHORT);
    navigation.goBack();
  };

  return (
    <View style={styles.body}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={[TextStyles.h3, Spacing.mediumTopSpacing]}>Title</Text>
          <Text style={TextStyles.desc}>Write your job title here.</Text>
          <TextInput placeholder='Eg. Volunteer, Dog Walker..' defaultValue={title} onChangeText={value => setTitle(value)} containerStyle={Spacing.superSmallTopSpacing} renderErrorMessage={false} />
          <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Job Type</Text>
          <View style={styles.rowContainer}>
            <SquareButton
              title='Full-time'
              containerStyle={styles.squareLeftButton}
              buttonStyle={[type === 'Full-time' && styles.squareButtonPressed, styles.squareButton]}
              titleStyle={type === 'Full-time' && styles.squareButtonTextPressed}
              onPress={() => setType('Full-time')}
            />
            <SquareButton
              title='Part-time'
              containerStyle={styles.squareRightButton}
              buttonStyle={[type === 'Part-time' && styles.squareButtonPressed, styles.squareButton]}
              titleStyle={type === 'Part-time' && styles.squareButtonTextPressed}
              onPress={() => setType('Part-time')}
            />
          </View>
          <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Salary</Text>
          <View style={styles.rowContainer}>
            <CheckBox checked={isVoluntary} checkedColor='black' onPress={() => setIsVoluntary(!isVoluntary)} containerStyle={styles.checkBox} />
            <Text style={TextStyles.desc}>This job is for volunteers only. There will be no cash compensation. There will be no cash compensation.</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={[TextStyles.h3, Spacing.superSmallRightSpacing]}>RM</Text>
            <TextInput
              placeholder='0.00'
              keyboardType='numeric'
              maxLength={4}
              defaultValue={salary}
              disabled={isVoluntary}
              onChangeText={value => setSalary(value)}
              renderErrorMessage={false}
              inputContainerStyle={styles.salaryItems}
              containerStyle={[Spacing.smallRightSpacing, {width: scale(65)}]}
            />
            <View style={[styles.pickerContainer, styles.salaryItems]}>
              <Picker selectedValue={salaryType} enabled={!isVoluntary} onValueChange={(value, index) => setSalaryType(value)}>
                <Picker.Item key='hour' label='/hour' value='/hour' style={styles.pickerItem} />
                <Picker.Item key='month' label='/month' value='/month' style={styles.pickerItem} />
              </Picker>
            </View>
          </View>
          <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Job Description</Text>
          <Text style={TextStyles.desc}>Tell applicants about the position in detail. Include job requirements, tasks involved and even advantages!</Text>
          <MultiLineInput numberOfLines={5} defaultValue={desc} onChangeText={desc => setDesc(desc)} containerStyle={Spacing.smallTopSpacing} />
          <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>Media</Text>
          <Text style={TextStyles.desc}>Attach an image that represents the job! </Text>
          {image ? (
            <View style={[styles.image, Spacing.superSmallTopSpacing]}>
              <Image source={{uri: image[0]}} style={styles.image} />
              <Icon name='close-circle-outline' type='material-community' size={moderateScale(30)} color='white' containerStyle={styles.cancelImageButton} />
              <Icon name='close-circle' type='material-community' size={moderateScale(30)} containerStyle={styles.cancelImageButton} onPress={() => setImage(null)} />
            </View>
          ) : (
            <MediaPicker singleMedia imageOnly setChosenMedia={setImage} />
          )}
        </View>
        <LongRoundButton title='CONTINUE' onPress={handleSubmit} containerStyle={styles.button} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    paddingHorizontal: scale(16),
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: scale(8),
    borderWidth: 1,
    borderColor: colours.mediumGray,
    borderRadius: 4,
  },
  rowContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(8),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  squareButton: {
    height: verticalScale(40),
  },
  squareLeftButton: {
    flex: 1,
    marginRight: scale(8),
  },
  squareRightButton: {
    flex: 1,
  },
  squareButtonPressed: {
    backgroundColor: colours.black,
  },
  squareButtonTextPressed: {
    color: colours.white,
  },
  checkBox: {
    padding: 0,
  },
  salaryItems: {
    height: verticalScale(40),
  },
  pickerItem: {
    color: colours.darkGray,
  },
  button: {
    marginTop: verticalScale(24),
    marginBottom: verticalScale(32),
    alignSelf: 'center',
  },
  image: {
    height: verticalScale(150),
    borderRadius: moderateScale(8),
  },
  cancelImageButton: {
    position: 'absolute',
    top: verticalScale(4),
    right: scale(4),
  },
});

export default JobForm;
