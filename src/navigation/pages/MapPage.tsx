import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { Event } from "../../../interface";
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from react-native-vector-icons

export default function MapPage() {
   const navigation = useNavigation(); // Access navigation object

   const [mapRegion, setMapRegion] = useState({
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
   });

   const userLocation = async () => {
      console.log('mepr')
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
         console.log("Permission to access was denied");
      }
      let location = await Location.getCurrentPositionAsync({});
      setMapRegion({
         latitude: location.coords.latitude,
         longitude: location.coords.longitude,
         latitudeDelta: 0.0922,
         longitudeDelta: 0.0421,
      });
      console.log(location.coords.latitude, location.coords.longitude);
   };

   useEffect(() => {
      userLocation();
   }, []);

   return (
      <View style={styles.container}>
         {/* Back Button */}
         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="ios-arrow-back" size={24} color="#000" />
         </TouchableOpacity>
         <MapView
            style={styles.map}
            region={mapRegion}
         >
            <Marker coordinate={mapRegion} title="Marker" />
            {/* You should query the database here for all the open events and the ones you are invited to,
            to pop up as markers */}
         </MapView>
         {/* No text for the Get Location button */}
         <TouchableOpacity style={styles.getLocationButton} onPress={userLocation}>
            <Ionicons name="ios-pin" size={24} color="#000" />
         </TouchableOpacity>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
      justifyContent: "center",
      alignContent: "center"
   },
   map: {
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height
   },
   backButton: {
      position: 'absolute',
      top: 30,
      left: 20,
      // backgroundColor: 'rgba(255, 255, 255, 0.5)', // Customize as needed
      padding: 10,
      borderRadius: 5,
      zIndex: 999,
   },
   getLocationButton: {
      position: 'absolute',
      top: 30,
      right: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.5)', // Customize as needed
      padding: 10,
      borderRadius: 5,
      zIndex: 998,
   },
});
