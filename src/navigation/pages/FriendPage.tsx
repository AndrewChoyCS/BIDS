import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import FriendItem from '../../components/FriendItem';
import { getAuth } from 'firebase/auth';
import {ref, push, set, onValue} from 'firebase/database';
import { db } from '../../config/firebase';

interface Friend {
  id: string;
  name: string;
  profilePicture: string;
  status: string;
}

const COLORS = {
  primary: '#000000',
  secondary: '#7d12ff',
  tertiary: '#ab20fd',
  accent: '#200589',
  background: '#fbf8fd',
  button: '#35CE8D', // Added button color
};

const FriendPage: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    // console.log(user.uid)
    const friendsRef = ref(db, `Users/${user.uid}/Friends`);

    onValue(friendsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const friendsArray = Object.values(data) as Friend[];
        setFriends(friendsArray);
      }      
    });
    // console.log(friends)
  }, [user]);

  const handleAddFriendPress = () => {
    navigation.navigate('AddFriendPage');
  };

  return (
    <ScrollView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Friends</Text>
        <TouchableOpacity onPress={handleAddFriendPress} style={styles.addButton}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={friends}
        // keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FriendItem userId={item} />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No friends to show.</Text>}
        contentContainerStyle={styles.container} // Remove this line if not needed
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A0A08"
  },
  container: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    // paddingVertical: 20,
    paddingTop: 80,
    backgroundColor: COLORS.primary,
  },
  headerText: {
    color: COLORS.button,
    fontSize: 35,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: COLORS.button,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#555', // Adjusted empty text color
    fontSize: 16,
  },
});

export default FriendPage;