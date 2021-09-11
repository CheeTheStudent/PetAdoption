import React, { useState } from 'react';
import { View, Text, StatusBar, Image, ActivityIndicator, ToastAndroid, StyleSheet } from 'react-native';
import { Button, SocialIcon } from 'react-native-elements';
import AppIntroSlider from 'react-native-app-intro-slider';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import auth from '@react-native-firebase/auth';

import LongRoundButton from './components/LongRoundButton';
import colours from '../assets/colours/colours';
import { SCREEN } from '../assets/constants/dimensions';

const data = [
  {
    title: 'Save A Life',
    text: 'Description.\nSay something cool',
    image: require('../assets/images/onboard1.png'),
  },
  {
    title: 'Help A Cause',
    text: 'Other cool stuff',
    image: require('../assets/images/onboard2.png'),
  },
  {
    title: 'Throw A Ball',
    text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
    image: require('../assets/images/onboard3.png'),
  },
];

const Auth = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  GoogleSignin.configure({
    scopes: [],
    webClientId: '1059071183035-sjnactigk6su3d17ak9ed2l15o4t2v7v.apps.googleusercontent.com',
    offlineAccess: true,
    hostedDomain: '',
    loginHint: '',
    forceConsentPrompt: true,
    accountName: '',
    iosClientId: ''
  });

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} />
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
    );
  };

  const keyExtractor = (item) => item.title;

  const handleEmailLogin = () => {
    navigation.navigate('Login');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleFacebookLogin = () => {
    setLoading(true);

    LoginManager.logInWithPermissions(["public_profile"])
      .then(result => {
        if (result.isCancelled) {
          setLoading(false);
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            if (!data) {
              throw 'Something went wrong obtaining access token';
            }
            const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
            return auth().signInWithCredential(facebookCredential);
          });
        }
      }).catch(error => {
        ToastAndroid.show("Sign in failed, please try again.", ToastAndroid.SHORT);
        setLoading(false);
      });
  };

  const handleGoogleLogin = () => {
    setLoading(true);

    GoogleSignin.signIn().then(({ idToken }) => {
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      return auth().signInWithCredential(googleCredential);
    }).catch(error => {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("Login Cancelled.");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play Services are not available or outdated.");
      } else {
        console.log("Login fail with error: " + error);
      }
    });
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {loading && <ActivityIndicator size={50} color="blue" style={styles.loading} />}
      <View style={{ flex: 2 }}>
        <AppIntroSlider
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          dotStyle={styles.dotStyle}
          activeDotStyle={styles.activeDotStyle}
          data={data}
        />
      </View>
      <View style={{ flex: 1 }} >
        <LongRoundButton title="LOGIN WITH EMAIL" onPress={handleEmailLogin} />
        <SocialIcon title="LOGIN WITH FACEBOOOK" button type="facebook" onPress={handleFacebookLogin} style={styles.socialButton} fontStyle={styles.buttonText} />
        <SocialIcon title="LOGIN WITH GOOGLE" button type="google" onPress={handleGoogleLogin} style={styles.socialButton} fontStyle={styles.buttonText} />
        <Text style={styles.text}>Don't have an account? <Text style={styles.signUpText} onPress={handleSignUp}>Signup</Text></Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    marginVertical: 60,
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    fontFamily: 'Roboto-Regular',
    color: colours.black,
  },
  text: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
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
  socialButton: {
    height: 56,
    borderRadius: 30,
    marginTop: 0,
    marginHorizontal: 32,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    fontWeight: 'normal'
  },
  signUpText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    position: 'absolute',
    top: SCREEN.HEIGHT / 2 - 25,
    left: SCREEN.WIDTH / 2 - 25,
  }
});

export default Auth;