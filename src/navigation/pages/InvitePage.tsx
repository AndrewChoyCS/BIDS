import React, { useState, createContext, useContext, useEffect, } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import EventModel from '../../components/EventModal';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth } from 'firebase/auth';
import { onValue, ref } from 'firebase/database';
import { db } from '../../config/firebase';


interface Event {
  id: number;
  eventName: string;
  organizerName: string;
  organizerProfilePic: string;
  editMode: boolean;
  buttonPressed: number;
  location: string;
  ratings: number;
  theme: string;
  date: string;
  bid: boolean;
}

interface InvitePageProps {
  events?: Event[];
}
const InvitePage: React.FC<InvitePageProps> = ({ events = [] }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editModes, setEditModes] = useState<{ [eventId: number]: boolean }>({});
  const [rsvpStatus, setRSVPStatus] = useState<{ [eventId: number]: number }>({
  });

  const auth = getAuth()
  const user = auth.currentUser

  useEffect(() => {
    // console.log(user.uid)
    const friendsRef = ref(db, `Users/${user.uid}/Friends`);

    onValue(friendsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const friendsArray = Object.values(data);
        setSelectedEvent(friendsArray);
      }      
    });
    // console.log(friends)
  }, [user]);

  const handleAddFriendPress = () => {
    navigation.navigate('AddFriendPage');
  };
  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditMode(selectedEvent?.id, false);
  };

  const handleResponse = (eventId: number, response: 'yes' | 'no') => {
    console.log(`User responded ${response} for event ${eventId}`);
    setRSVPStatus((prevRSVPStatus) => ({
      ...prevRSVPStatus,
      [eventId]: response === 'yes' ? 1 : 2,
    }));
    setEditMode(eventId, true);
  };

  const handleEdit = (eventId: number) => {
    setEditMode(eventId, false);
  };

  const setEditMode = (eventId: number, value: boolean) => {
    setEditModes((prevEditModes) => ({
      ...prevEditModes,
      [eventId]: value,
    }));
  };

  const getEventStyles = (event: Event) => {
    const eventRSVPStatus = rsvpStatus[event.id];

    if (event.editMode || (eventRSVPStatus !== undefined && eventRSVPStatus !== 0)) {
      return {
        borderColor: eventRSVPStatus === 1 ? '#00FF00' : (eventRSVPStatus === 2 ? '#FF0000' : 'transparent'),
        borderWidth: 2,
        backgroundColor: '#7d12ff',
      };
    }

    return {
      borderColor: 'transparent',
      borderWidth: 0,
      backgroundColor: '#7d12ff',
    };
  };

  const modalData = {
    img: selectedEvent?.organizerProfilePic,
    name: selectedEvent?.eventName,
    ratings: selectedEvent?.ratings,
    location: selectedEvent?.location,
    date: selectedEvent?.date,
    theme: selectedEvent?.theme,
    bid: selectedEvent?.bid,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {[...events, hardcodedEvent, hardcodedEvent2, hardcodedEvent3].map((event) => (
          <TouchableOpacity key={event.id} onPress={() => openModal(event)}>
            <View style={[styles.eventCard, getEventStyles(event)]}>
              <View style={styles.eventInfo}>
                <Text style={styles.eventName}>{event.eventName}</Text>
                <Text style={styles.organizerText}>Organized by: {event.organizerName}</Text>
              </View>
              {!editModes[event.id] ? (
                <View style={styles.responseButtons}>
                  <TouchableOpacity
                    onPress={() => handleResponse(event.id, 'yes')}
                    style={[styles.responseButton, styles.yesButton]}
                  >
                    <Text style={styles.buttonText}>Going</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleResponse(event.id, 'no')}
                    style={[styles.responseButton, styles.noButton]}
                  >
                    <Text style={styles.buttonText}>Not Going</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => handleEdit(event.id)}
                  style={[styles.responseButton, styles.editButton]}
                >
                  <Text style={styles.buttonText}>Edit RSVP</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ))}
        <EventModel modalVisible={modalVisible} closeModal={closeModal} {...modalData} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A08', // Black
  },
  container: {
    flex: 1,
    backgroundColor: "#0A0A08",
    padding: 10,
    paddingTop: 30
  },
  eventCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    margin: 8,
    borderRadius: 16,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#fff',
  },
  organizerText: {
    fontSize: 14,
    color: "#eeeade",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
  },
  responseButtons: {
    flexDirection: 'row',
  },
  responseButton: {
    padding: 10,
    borderRadius: 8,
  },
  yesButton: {
    backgroundColor: '#228B22',
    marginLeft: 10,
  },
  noButton: {
    backgroundColor: '#ff0000',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    backgroundColor: "#0A0A08", // Adjust the background color
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImg: {
    height: 400,
    width: "100%",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#c0e5c8",
    marginBottom: 10,
    marginTop: -50,
  },
  locationTextInModel: {
    color: "#85b79d",
    fontSize: 18
  },
  themeText: {
    fontSize: 16,
    color: "#85b79d",
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 75,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },  
  closeButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },
  editButton: {
    backgroundColor: '#007BFF', // Blue color for Edit RSVP button
    marginLeft: 10,
  },
  ratings: {
    flexDirection: "row",
    alignItems: "center",
    
  },
});


export default InvitePage;
