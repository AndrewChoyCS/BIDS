import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Touchable} from 'react-native';
import FriendItem from '../../components/FriendItem';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { COLORS } from "../utils"
const COLORS = {
  primary: '#000000',
  secondary: '#7d12ff',
  tertiary: '#ab20fd',
  accent: '#200589',
  background: '#fbf8fd',
};

interface Friend {
  id: string;
  name: string;
  profilePicture: string;
  status: string;
}

const FriendPage: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    // Here you would fetch your friends from an API or local data source
    // This is just hardcoded data for example purposes
    const newFriends = [
      { id: '1', name: 'Big Time Rush', profilePicture: 'https://via.placeholder.com/150', status: 'Online' },
      { id: '2', name: 'Henry Danger', profilePicture: 'https://via.placeholder.com/150', status: 'Offline' },
      { id: '3', name: 'Chirs Pena', profilePicture: 'https://via.placeholder.com/150', status: 'Getting Blasted' },
      { id: '4', name: 'Andrew Choy', profilePicture: 'https://via.placeholder.com/150', status: 'Gettting Active' },
      // Add more friends here
    ];
    setFriends(newFriends);
    console.log(newFriends); // This should print the array of friends
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={friends}
        // style={styles.friendText}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          console.log(item); // This should log each friend object
          return <FriendItem friend={item}/>;
        }}
        ListEmptyComponent={<Text>No friends to show.</Text>}
        contentContainerStyle={styles.container}
      />
    </SafeAreaView>
 
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A08', // Black
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#0A0A08",
    paddingTop: 20
  },
  friendText: {
    color: "#200589"
  },
});

export default FriendPage;