import React from 'react';
import {View, FlatList, TouchableOpacity, StyleSheet, ToastAndroid} from 'react-native';
import {Icon} from 'react-native-elements';
import OptionsMenu from 'react-native-option-menu';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

import JobCard from '../components/JobCard';
import colours from '../../assets/colours';
import {scale, verticalScale, moderateScale} from '../../assets/dimensions';
import {Spacing, TextStyles} from '../../assets/styles';

const M2Jobs = ({navigation, jobs}) => {
  const jobRef = database().ref('jobs');
  const jobStore = storage().ref('jobs');

  const handleViewJob = job => {
    navigation.navigate('Job', {job});
  };

  const handleEditJob = job => {
    navigation.navigate('JobForm', {rootNavigation: navigation, job});
  };

  const handleDeleteJob = async job => {
    if (job.image) {
      const existingMedia = await jobStore.child(job.id).listAll();
      storage().ref(existingMedia.items[0].path).delete();
    }
    jobRef.child(job.id).remove();
    ToastAndroid.show('Successfully deleted!', ToastAndroid.SHORT);
  };

  return (
    <>
      <View style={styles.body}>
        <FlatList
          data={jobs}
          renderItem={({item, index}) => (
            <OptionsMenu
              customButton={<JobCard job={item} />}
              options={['View', 'Edit Job', 'Delete Job', 'Cancel']}
              actions={[() => handleViewJob(item), () => handleEditJob(item), () => handleDeleteJob(item)]}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('JobForm', {rootNavigation: navigation})}>
        <Icon name='plus' type='material-community' size={30} color='white' />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: verticalScale(8),
  },
  listContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(16),
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

export default M2Jobs;
