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
import { getDatabase, ref, onValue, get, child } from "firebase/database";



// import { StyleSheet, Text, View } from 'react-native';

import React from "react";

export default function LandingPage () {
  // const { user } = useAuthentication();
  const auth = getAuth();
  const user = auth.currentUser
  const navigation = useNavigation();
  // const db = getDatabase();
  const [events, setEvents] = useState([]);
  const db = getDatabase();
  const dbRef = ref(getDatabase());

  // TODO: this is the same function as invite page. Find way to optimize
  useEffect(() => {
    const userRef = ref(db, `Users/${user.uid}/Organizations`);
  
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const dataArray = Object.values(data);
  
        // Create an array of promises
        const promises = dataArray.map((organization) => {
          return get(child(dbRef, `Organizations/${organization}/OngoingEvents`))
            .then((snapshot2) => {
              if (snapshot2.exists()) {
                const ongoingEvents = snapshot2.val();
                return Object.values(ongoingEvents);
              } else {
                return [];
              }
            });
        });
  
        // Wait for all promises to resolve
        return Promise.all(promises);
      } else {
        console.log("No data found");
        return [];
      }
    }).then((allOngoingEventsArrays) => {
      // Concatenate arrays obtained from different promises
      const ongoingEventsArray = [].concat(...allOngoingEventsArrays);
  
      // Create an array of promises for fetching events
      const eventPromises = ongoingEventsArray.map((currEvent) => {
        return get(child(dbRef, `Events/${currEvent}`))
          .then((snapshot3) => {
            if (snapshot3.exists()) {
              const eventData = snapshot3.val();
              return eventData;
            } else {
              return [];
            }
          });
      });
      // Wait for all event promises to resolve
      return Promise.all(eventPromises);
    }).then((allEvents) => {
      const allUserEvents = [].concat(...allEvents);

      // Sort events based on startDate and startTime
      const sortedEvents = allUserEvents.sort((a, b) => {
        console.log("Event A:", a.startDate);
        console.log("Event B:", b.startDate);
      
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
      
        if (dateA > dateB) {
          return 1; // return -1 here for DESC order
        } else if (dateA < dateB) {
          return -1;
        } else {
          const timeA = new Date(`1970-01-01T${a.startTime}`).getTime();
          const timeB = new Date(`1970-01-01T${b.startTime}`).getTime();
      
          if (timeA > timeB) {
            return 1;
          } else {
            return -1;
          }
        }
      });

    setEvents(sortedEvents);
    console.log("Sorted Events:", sortedEvents);  
    }).catch((error) => {
      console.error(error);
    });
    
  }, [db, user.uid, dbRef]);




  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.pageContainer}>
        <Text style={styles.eventText}>Placeholder</Text>
        <View style={styles.eventsContainer}>
          {/* Header */}
          {events.map((event, index) => (
            <EventCard
              key={index}
              name={event.eventTitle}
              location={event.address}
              img={event.eventBanner}
              // img={require("../../Images/tke.jpeg")}
              ratings={1.8}
              theme={event.theme}
              fee={event.entryFee}
              startDate={event.startDate}
              startTime={event.startTime}
              eventID={event.eventId}
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
    fontWeight: "bold",
    // fontFamily: 'customFont'
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