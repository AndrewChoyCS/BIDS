// MyOrganizationPage.js
import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import OrganizationItem from "../components/OrganizationItem";
import { Organization } from "../interface";

export default function MyOrganizationPage() {
  const organizations: Organization[] = [
    {
      id: '1',
      name: 'TechHub',
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
    <View style={{ flex: 1, backgroundColor: "#0A0A08", padding: 10 }}>
      <TouchableOpacity
        onPress={() => useNavigation('CreateOrganizationPage')}
        style={{ top: 20, right: 20, backgroundColor: '#2C3E50', padding: 30, borderRadius: 5 }}
      >
        <Text style={{ color: 'white' }}>Create an Organization</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {organizations.map((organization) => (
          <OrganizationItem key={organization.id} organization={organization} />
        ))}
      </View>
    </View>
  );
};