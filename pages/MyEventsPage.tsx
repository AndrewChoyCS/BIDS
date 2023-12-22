import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import EditEventModal from "../components/EditEventModal";
import { ScrollView } from 'react-native-gesture-handler';

interface Event {
  id: number;
  eventName: string;
  organizerName: string;
  organizerProfilePic: any; // Change the type to 'any' or the correct type based on your image handling library
  editMode: boolean;
  buttonPressed: number;
  location: string;
  ratings: number;
  theme: string;
  date: string;
  bid: boolean;
}

const MyEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const newEvents: Event[] = [
      {
        id: 1,
        eventName: 'Test Event',
        organizerName: 'Test Organizer',
        organizerProfilePic: require("../Images/parker.jpeg"), // Use require for local images
        editMode: false,
        buttonPressed: 0,
        ratings: 3.2,
        theme: "willy wonka",
        date: "Monday",
        bid: true,
        location: "home"
      },
      {
        id: 2,
        eventName: 'Merp and Derp',
        organizerName: 'Da Boi',
        organizerProfilePic: require("../Images/parker.jpeg"), // Use require for local images
        editMode: false,
        buttonPressed: 0,
        ratings: 3.2,
        theme: "willy wonka",
        date: "Monday",
        bid: true,
        location: "joe mama house",
      },
      {
        id: 3,
        eventName: 'Minecraft Bed Wars Lan Event',
        organizerName: 'One of us Gaming feat. Minimize and avelman',
        organizerProfilePic: require("../Images/parker.jpeg"), // Use require for local images
        editMode: false,
        buttonPressed: 0,
        ratings: 3.2,
        theme: "willy wonka",
        date: "Monday",
        location: "joe's house",
        bid: true
      }
    ];
    setEvents(newEvents);
  }, []);

  const handleItemPress = (event: Event) => {
    // Set the selected event and open the modal
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    // Close the modal
    setModalVisible(false);
  };
  const modalData = {
    img: selectedEvent?.organizerProfilePic,
    name: selectedEvent?.eventName,
    ratings: selectedEvent?.ratings,
    location: selectedEvent?.location,
    date: selectedEvent?.date,
    theme: selectedEvent?.theme,
    bid: selectedEvent?.bid,
    description: "Mepr",
    organizationName: selectedEvent?.organizerName
  };

  return (
    <ScrollView style={styles.wholePageContainer}>
      {events.map((item, index) => (
        <TouchableOpacity key={item.id} onPress={() => handleItemPress(item)}>
          <View style={styles.cardContainer}>            
          <Image source={item.organizerProfilePic} style={styles.profilePic} />
            <View style={styles.cardContent}>
              <Text style={styles.eventName}>{item.eventName}</Text>
              <Text style={styles.organizerName}>{item.organizerName}</Text>
              <Text style={styles.location}>{item.location}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
      <EditEventModal modalVisible={modalVisible} closeModal={closeModal} {...modalData} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wholePageContainer: {
    flex: 1,
    backgroundColor: '#0A0A08', // Black
    paddingTop: 16
  },
  cardContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#200589', // Light Lavender
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 7,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 3,
    width: "90%"
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fbf8fd', // Purple
    marginBottom: 4,
  },
  organizerName: {
    fontWeight:'bold',
    fontSize: 14,
    color: '#6bd07b', // Dark Purple
    marginBottom: 2,
  },
  location: {
    fontWeight: "bold",
    fontSize: 14,
    color: '#e5cfe3', // Deep Blue
  },
});


export default MyEventsPage;
