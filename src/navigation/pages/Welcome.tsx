import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BIDS</Text>
        <Text style={styles.description}>RSVP YOUR SPOT NOW</Text>

      <View style={styles.buttons}>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('Sign In')}
        >
          Sign In
        </Button>
        <Button
          mode="outlined"
          style={styles.button}
          onPress={() => navigation.navigate('Sign Up')}
          labelStyle={{color: 'white'}}
        >
          Sign Up
        </Button>
        <Button
          mode="outlined"
          style={styles.button}
          onPress={() => navigation.navigate('LandingPage')}
          labelStyle={{color: 'white'}}
        >
          skip
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2D43',
    padding: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#FF84E8"
  },
  description: {
    color: "#FFA9E7",
    fontSize: 20,
  },
  buttons: {
    width: '100%',
    marginTop: 20,
  },

  button: {
    marginVertical: 10,
    color: "#fff"
  },
});

export default WelcomeScreen;
