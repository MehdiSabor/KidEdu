import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ActivityIndicator,RefreshControl,View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import io from 'socket.io-client';
import { apiRequestChild } from '../../services/api'; // Adjust this import according to your project structure
import { useFocusEffect } from '@react-navigation/native';

const ChatScreen = ({ route }) => {
  const { roomId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
 

  const fetchMessages = async () => {
    try {
      const fetchedMessages = await apiRequestChild(`/chat/get/${roomId}`);
      setMessages(fetchedMessages);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    // Place your data fetching logic here
    try {
      // Fetch data
      fetchMessages();
      
    } catch (error) {
      console.error(error);
    }

    setRefreshing(false);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      
    // Connect to the socket server
    socket.current = io('https://1872-196-43-236-5.ngrok-free.app'); // Replace with your server URL
    console.log('Connecting to socket server');

    socket.current.emit('join-room', roomId);
    console.log(`Joining room: ${roomId}`);
  
    // Fetch existing messages from the server
    fetchMessages();

    // Listen for new messages
    socket.current.on('new-message', (message) => {
      console.log('from child New message received:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.current.disconnect();
      console.log('Socket disconnected');
    };
  }, [roomId])
  );

  if (isLoading) {
    return <ActivityIndicator />;
  }
  

  const sendMessage = async () => {
    try {
      const message = await apiRequestChild(`/chat/send/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newMessage }),
      });
      setNewMessage('');
      // No need to add the message to state; it will be added via socket.io
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messageBox: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
});

export default ChatScreen;
