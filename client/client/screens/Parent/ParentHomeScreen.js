import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet,RefreshControl, FlatList, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiRequest} from '../../services/api';
import { Card } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { authEventEmitter } from '../../services/AuthEventEmitter';


const ParentHomePage = ({ navigation }) => {
  const [parentInfo, setParentInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


  const fetchRooms = async () => {
    try {
      const response = await apiRequest('/parent/rooms');
      let jsonResponse = await response;
      
      if (jsonResponse && jsonResponse.email) {
        setParentInfo(jsonResponse);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching parent data:', error);
      setIsLoading(false);
    }
  };

 

  useFocusEffect(
    React.useCallback(() => {
      

      fetchRooms();

      return () => {
        // Optional: Any cleanup actions
      };
    }, [])
  );


  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    // Place your data fetching logic here
    try {
      // Fetch data
      fetchRooms();
    } catch (error) {
      console.error(error);
    }

    setRefreshing(false);
  }, []);

  const createRoom = async () => {
    try {
      // Call the API to create a room
      await apiRequest('/room/create', { method: 'POST' });
      // If successful, refresh the list of rooms
      fetchRooms();
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  if (isLoading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  if (!parentInfo) {
    return <View style={styles.container}><Text>No data available</Text></View>;
  }


  const renderRoom = ({ item }) => {
    const childName = item.child ? `Child: ${item.child.name}` : 'No one';
  
    return (
    <TouchableOpacity onPress={() => navigation.navigate('RoomTab', { roomId: item.id })}>
        <Card>
          <Card.Title>{item.code}</Card.Title>
          <Text>Total: {item.total}</Text>
          <Text>{childName}</Text>
        </Card>
      </TouchableOpacity>
    );
  };
  
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken'); // Assuming 'userToken' is the key for the stored token
      authEventEmitter.emit('authChange'); // Emitting the event to notify the app of the auth change
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  

  return (
    <View style={styles.container}>
    <View style={styles.headerContainer}>

      <Text style={styles.title}>Welcome, {parentInfo.name}</Text>
      <Icon
          name='sign-out'
          type='font-awesome'
          color='#517fa4'
          onPress={logout}
          containerStyle={styles.iconContainer}
        />
        </View>
      <FlatList
        data={parentInfo.rooms}
        keyExtractor={item => item.id.toString()}
        renderItem={renderRoom}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
      <Button title="Create Room" onPress={createRoom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Adjust this to position the button

    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1, // Take up as much space as possible
  },
  iconContainer: {
    padding: 10,
  },
});

export default ParentHomePage;
