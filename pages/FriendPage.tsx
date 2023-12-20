import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import FriendItem from '../components/FriendItem';

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
      { id: '1', name: 'John Doe', profilePicture: 'https://via.placeholder.com/150', status: 'Online' },
      { id: '2', name: 'Jane Smith', profilePicture: 'https://via.placeholder.com/150', status: 'Offline' },
      // Add more friends here
    ];
    setFriends(newFriends);
    console.log(newFriends); // This should print the array of friends
  }, []);

  return (
    <FlatList
      data={friends}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        console.log(item); // This should log each friend object
        return <FriendItem friend={item} />;
      }}
      ListEmptyComponent={<Text>No friends to show.</Text>}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

export default FriendPage;