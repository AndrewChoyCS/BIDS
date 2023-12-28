import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import EditEventModal from "../../components/EditEventModal";
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaFrameContext, SafeAreaView } from 'react-native-safe-area-context';
import { getAuth,} from 'firebase/auth';
import { db } from '../../config/firebase';
import { push, ref, set, onValue } from 'firebase/database';

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

  const auth = getAuth();
  const user = auth.currentUser;

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
        console.log(userEvents);
      }
    });
  }, [user]);
  
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.wholePageContainer}>
        {events.map((item, index) => (
          <TouchableOpacity key={item.id} onPress={() => handleItemPress(item)}>
            <View style={styles.cardContainer}>            
              <Image source={item.organizerProfilePic} style={styles.profilePic} />
              <View style={styles.cardContent}>
                <Text style={styles.eventName}>{item.eventTitle}</Text>
                <Text style={styles.organizerName}>{item.organization}</Text>
                <Text style={styles.location}>{item.address}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <EditEventModal modalVisible={modalVisible} closeModal={closeModal} {...modalData} />
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
    paddingTop: 50
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
