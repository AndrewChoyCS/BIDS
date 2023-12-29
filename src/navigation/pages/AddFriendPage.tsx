import React, { useState, useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getDatabase, ref, query, orderByChild, startAt, endAt, get, set, push } from 'firebase/database';
import { getAuth } from "firebase/auth";


// Assuming 'db' is initialized properly somewhere in your code
import { db } from "../../config/firebase";

export default function AddFriendPage({ navigation }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [friendRequestsSent, setFriendRequestsSent] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = ref(db, "Users");
  
      try {
        if (searchQuery.trim() !== "") {
          const searchResults = [];
  
          const snapshot = await get(usersRef);
  
          snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
  
            // Check if the username includes the search query (case-insensitive)
            if (user.username.toLowerCase().includes(searchQuery.toLowerCase())) {
              searchResults.push(user);
            }
          });
  
          setSearchResults(searchResults);
        } else {
          setSearchResults([]); 
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchUsers();
  }, [searchQuery]);


  const addFriend = async (friendUserId) => {
    const auth = getAuth();
    const user = auth.currentUser;

    // Replace 'Friends' with the path to your friends collection in Firebase
    const friendsRef = ref(db, `Users/${user.uid}/Friends`);

    // Check if a friend request has already been sent to this user
    if (friendRequestsSent[friendUserId]) {
      console.log(`Friend request to ${friendUserId} already sent`);
      return;
    }

    // Generate a unique key for the friend
    const newFriendRef = push(friendsRef);

    try {
      // Set the user with friendUserId as a friend using the unique key
      // Assuming you want to set a boolean value (true) as a friend
      await set(newFriendRef, friendUserId, true);

      console.log(`Successfully added ${friendUserId} to your Friends list`);

      // Update state to indicate that the friend request has been sent for this user
      setFriendRequestsSent((prev) => ({
        ...prev,
        [friendUserId]: true,
      }));
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };



  const renderItem = ({ item }) => (
    <View style={styles.userContainer}>
      <Text>{item.username}</Text>
      <TouchableOpacity onPress={() => addFriend(item.userId)} disabled={friendRequestsSent[item.userId]}>
        <Ionicons
          name={friendRequestsSent[item.userId] ? "ios-checkmark-circle" : "ios-add-circle"}
          size={24}
          color={friendRequestsSent[item.userId] ? "green" : "blue"}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="ios-arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Friend</Text>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by username"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.userId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0, // Adjusted padding for Android
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    marginBottom: 16,
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
});
