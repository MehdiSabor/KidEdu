import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from './screens/LoadingScreen';
import { authEventEmitter } from './services/AuthEventEmitter';
import UserTypeNavigator from './navigation/UserTypeNavigator'; // Assume you've separated these into their own component files
import ParentNavigator from './navigation/ParentNavigator';
import ChildNavigator from './navigation/ChildNavigator';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState(null); // 'child' or 'parent'

  useEffect(() => {
    const checkAuth = async () => {
      const storedChildId = await AsyncStorage.getItem('childId');
      const storedToken = await AsyncStorage.getItem('userToken');
      console.log("token:",storedToken);
      console.log("storedChildId",storedChildId);
      let type = null;
      if (storedChildId) type = 'child';
      else if (storedToken) type = 'parent';

      setUserType(type);
      setIsAuthenticated(type !== null);
      setIsLoading(false);
    };
  
    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };
  
    authEventEmitter.on('authChange', handleAuthChange);
  
    return () => {
      authEventEmitter.off('authChange', handleAuthChange);
    };
  }, []);
  

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {!isAuthenticated && <UserTypeNavigator />}
      {isAuthenticated && userType === 'child' && <ChildNavigator />}
      {isAuthenticated && userType === 'parent' && <ParentNavigator />}
    </NavigationContainer>
  );
};


export default App;
