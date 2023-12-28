// MyOrganizationPage.js
import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import OrganizationItem from "../../components/OrganizationItem";
import { Organization } from "../../../interface";
import { SafeAreaView } from "react-native-safe-area-context";
import { ref, onValue, getDatabase } from "firebase/database";
import { db } from "../../config/firebase";
import { getAuth } from "firebase/auth";


export default function MyOrganizationPage({route}) {
  const navigation = useNavigation();
  const [organizations, setOrganizations] = useState([]);

  const { newOrganization } = route.params || { newOrganization: null };
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
  }, [user]);  // Include user in the dependency array to trigger the effect when user changes

  return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate("CreateOrganization")}
          style={styles.createButton}
        >
          <Text style={{ color: 'white' }}>Create an Organization</Text>
        </TouchableOpacity>
        <View style={styles.organizationContainer}>
          {organizations.map((organization) => (
            // console.log(organization),
            <OrganizationItem 
              key={organization.id} 
              organization={organization} />
          ))}
        </View>
      </SafeAreaView>
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
});

