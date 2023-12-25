import 'react-native-gesture-handler';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LandingPage from "./src/navigation/pages/LandingPage";
import CreatePage from "./src/navigation/pages/CreatePage";
import FriendPage from "./src/navigation/pages/FriendPage";
import PhotoPage from "./src/navigation/pages/MapPage";
import InvitePage from './src/navigation/pages/InvitePage';
import ProfilePage from "./src/navigation/pages/ProfilePage";
import MyOrganizationsPage from "./src/navigation/pages/MyOrganizationPage"; //test
import MyEventsPage from "./src/navigation/pages/MyEventsPage";
import CreateOrganizationPage from "./src/navigation/pages/CreateOrganizationPage";
import { View, Text} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { Entypo, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import './src/config/firebase'
import RootNavigation from './src/navigation';
import { ThemeProvider } from 'react-native-elements';




export default function App() {
  return (
    <ThemeProvider>
      <RootNavigation />
    </ThemeProvider>

  );
}

