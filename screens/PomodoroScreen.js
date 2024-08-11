// // screens/PomodoroScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Vibration, Platform } from 'react-native';


const PomodoroScreen = () => {
  const [workTime, setWorkTime] = useState(25); // Default work time in minutes
  const [shortBreakTime, setShortBreakTime] = useState(5); // Default short break time in minutes
  const [longBreakTime, setLongBreakTime] = useState(15); // Default long break time in minutes
  const [time, setTime] = useState(workTime * 60); // Initialize with work time
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkInterval, setIsWorkInterval] = useState(true); // Track if it's work or break
  const [sessionCount, setSessionCount] = useState(0); // Track number of work sessions


  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(interval);
            handleTimeUp();
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsWorkInterval(true);
    setSessionCount(0);
    setTime(workTime * 60);
  };


  const handleTimeUp = async () => {
  Vibration.vibrate([500, 1000, 500], false);



  Alert.alert(
    'Times Up!',
    isWorkInterval ? 'Good job! Take a break.' : 'Break over! Back to work.',
    [
      { text: 'OK', onPress: () => switchInterval() }
    ],
    { cancelable: false }
  );
};


 

  const switchInterval = () => {
    if (isWorkInterval) {
      // End of work session
      console.log(`Pomodoro session ${sessionCount + 1} ended. Duration: ${workTime} minutes.`);
      
      setSessionCount((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount % 4 === 0) {
          // Trigger a long break after every 4 work sessions
          console.log(`Starting long break. Duration: ${longBreakTime} minutes.`);
          setIsWorkInterval(false);
          setTime(longBreakTime * 60);
        } else {
          // Trigger a short break
          console.log(`Starting short break. Duration: ${shortBreakTime} minutes.`);
          setIsWorkInterval(false);
          setTime(shortBreakTime * 60);
        }
        return newCount;
      });
    } else {
      // End of break session
      if (sessionCount % 4 === 0) {
        console.log(`Long break ended. Duration: ${longBreakTime} minutes.`);
      } else {
        console.log(`Short break ended. Duration: ${shortBreakTime} minutes.`);
      }

      setIsWorkInterval(true);
      setTime(workTime * 60);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(time)}</Text>
      
      {/* Work, Short Break, and Long Break Time Inputs */}
      <View style={styles.inputContainer}>
        <Text>Work Time (minutes):</Text>
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          value={workTime.toString()}
          onChangeText={(value) => setWorkTime(Number(value))}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text>Short Break Time (minutes):</Text>
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          value={shortBreakTime.toString()}
          onChangeText={(value) => setShortBreakTime(Number(value))}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Long Break Time (minutes):</Text>
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          value={longBreakTime.toString()}
          onChangeText={(value) => setLongBreakTime(Number(value))}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleStartStop}>
        <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  timer: {
    fontSize: 48,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    width: 60,
    marginLeft: 10,
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: 100,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});

export default PomodoroScreen;










// 2. Prioritization System
// Integration: Modify the AddTaskScreen to include a priority level dropdown.
// Details: Add a priority field to the task object. Update the TaskListScreen to allow sorting or filtering tasks based on priority.
// 3. Visual Task Board
// Screen: You could create a new TaskBoardScreen.
// Details: Implement a Kanban board where users can drag and drop tasks between columns like "To Do," "In Progress," and "Done."
// 4. Daily Goals/Top 3 Tasks
// Integration: Add a section on HomeScreen to display today's goals or top tasks.
// Details: Allow users to mark certain tasks as daily goals and display these on the home screen.


// 6. Habit Tracker
// Screen: Consider adding a HabitTrackerScreen.
// Details: Track habits with a visual representation of streaks or progress. Allow users to add and track habits alongside tasks.
// 7. Customizable Notifications
// Integration: Extend the TaskContext to manage notification settings.
// Details: Allow users to customize reminders and notifications for tasks.
// 8. Task Dependencies
// Integration: Modify AddTaskScreen to include dependencies.
// Details: Allow users to set dependencies between tasks, and display these dependencies in the task list.
// 9. Voice Commands
// Integration: Use voice recognition libraries to allow voice commands for adding or managing tasks.
// Details: Implement a button or gesture to activate voice commands.
// 10. Gamification Elements
// Integration: Add gamification features to HomeScreen or TaskListScreen.
// Details: Display points, badges, or achievements for completing tasks and maintaining streaks.
// 11. Customizable Themes
// Integration: Use your existing theme management system for customizable themes.
// Details: Allow users to switch between different themes or create their own.
// 12. Integration with Calendar
// Integration: Sync tasks with a calendar view on HomeScreen or a new CalendarScreen.
// Details: Display tasks and events in a unified calendar view.
// 13. Task Templates
// Integration: Add a feature to save and use templates on AddTaskScreen.
// Details: Allow users to create and use task templates for common tasks or projects.



// 15. Progress Visualization
// Integration: Use charts or graphs on HomeScreen or a new ProgressScreen.
// Details: Provide visual feedback on task completion and time spent.







