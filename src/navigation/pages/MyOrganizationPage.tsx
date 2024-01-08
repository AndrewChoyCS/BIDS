import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Modal, Image, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ref, onValue, update, remove, set, push, get } from "firebase/database";
import { db } from "../../config/firebase";
import { getAuth } from "firebase/auth";
import Icon from 'react-native-vector-icons/FontAwesome';
import getUserData from '../../components/getUserData';
import OrganizationItem from "../../components/OrganizationItem";
import FriendSelectorModal from "../../components/FriendSelectorModal";

export default function MyOrganizationPage({ route }) {
  const navigation = useNavigation();
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [organizationMembers, setOrganizationMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [friendModalVisible, setFriendModalVisible] = useState(false);
  const [aggregatedData, setAggregatedData] = useState([]); 
  const [friendUID, setFriendUID] = useState([])

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const organizationsRef = ref(db, 'Organizations');

    onValue(organizationsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const organizationsArray = Object.values(data);

        // Filter organizations where admin UID matches the current user's UID
        const userOrganizations = organizationsArray.filter(
          organization => organization.admin === user.uid
        );

        setOrganizations(userOrganizations);
        console.log(userOrganizations);
      }
    });

    const friendRef = ref(db, `Users/${user.uid}/Friends`);
    const fullList = [];
  
    onValue(friendRef, (snapshot) => {
      const friendData = snapshot.val();
  
      if (friendData) {
        // Use Object.values to get an array of friendData values
        const friendValues = Object.values(friendData);
  
        // Push each friend value to the fullList array
        for (const friendValue of friendValues) {
          fullList.push(friendValue);
        }
  
        // console.log(fullList);
        setFriendUID(fullList)
      }
    });
  }, [user]); // Include user in the dependency array to trigger the effect when user changes
  
  const openFriendModal = () => {
    setFriendModalVisible(true);
  };

  const openModal = async (organization) => {
    setSelectedOrganization(organization);
    const data = [];

    // Create an array of promises for each friend
    const friendPromises = organization.organizationMembers.map((friend) => {
      const friendRef = ref(db, `Users/${friend}`);

      return new Promise<void>((resolve) => {
        onValue(friendRef, (snapshot) => {
          const friendData = snapshot.val();
          data.push({ uid: friend, username: friendData.username });
          resolve();
        });
      });
    });

    // Wait for all promises to resolve
    await Promise.all(friendPromises);

    // Now 'data' contains all the friend data
    setAggregatedData(data);

    setOrganizationMembers(organization.organizationMembers);
    setSelectedMembers(organization.organizationMembers);
    setModalVisible(true);
  };


  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSaveMembers = async () => {
    try {
      // Get the previous organization members
      const prevMembers = selectedOrganization.organizationMembers;
  
      // Update the organization members in the local state
      setSelectedOrganization((prevOrg) => ({
        ...prevOrg,
        organizationMembers: selectedMembers,
      }));
  
      // Update the organization members in the database
      const organizationRef = ref(db, `Organizations/${selectedOrganization.organizationID}`);
      await update(organizationRef, { organizationMembers: selectedMembers });
      console.log("Update occurred");
  
      // Identify members to remove organization ID
      const membersToRemove = prevMembers.filter(
        (prevMember) => !selectedMembers.includes(prevMember)
      );
  
      // Identify members to add organization ID
      const membersToAdd = selectedMembers.filter(
        (selectedMember) => !prevMembers.includes(selectedMember)
      );
  
      // Create an array of promises to remove organization ID for each member
      const removePromises = membersToRemove.map(async (memberIdToRemove) => {
        const userRef = ref(db, `Users/${memberIdToRemove}/Organizations`);
        const snapshot = await get(userRef);
        const allOrgs = snapshot.val();
  
        // Check each key in the dictionary
        for (const orgKey in allOrgs) {
          if (allOrgs.hasOwnProperty(orgKey)) {
            // If the organization ID matches, remove the key
            if (allOrgs[orgKey] === selectedOrganization.organizationID) {
              const orgRef = ref(db, `Users/${memberIdToRemove}/Organizations/${orgKey}`);
              await remove(orgRef);
            }
          }
        }
      });
  
      // Wait for all remove promises to resolve
      await Promise.all(removePromises);
  
      // Create an array of promises to add organization ID for each member
      const addPromises = membersToAdd.map(async (memberIdToAdd) => {
        const memberRef = ref(db, `Users/${memberIdToAdd}/Organizations`);
        const newRef = push(memberRef);
        await set(newRef, selectedOrganization.organizationID);
      });
  
      // Wait for all add promises to resolve
      await Promise.all(addPromises);
  
      console.log("Done");
    } catch (error) {
      console.error("Error updating members:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("CreateOrganization")}
        style={styles.createButton}
      >
        <Text style={{ color: 'white' }}>Create an Organization</Text>
      </TouchableOpacity>
      <ScrollView style={{ ...styles.container }}>
        <View style={styles.organizationContainer}>
          {organizations.map((organization) => (
            <TouchableOpacity key={organization.id} onPress={() => openModal(organization)}>
              <OrganizationItem organization={organization} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Image
            source={{ uri: selectedOrganization?.organizationPhoto }}
            style={styles.modalImage}
          />
          <Text style={styles.modalOrganizationName}>{selectedOrganization?.organizationName}</Text>

          <TouchableOpacity onPress={openFriendModal} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Edit Members</Text>
            <FriendSelectorModal
              showModal={friendModalVisible}
              friendsList={friendUID}
              isFriendSelected={(uid) => selectedMembers.includes(uid)}
              onFriendSelect={(uid) => {
                setSelectedMembers((prevMembers) => {
                  if (prevMembers.includes(uid)) {
                    return prevMembers.filter((member) => member !== uid);
                  } else {
                    return [...prevMembers, uid];
                  }
                });
              }}
              onCloseModal={() => setFriendModalVisible(false)}
              friendUsernames={aggregatedData.reduce(
                (acc, friend) => ({ ...acc, [friend.uid]: friend.username }),
                {}
              )}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {closeModal(), handleSaveMembers()}} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A08",
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight:10,
  },
  createButton: {
    position: 'absolute',
    top:75,
    right: 20,
    backgroundColor: '#2C3E50',
    padding: 15,
    borderRadius: 5,
    zIndex: 1, // Ensure the button is on top
  },
  organizationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 60, // Adjust the top margin to create space for the button
  },
  modalContainer: {
    backgroundColor: '#A4BEF3',
    marginTop: 150,
    // margin: 20,
    marginHorizontal:20,
    padding: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalOrganizationName: {
    color: '#F5EDF0',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 18,
    marginBottom: 10,
    color: '#A076F9', // Neon green
  },
  memberItem: {
    backgroundColor: '#ff00ff', // Neon pink
    borderRadius: 15,
    padding: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  memberItemSelected: {
    backgroundColor: '#A076F9', // Light blue
  },
  memberItemText: {
    fontSize: 14,
    color: '#ffffff', // White text
  },
  modalButton: {
    backgroundColor: '#6528F7', // Neon green
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#ffffff', // White text
    fontWeight: 'bold',
  },
});