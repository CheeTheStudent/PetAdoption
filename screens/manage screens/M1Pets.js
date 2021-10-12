import React, {useState} from 'react';
import {View, FlatList, Text, TouchableOpacity, StyleSheet, ScrollView, ToastAndroid} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Icon, Button, Image} from 'react-native-elements';
import Modal from 'react-native-modal';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

import LongRoundButton from '../components/LongRoundButton';
import {scale, verticalScale, moderateScale, SCREEN} from '../../assets/dimensions';
import {Spacing, TextStyles} from '../../assets/styles';
import colours from '../../assets/colours';
import {useEffect} from 'react';

const M1Pets = ({navigation, setManageScreenNavigationOptions, pets}) => {
  const petRef = database().ref('pets');
  const petStore = storage().ref('pets');
  const [isLongPress, setIsLongPress] = useState(false);
  const initialSwitches = new Array(pets.length).fill(false);
  const [switches, setSwitches] = useState(initialSwitches);
  const [selected, setSelected] = useState(0);
  const [modalPet, setModalPet] = useState(null);

  const renderManageNavigationOptions = () => {
    setManageScreenNavigationOptions({
      headerTitle: () => (
        <View style={styles.manageHeader}>
          <View style={{flexDirection: 'row'}}>
            <Icon name='close' type='material-community' size={moderateScale(30)} onPress={() => handleCancelSelection()} />
            <Text style={[TextStyles.h2, Spacing.superSmallLeftSpacing]}>{selected}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            {selected <= 1 && (
              <Icon name='pencil' type='material-community' size={moderateScale(24)} onPress={() => handleEditPet(pets[switches.indexOf(true)])} style={Spacing.superSmallRightSpacing} />
            )}
            <Icon name='trash-can-outline' type='material-community' size={moderateScale(24)} onPress={() => handleDeletePet(pets.filter((el, i) => (switches[i] ? el : null)))} />
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

  const handleViewPet = pet => {
    navigation.navigate('PetProfile', {pet});
  };

  const handleEditPet = pet => {
    setModalPet(null);
    setSwitches(initialSwitches);
    setSelected(0);
    navigation.navigate('PetForm', {root: navigation, pet});
  };

  const handleDeletePet = pets => {
    pets.map(async pet => {
      if (pet.media) {
        const existingMedia = await petStore.child(pet.id).listAll();
        existingMedia.items.map(em => storage().ref(em.path).delete());
      }
      petRef.child(pet.id).remove();
    });
    ToastAndroid.show('Successfully deleted!', ToastAndroid.SHORT);
    setModalPet(null);
    setSwitches(initialSwitches);
    setSelected(0);
  };

  const renderPetModal = () => {
    return (
      <Modal isVisible={Boolean(modalPet)} onBackdropPress={() => setModalPet(null)} backdropTransitionOutTiming={0}>
        <View style={styles.modalContainer}>
          <Image source={modalPet?.media ? {uri: modalPet.media[0]} : require('../../assets/images/placeholder.png')} style={styles.modalImage} />
          <View style={styles.modalInfo}>
            <Text style={TextStyles.h3}>{modalPet?.name}</Text>
            <Icon name='trash-can-outline' type='material-community' size={moderateScale(24)} color='red' onPress={() => handleDeletePet([modalPet])} />
          </View>
          <LongRoundButton title='VIEW PROFILE' onPress={() => handleViewPet(modalPet)} buttonStyle={styles.modalButton} containerStyle={[Spacing.superSmallTopSpacing, styles.modalButton]} />
          <LongRoundButton title='EDIT PROFILE' onPress={() => handleEditPet(modalPet)} buttonStyle={styles.modalButton} containerStyle={[Spacing.superSmallTopSpacing, styles.modalButton]} />
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.body}>
      <FlatList
        numColumns={2}
        data={pets}
        renderItem={({item, index}) => (
          <TouchableOpacity onLongPress={() => handleLongPress(index)} onPress={() => (isLongPress ? handleSwitchToggle(index) : setModalPet(item))}>
            <Image source={item.media ? {uri: item.media[0]} : require('../../assets/images/placeholder.png')} style={styles.image} />
            <Text style={[TextStyles.h4, Spacing.superSmallLeftSpacing, {marginTop: verticalScale(4)}]}>{item.name}</Text>
            <Text style={[TextStyles.desc, Spacing.superSmallLeftSpacing]}>{calcPetAge(item.ageYear, item.ageMonth)}</Text>
            {switches[index] && <View style={styles.whiteOverlay} />}
          </TouchableOpacity>
        )}
        columnWrapperStyle={styles.rowContainer}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('PetForm', {root: navigation})}>
        <Icon name='plus' type='material-community' size={30} color='white' />
      </TouchableOpacity>
      {renderPetModal()}
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
  modalContainer: {
    width: scale(232),
    alignSelf: 'center',
    alignItems: 'center',
    padding: scale(16),
    borderRadius: moderateScale(10),
    backgroundColor: 'white',
  },
  modalImage: {
    width: scale(200),
    height: scale(200),
    borderRadius: scale(10),
  },
  modalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(8),
    paddingTop: verticalScale(8),
    width: scale(200),
  },
  modalButton: {
    width: scale(200),
    height: verticalScale(36),
  },
});

export default M1Pets;
