import { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  Button
} from "react-native";
import { COLORS } from "../../utils";
import { EventCard } from "../../Cards";
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import { signOut, getAuth } from "firebase/auth";
import { CommonActions, useNavigation } from '@react-navigation/native';


// import { StyleSheet, Text, View } from 'react-native';

import React from "react";

export default function LandingPage () {
  const { user } = useAuthentication();
  const auth = getAuth();
  const navigation = useNavigation();
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        })
      );    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };


    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.pageContainer}>
          {/* <Button title="Sign Out" onPress={() => handleSignOut()} /> */}

            <View style={styles.eventsContainer}>
                {/*Header*/}
                <View style={styles.eventHeader}>
                    {/* <Text style={styles.eventTitle}>Events</Text> */}
                </View>
                <EventCard
                    name="TKE"
                    location="32421 Berk"
                    img={require("../../Images/tke.jpeg")}
                    ratings={1.8}
                    theme="White Lies"
                    bid={true}
                    date="10pm"
                />
                <EventCard
                    name="Jupiter"
                    location="DownTown Berkeley" 
                    img={require("../../Images/dtberk.jpeg")}
                    ratings={4.7}
                    theme="Willy Wonka "
                    bid = {true}
                    date="10pm"
                />
                <EventCard
                    name="La Casa Parker"
                    location="2221 Parker St."
                    img={require("../../Images/parker.jpeg")}
                    ratings={100.0}
                    theme="I love parker"
                    bid = {false}
                    date="11am"
                />
                <EventCard
                    name="La Casa Parker"
                    location="2221 Parker St."
                    img={require("../../Images/parker.jpeg")}
                    ratings={100.0}
                    theme="merps and derps"
                    bid = {false}
                    date="10pm"
                />
                {/* <EventCard
                    name="La Casa Parker"
                    location="2221 Parker St."
                    img={require("../Images/parker.jpeg")}
                    ratings={100.0}
                /> */}
            </View>
        </ScrollView>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A08', // Black
  },
    pageContainer: {
      backgroundColor: "#0A0A08", // Replace with your desired background color
    },
    eventsContainer: {
      marginTop: 30,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    eventHeader: {
      justifyContent: "space-between",
    },
    eventTitle: {
      fontWeight: 'bold',
      fontSize: 50,
      color: '#2C514C',
      textAlign: 'center',
    },
  });