import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authEventEmitter } from '../../services/AuthEventEmitter';



const ChildRegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState('');

  const handleRegister = async () => {
    try {
      // Replace with your actual API endpoint
      let response = await fetch('http://10.0.2.2:3000/child/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name }),
      });
      let jsonResponse = await response.json();
      console.log("resp:", jsonResponse, jsonResponse.id);
      if (jsonResponse && jsonResponse.id) {
        await AsyncStorage.setItem('childId', jsonResponse.id.toString());
        // Example of emitting an event after login
        // Somewhere in your app, for example, after login
        await authEventEmitter.emit('authChange');


        navigation.navigate('ChildHome', { childId: jsonResponse.id });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Child Registration</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Child's Name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Register" onPress={handleRegister} />
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
  input: {
    width: '100%',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ChildRegistrationScreen;
