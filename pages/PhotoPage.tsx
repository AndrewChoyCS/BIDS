import React from "react";
import { Text, View, Image } from "react-native";
import MapView from 'react-native-maps';

export default function PhotoPage() {
   return (
      <View>
         <MapView
            initialRegion={{
               latitude: 37.78825,
               longitude: -122.4324,
               latitudeDelta: 0.0922,
               longitudeDelta: 0.0421,
            }}
         />
         <Image source={{ uri: "https://maps.googleapis.com/maps/api/staticmap?center=Berkeley,CA&zoom=14&size=400x400&key=AIzaSyBIt3E2OkFlypJTWt-QD2n2ZVpGMidaLHI" }} style={{ width: 400, height: 400 }} />
      </View>
   );
}