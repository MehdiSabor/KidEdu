import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChildHomeScreen from '../screens/ChildHomeScreen'; // To be created
import ChildSettingsScreen from '../screens/ChildSettingsScreen'; // To be created

const Tab = createBottomTabNavigator();

const ChildTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={ChildHomeScreen} />
    <Tab.Screen name="Settings" component={ChildSettingsScreen} />
  </Tab.Navigator>
);

export default ChildTabNavigator;
