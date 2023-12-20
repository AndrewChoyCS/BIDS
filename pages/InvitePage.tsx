import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface Event {
  id: number;
  eventName: string;
  organizerName: string;
  organizerProfilePic: string;
}

interface InvitePageProps {
  events?: Event[];
}

const InvitePage: React.FC<InvitePageProps> = ({ events = [] }) => {

  const hardcodedEvent: Event = {
    id: 1,
    eventName: 'Test Event',
    organizerName: 'Test Organizer',
    organizerProfilePic: "../Images/parker.jpeg",
  };
  const hardcodedEvent2: Event = {
    id: 2,
    eventName: 'Merp and Derp',
    organizerName: 'Da Boi',
    organizerProfilePic: "../Images/parker.jpeg",
  };
  const hardcodedEvent3: Event = {
    id: 3,
    eventName: 'Minecraft Bed Wars Lan Event',
    organizerName: 'One of us Gaming',
    organizerProfilePic: "../Images/parker.jpeg",
  };

  const handleResponse = (eventId: number, response: string) => {
    // Handle the user's response (yes or no) for the given event ID
    console.log(`User responded ${response} for event ${eventId}`);
    // You can implement the logic for confirming or denying attendance here
  };

  return (
    <View style={styles.container}>
      {[...events, hardcodedEvent, hardcodedEvent2, hardcodedEvent3].map((event) => (
        <View key={event.id} style={styles.eventCard}>
          <View style={styles.eventInfo}>
            <Text style={styles.eventName}>{event.eventName}</Text>
            <Text style={styles.organizerText}>Organized by: {event.organizerName}</Text>
          </View>
          <Image source={{ uri: event.organizerProfilePic }} style={styles.profilePic} />
          <View style={styles.responseButtons}>
            <TouchableOpacity onPress={() => handleResponse(event.id, 'yes')} style={[styles.responseButton, styles.yesButton]}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleResponse(event.id, 'no')} style={[styles.responseButton, styles.noButton]}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  eventCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    margin: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 3, // For shadow on Android
    shadowColor: 'black', // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  organizerText: {
    fontSize: 14,
    color: '#666',
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
    borderRadius: 5,
  },
  yesButton: {
    backgroundColor: 'green',
    marginLeft: 10,
  },
  noButton: {
    backgroundColor: 'red',
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default InvitePage;
