import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ParentHomeScreen from '../screens/Parent/ParentHomeScreen'; // To be created
import ParentSettingsScreen from '../screens/Parent/ParentSettingsScreen'; // To be created

const Tab = createBottomTabNavigator();

const ParentTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="ParentHome" component={ParentHomePage} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
    
  </Tab.Navigator>

  
);

export default ParentTabNavigator;
