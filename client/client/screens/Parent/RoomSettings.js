import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Button,RefreshControl, TextInput, Alert,Text,ActivityIndicator, ScrollView } from 'react-native';
import {apiRequest} from '../../services/api'; // Adjust path as necessary
import { Icon } from 'react-native-elements';

const RoomSettingsScreen = ({ route, navigation }) => {
  const { roomId } = route.params;
  const [childName, setChildName] = useState('');
  const [points, setPoints] = useState();
  const [pointsToAdd, setPointsToAdd] = useState('');
  const [pointsToDeduct, setPointsToDeduct] = useState('');
  const [roomDetails, setRoomDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pointsToAddOrDeduct, setPointsToAddOrDeduct] = useState(0);

  const renderButtonWithIcon = (title, iconName, color, onPress) => (
    <View style={styles.buttonContainer}>
      <Icon name={iconName} type="font-awesome" color={color} size={24} onPress={onPress} />
      <Text style={styles.buttonText}>{title}</Text>
    </View>
  );
  const fetchRoomDetails = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest(`/room/get/${roomId}`);
        setRoomDetails(response);
        console.log(roomDetails);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch room details');
      } finally {
        setIsLoading(false);
      }
    };
  // Fetch Room Details
  useEffect(() => {
  

    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);


  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    // Place your data fetching logic here
    try {
      // Fetch data
      fetchRoomDetails();
    } catch (error) {
      console.error(error);
    }

    setRefreshing(false);
  }, []);


  

  if (isLoading) {
    return <ActivityIndicator />; // Or any other loading indicator
  }


  const deleteRoom = async () => {
    try {
      await apiRequest(`/room/delete/${roomId}`, { method: 'DELETE' });
      navigation.reset({
        index: 0,
        routes: [{ name: 'ParentHome' }], // Replace 'MainPage' with the name of your main page
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to delete room');
    }
  };

  const kickChild = async () => {
    try {
      await apiRequest(`/room/kick/${roomId}`, { method: 'DELETE' });
      Alert.alert('Success', 'Child kicked out of the room');
    } catch (error) {
      Alert.alert('Error', 'Failed to kick child');
    }
  };

  const updateChildName = async () => {
    try {
      await apiRequest(`/room/updateChildName/${roomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: childName }),
      });
      Alert.alert('Success', 'Child name updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update child name');
    }
  };

  const updatePoints = async (pointsChange) => {
    try {
      const endpoint = pointsChange > 0 ? '/room/addPoints' : '/room/deductPoints';
      await apiRequest(`${endpoint}/${roomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: Math.abs(pointsChange) }),
      });
      fetchRoomDetails();
      Alert.alert('Success', 'Points updated');
      setPointsToAddOrDeduct(0);
    } catch (error) {
      Alert.alert('Error', 'Failed to update points');
    }
  };


  const adjustPoints = (adjustment) => {
    setPoints((currentPoints) => Math.max(0, currentPoints + adjustment));
  };

  return (
    <ScrollView
      style={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <Text style={styles.header}>Room Settings</Text>
        <Text style={styles.roomCode}>Room Code: {roomDetails.code}</Text>
        <Text style={styles.pointsLabel}>Points: {roomDetails.total}</Text>

        <View style={styles.pointAdjustmentContainer}>
          <Button title="-" onPress={() => setPointsToAddOrDeduct(pointsToAddOrDeduct - 1)} />
          <TextInput
            style={styles.pointsInput}
            value={String(pointsToAddOrDeduct)}
            onChangeText={(text) => setPointsToAddOrDeduct(parseInt(text) || 0)}
            keyboardType="numeric"
          />
          <Button title="+" onPress={() => setPointsToAddOrDeduct(pointsToAddOrDeduct + 1)} />
        </View>
        <Button title="Update Points" onPress={() => updatePoints(pointsToAddOrDeduct)} />
      </View>
      <View style={styles.iconRow}>
          {renderButtonWithIcon("Delete Room", "trash", "red", deleteRoom)}
          {renderButtonWithIcon("Kick Child", "user-times", "orange", kickChild)}
          {renderButtonWithIcon("Rename Child", "pencil", "blue", updateChildName)}
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  roomCode: {
    fontSize: 18,
    marginBottom: 15,
  },
  pointsLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  pointAdjustmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  pointsInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    width: 100,
    textAlign: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    marginTop: 5,
  },
  // ... other styles
});

export default RoomSettingsScreen;