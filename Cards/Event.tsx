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
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook


type Props = {
  img: any;
  location: string;
  name: string;
  ratings: number;
};

const EventCard = ({ img, location, name, ratings }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
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

      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <Image source={img} style={styles.modalImg} resizeMode="contain"/>
          <Text style={styles.modalTitle}>{name}</Text>
          <View style={styles.ratings}>
            <MaterialCommunityIcons
              name="star"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.ratingsText}>{ratings}</Text>
            <Entypo name="dot-single" size={20} color={"#ffffff"} />
            <Text style={styles.locationTextInModel}>{location}</Text>
          </View>
          <Text style={styles.themeText}>Theme: Thongs and Bongs</Text>
          <Text style={styles.themeText}>Bids: No</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={closeModal}>
              <MaterialCommunityIcons name="check" size={30} color="#4CAF50" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={closeModal}>
              <MaterialCommunityIcons name="close" size={30} color="#FF0000" />
            </TouchableOpacity>
          </View>

          <Button title="Close" onPress={closeModal} />
        </View>
      </Modal>
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
  },
  locationText: {
    color: "#fcece3",
  },
  modalContainer: {
    backgroundColor: "#16302b",
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
  },
  themeText: {
    fontSize: 16,
    color: "#85b79d",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
  },
});
