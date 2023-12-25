import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Organization, Friend } from "../../interface";

interface OrganizationItemProps {
  organization: Organization;
}

const OrganizationItem: React.FC<OrganizationItemProps> = ({ organization }) => {
  console.log("Organization Item Rendered:", organization);

  return (
    <View style={styles.organizationItem}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../Images/cody.png")}
          style={styles.organizationImage}
        />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.organizationName}>{organization.name}</Text>
        <View style={styles.membersContainer}>
          <Text style={styles.remainingMemberText}> {organization.friendList.length} Members</Text>
          {/* {renderMembers()} */}
        </View>
      </View>
    </View>
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
    flexBasis: '48%', // Set the flex basis to have two items per row
    flexGrow: 0, // Avoid items from growing beyond flexBasis
    borderWidth: 2,
    borderColor: '#31304D',
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
    // marginBottom: 5,
    color: '#B6BBC4',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  membersContainer: {
    marginTop: 10,
  },
  membersHeader: {
    marginBottom: 10,
    fontSize: 22,
    color: '#EF4040',
    textAlign: 'center',
  },
  memberName: {
    color: '#FFA732',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  remainingMembersContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  remainingMemberText: {
    color: "#c1d5f5",
    alignSelf: "center"
  },
});

export default OrganizationItem;
