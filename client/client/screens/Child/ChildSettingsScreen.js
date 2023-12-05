import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { apiRequestChild } from '../../services/api'; // Ensure this import points to your API request function

const RoomSettingsScreen = ({ route }) => {
  const { roomId } = route.params; // Assuming roomId is passed via navigation parameters
  const [roomDetails, setRoomDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRoomDetails = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequestChild(`/room/get/${roomId}`);
      setRoomDetails(response);
    } catch (error) {
      console.error('Error fetching room details:', error);
      // Handle error (e.g., show an alert or message)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRoomDetails();
    setRefreshing(false);
  }, [roomId]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!roomDetails) {
    return (
      <View style={styles.container}>
        <Text>Room details not available.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>Room Settings</Text>
      <View style={styles.detailSection}>
        <Text style={styles.label}>Room Code</Text>
        <Text style={styles.roomCode}>{roomDetails.code}</Text>
      </View>
      <View style={styles.detailSection}>
        <Text style={styles.label}>Child Name</Text>
        <Text style={styles.detail}>{roomDetails.child?.name || 'No child assigned'}</Text>
      </View>
      <View style={styles.detailSection}>
        <Text style={styles.label}>Points</Text>
        <Text style={styles.points}>{roomDetails.total}</Text>
      </View>
      {/* Add more room details or settings options as needed */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  detailSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  roomCode: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  detail: {
    fontSize: 18,
    color: '#000',
  },
  points: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
  },
  // Add more styles as needed
});
export default RoomSettingsScreen;
