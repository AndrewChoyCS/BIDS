import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LandingPage from "./pages/LandingPage";
import CreatePage from "./pages/CreatePage";
import FriendPage from "./pages/FriendPage";
import PhotoPage from "./pages/PhotoPage";
import InvitePage from './pages/InvitePage';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const MainStack = () => (
  <Stack.Navigator initialRouteName="LandingPage" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LandingPage" component={LandingPage} />
    {/* Add additional screens for MainStack as needed */}
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Events" component={LandingPage} />
    <Tab.Screen name="Friends" component={FriendPage}/>
    <Tab.Screen name="Create" component={CreatePage}/>
    <Tab.Screen name="Invites" component={InvitePage}/>
    <Tab.Screen name="Photos" component={PhotoPage}/>

    {/* Add additional screens for the bottom tab navigation as needed */}
  </Tab.Navigator>
);

const DrawerNavigator = () => (
  <Drawer.Navigator initialRouteName="TabNavigator">
    <Drawer.Screen name="TabNavigator" component={TabNavigator} />
    {/* Add additional screens for the drawer navigation as needed */}
  </Drawer.Navigator>
);

const events = [
  {
    id: 1,
    eventName: 'Party Time',
    organizerName: 'The Goat Noemi',
    organizerProfilePic: 'https://example.com/john-doe-profile.jpg',
  },
];

export default function App() {
  return (    
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
