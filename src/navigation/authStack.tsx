import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { Button, Image, StyleSheet } from 'react-native';
import { CommonActions, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LandingPage from "./pages/LandingPage";
import CreatePage from "./pages/CreatePage";
import FriendPage from "./pages/FriendPage";
import PhotoPage from "./pages/MapPage";
import InvitePage from './pages/InvitePage';
import ProfilePage from "./pages/ProfilePage";
import MyOrganizationsPage from "./pages/MyOrganizationPage"; //test
import MyEventsPage from "./pages/MyEventsPage";
import CreateOrganizationPage from "./pages/CreateOrganizationPage";
import { View, Text} from 'react-native';
import SignOutScreen from '../navigation/pages/Welcome';
import SignInScreen from './pages/SignInPage';
import WelcomeScreen from '../navigation/pages/Welcome';
import CustomHeader from '../components/CustomHeader';
import AddFriendPage from './pages/AddFriendPage';
import EditProfile from './pages/EditProfilePage';
import {getAuth, signOut, updateCurrentUser} from "firebase/auth";
import MapPage from './pages/MapPage';


import { Entypo, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { firebase } from '@react-native-firebase/auth';
import SignUpScreen from './pages/SignUpPage';
import navigation from '.';
import { child, getDatabase, ref , get} from 'firebase/database';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const handleSignOut = async (navigation) => {
  const auth = getAuth();

  try {
    await signOut(auth);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      })
    );
  } catch (error) {
    console.error('Error signing out:', error.message);
  }
};

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#000',
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#fff',
      },
      tabBarIconStyle: {
        marginTop: 5,
      },
      tabBarActiveTintColor: '#0F0',
      tabBarInactiveTintColor: '#666',
    }}
  >
    <Tab.Screen
      name="Events"
      component={LandingPage}
      options={{
        tabBarLabel: 'Events',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="beer-outline" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Friends"
      component={FriendPage}
      options={{
        tabBarLabel: 'Friends',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account-multiple-plus-outline" color={color} size={size} />
        ),
        headerShown: false
      }}
    />
    <Tab.Screen
      name="Create"
      component={CreatePage}
      options={{
        tabBarLabel: 'Create',
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="plus-circle" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Invites"
      component={InvitePage}
      options={{
        tabBarLabel: 'Invites',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="email-outline" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={EditProfile}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default function AuthStack() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Sign In" component={SignInScreen} />
          <Stack.Screen name="Sign Up" component={SignUpScreen} />
          <Stack.Screen name="LandingPage" component={TabNavigator} />
          <Stack.Screen name="MyOrganizationPage" component={MyOrganizationsPage} options={{ headerShown: false }} />
          <Stack.Screen name="CreateOrganization" component={CreateOrganizationPage} />
          <Stack.Screen name="AddFriendPage" component={AddFriendPage} />
          <Stack.Screen name="My Events" component={MyEventsPage} />
          <Stack.Screen name="My Organizations" component={MyOrganizationsPage} />
          <Stack.Screen name="Map Page" component={MapPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
    drawerContainer: {
      flex: 1,
      backgroundColor: '#0A0A08',
      paddingTop: 40,
      paddingHorizontal: 20,
    },
    usernameContainer: {
      alignItems: 'center',
      marginBottom: 20,
      // fontFamily: "System-BoldItalic"
    },
    usernameText: {
      fontSize: 35,
      color: '#fbf8fd',
    },
    profilePic: {
      width: 150,
      height: 150,
      borderRadius: 40,
      alignSelf: 'center',
      marginBottom: 20,
      shadowColor: "#ab20fd",
      // elevation: 3
    },
    drawerItemLabel: {
      fontSize: 18,
      color: '#7d12ff',
    },
    tabContainer: {
      color: "#D7BBF5"
    },
    signOutButton: {
      marginTop: 20, // Adjust the margin as needed
      backgroundColor: '#2A2D43', // Set your desired background color
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
  });
  