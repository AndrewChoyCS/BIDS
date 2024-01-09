import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Touchable , Dimensions, } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Modal, Portal, Button } from 'react-native-paper';


interface OrganizationItemProps {
  organization: {
    organizationMembers?: any[]; // Update the type as per your data structure
    image: string;
    organizationName: string;
    // Add other properties as needed
  };
}

const OrganizationItem: React.FC<OrganizationItemProps> = ({ organization }) => {
  const navigation = useNavigation();

  // Get the screen width
  const screenWidth = Dimensions.get('window').width;

  // Calculate the width of each item to have two items per row
  const itemWidth = (screenWidth - 30) / 2; // 30 is the total horizontal padding

  // Check if organizationMembers is defined
  const memberCount = organization.organizationMembers ? organization.organizationMembers.length : 0;

  const [modalVisible, setModalVisible] = useState(false);


  return (
    <>
      <View style={[styles.organizationItem]}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: organization.organizationPhoto}}
            style={styles.organizationImage}
          />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.organizationName}>{organization.organizationName}</Text>
          <View style={styles.membersContainer}>
            <Text style={styles.remainingMemberText}>{organization.organizationMembers?.length || 0} Members</Text>
          </View>
        </View>
      </View>
    </>
  );
};


const styles = StyleSheet.create({
  organizationItem: {
    backgroundColor: "#0A0A08",
    padding: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    flexGrow: 0, // Avoid items from growing beyond flexBasis
    borderWidth: 2,
    borderColor: '#31304D',
    width: '100%',

  },
  imageContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    width: '100%', // Add this line to ensure the image takes the full width
  },
  organizationImage: {
    width: '100%',
    height: 150,
  },
  detailsContainer: {
    padding: 15,
    flex: 1,
  },
  organizationName: {
    color: '#B6BBC4',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  membersContainer: {
    marginTop: 10,
  },
  remainingMembersContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  remainingMemberText: {
    color: "#c1d5f5",
    alignSelf: "center"
  }, 
});

export default OrganizationItem;
