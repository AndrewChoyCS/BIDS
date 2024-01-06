import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";
import { onValue, ref, update, remove, push, set, get} from 'firebase/database';
import { db } from '../config/firebase';
import { getAuth } from 'firebase/auth';

interface FriendItemProps {
  userId: string;
}

const FriendRequestItem: React.FC<FriendItemProps & { onAccept: () => void, onDecline: () => void }> = ({ userId, onAccept, onDecline }) => {
    const [userData, setUserData] = useState<any>(null);
  const auth = getAuth()
  const user = auth.currentUser

  useEffect(() => {
    const userRef = ref(db, `Users/${userId}`);
  
    const fetchData = async () => {
      try {
        onValue(userRef, (snapshot) => {
          setUserData(snapshot.val());
          console.log(userData)
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [userId]);


    const acceptFriendRequest = async (friendUserId) => {
        const friendRequestRef = ref(db, `Users/${user.uid}/FriendRequest`);

        try {
            const friendRequestSnapshot = await get(friendRequestRef);
            if (friendRequestSnapshot.exists()) {
                const friendRequestDict = friendRequestSnapshot.val();
                for (const key in friendRequestDict) {
                    if (friendRequestDict[key] === friendUserId) {
                        const deleteRef = ref(db, `Users/${user.uid}/FriendRequest/${key}`);
                        await remove(deleteRef);
                    }
                }
                const friendsRef = ref(db, `Users/${user.uid}/Friends`);
                await push(friendsRef, friendUserId);
                const friendFriendsRef = ref(db, `Users/${friendUserId}/Friends`);
                await push(friendFriendsRef, user.uid); 
            } else {
                console.log('Friend request data not found.');
            }
        } catch (error) {
            console.error('Error accepting friend request:', error.message);
        }
    };

    const declineFriendRequest = async (friendUserId) => {
        const friendRequestRef = ref(db, `Users/${user.uid}/FriendRequest`);
        try { 
            const friendRequestSnapshot = await get(friendRequestRef);
            if (friendRequestSnapshot.exists()) {
                const friendRequestDict = friendRequestSnapshot.val();
                for (const key in friendRequestDict) {
                    if (friendRequestDict[key] === friendUserId) {
                        const deleteRef = ref(db, `Users/${user.uid}/FriendRequest/${key}`);
                        await remove(deleteRef);
                    }
                }
            } else {
                console.log('Friend request data not found.');
            }    
        } catch (error) {
            console.error('Error deleting friend request:', error.message);
        }
    };




  return (
    <>
        <View style={styles.container}>
          <Image source={{ uri: userData?.profilePicture }} style={styles.profilePicture} />
          <View style={styles.info}>
            <Text style={styles.name}>{userData?.username}</Text>
            <Text style={styles.status}>Insert status here</Text>
          </View>
          {/* Add green check and red x icons */}
          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.acceptIcon} onPress={() => {acceptFriendRequest(userId), onAccept}}>
                <FontAwesome5 name="check" size={20} color="green" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectIcon} onPress = {() => {declineFriendRequest(userId), onDecline}}>
              <FontAwesome5 name="times" size={20} color="red" />
            </TouchableOpacity>
          </View>
        </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 10,
    marginVertical: 5,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: '#4d4d4d',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    color: "#6BA292",
    fontSize: 18,
  },
  status: {
    color: '#aaaaaa',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2c2c2c',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  nameInModel: {
    fontWeight: 'bold',
    color: "#ab20fd",
    fontSize: 50,
    alignSelf: "center",
  },
  statusInModel: {
    color: "#ffffff",
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
    color: "#ab20fd",
  },
  recentEventsText: {
    fontSize: 20,
    color: "#ffffff",
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptIcon: {
    marginHorizontal: 5,
  },
  rejectIcon: {
    marginHorizontal: 5,
  },
});

export default FriendRequestItem;
function async(friendUserId: any) {
    throw new Error('Function not implemented.');
}

