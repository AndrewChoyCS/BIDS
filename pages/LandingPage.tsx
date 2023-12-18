import { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
} from "react-native";
import { COLORS } from "../utils";
import { EventCard } from "../Cards";
// import { StyleSheet, Text, View } from 'react-native';

import React from "react";

export default function LandingPage () {
    return (
        <ScrollView style={styles.pageContainer}>
            <View style={styles.eventsContainer}>
                {/*Header*/}
                <View style={styles.eventHeader}>
                    <Text style={styles.eventTitle}>Events</Text>
                </View>
                <EventCard
                    name="TKE"
                    location="32421 Berk"
                    img={require("../Images/tke.jpeg")}
                    ratings={1.8}
                />
                <EventCard
                    name="Jupiter"
                    location="DownTown Berkeley" 
                    img={require("../Images/dtberk.jpeg")}
                    ratings={4.7}
                />
                <EventCard
                    name="La Casa Parker"
                    location="2221 Parker St."
                    img={require("../Images/parker.jpeg")}
                    ratings={100.0}
                />
                <EventCard
                    name="La Casa Parker"
                    location="2221 Parker St."
                    img={require("../Images/parker.jpeg")}
                    ratings={100.0}
                />
                {/* <EventCard
                    name="La Casa Parker"
                    location="2221 Parker St."
                    img={require("../Images/parker.jpeg")}
                    ratings={100.0}
                /> */}
            </View>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    pageContainer: {
      backgroundColor: "#000000", // Replace with your desired background color
    },
    eventsContainer: {
      marginTop: 30,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    eventHeader: {
      justifyContent: "space-between",
    },
    eventTitle: {
      fontWeight: 'bold',
      fontSize: 50,
      color: '#6d0670',
      textAlign: 'center',
    },
  });