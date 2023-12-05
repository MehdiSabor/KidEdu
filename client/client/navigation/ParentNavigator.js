// ParentNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ParentHomeScreen from '../screens/Parent/ParentHomeScreen';
import RoomTabNavigator from './pRoomTabNavigator';
import ParentSettingsScreen from '../screens/Parent/ParentSettingsScreen'; // Replace with your actual screen
import { Button } from 'react-native';

const Stack = createNativeStackNavigator();

const ParentNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ParentHome" component={ParentHomeScreen} />
      <Stack.Screen
        name="RoomTab"
        component={RoomTabNavigator}
      />
      {/* Add the rest of your screens here */}
      
    </Stack.Navigator>
  );
};

export default ParentNavigator;
