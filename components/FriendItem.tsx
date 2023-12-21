import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

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
  if (!friend) {
    console.error('FriendItem recieved underfined friend.');
    return null;
  }
  return (
    <View style={styles.container}>
      <Image source={{ uri: friend.profilePicture }} style={styles.profilePicture} />
      <View style={styles.info}>
        <Text style={styles.name}>{friend.name}</Text>
        <Text style={styles.status}>{friend.status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: '#cccccc', // Random Color
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    color: "#ab20fd"
  },
  status: {
    color: 'white',
  },
});

export default FriendItem;