import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';

import Tag from '../components/Tag';
import colours from '../../assets/colours';
import {moderateScale, verticalScale, scale} from '../../assets/dimensions';
import {Spacing, TextStyles} from '../../assets/styles';

const ageGroups = [
  {label: '< 18 years old', value: 'lt18'},
  {label: '18 - 24 years old', value: '18-24'},
  {label: '25 - 34 years old', value: '25-34'},
  {label: '35 - 44 years old', value: '35-44'},
  {label: '45 - 54 years old', value: '45-54'},
  {label: '55 - 64 years old', value: '55-64'},
  {label: '> 65 years old ', value: 'mt65'},
];

const O4Screening = ({user}) => {
  const {age, livingCondition, numOfPetsOwned, petsSpayed, petsVaccinated, status} = user.screening || {};

  return (
    <View style={styles.body}>
      <View style={styles.card}>
        <Icon name='person' type='ionicon' size={moderateScale(35)} style={Spacing.smallRightSpacing} />
        <View>
          <Text style={TextStyles.h3}>Age</Text>
          <Text style={[TextStyles.h2, styles.infoText]}>{age ? ageGroups.find(e => e.value === age).label : '-'}</Text>
        </View>
      </View>
      <View style={styles.card}>
        <Icon name='business' type='ionicon' size={moderateScale(35)} style={Spacing.smallRightSpacing} />
        <View>
          <Text style={TextStyles.h3}>Living Condition</Text>
          <View style={styles.tagsContainer}>{livingCondition && livingCondition.map(cond => <Tag key={cond} title={cond} type='black' />)}</View>
        </View>
      </View>
      <View style={styles.card}>
        <Icon name='briefcase' type='ionicon' size={moderateScale(35)} style={Spacing.smallRightSpacing} />
        <View>
          <Text style={TextStyles.h3}>Status</Text>
          <View style={styles.tagsContainer}>{status && status.map(stat => <Tag key={stat} title={stat} type='black' />)}</View>
        </View>
      </View>
      {numOfPetsOwned ? (
        <View style={styles.card}>
          <Icon name='paw' type='ionicon' size={moderateScale(35)} style={Spacing.smallRightSpacing} />
          <View>
            <Text style={TextStyles.h3}>Owned Pets</Text>
            <Text style={[TextStyles.h2, styles.infoText]}>{numOfPetsOwned}</Text>
            <View style={styles.tagsContainer}>
              {petsVaccinated ? (
                <Tag title='Vaccinated' icon={<Icon name='injection-syringe' type='fontisto' size={moderateScale(16)} color='white' style={{marginRight: scale(4)}} />} type='black' />
              ) : null}
              {petsSpayed ? <Tag title='Neutered' icon={<Icon name='md-male-female' type='ionicon' size={moderateScale(16)} color='white' style={{marginRight: scale(4)}} />} type='black' /> : null}
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingTop: verticalScale(16),
    paddingHorizontal: scale(16),
    backgroundColor: 'white',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(8),
    borderRadius: moderateScale(10),
    backgroundColor: colours.lightGray,
  },
  infoText: {
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default O4Screening;
