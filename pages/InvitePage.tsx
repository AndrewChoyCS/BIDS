import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


//The commented attributes should be the required ones for this to work
interface Event {
  id: number;
  eventName: string;
  organizerName: string;
  organizerProfilePic: string;
  editMode: boolean; // Add this property
  buttonPressed: number, //3 will be default and will help with boolean case

  // img: any;
  // location: string;
  // name: string;
  // ratings: number;
  // theme: string;
  // date: string
  // bid: boolean
}

interface InvitePageProps {
  events?: Event[];
}

const hardcodedEvent: Event = {
  id: 1,
  eventName: 'Test Event',
  organizerName: 'Test Organizer',
  organizerProfilePic: "../Images/parker.jpeg",
  editMode: false,
  buttonPressed: 3,
};

const hardcodedEvent2: Event = {
  id: 2,
  eventName: 'Merp and Derp',
  organizerName: 'Da Boi',
  organizerProfilePic: "../Images/parker.jpeg",
  editMode: false,
  buttonPressed: 3,
};
const hardcodedEvent3: Event = {
  id: 3,
  eventName: 'Minecraft Bed Wars Lan Event',
  organizerName: 'One of us Gaming feat. Minimize and avelman',
  organizerProfilePic: "../Images/parker.jpeg",
  editMode: false,
  buttonPressed: 3,
};

      //  <TouchableOpacity key={event.id} onPress={() => openModal(event)}>

const InvitePage: React.FC<InvitePageProps> = ({ events = [] }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editModes, setEditModes] = useState<{ [eventId: number]: boolean }>({});

  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditMode(selectedEvent?.id, false); // Reset edit mode for the specific event
  };

  const handleResponse = (eventId: number, response: 'yes' | 'no') => {
    console.log(`User responded ${response} for event ${eventId}`);
    // Implement your logic for handling the response here
    setEditMode(eventId, true); // Set edit mode for the specific event
  };

  const handleEdit = () => {
    setEditMode(selectedEvent?.id, false); // Reset edit mode for the specific event
  };

  const setEditMode = (eventId: number, value: boolean) => {
    setEditModes((prevEditModes) => ({
      ...prevEditModes,
      [eventId]: value,
    }));
  };

  return (
    <View style={styles.container}>
      {[...events, hardcodedEvent, hardcodedEvent2, hardcodedEvent3].map((event) => (
        <TouchableOpacity key={event.id} onPress={() => openModal(event)}>
          <View
            style={[
              styles.eventCard,
              editModes[event.id] && { borderColor: '#4CAF50' }, // Green outline in edit mode
            ]}
          >
            <View style={styles.eventInfo}>
              <Text style={styles.eventName}>{event.eventName}</Text>
              <Text style={styles.organizerText}>Organized by: {event.organizerName}</Text>
            </View>
            <Image source={{ uri: event.organizerProfilePic }} style={styles.profilePic} />
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
              <TouchableOpacity onPress={handleEdit} style={[styles.responseButton, styles.editButton]}>
                <Text style={styles.buttonText}>Edit RSVP</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      ))}
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <MaterialCommunityIcons name="close" size={30} color="#FF0000" />
          </TouchableOpacity>
          {/* Add the details of the selected event in the modal */}
          {selectedEvent && (
            <>
              <Image source={{ uri: selectedEvent.organizerProfilePic }} style={styles.modalImg} resizeMode="contain"/>
              <Text style={styles.modalTitle}>{selectedEvent.eventName}</Text>
              <View style={styles.ratings} />
                {/* Add your rating and location details here */}
              {/* </View> */}
              <Text style={styles.themeText}>Time: {selectedEvent.date}</Text>
              <Text style={styles.themeText}>Theme: {selectedEvent.theme}</Text>
              {selectedEvent.bid ? (
                <Text style={styles.themeText}>Bids Required: Yes</Text>
              ) : (
                <Text style={styles.themeText}>Bids Required: No</Text>
              )}
              <Text style={styles.themeText}></Text>
              {/* <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, { marginRight: 10 }]} onPress={closeModal}>
                  <MaterialCommunityIcons name="check" size={30} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { marginLeft: 10 }]} onPress={closeModal}>
                  <MaterialCommunityIcons name="close" size={30} color="#FF0000" />
                </TouchableOpacity>
              </View> */}
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A08",
    padding: 10,
  },
  eventCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    margin: 8,
    backgroundColor: '#7d12ff',
    borderRadius: 16,
    elevation: 3, // For shadow on Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  //   borderColor: ({ editMode, eventId }) => (editMode[eventId] ? '#4CAF50' : 'transparent'), // Green outline in edit mode
  //   borderWidth: ({ editMode, eventId }) => (editMode[eventId] ? 2 : 0), // Adjust the border width as needed
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
    // borderCurve: 10
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
});


export default InvitePage;
