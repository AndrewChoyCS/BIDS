import 'react-native-gesture-handler';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LandingPage from "./pages/LandingPage";
import CreatePage from "./pages/CreatePage";
import FriendPage from "./pages/FriendPage";
import PhotoPage from "./pages/PhotoPage";
import InvitePage from './pages/InvitePage';
import ProfilePage from "./pages/ProfilePage";
import MyOrganizationsPage from "./pages/MyOrganizationsPage"; //test
import MyEventsPage from "./pages/MyEventsPage";
import { View, Text} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { Entypo, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";



const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const CustomDrawerContent = (props) => (
  <DrawerContentScrollView {...props} style={styles.drawerContainer}>
    <View style={styles.usernameContainer}>
      <Text style={styles.usernameText}>Andrew Choy</Text>
    </View>
    <Image
      source={require("../BIDS/Images/profilePic.jpg")}
      style={styles.profilePic}
    />
    <DrawerItemList {...props} />
  </DrawerContentScrollView>
);


const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#000', // Set the background color to black
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#fff', // Set the label color to white
      },
      tabBarIconStyle: {
        marginTop: 5,
      },
      tabBarActiveTintColor: '#0F0', // Set the active tab color to neon green
      tabBarInactiveTintColor: '#666', // Set the inactive tab color to gray
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
      name="Photos"
      component={PhotoPage}
      options={{
        tabBarLabel: 'Map',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="google-maps" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);


const DrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="TabNavigator"
    // screenOptions={{headerShown: false}}
    drawerContent={(props) => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen
      name="TabNavigator"
      component={TabNavigator}
      options={{
        drawerLabel: ({ focused }) => (
          <Text style={[styles.drawerItemLabel, focused ? { fontWeight: 'bold' } : null]}>
            Home
          </Text>
        ),
      }}
    />
    <Drawer.Screen
      name="My Events"
      component={MyEventsPage}
      options={{
        drawerLabel: ({ focused }) => (
          <Text style={[styles.drawerItemLabel, focused ? { fontWeight: 'bold' } : null]}>
            My Events
          </Text>
        ),
      }}
    />
    <Drawer.Screen
      name="My Organizations"
      component={MyOrganizationsPage}
      options={{
        drawerLabel: ({ focused }) => (
          <Text style={[styles.drawerItemLabel, focused ? { fontWeight: 'bold' } : null]}>
            My Organizations
          </Text>
        ),
      }}
    />
    <Drawer.Screen
      name="Edit Profile"
      component={ProfilePage}
      options={{
        drawerLabel: ({ focused }) => (
          <Text style={[styles.drawerItemLabel, focused ? { fontWeight: 'bold' } : null]}>
            Edit Profile
          </Text>
        ),
      }}
    />
    <Drawer.Screen
      name="Settings"
      component={ProfilePage}
      options={{
        drawerLabel: ({ focused }) => (
          <Text style={[styles.drawerItemLabel, focused ? { fontWeight: 'bold' } : null]}>
            Settings
          </Text>
        ),
      }}
    />
    
  </Drawer.Navigator>
);

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
  }
});



export default function App() {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}