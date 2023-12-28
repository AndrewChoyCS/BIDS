import { useState, useEffect } from "react";
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
import { db } from "../../config/firebase";
import { getDatabase, ref, onValue } from "firebase/database";



// import { StyleSheet, Text, View } from 'react-native';

import React from "react";

export default function LandingPage () {
  // const { user } = useAuthentication();
  const auth = getAuth();
  const navigation = useNavigation();
  // const db = getDatabase();
  const [events, setEvents] = useState([]);
  const db = getDatabase();

  useEffect(() => {
    const eventsRef = ref(db, "Events");

    // Listen for changes to the 'Events' node in the database
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();

      // Convert the data to an array and update the state
      if (data) {
        const eventsArray = Object.values(data);
        setEvents(eventsArray);
      }
    });
  }, []);



  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.pageContainer}>
        <Text style={styles.eventText}>Events</Text>
        <View style={styles.eventsContainer}>
          {/* Header */}
          {events.map((event, index) => (
            <EventCard
              key={index}
              name={event.eventTitle}
              location={event.address}
              img={require("../../Images/tke.jpeg")}
              ratings={1.8}
              theme={event.theme}
              bid={true}
              date="10pm"
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A08', // Black
  },
  pageContainer: {
    backgroundColor: "#0A0A08", // Replace with your desired background color
  },
  eventText: {
    fontSize: 30,
    color: "#F0EDEE",
    alignSelf: "center",
    fontWeight: "bold"
  },
  eventsContainer: {
    marginTop: 0,
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