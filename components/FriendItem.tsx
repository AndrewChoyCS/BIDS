import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";

interface Friend {
  id: string;
  name: string;
  profilePicture: string;
  status: string;
}

interface FriendItemProps {
  friend: Friend;
}

const FriendItem: React.FC<FriendItemProps> = ({ friend }) => {
  const [modalVisible, setModalVisible] = useState(false);

  if (!friend) {
    console.error('FriendItem received undefined friend.');
    return null;
  }

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const recentEvents = ["Event Title 1", "Event Title 2", "Event Title 3"];

  return (
    <>
      <TouchableOpacity onPress={openModal}>
        <View style={styles.container}>
          <Image source={{ uri: friend.profilePicture }} style={styles.profilePicture} />
          <View style={styles.info}>
            <Text style={styles.name}>{friend.name}</Text>
            <Text style={styles.status}>{friend.status}</Text>
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
              <Image source={{ uri: friend.profilePicture }} style={styles.imageInModel} />
              <Text style={styles.nameInModel}>{friend.name}</Text>
              <Text style={styles.statusInModel}>{friend.status}</Text>

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
    backgroundColor: '#2c2c2c', // Updated background color to a dark shade
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
    color: "#ab20fd", // Purple color
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
