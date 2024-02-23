import React from "react";
import { useState, useEffect } from "react";
import { Button, SafeAreaView, ScrollView, StyleSheet, View, Text } from "react-native";
import { EventCard } from "../../Cards";
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import { signOut, getAuth } from "firebase/auth";
import { CommonActions, useNavigation } from '@react-navigation/native';
import { db } from "../../config/firebase";
import { getDatabase, ref, onValue, get, child } from "firebase/database";
import { deleteExpiredEvents } from "../../services/eventservice";
import MapPage from "./MapPage";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function LandingPage() {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const db = getDatabase();
  const dbRef = ref(getDatabase());

  useEffect(() => {
    deleteExpiredEvents(user.uid);
  }, [user.uid]);

  useEffect(() => {
    const userRef = ref(db, `Users/${user.uid}/Organizations`);

    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const dataArray = Object.values(data);

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

        return Promise.all(promises);
      } else {
        console.log("No data found");
        return [];
      }
    }).then((allOngoingEventsArrays) => {
      const ongoingEventsArray = [].concat(...allOngoingEventsArrays);

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

      return Promise.all(eventPromises);
    }).then((allEvents) => {
      const allUserEvents = [].concat(...allEvents);

      const sortedEvents = allUserEvents.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);

        if (dateA > dateB) {
          return 1;
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
    }).catch((error) => {
      console.error(error);
    });

  }, [db, user.uid, dbRef]);


  const handleMapPress = () => {
    navigation.navigate('Map Page');
    console.log("print")
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.pageContainer}>
        <View style={styles.mapButtonContainer}>
          <TouchableOpacity style={styles.mapButton} onPress={handleMapPress}>
            <Text>Map</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.eventsContainer}>
          {/* Header */}
          {events.map((event, index) => (
            <EventCard
              key={index}
              name={event.eventTitle}
              location={event.address}
              img={event.eventBanner}
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
  mapButtonContainer: {
    position: 'absolute',
    top: 5,
    right: 20,
    zIndex: 999, // Ensure the button is above other elements
  },
  mapButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white background
    padding: 10,
    borderRadius: 5,
  },
  mapButtonText: {
    color: "#000", // Adjust the color according to your design
    fontSize: 16, // Adjust the font size according to your design
  },
  eventsContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
