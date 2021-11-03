import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, RefreshControl, ActivityIndicator, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import {BarChart, LineChart, PieChart} from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import moment from 'moment';

import Tag from '../components/Tag';
import {Spacing, TextStyles} from '../../assets/styles';
import {moderateScale, scale, SCREEN, verticalScale} from '../../assets/dimensions';
import colours from '../../assets/colours';

const timeLabels = [
  {label: '00:00', value: 0},
  {label: '06:00', value: 6},
  {label: '12:00', value: 12},
  {label: '18:00', value: 18},
  {label: '23:00', value: 23},
];
const dayOfWeekLabels = [
  {label: 'S', value: 0},
  {label: 'M', value: 1},
  {label: 'T', value: 2},
  {label: 'W', value: 3},
  {label: 'T', value: 4},
  {label: 'F', value: 5},
  {label: 'S', value: 6},
];

const weekLabels = [
  {label: '1', value: 0},
  {label: '2', value: 1},
  {label: '3', value: 2},
  {label: '4', value: 3},
  {label: '5', value: 4},
  {label: '6', value: 5},
];
const monthLabels = [
  {label: 'J', value: 0},
  {label: 'F', value: 1},
  {label: 'M', value: 2},
  {label: 'A', value: 3},
  {label: 'M', value: 4},
  {label: 'J', value: 5},
  {label: 'J', value: 6},
  {label: 'A', value: 7},
  {label: 'S', value: 8},
  {label: 'O', value: 9},
  {label: 'N', value: 10},
  {label: 'D', value: 11},
];

const periodLabels = [
  {label: 'Day', value: 'day'},
  {label: 'Week', value: 'week'},
  {label: 'Month', value: 'month'},
  {label: 'Year', value: 'year'},
];

const pieLegendStyle = {legendFontColor: colours.darkGray, legendFontSize: moderateScale(14)};

const pieData = [
  {name: 'Dogs', population: 0, color: '#1F2326', ...pieLegendStyle},
  {name: 'Cats', population: 0, color: '#DBDBDB', ...pieLegendStyle},
  {name: 'Rabbits', population: 0, color: '#525357', ...pieLegendStyle},
  {name: 'Rodents', population: 0, color: '#BFBFBF', ...pieLegendStyle},
  {name: 'Reptiles', population: 0, color: '#6A6D72', ...pieLegendStyle},
  {name: 'Birds', population: 0, color: '#A9ACB1', ...pieLegendStyle},
];

const chartConfig = {
  decimalPlaces: 0,
  backgroundGradientFromOpacity: 0,
  backgroundGradientToOpacity: 0,
  fillShadowGradient: colours.lightGray,
  fillShadowGradientOpacity: 1,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  barPercentage: 0.5,
};

