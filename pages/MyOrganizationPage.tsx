// MyOrganizationPage.js
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import OrganizationItem from "../components/OrganizationItem";
import { Organization } from "../interface";

export default function MyOrganizationPage({route}) {
  const navigation = useNavigation();
  const { newOrganization } = route.params || { newOrganization: null };

  const organizations: Organization[] = [
    {
      id: '1',
      name: 'Codology',
      profilePicture: "merp",
      description: "UC Berkeley Tech Group",
      friendList: [
        { id: '101', name: 'John Doe' },
        { id: '102', name: 'Jane Smith' },
      ],
    },
    {
      id: '2',
      name: 'Designers United',
      profilePicture: "merp",
      description: "NYC Fun Club",
      friendList: [
        { id: '201', name: 'Alice Johnson' },
        { id: '202', name: 'Bob Anderson' },
        { id: '203', name: 'Andrew' },
        { id: '204', name: 'Daniel' },
        { id: '205', name: 'Joe' },
        { id: '206', name: 'Chirs' },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("CreateOrganization")}
        style={styles.createButton}
      >
        <Text style={{ color: 'white' }}>Create an Organization</Text>
      </TouchableOpacity>
      <View style={styles.organizationContainer}>
        {organizations.map((organization) => (
          <OrganizationItem key={organization.id} organization={organization} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A08",
    padding: 10,
  },
  createButton: {
    position: 'absolute',
    top: 20,
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

