import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserTypeScreen from '../screens/Login'; // You'll create this screen next
import ParentTabNavigator from './ParentTabNavigator'; // To be created
import ChildTabNavigator from './ChildTabNavigator'; // To be created
import ChildRegistrationScreen from '../screens/ChildRegistrationScreen';
import ChildHomeScreen from '../screens/ChildHomeScreen';
import ParentHomeScreen from '../screens/ParentHomeScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="UserType" component={UserTypeScreen} />
    <Stack.Screen name="Parent" component={ParentTabNavigator} />
    <Stack.Screen name="Child" component={ChildTabNavigator} />
    <Stack.Screen name="ChildRegistration" component={ChildRegistrationScreen} />
    <Stack.Screen name="ChildHome" component={ChildHomeScreen} />
    <Stack.Screen name="ParentHome" component={ParentHomeScreen} />
  </Stack.Navigator>
);

export default AppNavigator;
