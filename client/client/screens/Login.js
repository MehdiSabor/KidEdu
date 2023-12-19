import React from 'react';
import { View, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import WebViewHeader from './WebViewHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authEventEmitter } from '../services/AuthEventEmitter';

const UserTypeScreen = ({ navigation }) => {
  const [showWebView, setShowWebView] = React.useState(false);

  const handleMessage = async (event) => {
    // Extract token from event
    const { data } = event.nativeEvent;
    try {
      const response = JSON.parse(data);
      if (response.token) {
        // Store token in AsyncStorage
        await AsyncStorage.setItem('userToken', response.token);
        await authEventEmitter.emit('authChange');

        
        // Navigate to the appropriate screen or update state as necessary
        setShowWebView(false);
        
        navigation.navigate('ParentHome'); // Assuming you navigate to a 'ParentHome' screen
      }
    } catch (e) {
      console.error('Failed to parse the token from the WebView', e);
    }
  };

  const handleParentLogin = () => {
    setShowWebView(true);
  };

  const handleBackPress = () => {
    setShowWebView(false); // Hide WebView and go back to the main screen
  };

  if (showWebView) {
    return (
      <View style={{ flex: 1 }}>
        <WebViewHeader onBackPress={handleBackPress} />
        <WebView
          source={{ uri: 'https://7c76-196-43-236-5.ngrok-free.app/auth/google' }}
          userAgent="Mozilla/5.0 Google"
          domStorageEnabled={true}
          javaScriptEnabled={true}
          onMessage={handleMessage} // Listen for the message from the WebView
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Parent Login" onPress={handleParentLogin} />
     
      <Button title="Child" onPress={() => navigation.navigate('ChildRegistration')} />

    </View>
  );
};

export default UserTypeScreen;
