// authHelpers.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authEventEmitter } from './AuthEventEmitter';

export const handleLogout = async () => {
  await AsyncStorage.removeItem('childId');
  await AsyncStorage.removeItem('userToken');
  authEventEmitter.emit('authChange');
};
