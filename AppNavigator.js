// // // appnavigator.js

import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { FontAwesome5, MaterialIcons, AntDesign } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import TaskListScreen from './screens/TaskListScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import UpdateTaskScreen from './screens/UpdateTaskScreen';
import PomodoroScreen from './screens/PomodoroScreen';
import WelAppScreen from './screens/WelAppScreen';
import ProgressReportScreen from './screens/ProgressReportScreen';
import MotivationalHeader from './components/MotivationalHeader';
import AuthScreen from './screens/AuthScreen';
import GameScreen from './screens/GameScreen';
import UserProfileScreen from './screens/UserScreen'; // Import UserProfileScreen
import { auth } from './firebase';



// Custom drawer content component
const CustomDrawerContent = (props) => (
  <DrawerContentScrollView {...props}>
    <View style={styles.drawerHeader}>
      <Text style={styles.drawerTitle}>Tola</Text>
    </View>
    <DrawerItemList {...props} />
  </DrawerContentScrollView>
);


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();


const HomeStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Todo" component={HomeScreen} />
    <Stack.Screen name="UpdateTask" component={UpdateTaskScreen} />
    <Stack.Screen name="Game" component={GameScreen} />
  </Stack.Navigator>
);

// const HomeStackNavigator = () => (
//   <Stack.Navigator>
//     <Stack.Screen
//       name="Home"
//       component={HomeScreen}
//       options={{
//         headerTitle: () => <MotivationalHeader />,
//         headerStyle: {
//           backgroundColor: 'skyblue', // Adjust as needed
//         },
//       }}
//     />
//     <Stack.Screen name="UpdateTask" component={UpdateTaskScreen} />
//   </Stack.Navigator>
// );

const TaskStackNavigator = () => (
  <Stack.Navigator >
    <Stack.Screen options={{ headerShown:false }}
 name="TaskList" component={TaskListScreen} />
    <Stack.Screen name="UpdateTask" component={UpdateTaskScreen} />
    <Stack.Screen name="AddTask" component={AddTaskScreen} />
  </Stack.Navigator>
);


const DrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="Home"
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={({ route }) => ({
      drawerIcon: ({ color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Home':
            iconName = 'home';
            return <FontAwesome5 name={iconName} size={size} color={color} />;
          case 'Game':
            iconName = 'gamepad';
            return <FontAwesome5 name={iconName} size={size} color={color} />;
          case 'Progress Report':
             iconName = 'barschart';
             return <AntDesign name={iconName} size={size} color={color} />;
          case 'Profile':
             iconName = 'user';
             return <AntDesign name={iconName} size={size} color={color} />;
          default:
            return null;
        }
      },
    })}
  >
     <Drawer.Screen name="Profile" component={UserProfileScreen} />
    <Drawer.Screen
      name="Home" 
      component={TabNavigator}
      options={{
        title: 'Home', // Hide the text label for Home
        headerShown: false, // Hide the header when navigating to Home
      }}
    />
    {/* <Drawer.Screen name="Profile" component={UserProfileScreen} /> */}
    <Drawer.Screen name="Game" component={GameScreen} />
    <Drawer.Screen name="Progress Report" component={ProgressReportScreen} />
  </Drawer.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Home"
      component={HomeStackNavigator}
      options={{ headerShown:false ,
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="home" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Tasks"
      component={TaskStackNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="tasks" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Add Task"
      component={AddTaskScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="add-task" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Pomodoro"
      component={PomodoroScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="timer" size={size} color={color} />
        ),
      }}
    />
    {/* <Tab.Screen
      name="Progress Report"
      style={styles.drawerTitle}
      component={ProgressReportScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <AntDesign name="barschart" size={size} color={color} />
        ),
      }}
    /> */}
  </Tab.Navigator>
);



const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsLoggedIn(!!user);
      setIsLoading(false); // Set loading to false after checking auth status
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return null; // Optionally show a loading spinner or splash screen here
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelAppScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Home" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
    // <NavigationContainer>
    //   <Stack.Navigator screenOptions={{ headerShown: false }}>
    //     <Stack.Screen name="Welcome" component={WelAppScreen} />
    //     {isLoggedIn ? (
    //       <Stack.Screen name="Home" component={TabNavigator} />
    //     ) : (
    //       <Stack.Screen name="Auth" component={AuthScreen} />
    //      )} 
    //   </Stack.Navigator>
    // </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    backgroundColor: '#f5f5f5', // Background color of the drawer header
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'RubiksBubble-Regular'
  },
});

export default AppNavigator;


