import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import EditEventModal from "../../components/EditEventModal";
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaFrameContext, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/firebase';
import { push, ref, set, onValue, remove, get } from 'firebase/database';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons'; // Import the MaterialIcons icon
import { useNavigation } from '@react-navigation/native';
import EventDetailsModal from '../../components/EventDetailsModal'; // Import EventDetailsModal



const MyEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editEventClicked, setEditEventClicked] = useState(false);
  const [eventDetailsModalVisible, setEventDetailsModalVisible] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation()
  const insets = useSafeAreaInsets(); // Correct usage of useSafeAreaInsets

  useEffect(() => {
    const eventsRef = ref(db, 'Events');

    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const eventsArray: Event[] = Object.values(data);

        // Filter events where admin UID matches the current user's UID
        const userEvents = eventsArray.filter(
          event => event.admin === user.uid
        );

        setEvents(userEvents);
      }
    });
  }, [user]);

  const handleEditEventClick = () => {
    // Set the state when the "Edit Event" button is clicked
    setEditEventClicked(true);
  };

  const handleItemPress = (event: Event) => {
    // Check if the "Edit Event" button has been clicked
    if (editEventClicked) {
      // Set the selected event and open the edit event modal only if "Edit Event" button was clicked
      setSelectedEvent(event);
      setModalVisible(true);
    } else {
      // If "Edit Event" is not clicked, open the event details modal
      setSelectedEvent(event);
      setEventDetailsModalVisible(true);
    }
  };

  const closeModal = () => {
    // Close both modals and reset the "Edit Event" button state
    setModalVisible(false);
    setEventDetailsModalVisible(false);
    setEditEventClicked(false);
  };

  const modalData = {
    img: selectedEvent?.organizerProfilePic,
    name: selectedEvent?.eventTitle,
    ratings: selectedEvent?.ratings,
    location: selectedEvent?.address,
    fee: selectedEvent?.entryFee,
    date: selectedEvent?.date,
    theme: selectedEvent?.theme,
    bid: selectedEvent?.bid,
    description: selectedEvent?.eventDescription,
    organizationName: selectedEvent?.organizerName,
    eventID: selectedEvent?.eventId
  };

  const renderSwipeableEventItem = (event: Event, key: string) => {
    const swipeRightActions = () => (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteEvent(event)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    );

    return (
      <Swipeable key={key} renderRightActions={swipeRightActions}>
        <TouchableOpacity onPress={() => handleItemPress(event)}>
          <View style={styles.cardContainer}>
            <Image source={{ uri: event.eventBanner }} style={styles.profilePic} />
            <View style={styles.cardContent}>
              <Text style={styles.eventName}>{event.eventTitle}</Text>
              <Text style={styles.organizerName}>{event.organizationName}</Text>
              <Text style={styles.location}>{event.address}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const handleDeleteEvent = async (eventData) => {
    try {
      const eventRef = ref(db, `Events/${eventData.eventId}`);
      await remove(eventRef);

      const orgRef = ref(db, `Organizations/${eventData.organizationID}/OngoingEvents`);
      const snapshot = await get(orgRef);

      if (snapshot.exists()) {
        const allEvents = snapshot.val();

        for (const event in allEvents) {
          if (allEvents[event] === eventData.eventId) {
            const lastRef = ref(db, `Organizations/${eventData.organizationID}/OngoingEvents/${event}`);
            await remove(lastRef);
          }
        }
      } else {
        console.log("Organization's ongoing events not found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.editEventButton}
        onPress={handleEditEventClick}
      >
        <Text style={styles.editEventButtonText}>Edit Event</Text>
      </TouchableOpacity>
      <ScrollView style={styles.wholePageContainer}>
      {events.map((item) => renderSwipeableEventItem(item, item.eventId))}
        <EditEventModal
          modalVisible={modalVisible}
          closeModal={closeModal}
          {...modalData}
        />
        {/* Render the new event details modal */}
        <EventDetailsModal
          modalVisible={eventDetailsModalVisible}
          closeModal={closeModal}
          eventData={selectedEvent}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A08', // Black
  },
  wholePageContainer: {
    flex: 1,
    backgroundColor: '#0A0A08', // Black
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 1,
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
    width: "90%",
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
    fontWeight: 'bold',
    fontSize: 14,
    color: '#6bd07b', // Dark Purple
    marginBottom: 2,
  },
  location: {
    fontWeight: "bold",
    fontSize: 14,
    color: '#e5cfe3', // Deep Blue
  },
  deleteButton: {
    backgroundColor: 'red', // You can customize the color as needed
    justifyContent: 'center',
    alignItems: 'center',
    width: 80, // Adjust the width as needed
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editEventButton: {
    position: 'absolute',
    top:  65,
    right: 16,
    zIndex: 1,
  },
  editEventButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: "bold"
  },
});

export default MyEventsPage;
