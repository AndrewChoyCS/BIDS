import React, { useState, createContext, useContext, useEffect, } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import EventModel from '../../components/EventModal';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth } from 'firebase/auth';
import { child, equalTo, get, getDatabase, onValue, orderByValue, push, query, ref, remove, set } from 'firebase/database';
import { db } from '../../config/firebase';
import getUserEventData from "../../components/getUserEventData";


interface InvitePageProps {
  events?: Event[];
}
const InvitePage: React.FC<InvitePageProps> = ({}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editModes, setEditModes] = useState<{ [eventId: number]: boolean }>({});
  const [rsvpStatus, setRSVPStatus] = useState<{ [eventId: number]: number }>({});
  const [userOrganizations, setUserOrganizations] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [eventList, setEventList] = useState([]);

  const auth = getAuth()
  const user = auth.currentUser
  const dbRef = ref(getDatabase());

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
    setUserEvents(allUserEvents)
  }).catch((error) => {
    console.error(error);
  });
}, [db, user.uid, dbRef]);

  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditMode(selectedEvent?.id, false);
  };

  const handleResponse = async (eventId: number, response: 'yes' | 'no') => {
    console.log(`Handling response for event ${eventId}, response: ${response}`);
    const eventRef = ref(db, `Events/${eventId}/RSVPStatus/`);
  
    const oppositeResponse = response === 'yes' ? 'no' : 'yes';
    const oppositeRef = ref(db, `Events/${eventId}/RSVPStatus/${oppositeResponse}`);
  
    const userUid = user.uid;
  
    // Check if user is already in the corresponding category
    const currentResponseRef = ref(db, `Events/${eventId}/RSVPStatus/${response}`);
    const currentResponseQuery = query(currentResponseRef, orderByValue(), equalTo(userUid));
    const currentResponseSnapshot = await get(currentResponseQuery);
  
    if (currentResponseSnapshot.exists()) {
      console.log(`User already in ${response} category for event ${eventId}`);
      return; // User is already in the corresponding category, no need to make changes
    }
  
    // Remove user from the opposite RSVP status if exists
    const oppositeQuery = query(oppositeRef, orderByValue(), equalTo(userUid));
    const oppositeSnapshot = await get(oppositeQuery);
    oppositeSnapshot.forEach((childSnapshot) => {
      const childRef = ref(db, `Events/${eventId}/RSVPStatus/${oppositeResponse}/${childSnapshot.key}`);
      remove(childRef);
    });
  
    // Add user to the new RSVP status
    const newRef = ref(db, `Events/${eventId}/RSVPStatus/${response}`);
    const newOrganizationRef = push(newRef);
    set(newOrganizationRef, userUid);
  
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
    const eventRSVPStatus = rsvpStatus[event.eventId];

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
    img: selectedEvent?.eventBanner,
    name: selectedEvent?.eventTitle,
    ratings: selectedEvent?.ratings,
    location: selectedEvent?.address,
    date: selectedEvent?.date,
    theme: selectedEvent?.theme,
    fee: selectedEvent?.entryFee,
    eventID: selectedEvent?.eventId

  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {userEvents.map((event) => (
          <TouchableOpacity key={event.eventId} onPress={() => openModal(event)}>
            <View style={[styles.eventCard, getEventStyles(event)]}>
              <View style={styles.eventInfo}>
                <Text style={styles.eventName}>{event.eventTitle}</Text>
                <Text style={styles.organizerText}>Organized by: {event.organizationName}</Text>
              </View>
              {!editModes[event.eventId] ? (
                <View style={styles.responseButtons}>
                  <TouchableOpacity
                    onPress={() => handleResponse(event.eventId, 'yes')}
                    style={[styles.responseButton, styles.yesButton]}
                  >
                    <Text style={styles.buttonText}>Going</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleResponse(event.eventId, 'no')}
                    style={[styles.responseButton, styles.noButton]}
                  >
                    <Text style={styles.buttonText}>Not Going</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => handleEdit(event.eventId)}
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