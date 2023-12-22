import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

  // img: any;
  // location: string;
  // name: string;
  // ratings: number;
  // theme: string;
  // date: string
  // bid: boolean

//The commented attributes should be the required ones for this to work
interface Event {
  id: number;
  eventName: string;
  organizerName: string;
  organizerProfilePic: string;
  editMode: boolean; 
  buttonPressed: number; 
  //0 will be default when no button is pressed
  //1 when user is going therefore switch styling sheet for the event box to have neon green borders
  //2 when user is not going therefore switch styling sheet for the event box to have neon Red borders
  //Back to 0 when user clicks edit resvp
}


const hardcodedEvent: Event = {
  id: 1,
  eventName: 'Test Event',
  organizerName: 'Test Organizer',
  organizerProfilePic: "../Images/parker.jpeg",
  editMode: false,
  buttonPressed: 0,
};

const hardcodedEvent2: Event = {
  id: 2,
  eventName: 'Merp and Derp',
  organizerName: 'Da Boi',
  organizerProfilePic: "../Images/parker.jpeg",
  editMode: false,
  buttonPressed: 0,
};
const hardcodedEvent3: Event = {
  id: 3,
  eventName: 'Minecraft Bed Wars Lan Event',
  organizerName: 'One of us Gaming feat. Minimize and avelman',
  organizerProfilePic: "../Images/parker.jpeg",
  editMode: false,
  buttonPressed: 0,

};

const InvitePage: React.FC<InvitePageProps> = ({ events = [] }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editModes, setEditModes] = useState<{ [eventId: number]: boolean }>({});
  const [rsvpStatus, setRSVPStatus] = useState<{ [eventId: number]: number }>({
    1: hardcodedEvent.buttonPressed,
    2: hardcodedEvent2.buttonPressed,
    3: hardcodedEvent3.buttonPressed,
  });

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
    // Update the RSVP status for the event
    setRSVPStatus((prevRSVPStatus) => ({
      ...prevRSVPStatus,
      [eventId]: response === 'yes' ? 1 : 2,
    }));
    // Update the buttonPressed property for the event
    setEditMode(eventId, true);
  };
  

  const handleEdit = (eventId: number) => {
    setEditMode(eventId, false); // Reset edit mode for the specific event
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
        backgroundColor: '#7d12ff', // Keep the background color constant
      };
    }
    
    return {
      borderColor: 'transparent', // No border when not in edit mode and no RSVP status
      borderWidth: 0,
      backgroundColor: '#7d12ff', // Keep the background color constant
    };
  };
  
  return (
    <View style={styles.container}>
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
    // backgroundColor: '#7d12ff',
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
