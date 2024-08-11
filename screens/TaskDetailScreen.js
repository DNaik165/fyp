// screens/TaskDetailScreen.js
import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { TaskContext } from '../context/TaskContext';

const TaskDetailScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const { tasks, updateTask, deleteTask } = useContext(TaskContext);
  const task = tasks.find(t => t.id === taskId);

  const [taskName, setTaskName] = useState(task.name);
  const [dueDate, setDueDate] = useState(task.dueDate);

  const handleUpdateTask = () => {
    updateTask(taskId, { name: taskName, dueDate });
    navigation.goBack();
  };

  const handleDeleteTask = () => {
    deleteTask(taskId);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text>Task Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Task Name"
        value={taskName}
        onChangeText={setTaskName}
      />
      <TextInput
        style={styles.input}
        placeholder="Due Date (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
      />
      <Button title="Update Task" onPress={handleUpdateTask} />
      <Button title="Delete Task" onPress={handleDeleteTask} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default TaskDetailScreen;
