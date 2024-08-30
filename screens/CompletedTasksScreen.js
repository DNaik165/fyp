//screens/CompletedTasksScreen.js

import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Image  } from 'react-native';
import { TaskContext } from '../context/TaskContext';
import { useNavigation } from '@react-navigation/native';

const TaskItem = ({ task, onPress }) => (
        <TouchableOpacity onPress={() => onPress(task)}>
          <View style={styles.taskContainerT}>
            <Text style={styles.taskName}>{task.taskName}</Text>
            <Text style={styles.taskDetails}>{task.taskDetails}</Text>
            <Text>Date: {task.date}</Text>
            <Text>Status: {task.myStatus}</Text>
            {/* <Text>Priority: {task.priority}</Text> */}
            {task.attachments && task.attachments.length > 0 && (
              <Image
                source={{ uri: task.attachments[0].uri }}
                style={styles.attachmentImage}
              />
            )}
          </View>
        </TouchableOpacity>
      );

      
const categorizeCompletedTasks = (tasks) => {
  
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const getDateStr = (date) => date.toISOString().split('T')[0];
  
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const sevenDaysAgoStr = getDateStr(sevenDaysAgo);

  const fourteenDaysAgo = new Date(today);
  fourteenDaysAgo.setDate(today.getDate() - 14);
  const fourteenDaysAgoStr = getDateStr(fourteenDaysAgo);

  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const thirtyDaysAgoStr = getDateStr(thirtyDaysAgo);

  const categorizedTasks = {
    today: [],
    sevenDaysAgo: [],
    fourteenDaysAgo: [],
    thirtyDaysAgo: [],
    older: []
  };

  tasks.forEach(task => {
    if (task.myStatus === 'Done') {
      const taskDate = new Date(task.date);
      const taskDateStr = getDateStr(taskDate);

      if (taskDateStr === todayStr) {
        categorizedTasks.today.push(task);
      } else if (taskDateStr >= sevenDaysAgoStr && taskDateStr < todayStr) {
        categorizedTasks.sevenDaysAgo.push(task);
      } else if (taskDateStr >= fourteenDaysAgoStr && taskDateStr < sevenDaysAgoStr) {
        categorizedTasks.fourteenDaysAgo.push(task);
      } else if (taskDateStr >= thirtyDaysAgoStr && taskDateStr < fourteenDaysAgoStr) {
        categorizedTasks.thirtyDaysAgo.push(task);
      } else if (taskDateStr < thirtyDaysAgoStr) {
        categorizedTasks.older.push(task);
      }
    }
  });

  return categorizedTasks;
};

const CompletedTasksScreen = () => {
  const navigation = useNavigation();
  
  const handleTaskPress = (task) => {
    navigation.navigate('UpdateTask', { task });
  };


  const { tasks } = useContext(TaskContext);
  const [categorizedTasks, setCategorizedTasks] = useState({
    today: [],
    sevenDaysAgo: [],
    fourteenDaysAgo: [],
    thirtyDaysAgo: [],
    older: []
  });

  useEffect(() => {
    const tasksByCategory = categorizeCompletedTasks(tasks);
    setCategorizedTasks(tasksByCategory);
  }, [tasks]);

  const renderTaskItem = ({ item }) => (
    <TaskItem task={item} onPress={handleTaskPress} />
  );

  const sections = [
    { title: "Today's", data: categorizedTasks.today },
    { title: '7 Days Ago', data: categorizedTasks.sevenDaysAgo },
    { title: '14 Days Ago', data: categorizedTasks.fourteenDaysAgo },
    { title: '30 Days Ago', data: categorizedTasks.thirtyDaysAgo },
    { title: 'Older', data: categorizedTasks.older }
  ];

  return (
    <SectionList
      sections={sections}
      renderItem={renderTaskItem}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
      )}
      keyExtractor={(item) => item.id.toString()}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'skyblue',
  },
  taskContainerT: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    marginRight: 10,
    marginBottom: 20
  },
  taskContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    marginRight: 10,
    borderWidth: 2,
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'lightblue',
  },
  taskDetails: {
    fontSize: 14,
    color: 'gray',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: 'gray',
  },
  status: {
    fontSize: 14,
    color: 'green',
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: 'black',
  },
});

export default CompletedTasksScreen;




