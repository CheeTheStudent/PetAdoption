import React, { useState } from 'react';
import { View, FlatList, Image, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Icon, Button } from 'react-native-elements';
import OptionsMenu from "react-native-option-menu";

import { scale, verticalScale, moderateScale, SCREEN } from '../../assets/dimensions';
import { Spacing, TextStyles } from '../../assets/styles';
import colours from '../../assets/colours';
import { useEffect } from 'react';

const tempData = [{}, {}, {}, {}, {}, {}, {}];

const M1Pets = ({ navigation, setManageScreenNavigationOptions }) => {

  const [isLongPress, setIsLongPress] = useState(false);
  const initialSwitches = new Array(tempData.length).fill(false);
  const [switches, setSwitches] = useState(initialSwitches);
  const [selected, setSelected] = useState(0);

  const originalHeader = {
    title: 'Manage',
    headerTitleStyle: TextStyles.h2,
    headerTitle: {},
  };

  const renderManageNavigationOptions = () => {
    setManageScreenNavigationOptions({
      headerTitle: () => (
        <View style={styles.manageHeader}>
          <View style={{ flexDirection: 'row' }}>
            <Icon name="close" type="material-community" size={moderateScale(30)} onPress={() => handleCancelSelection()} />
            <Text style={[TextStyles.h2, Spacing.superSmallLeftSpacing]}>{selected}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <OptionsMenu
              customButton={<Icon name="pencil" type="material-community" size={moderateScale(24)} style={Spacing.superSmallRightSpacing} />}
              destructiveIndex={1}
              options={["Update Status", "Edit Pet", "Cancel"]}
            // actions={[editPost, deletePost]}
            />
            <Icon name="trash-can-outline" type="material-community" size={moderateScale(24)} />
          </View>
        </View >
      )
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
    setSwitches((prev) => prev.map((el, i) => (i !== index ? el : !el)));
    setSelected(switches.filter((el, i) => i !== index ? el : !el).length);
    const checker = switches.every((el, i) => (i !== index ? !el : el === true));
    if (checker)
      handleCancelSelection();
  };

  const handleCancelSelection = () => {
    if (setManageScreenNavigationOptions) {
      setManageScreenNavigationOptions(originalHeader);
    }
    setSwitches(initialSwitches);
    setIsLongPress(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => handleCancelSelection();
    }, [])
  );

  return (
    <>
      <ScrollView style={styles.body}>
        <FlatList
          numColumns={2}
          data={tempData}
          renderItem={({ item, index }) => (
            <TouchableOpacity onLongPress={() => handleLongPress(index)} onPress={() => isLongPress && handleSwitchToggle(index)}>
              <Image source={require('../../assets/images/dog.png')} style={styles.image} />
              <Text style={[TextStyles.h4, Spacing.superSmallLeftSpacing, { marginTop: verticalScale(4) }]}>Ron</Text>
              <Text style={[TextStyles.desc, Spacing.superSmallLeftSpacing]}>12 months old</Text>
              {switches[index] && <View style={styles.whiteOverlay} />}
            </TouchableOpacity>
          )}
          columnWrapperStyle={styles.rowContainer}
          style={Spacing.mediumBottomSpacing}
        />
      </ScrollView>
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('PetForm', { root: navigation })} >
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
  manageHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rowContainer: {
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
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
    position: 'absolute'
  },
});

export default M1Pets;