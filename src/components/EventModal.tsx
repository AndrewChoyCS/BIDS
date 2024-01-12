import React, { useEffect, useState } from "react";
import {Image, StyleSheet, Text, View, TouchableOpacity, Modal, Button} from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../utils";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { equalTo, get, orderByValue, push, query, ref, remove, set } from "firebase/database";
import { db } from "../config/firebase";
import { getAuth } from "firebase/auth";

  
const EventModel = ( {modalVisible, closeModal, img, name, ratings, location, startDate, startTime, theme, fee, eventID }) => {
  const [rsvpStatus, setRSVPStatus] = useState<{ [eventId: number]: number }>({});
  const [formattedStartDate, setFormattedStartDate] = useState("");
  const [formattedStartTime, setFormattedStartTime] = useState("");

  useEffect(() => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setFormattedStartDate(
      new Date(startDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        timeZone: userTimeZone,
      })
    );
    setFormattedStartTime(
      new Date(startTime).toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "numeric",
        timeZone: userTimeZone,
      })
    );
  }, [startDate, startTime]);

  const auth = getAuth()
  const user = auth.currentUser
  
  const handleResponse = async (eventId: string, response: 'yes' | 'no') => {
    const eventRef = ref(db, `Events/${eventId}/RSVPStatus/`);
    
    const oppositeResponse = response === 'yes' ? 'no' : 'yes';
    const oppositeRef = ref(db, `Events/${eventId}/RSVPStatus/${oppositeResponse}`);
  
    const userUid = user.uid;
  
    // Check if user is already in the corresponding category
    const currentResponseRef = ref(db, `Events/${eventId}/RSVPStatus/${response}`);
    const currentResponseQuery = query(currentResponseRef, orderByValue(), equalTo(userUid));
    const currentResponseSnapshot = await get(currentResponseQuery);
  
    if (currentResponseSnapshot.exists()) {
      console.log(`User already in ${response} category for event ${eventId}`);
      return; // User is already in the corresponding category, no need to make changes
    }
  
    // Remove user from the opposite RSVP status if exists
    const oppositeQuery = query(oppositeRef, orderByValue(), equalTo(userUid));
    const oppositeSnapshot = await get(oppositeQuery);
    oppositeSnapshot.forEach((childSnapshot) => {
      const childRef = ref(db, `Events/${eventId}/RSVPStatus/${oppositeResponse}/${childSnapshot.key}`);
      remove(childRef);
    });
  
    // Add user to the new RSVP status
    const newRef = ref(db, `Events/${eventId}/RSVPStatus/${response}`);
    const newOrganizationRef = push(newRef);
    set(newOrganizationRef, userUid);
  
    console.log(`User responded ${response} for event ${eventId}`);
    setRSVPStatus((prevRSVPStatus) => ({
      ...prevRSVPStatus,
      [eventId]: response === 'yes' ? 1 : 2,
    }));
  };

  const yesButtonClicked = () => {
    handleResponse(eventID, 'yes')
  }
  const noButtonClicked = () => {
    handleResponse(eventID, 'no')
  }


  return (
    <Modal animationType="slide" transparent={false} visible={modalVisible}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <MaterialCommunityIcons name="close" size={30} color="#FF0000" />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>{name}</Text>
        <Image source={{uri: img}} style={styles.modalImg} resizeMode="contain" />
        <View style={styles.ratings}>
          <MaterialCommunityIcons name="star" size={20} color={COLORS.primary} />
          <Text style={styles.ratingsText}>{ratings}</Text>
          <Entypo name="dot-single" size={20} color={"#ffffff"} />
          <Text style={styles.locationTextInModel}>{location}</Text>
        </View>
        <Text style={styles.themeText}>Date and Time: {formattedStartDate}, {formattedStartTime}</Text>
        <Text style={styles.themeText}>Theme: {theme}</Text>
        <Text style={styles.themeText}> Entry Fee: {fee}</Text>
        <Text style={styles.themeText}></Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, { marginRight: 10 }]} onPress={() => {closeModal(), yesButtonClicked()}}>
            <MaterialCommunityIcons name="check" size={30} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { marginLeft: 10 }]} onPress={() => {closeModal(), noButtonClicked()}}>
            <MaterialCommunityIcons name="close" size={30} color="#FF0000" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
    container: {
      marginVertical: 15,
      width: "100%",
      borderRadius: 10,
      overflow: "hidden",
    },
    img: {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      height: 200,
      width: "100%",
    },
    cardContent: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 15,
      
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    cardTitle: {
      color: COLORS.white,
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 5,
    },
    ratings: {
      flexDirection: "row",
      alignItems: "center",
      
    },
    ratingsText: {
      color: COLORS.primary,
      marginLeft: 5,
      fontSize: 18
    },
    locationText: {
      color: "#fcece3",
    },
    modalContainer: {
      backgroundColor: "#0A0A08", // Adjust the background color
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalImg: {
      height: 400,
      width: "100%",
      marginBottom: 15,
      // borderCurve: 10
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#c0e5c8",
      marginBottom: 10,
      marginTop: -50,
    },
    locationTextInModel: {
      color: "#85b79d",
      fontSize: 18
    },
    themeText: {
      fontSize: 16,
      color: "#85b79d",
      marginBottom: 5,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 20,
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      width: 150,
      height: 75,
      borderRadius: 50,
      borderWidth: 3,
      borderColor: "#fff",
    },  
    closeButton: {
      position: "absolute",
      top: 50,
      left: 20,
      zIndex: 1,
    },
});

export default EventModel