const MOverview = ({pets}) => {
  const userUID = auth().currentUser.uid;
  const petDataRef = database().ref(`petData/${userUID}`);
  const petRef = database().ref(`pets`).orderByChild('ownerId').equalTo(userUID);
  const [period, setPeriod] = useState('Day');
  const [selectedTime, setSelectedTime] = useState(moment());
  const [petsData, setPetsData] = useState([]);
  const [petsAdopted, setPetsAdopted] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adoptedData = pets.filter(pet => pet.status.status === 'Adopted');
    setPetsAdopted(adoptedData);
  }, [pets]);

  useEffect(() => {
    let queryRef = petDataRef;
    const currentDate = moment(selectedTime);
    const unit = periodLabels.find(val => val.label === period).value;
    const startOfTime = currentDate.startOf(unit).valueOf();
    const endOfTime = currentDate.endOf(unit).valueOf();

    queryRef = petDataRef.orderByChild('createdAt').startAt(startOfTime).endAt(endOfTime);

    queryRef.once('value', snapshot => {
      const data = snapshot.val() ? snapshot.val() : {};
      let retrievedData = [];
      Object.entries(data).map(value => retrievedData.push(value[1]));
      setPetsData(retrievedData);
      setRefresh(false);
      setLoading(false);
      getAdoptionRate();
    });
  }, [period, selectedTime, refresh]);

  const onChangePeriod = selected => {
    setPeriod(selected);
    setLoading(true);
  };

  const getWeekOfMonth = date => {
    const firstDayOfMonth = date.clone().startOf('month');
    const firstDayOfWeek = firstDayOfMonth.clone().startOf('week');
    const offset = firstDayOfMonth.diff(firstDayOfWeek, 'days');

    return Math.ceil((date.date() + offset) / 7);
  };

  const getLabels = () => {
    let selectedLabels; // Set labels corresponding to time frame chosen
    let searchBy; // To retrieve date's relative time value eg. Month of specific date
    let timeUnit; // Time unit to search by
    switch (period) {
      case 'Day':
        selectedLabels = timeLabels;
        searchBy = 'hour';
        timeUnit = 'hh:mm';
        break;
      case 'Week':
        selectedLabels = dayOfWeekLabels;
        searchBy = 'day';
        timeUnit = 'day';
        break;
      case 'Month':
        selectedLabels = weekLabels.slice(0, getWeekOfMonth(moment(selectedTime).endOf('month')));
        searchBy = 'hour';
        timeUnit = 'hh:mm';
        break;
      case 'Year':
        selectedLabels = monthLabels;
        searchBy = 'month';
        timeUnit = 'month';
        break;
    }
    const labels = selectedLabels.map(el => el.label);
    const values = selectedLabels.map(el => el.value);
    return {labels, values, searchBy, timeUnit};
  };

  const getViewsDistribution = () => {
    const lengthOfValues = getLabels().values.length;
    const numOfViews = Array(lengthOfValues).fill(0);

    if (petsData) {
      petsData.map(item => {
        numOfViews.every((el, i, arr) => {
          if (period !== 'Month') {
            if (moment(item.createdAt).isSameOrBefore(moment(item.createdAt)[getLabels().searchBy](getLabels().values[i]), getLabels().timeUnit)) {
              arr[i] += 1;
              return false;
            }
            return true;
          } else {
            // Moment.js does not provide a default "week of the month" get function
            // getWeekOfMonth() is a custom function for this purpose
            if (getWeekOfMonth(moment(item.createdAt)) == i + 1) {
              arr[i] += 1;
              return false;
            }
            return true;
          }
        });
      });
    }
    return {labels: getLabels().labels, datasets: [{data: numOfViews}]};
  };

  const getInteractionsDistribution = () => {
    const lengthOfValues = getLabels().values.length;
    const numOfLikes = Array(lengthOfValues).fill(0);
    const numOfDislikes = Array(lengthOfValues).fill(0);

    if (petsData) {
      petsData.map(item => {
        numOfLikes.every((el, i, arr) => {
          if (period !== 'Month') {
            if (moment(item.createdAt).isSameOrBefore(moment(item.createdAt)[getLabels().searchBy](getLabels().values[i]), getLabels().timeUnit)) {
              item.liked ? (arr[i] += 1) : (numOfDislikes[i] += 1);
              return false;
            }
            return true;
          } else {
            if (getWeekOfMonth(moment(item.createdAt)) == i + 1) {
              item.liked ? (arr[i] += 1) : (numOfDislikes[i] += 1);
              return false;
            }
            return true;
          }
        });
      });
    }
    return {labels: getLabels().labels, datasets: [{data: numOfDislikes, color: () => '#A9ACB1'}, {data: numOfLikes}], legend: ['Dislikes', 'Likes']};
  };

  const getAdoptionRate = () => {
    if (!petsAdopted) return;
    let noAdoptions = true;
    const lengthOfValues = getLabels().values.length;
    const numOfAdoptions = Array(lengthOfValues).fill(0);

    if (petsAdopted) {
      petsAdopted.map(pet => {
        const createdAt = pet.status.createdAt;
        numOfAdoptions.forEach((el, i, arr) => {
          if (period !== 'Month') {
            if (moment(createdAt).isSame(moment(selectedTime)[getLabels().searchBy](getLabels().values[i]), getLabels().timeUnit)) {
              arr[i] += 1;
              noAdoptions = false;
            }
          } else {
            if (getWeekOfMonth(moment(createdAt)) == i + 1) {
              arr[i] += 1;
              noAdoptions = false;
            }
          }
        });
      });
    }

    return {labels: getLabels().labels, datasets: [{data: numOfAdoptions}], noData: noAdoptions};
  };

  const getAnimalDistribution = () => {
    pieData.map(el => (el.population = 0));
    pets.map(pet => {
      const pieIndex = pieData.findIndex(({name}) => name === pet.species);
      pieData[pieIndex].population += 1;
    });
    const newPie = pieData.filter(el => el.population > 0);
    return newPie;
  };

  const getTime = () => {
    switch (period) {
      case 'Day':
        return selectedTime.format('Do MMM YY');
      case 'Week':
        return selectedTime.clone().day(0).format('Do MMM YY') + ' - ' + selectedTime.clone().day(6).format('Do MMM YY');
      case 'Month':
        return selectedTime.format('MMM YY');
      case 'Year':
        return selectedTime.format('YYYY');
    }
  };

  const previousTime = () => {
    setLoading(true);
    let subtracted = selectedTime.clone().subtract(1, periodLabels.find(val => val.label === period).value);
    if (subtracted.isAfter(moment())) subtracted = moment();
    setSelectedTime(subtracted);
  };

  const nextTime = () => {
    setLoading(true);
    let added = selectedTime.clone().add(1, periodLabels.find(val => val.label === period).value);
    if (added.isAfter(moment())) added = moment();
    setSelectedTime(added);
  };

  const backToTheFuture = () => {
    setLoading(true);
    setSelectedTime(moment());
  };

  return (
    <View style={styles.body}>
      <ScrollView refreshControl={<RefreshControl refreshing={refresh} onRefresh={() => setRefresh(true)} />} style={styles.container}>
        <View style={[styles.rowContainer, Spacing.superSmallTopSpacing]}>
          {periodLabels.map(day => (
            <Tag key={day.value} title={day.label} onSingleSelected={onChangePeriod} type={period === day.label ? 'black' : ''} containerStyle={{flex: 1}} />
          ))}
        </View>
        <View style={[styles.rowContainer, Spacing.superSmallTopSpacing]}>
          <Icon name='chevron-back' type='ionicon' size={moderateScale(24)} onPress={previousTime} />
          <View style={styles.rowContainer}>
            <Text style={[TextStyles.h3, {textAlign: 'center'}]}>{selectedTime ? getTime() : null}</Text>
            {!selectedTime.isSameOrAfter(moment(), periodLabels.find(val => val.label === period).value) ? (
              <Icon name='refresh' type='ionicon' size={moderateScale(20)} onPress={backToTheFuture} containerStyle={Spacing.superSmallLeftSpacing} />
            ) : null}
          </View>
          <Icon
            name='chevron-forward'
            type='ionicon'
            size={moderateScale(24)}
            onPress={nextTime}
            color={selectedTime.isSameOrAfter(moment(), periodLabels.find(val => val.label === period).value) ? 'transparent' : 'black'}
          />
        </View>
        <View style={styles.card}>
          {petsData?.length <= 0 ? <Text style={styles.noDataMessage}>No data</Text> : null}
          <Text style={TextStyles.h3}>Views Distribution</Text>
          <BarChart
            data={getViewsDistribution()}
            width={SCREEN.WIDTH - scale(32)}
            height={verticalScale(150)}
            fromZero
            withInnerLines={false}
            chartConfig={chartConfig}
            style={[styles.chart, styles.barChart]}
          />
          <ActivityIndicator animating={loading} color={colours.darkGray} size={moderateScale(24)} style={styles.chartLoader} />
        </View>
        <View style={styles.card}>
          {petsData?.length <= 0 ? <Text style={styles.noDataMessage}>No data</Text> : null}
          <Text style={TextStyles.h3}>Interactions Distribution</Text>
          <LineChart
            data={getInteractionsDistribution()}
            width={SCREEN.WIDTH - scale(32)}
            height={verticalScale(150)}
            fromZero
            withInnerLines={false}
            withOuterLines={false}
            chartConfig={chartConfig}
            style={[styles.chart, styles.lineChart]}
          />
          <ActivityIndicator animating={loading} color={colours.darkGray} size={moderateScale(24)} style={styles.chartLoader} />
        </View>
        {period !== 'Day' ? (
          <View style={styles.card}>
            {getAdoptionRate().noData ? <Text style={styles.noDataMessage}>No data</Text> : null}
            <Text style={TextStyles.h3}>Adoption Rate</Text>
            <LineChart
              data={getAdoptionRate()}
              width={SCREEN.WIDTH - scale(32)}
              height={verticalScale(150)}
              fromZero
              withInnerLines={false}
              withOuterLines={false}
              chartConfig={chartConfig}
              style={[styles.chart, styles.lineChart]}
            />
            <ActivityIndicator animating={loading} color={colours.darkGray} size={moderateScale(24)} style={styles.chartLoader} />
          </View>
        ) : null}
        <Text style={[TextStyles.h3, Spacing.smallTopSpacing]}>General Statistics</Text>
        <View style={styles.rowContainer}>
          <View style={[styles.smallCard, Spacing.superSmallRightSpacing]}>
            <Text style={styles.largeStatText}>
              {pets ? pets.length - petsAdopted?.length : '0'} <Text style={TextStyles.h4}>pets</Text>
            </Text>
            <Text style={[TextStyles.h4, {color: colours.darkGray}]}>for adoption</Text>
          </View>
          <View style={styles.smallCard}>
            <Text style={styles.largeStatText}>
              {petsAdopted ? petsAdopted.length : '0'} <Text style={TextStyles.h4}>{petsAdopted && petsAdopted.length > 1 ? 'pets' : 'pet'}</Text>
            </Text>
            <Text style={[TextStyles.h4, {color: colours.darkGray}]}>adopted</Text>
          </View>
        </View>
        <View style={[styles.card, Spacing.smallBottomSpacing, {paddingBottom: 0}]}>
          <Text style={TextStyles.h3}>Animal Distribution</Text>
          {pets ? (
            <PieChart data={getAnimalDistribution()} width={SCREEN.WIDTH - scale(32)} height={verticalScale(150)} accessor={'population'} chartConfig={chartConfig} style={styles.chart} />
          ) : null}
        </View>
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    justifyContent: 'center',
    marginTop: verticalScale(16),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    elevation: moderateScale(1),
    borderRadius: moderateScale(10),
  },
  chartLoader: {
    position: 'absolute',
    alignSelf: 'center',
  },
  noDataMessage: {
    position: 'absolute',
    alignSelf: 'center',
    ...TextStyles.h3,
    color: colours.mediumGray,
  },
  smallCard: {
    flex: 1,
    marginTop: verticalScale(8),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    elevation: moderateScale(1),
    borderRadius: moderateScale(10),
  },
  chart: {
    marginTop: verticalScale(8),
    alignSelf: 'center',
  },
  barChart: {
    marginLeft: scale(-30),
  },
  lineChart: {
    marginLeft: scale(-10),
  },
  largeStatText: {
    fontSize: moderateScale(48),
  },
});

export default MOverview;
