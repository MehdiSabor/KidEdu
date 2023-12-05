import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TaskScreen from '../screens/Parent/pTaskScreen'; // Replace with actual screens
import RewardScreen from '../screens/Parent/pRewardScreen'; // Replace with actual screens
import RoomSettingsScreen from '../screens/Parent/RoomSettings';
import ChatScreen from '../screens/Parent/ChatScreen';
const Tab = createBottomTabNavigator();

const RoomTabNavigator = ({ route }) => {
  // Extract roomId from route parameters
  const { roomId } = route.params;

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="TaskScreen"
        component={TaskScreen}
        initialParams={{ roomId }}
      />
      <Tab.Screen
        name="RewardScreen"
        component={RewardScreen}
        initialParams={{ roomId }}
      />
      <Tab.Screen
        name="ChatScreen"
        component={ChatScreen}
        initialParams={{ roomId }}
      />
      <Tab.Screen
        name="RoomSettings"
        component={RoomSettingsScreen}
        initialParams={{ roomId }}
      />
      {/* Add more tabs as needed */}
    </Tab.Navigator>
  );
};

export default RoomTabNavigator;
