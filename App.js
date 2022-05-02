

import { ApolloProvider , useReactiveVar } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import React, { Suspense, useEffect, useState } from 'react'
import LoggedInNav from './Nav/LoggedInNav';

import client, { isConnectedVar, isLoggedInVar, logUserOut, tokenVar, userInConnect } from './apollo';
import LoggedOutNav from './Nav/LoggedOutNav';
import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { registerForPushNotificationsAsync } from './helper/getPermissionAndToken';
import { updatePushToken } from './helper/updatePushToken';
import * as Font from 'expo-font';
import { StatusBar } from 'react-native';






export default function App() {
  
  console.log(tokenVar())
  /* const loadFonts = async () => {
    await Font.loadAsync({
      font: require("./assets/Noto_Serif_KR/NotoSerifKR-Light.otf")
    })
  }
  loadFonts */
  useEffect(async () => {
    const token = await registerForPushNotificationsAsync();
    
    const ok = await updatePushToken(token);
    
    
  },[isConnected])
  

  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const isConnected = useReactiveVar(isConnectedVar); 
  
  
  
  const [loading, setLoading] = useState(true);
  const preloadAssets = async () => {
    const fontsToLoad = [{font: require("./assets/Noto_Serif_KR/NotoSerifKR-Light.otf")}]
    const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font));
    return Promise.all([...fontPromises]);
  }
  const preload = async () => {
    const token = await AsyncStorage.getItem('token');
    const familyCode = await AsyncStorage.getItem('familyCode');
    
    if (token) {
      isLoggedInVar(true);
      tokenVar(token);
    }
    if (familyCode) {
      isConnectedVar(true);
    }
    return preloadAssets;
  }

  
  const onFinish = () => setLoading(false);
  
  if (loading) {
    return <AppLoading
      startAsync={preload}
      onError={console.warn}
      onFinish={onFinish}
    />
  }
  
 

  return (
    <ApolloProvider client={client}> 
      <NavigationContainer>
        {/* <StatusBar barStyle='dark-content'/> */}
        {isLoggedIn ? <Suspense><LoggedInNav /></Suspense> : <LoggedOutNav />}
      </NavigationContainer>
    </ApolloProvider>
  );
}
