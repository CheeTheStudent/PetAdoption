import React, {useState} from 'react';
import {View, Text, StatusBar, Image, ActivityIndicator, ToastAndroid, StyleSheet} from 'react-native';
import {Button, SocialIcon} from 'react-native-elements';
import AppIntroSlider from 'react-native-app-intro-slider';
import {GoogleSignin, statusCodes} from 'react-native-google-signin';
import auth from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';

import LongRoundButton from './components/LongRoundButton';
import colours from '../assets/colours';
import {TextStyles} from '../assets/styles';
import {SCREEN, scale, verticalScale, moderateScale} from '../assets/dimensions';

import Dog from '../assets/images/auth1.svg';
import Home from '../assets/images/auth2.svg';
import Walk from '../assets/images/auth3.svg';

const data = [
  {
    title: 'Save A Life',
    text: 'Browse through adoptable pets of all breeds, personalities and sizes. Save a life by adopting one!',
    image: <LottieView source={require('../assets/images/onboard1.json')} autoPlay loop style={{width: moderateScale(300), marginTop: verticalScale(2)}} />,
  },
  {
    title: 'Help A Cause',
    text: "Can't adopt but looking for a way to help? We've got plenty of opportunities for volunteering!",
    image: <LottieView source={require('../assets/images/onboard2.json')} autoPlay loop style={{height: moderateScale(300)}} />,
  },
  {
    title: 'Throw A Ball',
    text: "You take care of the pets, we'll take care of the rest. Put pets up for adoption here and find the perfect adopters!",
    image: <LottieView source={require('../assets/images/onboard3.json')} autoPlay loop style={{width: moderateScale(290), marginTop: verticalScale(-4)}} />,
  },
];

const Auth = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  GoogleSignin.configure({
    scopes: [],
    webClientId: '1059071183035-sjnactigk6su3d17ak9ed2l15o4t2v7v.apps.googleusercontent.com',
    offlineAccess: true,
    hostedDomain: '',
    loginHint: '',
    forceConsentPrompt: true,
    accountName: '',
    iosClientId: '',
  });

  const renderItem = ({item}) => {
    return (
      <View style={styles.slide}>
        {item.image}
        <View style={{position: 'absolute', bottom: verticalScale(70)}}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={[TextStyles.text, styles.text]}>{item.text}</Text>
        </View>
      </View>
    );
  };

  const keyExtractor = item => item.title;

  const handleEmailLogin = () => {
    navigation.navigate('Login');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleGoogleLogin = () => {
    setLoading(true);

    GoogleSignin.signIn()
      .then(({idToken}) => {
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return auth().signInWithCredential(googleCredential);
      })
      .catch(error => {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          ToastAndroid.show('Login Cancelled.', ToastAndroid.SHORT);
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          ToastAndroid.show('Play Services are not available or outdated.', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('Login failed, please try again later.', ToastAndroid.SHORT);
        }
      });
    setLoading(false);
  };

  return (
    <View style={styles.body}>
      <ActivityIndicator animating={loading} size={50} color='black' style={styles.loading} />
      <View style={{flex: 3}}>
        <AppIntroSlider keyExtractor={keyExtractor} renderItem={renderItem} showNextButton={false} dotStyle={styles.dotStyle} activeDotStyle={styles.activeDotStyle} data={data} />
      </View>
      <View style={{flex: 1}}>
        <LongRoundButton title='LOGIN WITH EMAIL' onPress={handleEmailLogin} containerStyle={styles.emailButton} />
        <SocialIcon title='LOGIN WITH GOOGLE' button type='google' iconSize={moderateScale(20)} onPress={handleGoogleLogin} style={styles.socialButton} fontStyle={styles.buttonText} />
        <Text style={styles.text}>
          Don't have an account?{' '}
          <Text style={styles.signUpText} onPress={handleSignUp}>
            Signup
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: moderateScale(24),
    fontFamily: 'Roboto-Regular',
    color: colours.black,
  },
  text: {
    marginTop: verticalScale(16),
    marginBottom: verticalScale(24),
    marginHorizontal: scale(70),
    textAlign: 'center',
    color: colours.darkGray,
  },
  dotStyle: {
    backgroundColor: colours.white,
    borderColor: colours.mediumGray,
    borderWidth: 1,
  },
  activeDotStyle: {
    backgroundColor: colours.lightGray,
    borderColor: colours.mediumGray,
    borderWidth: 1,
  },
  emailButton: {
    marginBottom: verticalScale(8),
    marginHorizontal: scale(32),
  },
  socialButton: {
    height: verticalScale(42),
    borderRadius: 30,
    marginTop: 0,
    marginHorizontal: scale(32),
  },
  buttonText: {
    fontSize: moderateScale(12),
    fontFamily: 'Roboto-Medium',
    fontWeight: 'normal',
  },
  signUpText: {
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
  loading: {
    position: 'absolute',
    top: SCREEN.HEIGHT / 2 - 25,
    left: SCREEN.WIDTH / 2 - 25,
  },
});

export default Auth;
