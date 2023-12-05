import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ActivityIndicator,RefreshControl,View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import io from 'socket.io-client';
import { apiRequest} from '../../services/api'; // Adjust this import according to your project structure
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
      const fetchedMessages = await apiRequest(`/chat/get/${roomId}`);
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
      
        
            // Initialize the socket
            socket.current = io('https://9448-197-146-63-142.ngrok-free.app');
            console.log(socket.current);
          
            const handleNewMessage = (message) => {
              console.log('from parent New message received:', message);
              setMessages(prevMessages => [...prevMessages, message]);
            };
          
            if (socket.current) {
              console.log('parent Connecting to socket server');
              
              socket.current.emit('join-room', roomId);
              console.log(`parent Joining room: ${roomId}`);
          
              // Fetch existing messages
              fetchMessages();
          
              // Set up event listener for new messages
              if (socket.current) {
                console.log('Setting up socket listener for new-message');
                socket.current.on('new-message', handleNewMessage);
                console.log("Listening for new messages...");  // Add this line
              }
              
              // Check for successful connection
              socket.current.on('connect', () => {
                console.log('Socket connected:', socket.current.id);
              });
            }
          
            // Clean up
            return () => {
              if (socket.current) {
                socket.current.off('new-message', handleNewMessage);
                socket.current.disconnect();
                console.log('Socket disconnected');
              }
            };
         
  }, [roomId])
  );

  if (isLoading) {
    return <ActivityIndicator />;
  }
  

  const sendMessage = async () => {
    try {
      const message = await apiRequest(`/chat/send/${roomId}`, {
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
