// api.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authEventEmitter } from './AuthEventEmitter';
import { handleLogout } from './AuthHelpers';
import config from './config'; // Adjust the path to your config file


export const apiRequest = async (endpoint, options = {}) => {
  
  const baseURL = endpoint.includes('chat') ? config.Chat_URL : config.API_URL;
  // Construct the full URL
  const url = `${baseURL}${endpoint}`;
  console.log(url);
  const token = await AsyncStorage.getItem('userToken');
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok && response.status === 401) { // Unauthorized
    await handleLogout();
    throw new Error('Unauthorized');
  }
  if (!response.ok && response.status === 403) { // Forbidden
    await handleLogout();
    throw new Error('Forbidden');
  }

  return response.json();
};

export const apiRequestChild = async (endpoint, options = {}) => {
  try {
    const childId = await AsyncStorage.getItem('childId');
    if (!childId) {
      throw new Error('No child ID found in storage');
    }

    const url = `${config.API_URL}${endpoint}`;
  
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'x-child-id': childId,
      },
    });

    if (!response.ok) {
      // Handle non-OK responses here
      const errorText = await response.text();
      throw new Error(errorText);
    }

    return response.json();
  } catch (error) {
    // Handle errors, such as missing child ID, request errors, etc.
    console.error('API request error:', error.message);
    throw error; // You might want to re-throw the error or handle it differently
  }
};





