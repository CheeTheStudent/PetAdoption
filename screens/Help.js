import React, {useState, useEffect, useLayoutEffect} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import database from '@react-native-firebase/database';
import {Picker} from '@react-native-picker/picker';

import JobCard from './components/JobCard';
import Loading from './components/Loading';
import {SCREEN, verticalScale, scale} from '../assets/dimensions';
import {TextStyles, Spacing} from '../assets/styles';
import colours from '../assets/colours';

const jobTypes = ['Job Type', 'All', 'Full-time', 'Part-time'];
const locations = [
  'Location',
  'All',
  'Federal Territory of Kuala Lumpur',
  'Johor',
  'Kedah',
  'Kelantan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Pulau Pinang',
  'Perak',
  'Perlis',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu',
  'Wilayah Persekutuan Kuala Lumpur',
];

const Help = ({navigation}) => {
  const jobRef = database().ref('jobs');

  const [jobs, setJobs] = useState([]);
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Volunteer & Jobs',
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    let jobQuery = jobRef;

    if (type && type !== 'All') {
      jobQuery = jobRef.orderByChild('type').equalTo(type);
    } else if (location && location !== 'All') {
      jobQuery = jobRef.orderByChild('location/state').equalTo(location);
    }

    jobQuery.limitToLast(20).once('value', snapshot => {
      const data = snapshot.val() ? snapshot.val() : {};
      let jobs = [];
      Object.entries(data).map(value => jobs.push({id: value[0], ...value[1]}));
      if (type && location) filterResults(jobs);
      else setJobs(jobs);
      setLoading(false);
    });
  }, [type, location]);

  const filterResults = data => {
    let filteredJobs = data;
    if (type !== 'All' && location !== 'All') {
      filteredJobs = filteredJobs.filter(el => el?.location?.state === location);
    }
    setJobs(filteredJobs);
  };

  return (
    <View style={styles.body}>
      <View style={styles.rowContainer}>
        <View style={[styles.pickerContainer, Spacing.superSmallRightSpacing]}>
          <Picker selectedValue={type} onValueChange={(value, index) => setType(value)}>
            {jobTypes.map((type, index) =>
              index == 0 ? <Picker.Item key={type} label={type} enabled={false} value='' /> : <Picker.Item key={type} label={type} value={type} style={styles.pickerItem} />,
            )}
          </Picker>
        </View>
        <View style={[styles.pickerContainer, styles.salaryItems]}>
          <Picker selectedValue={location} onValueChange={(value, index) => setLocation(value)}>
            {locations.map((type, index) =>
              index == 0 ? <Picker.Item key={type} label={type} enabled={false} value='' /> : <Picker.Item key={type} label={type} value={type} style={styles.pickerItem} />,
            )}
          </Picker>
        </View>
      </View>
      {loading ? (
        <Loading type='paw' />
      ) : jobs.length > 0 ? (
        <FlatList data={jobs} renderItem={({item, index}) => <JobCard key={item.id} job={item} onPress={() => navigation.navigate('Job', {job: item})} />} style={styles.listContainer} />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={{alignSelf: 'center'}}>There are no jobs for now!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: verticalScale(8),
  },
  rowContainer: {
    flexDirection: 'row',
    marginHorizontal: scale(16),
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
    height: verticalScale(40),
    paddingLeft: scale(8),
    borderWidth: 1,
    borderColor: colours.mediumGray,
    borderRadius: 4,
  },
  pickerLabel: {
    color: colours.darkGray,
    fontStyle: 'italic',
  },
  pickerItem: {
    color: colours.darkGray,
  },
  listContainer: {
    marginTop: verticalScale(8),
    paddingHorizontal: scale(16),
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Help;
