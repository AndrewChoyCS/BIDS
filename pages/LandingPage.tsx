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

        </View>

    )
}

const styles = StyleSheet.create({
    eventsContainer: {
        marginTop: 10,
    },
    eventHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    eventTitle: {
        fontWeight: 'bold',
        fontSize: 20,
    }

});