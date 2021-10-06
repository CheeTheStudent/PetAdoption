import React, {useState} from 'react';
import {View, FlatList, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Icon, Button, Image} from 'react-native-elements';
import OptionsMenu from 'react-native-option-menu';

import {scale, verticalScale, moderateScale, SCREEN} from '../../assets/dimensions';
import {Spacing, TextStyles} from '../../assets/styles';
import colours from '../../assets/colours';
import {useEffect} from 'react';

const M1Pets = ({navigation, setManageScreenNavigationOptions, pets}) => {
  const [isLongPress, setIsLongPress] = useState(false);
  const initialSwitches = new Array(pets.length).fill(false);
  const [switches, setSwitches] = useState(initialSwitches);
  const [selected, setSelected] = useState(0);

  const renderManageNavigationOptions = () => {
    setManageScreenNavigationOptions({
      headerTitle: () => (
        <View style={styles.manageHeader}>
          <View style={{flexDirection: 'row'}}>
            <Icon name='close' type='material-community' size={moderateScale(30)} onPress={() => handleCancelSelection()} />
            <Text style={[TextStyles.h2, Spacing.superSmallLeftSpacing]}>{selected}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <OptionsMenu
              customButton={<Icon name='pencil' type='material-community' size={moderateScale(24)} style={Spacing.superSmallRightSpacing} />}
              destructiveIndex={1}
              options={['Update Status', 'Edit Pet', 'Cancel']}
              // actions={[editPost, deletePost]}
            />
            <Icon name='trash-can-outline' type='material-community' size={moderateScale(24)} />
          </View>
        </View>
      ),
      headerLeft: () => null,
    });
  };

  useEffect(() => {
    let checker = switches.every(el => !el);
    if (setManageScreenNavigationOptions && !checker) {
      renderManageNavigationOptions();
    }
    navigation.o;
  }, [selected]);

  const handleLongPress = index => {
    setIsLongPress(true);
    handleSwitchToggle(index);
    renderManageNavigationOptions();
  };

  const handleSwitchToggle = index => {
    setSwitches(prev => prev.map((el, i) => (i !== index ? el : !el)));
    setSelected(switches.filter((el, i) => (i !== index ? el : !el)).length);
    const checker = switches.every((el, i) => (i !== index ? !el : el === true));
    if (checker) handleCancelSelection();
  };

  const handleCancelSelection = () => {
    if (setManageScreenNavigationOptions) {
      setManageScreenNavigationOptions(null);
    }
    setSwitches(initialSwitches);
    setIsLongPress(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => handleCancelSelection();
    }, []),
  );

  const calcPetAge = (ageYear, ageMonth) => {
    let ageLabel = '';
    if (ageYear == 0) {
      ageLabel = ageMonth + ' months';
    } else if (ageMonth == 0) {
      ageLabel = ageYear + ' years';
    } else if (ageYear > 0 && ageMonth > 0) {
      ageLabel = ageYear + ' years ' + ageMonth + ' months';
    } else {
      ageLabel = 'Age Unspecified';
    }
    return ageLabel;
  };

  return (
    <View style={styles.body}>
      <FlatList
        numColumns={2}
        data={pets}
        renderItem={({item, index}) => (
          <TouchableOpacity onLongPress={() => handleLongPress(index)} onPress={() => isLongPress && handleSwitchToggle(index)}>
            <Image source={item.media ? {uri: item.media[0]} : require('../../assets/images/placeholder.png')} style={styles.image} />
            <Text style={[TextStyles.h4, Spacing.superSmallLeftSpacing, {marginTop: verticalScale(4)}]}>{item.name}</Text>
            <Text style={[TextStyles.desc, Spacing.superSmallLeftSpacing]}>{calcPetAge(item.ageYear, item.ageMonth)}</Text>
            {switches[index] && <View style={styles.whiteOverlay} />}
          </TouchableOpacity>
        )}
        columnWrapperStyle={styles.rowContainer}
        contentContainerStyle={{paddingBottom: verticalScale(16)}}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('PetForm', {root: navigation})}>
        <Icon name='plus' type='material-community' size={30} color='white' />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: scale(16),
  },
  manageHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowContainer: {
    justifyContent: 'space-between',
    marginTop: verticalScale(16),
  },
  image: {
    width: scale(156),
    height: scale(156),
    borderRadius: scale(5),
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
  whiteOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: colours.whiteTransparent,
    position: 'absolute',
  },
});

export default M1Pets;
