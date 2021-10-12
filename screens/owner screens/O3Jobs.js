import React from 'react';
import {View, FlatList, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';

import JobCard from '../components/JobCard';
import colours from '../../assets/colours';
import {scale, verticalScale, moderateScale} from '../../assets/dimensions';
import {Spacing, TextStyles} from '../../assets/styles';

const O3Jobs = ({navigation, jobs}) => {
  return (
    <View style={styles.body}>
      <FlatList
        keyExtractor={item => item.id}
        data={jobs}
        renderItem={({item, index}) => <JobCard job={item} onPress={() => navigation.navigate('Job', {job: item})} />}
        style={Spacing.mediumBottomSpacing}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(16),
  },
});

export default O3Jobs;
