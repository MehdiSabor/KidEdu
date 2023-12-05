// ChildNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChildHomeScreen from '../screens/Child/ChildHomeScreen';
import RoomTabNavigator from './cRoomTabNavigator';
import ChildSettingsScreen from '../screens/Child/ChildSettingsScreen'; // Replace with your actual screen
import { Button } from 'react-native';

const Stack = createNativeStackNavigator();

const ChildNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChildHome" component={ChildHomeScreen} />
      <Stack.Screen
        name="ChildRoomTab"
        component={RoomTabNavigator}
        options={{
          headerShown: false, // This hides the entire header
    gestureEnabled: false, // This prevents swipe gestures on iOS
        }}
      />
      {/* Add the rest of your screens here */}
    </Stack.Navigator>

  );
};

export default ChildNavigator;
