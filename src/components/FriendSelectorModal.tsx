import React from 'react';
import { Modal, View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FriendSelectorModal = ({ showModal, friendsList, isFriendSelected, onFriendSelect, onCloseModal, friendUsernames }) => {
  console.log(friendUsernames)
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={showModal}
      onRequestClose={onCloseModal}
    >
      <View style={styles.modalView}>
        <FlatList
          data={friendsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.friendItem, isFriendSelected(item) && styles.friendItemSelected]}
              onPress={() => onFriendSelect(item)}
            >
              <Text style={styles.friendItemText}>{friendUsernames[item]}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.modalSubmitButton} onPress={onCloseModal}>
          <Text style={styles.submitButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0a0a0a', // Dark background
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
        backgroundColor: '#00ff00', // Neon green
      },
      imageUploadText: {
        fontSize: 16,
        color: '#7d12ff',
        marginTop: 10,
      },
      inputContainer: {
        marginBottom: 20,
      },
      textInput: {
        height: 50,
        borderColor: '#7d12ff', // Neon green
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 20, // Increased border radius for a bubbly shape
        color: '#6528F7', // White text
        // fontWeight: "bold",
        backgroundColor: '#ffffff', // Optional: background color if needed
      },
      label: {
        fontSize: 18,
        marginBottom: 10,
        color: '#A076F9', // Neon green
      },
      pickerContainer: {
        borderColor: '#7d12ff',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        marginBottom: 20,
        padding: 10,
        borderRadius: 20,
      },
      selectedFriendsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
      },
      selectedFriend: {
        backgroundColor: '#ff00ff', // Neon pink
        borderRadius: 15,
        padding: 8,
        marginRight: 10,
        marginBottom: 10,
      },
      selectedFriendText: {
        fontSize: 14,
        color: '#ffffff', // White text
      },
      friendItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#A076F9',
      },
      friendItemSelected: {
        backgroundColor: '#A076F9', // Light blue
      },
      friendItemText: {
        fontSize: 16,
        color: '#ffffff', // White text
      },
      submitButton: {
        backgroundColor: '#7d12ff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
      },
      submitButtonText: {
        fontSize: 16,
        color: '#ffffff', // White text
        fontWeight: 'bold',
      },
      modalView: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 44 : 20,
        backgroundColor: '#0a0a0a', // Dark background
      },
      modalSubmitButton: {
        backgroundColor: '#6528F7', // Neon green
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
      },  
      disabledButton: {
        backgroundColor: '#808080', // Gray color for disabled button
      },
      backButton: {
        marginTop: 10,
        marginLeft: 10,
        padding: 10,
      },});

export default FriendSelectorModal;
