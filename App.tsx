import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LandingPage from './pages/LandingPage'; // Import your LandingPage component

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MainStack = () => (
  <Stack.Navigator initialRouteName="LandingPage">
    <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }}/>
  </Stack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="MainStack">
        <Drawer.Screen name="MainStack" component={MainStack} />
        {/* Add additional screens as needed */}
      </Drawer.Navigator>
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
