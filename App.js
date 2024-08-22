// // App.js
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './AppNavigator';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider } from './context/AuthContext';
import { db } from './firebase'; 


SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'RubikBubbles-Regular': require('./assets/fonts/RubikBubbles-Regular.ttf'),
        'BubblegumSans-Regular': require('./assets/fonts/BubblegumSans-Regular.ttf'),
      });
      setFontsLoaded(true);
      SplashScreen.hideAsync(); // Hide splash screen once fonts are loaded
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Optionally return a blank view or a custom loading component
  }

  return (
    <AuthProvider>
    <TaskProvider>
      <View style={styles.container}>
        <AppNavigator />
        <StatusBar style="auto" />
      </View>
    </TaskProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
