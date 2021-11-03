import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, PermissionsAndroid} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LongRoundButton from './components/LongRoundButton';
import {scale, verticalScale, moderateScale, SCREEN} from '../assets/dimensions';
import {Spacing, TextStyles} from '../assets/styles';
import colours from '../assets/colours';

const permissions = [
  {
    title: 'Location',
    icon: 'location-sharp',
    type: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  },
  {
    title: 'Storage',
    icon: 'folder-open',
    type: PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  },
  {
    title: 'Camera',
    icon: 'camera',
    type: PermissionsAndroid.PERMISSIONS.CAMERA,
  },
];

const Permissions = ({navigation}) => {
  const [selected, setSelected] = useState([false, false, false]);
  const [disabled, setDisabled] = useState(true);

  const handleSelection = index => {
    setSelected(prev => prev.map((el, i) => (i !== index ? el : !el)));
    setDisabled(true);
    selected.map((el, i) => {
      if (i == index) {
        if (!el) {
          setDisabled(false);
        }
      } else if (el) {
        setDisabled(false);
      }
    });
  };

  const renderBox = (permission, index) => {
    return (
      <TouchableOpacity key={index} style={[styles.box, selected[index] && styles.boxPressed]} onPress={() => handleSelection(index)}>
        <Icon name='checkmark-circle' size={moderateScale(16)} color={selected[index] ? colours.black : colours.lightGray} style={styles.checkedIcon} />
        <Icon name={permission.icon} size={moderateScale(48)} style={Spacing.superSmallBottomSpacing} />
        <Text style={[TextStyles.text, styles.text]}>{permission.title}</Text>
      </TouchableOpacity>
    );
  };

  const handleAllow = async () => {
    const requests = permissions.flatMap((pm, i) => (selected[i] ? pm.type : []));
    await PermissionsAndroid.requestMultiple(requests);
    handleSkip();
  };

  const handleSkip = () => {
    navigation.navigate('Verify');
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Text style={TextStyles.h1}>Do you trust us?</Text>
        <Text style={TextStyles.h3}>Would you like to give us permission? It’s totally fine if you’re not ready.</Text>
        <View style={styles.centerContainer}>
          <View style={styles.permissionsContainer}>{permissions.map(renderBox)}</View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <LongRoundButton title='ALLOW' onPress={handleAllow} disabled={disabled} containerStyle={styles.button} />
        <Text onPress={handleSkip} style={styles.skipText}>
          SKIP
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    marginTop: verticalScale(32),
    paddingHorizontal: scale(24),
  },
  centerContainer: {
    height: SCREEN.HEIGHT,
    width: SCREEN.WIDTH,
    position: 'absolute',
    top: SCREEN.HEIGHT / 2 - scale(102),
  },
  permissionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: verticalScale(16),
  },
  box: {
    width: scale(102),
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(24),
    elevation: moderateScale(3),
    backgroundColor: 'white',
  },
  boxPressed: {
    backgroundColor: '#0000001F',
    elevation: 1,
  },
  checkedIcon: {
    position: 'absolute',
    top: scale(8),
    right: scale(8),
  },
  text: {
    textAlign: 'center',
  },
  bottomContainer: {
    width: SCREEN.WIDTH,
    position: 'absolute',
    bottom: verticalScale(32),
    alignItems: 'center',
  },
  skipText: {
    marginTop: verticalScale(8),
    fontSize: moderateScale(12),
    textDecorationLine: 'underline',
  },
});

export default Permissions;
