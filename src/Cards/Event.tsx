import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../utils";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import EventModel from "../components/EventModal";


type Props = {
  img: any;
  location: string;
  name: string;
  ratings: number;
  theme: string;
  date: string
  bid: boolean
};

const EventCard = ({ img, location, name, ratings, theme, date, bid }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const modalData = {
    img: img,
    name: name,
    ratings: ratings,
    location: location,
    date: date,
    theme: theme,
    bid: bid,
  };



  return (
    <TouchableWithoutFeedback onPress={openModal}>
      <View style={styles.container}>
        <Image source={img} style={styles.img} resizeMode="cover" />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{name}</Text>
          <View style={styles.ratings}>
            <MaterialCommunityIcons
              name="star"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.ratingsText}>{ratings}</Text>
            <Entypo name="dot-single" size={20} color={"#ffffff"} />
            <Text style={styles.locationText}>{location}</Text>
          </View>
        </View>
      </View>
      <View>
        <EventModel modalVisible={modalVisible} closeModal={closeModal} {...modalData} />
    </View>
      {/*This is when you click on the event  */}

    </TouchableWithoutFeedback>
  );
};

export default EventCard;

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
