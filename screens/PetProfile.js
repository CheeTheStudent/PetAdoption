import React, {useEffect, useState} from 'react';
import {ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FirebaseMessage from '../utils/FirebaseMessage';

import ActionButton from './components/ActionButton';
import Tag from './components/Tag';
import SquareButton from './components/SquareButton';
import {TextStyles, Spacing} from '../assets/styles';
import {SCREEN, verticalScale, scale, moderateScale} from '../assets/dimensions';
import colours from '../assets/colours';
import Loading from './components/Loading';

const PetProfile = ({navigation, route}) => {
  const {pet} = route.params;
  const {id: petId, name, ageYear, ageMonth, gender, species, breed, tags, weight, height, vaccinated, spayed, desc, media, ownerId} = pet;
  const userUID = auth().currentUser.uid;
  const ownerRef = database().ref(`/users/${ownerId}`);
  const firebaseMessage = FirebaseMessage();

  const [owner, setOwner] = useState();
  const [user, setUser] = useState();
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(async () => {
    const userData = await AsyncStorage.getItem('user');
    const user = JSON.parse(userData);
    setUser(user);

    ownerRef.once('value', snapshot => {
      const data = snapshot.val() ? snapshot.val() : null;
      data && setOwner(data);
    });
  }, []);

  const renderTag = tag => {
    let included = false;
    user.preferredTags?.map(sTag => {
      if (sTag === tag) {
        included = true;
      }
    });
    return <Tag key={tag} title={tag} type={included ? 'black' : 'white-outline'} disabled />;
  };

  const calcPetAge = () => {
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

  const isVideo = url => {
    let n = url.lastIndexOf('?');
    const fileType = url.substring(n - 3, n);
    return fileType === 'mp4';
  };

  const toggleModal = () => {
    navigation.navigate('GalleryModal', {media: media});
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLikePet = () => {
    navigation.navigate('Home', {
      swipeAway: 'like',
    });
  };

  const handleDislikePet = () => {
    navigation.navigate('Home', {
      swipeAway: 'dislike',
    });
  };

  const handleSendMessage = async () => {
    const convoInfo = {
      sender: {id: userUID, name: user.name, image: user.profilePic},
      receiver: {id: ownerId, name: owner.name, image: owner.profilePic},
      interest: petId,
      interestType: 'pets',
      requestAccepted: owner.private ? false : true,
    };
    const convoId = await firebaseMessage.createConvo(convoInfo);
    navigation.navigate('Chat', {convo: {id: convoId, ...convoInfo}});
  };

  return (
    <View style={styles.body}>
      {pet && user ? (
        // Pet info is available
        <ScrollView>
          <Image source={media ? {uri: media[0]} : require('../assets/images/placeholder.png')} style={styles.image} />
          <ActionButton name='chevron-up' containerStyle={styles.actionUpButton} onPress={handleGoBack} />
          <View style={styles.container}>
            <View style={styles.basicInfoContainer}>
              <Text style={[TextStyles.h1, Spacing.superSmallRightSpacing]}>{name}</Text>
              <Text style={TextStyles.h4}>{calcPetAge()}</Text>
            </View>
            <Text style={[TextStyles.h4, {color: colours.darkGray}]}>{`${gender ? 'Female' : 'Male'}${Boolean(breed) ? ', ' + breed : ''}`}</Text>
            <View style={[styles.tagContainer, Spacing.superSmallTopSpacing]}>{tags ? tags.map(tag => renderTag(tag)) : <></>}</View>
            <View style={[styles.healthContainer, Spacing.smallTopSpacing]}>
              <View>
                {weight != 0 && <Text style={TextStyles.h4}>Weight</Text>}
                {height != 0 && <Text style={[TextStyles.h4, Spacing.superSmallTopSpacing]}>Height</Text>}
                <Text style={[TextStyles.h4, Spacing.superSmallTopSpacing]}>Vaccinated</Text>
                <Text style={[TextStyles.h4, Spacing.superSmallTopSpacing]}>{gender ? 'Spayed' : 'Neutered'}</Text>
              </View>
              <View style={styles.healthValuesContainer}>
                {weight != 0 && <Text style={[TextStyles.h4, {color: colours.darkGray}]}>{`${weight} kg`}</Text>}
                {height != 0 && <Text style={[TextStyles.h4, Spacing.superSmallTopSpacing, {color: colours.darkGray}]}>{`${height} cm`}</Text>}
                <Icon name={vaccinated ? 'checkmark-circle' : 'close-circle'} type='ionicon' size={scale(24)} color='black' style={Spacing.superSmallTopSpacing} />
                <Icon name={spayed ? 'checkmark-circle' : 'close-circle'} type='ionicon' size={scale(24)} color='black' style={Spacing.superSmallTopSpacing} />
              </View>
            </View>
            {Boolean(desc) && (
              <>
                <Text style={[TextStyles.h3, Spacing.superSmallTopSpacing]}>About</Text>
                <Text style={[TextStyles.desc, Spacing.superSmallTopSpacing]}>{desc}</Text>
              </>
            )}
            {media && (
              <>
                <Text style={[TextStyles.h3, Spacing.superSmallTopSpacing]}>Gallery</Text>
                <FlatList
                  horizontal
                  data={media}
                  keyExtractor={(item, index) => index}
                  style={Spacing.smallTopSpacing}
                  renderItem={({item, index}) => (
                    <TouchableOpacity style={styles.cameraPics} onPress={toggleModal}>
                      {isVideo(item) ? (
                        <Video source={{uri: item}} resizeMode='cover' muted={true} style={{flex: 1, backgroundColor: colours.darkGray}} />
                      ) : (
                        <Image source={{uri: item}} style={{flex: 1}} />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </>
            )}
            {owner && (
              <View style={[styles.ownerContainer, Spacing.smallTopSpacing, Spacing.superSmallBottomSpacing]}>
                <Image source={require('../assets/images/dog.png')} style={[styles.ownerImage, Spacing.smallRightSpacing]} />
                <View style={[styles.shelterInfoContainer, Spacing.superSmallRightSpacing]}>
                  <Text style={[TextStyles.h3]} numberOfLines={1}>
                    {owner.name}
                  </Text>
                  <Text style={TextStyles.desc}>{owner.role}</Text>
                </View>
                <SquareButton
                  title='VIEW'
                  onPress={() => navigation.navigate('OwnerProfile', {ownerId, ownerName: owner.name})}
                  titleStyle={styles.buttonText}
                  buttonStyle={styles.viewOwnerButton}
                  containerStyle={styles.viewOwnerButtonCon}
                />
              </View>
            )}
            <View style={[styles.actionButtonsContainer, Spacing.superSmallTopSpacing]}>
              <SquareButton
                onPress={handleDislikePet}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.dislikeButtonContainerStyle}
                icon={<Icon name='thumb-down' type='material-community' color='black' />}
              />
              <SquareButton
                onPress={handleLikePet}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.likeButtonContainerStyle}
                icon={<Icon name='thumb-up' type='material-community' color='black' />}
              />
            </View>
            <SquareButton title='MESSAGE' onPress={handleSendMessage} buttonStyle={styles.buttonStyle} containerStyle={[styles.buttonContainerStyle, Spacing.superSmallTopSpacing]} />
          </View>
        </ScrollView>
      ) : (
        // Pet info is unavailable
        <Loading />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    height: SCREEN.HEIGHT * 0.4,
    width: SCREEN.WIDTH,
  },
  container: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(24),
  },
  basicInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  actionUpButton: {
    position: 'absolute',
    top: SCREEN.HEIGHT * 0.4 - 25,
    left: SCREEN.WIDTH / 2 - 25,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // backgroundColor: 'yellow',
  },
  healthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  healthValuesContainer: {
    alignItems: 'center',
  },
  cameraPics: {
    width: verticalScale(105),
    height: verticalScale(105),
    marginRight: scale(8),
    borderRadius: moderateScale(3),
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerImage: {
    width: SCREEN.WIDTH / 6,
    height: SCREEN.WIDTH / 6,
    borderRadius: SCREEN.WIDTH / 12,
  },
  shelterInfoContainer: {
    flex: 1,
  },
  viewOwnerButton: {
    width: scale(80),
    padding: moderateScale(10),
    borderRadius: moderateScale(50),
    borderWidth: 1,
    borderColor: colours.mediumGray,
  },
  viewOwnerButtonCon: {
    borderRadius: moderateScale(50),
  },
  buttonText: {
    fontSize: moderateScale(12),
    color: colours.darkGray,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
  },
  buttonStyle: {
    width: 'auto',
    padding: 12,
  },
  dislikeButtonContainerStyle: {
    flex: 1,
    marginRight: scale(8),
  },
  likeButtonContainerStyle: {
    flex: 1,
  },
});

export default PetProfile;
