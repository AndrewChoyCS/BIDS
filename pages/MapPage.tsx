import React, { useState, useEffect } from "react";
import MapView, { Marker } from 'react-native-maps';
import { Text, View, Image, StyleSheet, Dimensions, Button } from "react-native";
import * as Location from 'expo-location';

export default function MapPage() {
   const [mapRegion, setMapRegion] = useState({
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
   });

   const userLocation = async () => {
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
         <MapView
            style={styles.map}
            region={mapRegion}
         >
            <Marker coordinate={mapRegion} title="Marker" />
         </MapView>
         <Button title='Get Location' onPress={userLocation} />
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
   }
});
