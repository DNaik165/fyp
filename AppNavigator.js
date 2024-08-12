// // appnavigator.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5, MaterialIcons, AntDesign } from '@expo/vector-icons'; // Import the icon library
import HomeScreen from './screens/HomeScreen';
import TaskListScreen from './screens/TaskListScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import UpdateTaskScreen from './screens/UpdateTaskScreen';
import PomodoroScreen from './screens/PomodoroScreen';
import MotivationalHeader from './components/MotivationalHeader';
import ProgressReportScreen from './screens/ProgressReportScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Todo" component={HomeScreen} />
    <Stack.Screen name="UpdateTask" component={UpdateTaskScreen} />
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
  <Stack.Navigator>
    <Stack.Screen name="TaskList" component={TaskListScreen} />
    <Stack.Screen name="UpdateTask" component={UpdateTaskScreen} />
    <Stack.Screen name="AddTask" component={AddTaskScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
       initialRouteName="Home"
       >
        <Tab.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{
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
        <Tab.Screen
          name="Progress Report"
          component={ProgressReportScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="barschart" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

