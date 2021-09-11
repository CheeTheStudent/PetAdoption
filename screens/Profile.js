import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

const Profile = ({ navigation }) => {

  const handleSignOut = () => {
    auth()
      .signOut();
    // .then(() => navigation.navigate("Authentication"));
  };

  return (
    <View style={styles.body}>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Profile;