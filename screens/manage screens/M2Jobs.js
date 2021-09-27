import React from 'react';
import { FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import OptionsMenu from "react-native-option-menu";

import JobCard from '../components/JobCard';
import colours from '../../assets/colours';
import { scale, verticalScale, moderateScale } from '../../assets/dimensions';
import { Spacing, TextStyles } from '../../assets/styles';

const M2Jobs = () => {

  return (
    <>
      <ScrollView style={styles.body}>
        <FlatList
          data={[{}, {}, {}, {}, {}, {}, {}]}
          renderItem={({ item, index }) => (
            <OptionsMenu
              customButton={<JobCard />}
              destructiveIndex={1}
              options={["View", "Edit Job", "Delete Job", "Cancel"]}
              actions={[() => console.log(index)]}
            />
          )}
          style={Spacing.mediumBottomSpacing}
        />
      </ScrollView>
      <TouchableOpacity style={styles.fab} >
        <Icon name='plus' type='material-community' size={30} color='white' />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
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