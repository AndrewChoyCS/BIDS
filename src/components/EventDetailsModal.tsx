import { get, onValue, ref } from 'firebase/database';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet,} from 'react-native';
import { db } from '../config/firebase';
import { getAuth } from 'firebase/auth';

const EventDetailsModal: React.FC<{
    modalVisible: boolean;
    closeModal: () => void;
    eventData: Event | null;
  }> = ({ modalVisible, closeModal, eventData }) => {
    if (!eventData) {
      return null;
    }
    const auth = getAuth();
    const user = auth.currentUser;
    const [yesArray, setYesArray] = useState<string[]>([]); // Assume usernames are strings
    const [noArray, setNoArray] = useState<string[]>([]); // Assume usernames are strings
    const [loading, setLoading] = useState(true);
    const [yesUsernames, setYesUsernames] = useState([])
    const [noUsernames, setNoUsernames] = useState([])
    const [prevEventData, setPrevEventData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
          const yesRef = ref(db, `Events/${eventData.eventId}/RSVPStatus/yes`);
          const noRef = ref(db, `Events/${eventData.eventId}/RSVPStatus/no`);
      
          try {
            const [yesSnapshot, noSnapshot] = await Promise.all([get(yesRef), get(noRef)]);
      
            const yesData = yesSnapshot.val();
            const noData = noSnapshot.val();
      
            if (yesData) {
              const yesUsers = Object.values(yesData) as string[];
            //   setYesArray(yesUsers);
      
              const yesUsernamesPromises = yesUsers.map(async (user) => {
                const userRef = ref(db, `Users/${user}/username`);
                const usernameSnapshot = await get(userRef);
                return usernameSnapshot.val();
              });
              const yesUsernames = await Promise.all(yesUsernamesPromises);
              setYesUsernames((prevYesUsernames) => [...prevYesUsernames, ...yesUsernames]);
              

            }
      
            if (noData) {
              const noUsers = Object.values(noData) as string[];
            //   setNoArray(noUsers);
      
              const noUsernamesPromises = noUsers.map(async (user) => {
                const userRef = ref(db, `Users/${user}/username`);
                const usernameSnapshot = await get(userRef);
                return usernameSnapshot.val();
              });
              const noUsernames = await Promise.all(noUsernamesPromises);
              setNoUsernames((prevNoUsernames) => [...prevNoUsernames, ...noUsernames]);

            }
      
            setLoading(false); // Set loading to false when data fetching is complete
            console.log(yesUsernames)
            console.log(noUsernames)
          } catch (error) {
            console.error("Error fetching RSVP data:", error);
            setLoading(false); // Set loading to false in case of an error
          }
        };
      
        fetchData(); // Call the async function here
      }, [eventData]); // Dependency array to re-run effect when eventData changes
      

      const resetState = () => {
        setYesUsernames([]);
        setNoUsernames([]);
        // setLoading(true);
      };
    
      const handleCloseModal = () => {
        resetState();
        closeModal();
      };

    if (loading) {
      // Display a loading indicator or some placeholder while data is being fetched
      return (
        <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={closeModal}>
                 
        </Modal>
      );
    }
    
  
    return (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.eventDetailsModalContainer}>
            <Image source={{ uri: eventData.eventBanner }} style={styles.eventDetailsBanner} />
            <Text style={styles.eventDetailsName}>{eventData.eventTitle}</Text>
            <Text style={styles.eventDetailsAddress}>{eventData.address}</Text>
    
            <View style={styles.rsvpContainer}>
              <View style={styles.yesColumn}>
                <Text style={styles.rsvpTitle}>RSVP Yes</Text>
                <Text style={styles.rsvpList}>{yesUsernames.join(', ')}</Text>
              </View>
    
              <View style={styles.noColumn}>
                <Text style={styles.rsvpTitle}>RSVP No</Text>
                <Text style={styles.rsvpList}>{noUsernames.join(', ')}</Text>
              </View>
            </View>
    
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      );
    };

const styles = StyleSheet.create({
  eventDetailsModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  eventDetailsBanner: {
    width: '100%',
    height: 200, // Customize the height as needed
  },
  eventDetailsName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 10,
  },
  eventDetailsAddress: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  eventDetailsRSVP: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  rsvpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  yesColumn: {
    flex: 1,
    backgroundColor: 'green',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  noColumn: {
    flex: 1,
    backgroundColor: 'red',
    borderRadius: 8,
    padding: 10,
    marginLeft: 10,
  },
  rsvpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  rsvpList: {
    fontSize: 16,
    color: '#fff',
  },
});

export default EventDetailsModal;
