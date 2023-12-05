// UserTypeNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserTypeScreen from '../screens/Login'; // Replace with your actual screen
import ChildRegistrationScreen from '../screens/Child/ChildRegistrationScreen'; // Replace with your actual screen

const Stack = createNativeStackNavigator();

const UserTypeNavigator = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name="UserType" component={UserTypeScreen} />
      <Stack.Screen name="ChildRegistration" component={ChildRegistrationScreen} />
    </Stack.Navigator>
  );
};

export default UserTypeNavigator;
