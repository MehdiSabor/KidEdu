import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiRequestChild} from '../../services/api'; // Adjust path as necessary

const ChildHomeScreen = ({ navigation }) => {
  const [childId, setChildId] = useState('');
  const [roomCode, setRoomCode] = useState('');

  useEffect(() => {
    const checkRoomAndNavigate = async () => {
      try {
        const storedChildId = await AsyncStorage.getItem('childId');
        const storedRoomCode = await AsyncStorage.getItem('roomCode');
        console.log(storedChildId);
        console.log(storedRoomCode);
        if (storedChildId && storedRoomCode) {
          // Navigate to RoomTab if both childId and roomCode are stored
          navigation.navigate('ChildRoomTab', { roomId: storedRoomCode });
        } else if (storedChildId) {
          // Set childId if only childId is stored
          console.log(storedChildId);
          setChildId(storedChildId);


        }
      } catch (error) {
        console.error(error);
      }
    };

    checkRoomAndNavigate();
  }, [navigation]);

  const handleJoinRoom = async () => {
    if (!roomCode) {
      Alert.alert("Error", "Please enter a room code");
      return;
    }
console.log
    try {
      const response = await apiRequestChild(`/room/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, code: roomCode }),
      });
    
      if (response.room.id) {
        await AsyncStorage.setItem('roomCode', response.room.id.toString());
        navigation.navigate('ChildRoomTab', { roomId: response.room.id });
       /*FOR TESTING INSTEAD OF NAVIGATE: navigation.reset({
          index: 0,
          routes: [{ name: 'ChildRoomTab' }],
        });
        */
      
      } else {
        Alert.alert("Error", "Failed to join room 1");
      }
    } catch (error) {
      console.error('Error joining room:', error);
      Alert.alert("Error", "Failed to join room");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Child Home</Text>
      <Text>Child ID: {childId}</Text>
      <TextInput
        placeholder="Enter Room Code"
        value={roomCode}
        onChangeText={setRoomCode}
        style={styles.input}
      />
      <Button title="Join Room" onPress={handleJoinRoom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    width: '100%',
    marginBottom: 10,
  },
});

export default ChildHomeScreen;
