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
    organizerName: 'One of us Gaming feat. Minimize and avelman',
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
              <Text style={styles.buttonText}>Going</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleResponse(event.id, 'no')} style={[styles.responseButton, styles.noButton]}>
              <Text style={styles.buttonText}>Not Going</Text>
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
});


export default InvitePage;
