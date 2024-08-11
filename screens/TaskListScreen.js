//screens/TaskListScreen.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { TaskContext } from '../context/TaskContext';

const TaskListScreen = ({ navigation }) => {
  const { tasks } = useContext(TaskContext);

  // Convert tasks to agenda items format
  const items = tasks.reduce((acc, task) => {
    if (!acc[task.date]) {
      acc[task.date] = [];
    }
    acc[task.date].push({
      name: task.taskName,
      time: task.date,
      task: task.taskDetails,
      taskData: task,
    });
    return acc;
  }, {});

  const renderEmptyData = () => {
    return (
      <View style={styles.emptyDataContainer}>
        <Text>No Task for this day</Text>
      </View>
    );
  };

  const goToTask = () => {
    navigation.navigate('AddTask');
  };




  const handleTaskPress = (task) => {
    navigation.navigate('UpdateTask', { task });
  };

  return (
    <View style={styles.container}>
    <Agenda
      items={items}
      renderItem={(item) => (
        <TouchableOpacity onPress={() => handleTaskPress(item.taskData)}>
          <View style={styles.taskItem}>
            <Text>{item.name}</Text>
            <Text>{item.time}</Text>
            <Text>{item.taskDetails}</Text>
          </View>
        </TouchableOpacity>
      )}
      renderEmptyData={renderEmptyData}
    />

      <TouchableOpacity style={styles.addButton} onPress={goToTask}>
        <Text>➕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskItem: {
    marginVertical: 10,
    backgroundColor: 'white',
    padding: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 10,
  },
});

export default TaskListScreen;
