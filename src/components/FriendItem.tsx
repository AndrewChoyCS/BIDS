import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Entypo } from "@expo/vector-icons";
import { onValue, ref } from 'firebase/database';
import { db } from '../config/firebase';

interface FriendItemProps {
  userId: string; // Change this to userId
}

const FriendItem: React.FC<FriendItemProps> = ({ userId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const userRef = ref(db, `Users/${userId}`);
  
    const fetchData = async () => {
      try {
        // Provide both the reference and a callback function to onValue
        onValue(userRef, (snapshot) => {
          // handle snapshot data here
          setUserData(snapshot.val());
          console.log(userId)

        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    // console.log(userData)
    fetchData();
  }, [userId]);

  const recentEvents = ["Event Title 1", "Event Title 2", "Event Title 3"];

  return (
    <>
      <TouchableOpacity onPress={openModal}>
        <View style={styles.container}>
          <Image source={{ uri: userData?.profilePicture }} style={styles.profilePicture} />
          <View style={styles.info}>
            <Text style={styles.name}>{userData?.username}</Text>
            {/* <Text style={styles.status}>{userData?.status}</Text> */}
            <Text style={styles.status}>Insert status here</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={{ uri: userData?.profilePicture }} style={styles.imageInModel} />
              <Text style={styles.nameInModel}>{userData?.name}</Text>
              <Text style={styles.statusInModel}>{userData?.status}</Text>

              <View style={styles.recentEventsContainer}>
                <Text style={styles.recentEventTitle}>Recent Events</Text>
                {recentEvents.map((event, index) => (
                  <View key={event}>
                    <Text style={styles.recentEventsText}>
                      <Entypo name="vinyl" size={20} color="#ab20fd" />
                      {" "}{event}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'transparent', // Updated background color to a dark shade
    borderRadius: 10,
    marginVertical: 5,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: '#4d4d4d', // Updated background color to a slightly lighter shade
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    color: "#6BA292", // Purple color
    fontSize: 18,
  },
  status: {
    color: '#aaaaaa', // Lighter text color
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker modal background
    justifyContent: 'center',
    alignItems: 'center',
    // width:
  },
  modalContent: {
    backgroundColor: '#2c2c2c', // Updated modal background color
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  nameInModel: {
    fontWeight: 'bold',
    color: "#ab20fd", // Purple color
    fontSize: 50,
    alignSelf: "center",
  },
  statusInModel: {
    color: "#ffffff", // White text color
    alignSelf: "center",
    fontSize: 20,
  },
  imageInModel: {
    height: 200,
    width: 200,
    borderRadius: 100,
    alignSelf: "center",
  },
  recentEventsContainer: {
    marginTop: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#ab20fd',
    padding: 10,
  },
  recentEventTitle: {
    fontWeight: "bold",
    fontSize: 25,
    alignSelf: "center",
    paddingBottom: 10,
    color: "#ab20fd", // Purple color
  },
  recentEventsText: {
    fontSize: 20,
    color: "#ffffff", // White text color
  },
});


export default FriendItem;