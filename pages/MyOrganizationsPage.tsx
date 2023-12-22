import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  Platform
} from 'react-native';

const MyOrganizationsPage = () => {
  const [orgName, setOrgName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Hardcoded friends list (replace with dynamic data later)
  const friendsList = [
    { id: '1', name: 'Friend 1' },
    { id: '2', name: 'Friend 2' },
    // ... add more friends
  ];

  const onFriendSelect = (id) => {
    if (selectedFriends.includes(id)) {
      setSelectedFriends(selectedFriends.filter(friendId => friendId !== id));
    } else {
      setSelectedFriends([...selectedFriends, id]);
    }
  };

  const isFriendSelected = (id) => {
    return selectedFriends.includes(id);
  };

  const onSubmit = () => {
    // Handle the submit action
    console.log('Organization Name:', orgName);
    console.log('Selected Friends:', selectedFriends);
    // Close the modal
    setShowModal(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          {/* Placeholder for image - replace with actual image */}
          <Image
            source={require('../Images/tke.jpeg')}
            style={styles.orgImage}
          />
          <Text style={styles.imageUploadText}>Upload Organization Photo</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Organization Name:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={setOrgName}
            value={orgName}
            placeholder="Enter the name of your organization"
            placeholderTextColor="#a9a9a9"
          />
        </View>

        <TouchableOpacity style={styles.pickerContainer} onPress={() => setShowModal(true)}>
          <Text style={styles.label}>Add Members:</Text>
          {/* Display selected friends */}
          <View style={styles.selectedFriendsContainer}>
            {selectedFriends.map(friendId => {
              const friend = friendsList.find(f => f.id === friendId);
              return (
                <View style={styles.selectedFriend} key={friendId}>
                  <Text style={styles.selectedFriendText}>{friend.name}</Text>
                </View>
              );
            })}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalView}>
          <FlatList
            data={friendsList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.friendItem, isFriendSelected(item.id) && styles.friendItemSelected]}
                onPress={() => onFriendSelect(item.id)}
              >
                <Text style={styles.friendItemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.modalSubmitButton} onPress={() => setShowModal(false)}>
            <Text style={styles.submitButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f4f4', // or use a global background color if needed
  },
  container: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  orgImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e1e4e8',
  },
  imageUploadText: {
    fontSize: 16,
    color: '#0000ff',
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  pickerContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
  },
  selectedFriendsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  selectedFriend: {
    backgroundColor: '#dedede',
    borderRadius: 15,
    padding: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedFriendText: {
    fontSize: 14,
  },
  friendItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  friendItemSelected: {
    backgroundColor: '#c0ebff',
  },
  friendItemText: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#0000ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalView: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    backgroundColor: '#f4f4f4',
  },
  modalSubmitButton: {
    backgroundColor: '#0000ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default MyOrganizationsPage;
