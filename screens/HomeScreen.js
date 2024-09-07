// // //screens/HomeScreen.js

import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, Image, Switch, Button, Modal } from 'react-native';
import { TaskContext } from '../context/TaskContext';
import {FontAwesome5, FontAwesome6} from '@expo/vector-icons';


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


const CustomTaskItem = ({ task, onPress }) => {
  // Define colors for status
  let statusColor;
  switch (task.myStatus) {
    case 'Pending':
      statusColor = 'salmon';
      break;
    case 'Progress':
      statusColor = 'pink';
      break;
    case 'Done':
      statusColor = 'lightblue';
      break;
    default:
      statusColor = 'lavender';
      break;
  }

  // Define colors for priority
  let priorityBorderColor;
  switch (task.priority) {
    case 1: // High
      priorityBorderColor = 'crimson'; // Red for high priority
      break;
    case 2: // Medium
      priorityBorderColor = 'plum'; // Orange for medium priority
      break;
    case 3: // Low
      priorityBorderColor = 'pink'; // Green for low priority
      break;
    default:
      priorityBorderColor = 'grey'; // Default color if priority is not set
      break;
  }

  return (
    <TouchableOpacity onPress={() => onPress(task)}>
      <View style={[styles.taskContainer, { borderColor: priorityBorderColor }]}>
        <View style={styles.statusCircle}>
          <Text style={styles.taskName}>{task.taskName}</Text>
          <View style={[styles.pendingTask, { backgroundColor: statusColor }]}></View>
        </View>
        <View style={styles.statusDetails}>
          <Text style={styles.taskDetails}>{task.taskDetails}</Text>
          <Text style={styles.taskDetails}>{task.myStatus}</Text>
          {task.attachments && task.attachments.length > 0 && (
            <Image
              source={{ uri: task.attachments[0].uri }}
              style={styles.attachmentImage}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};





const HomeScreen = ({ navigation }) => {
  const { tasks, filterTasks, filterTasksByDate , sortTasksByPriority, completedTasksCount, isGameUnlocked} = useContext(TaskContext);
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [activeTab, setActiveTab] = useState('All');
  const [todayTasks, setTodayTasks] = useState([]);
  const [focusMode, setFocusMode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setTodayTasks(filterTasksByDate(today));
    console.log('Today\'s Tasks:', todayTasks);
  }, [tasks, filterTasksByDate]);


  useEffect(() => {
    let tasksToDisplay = [];
    if (activeTab === 'Today' || focusMode) {
      const today = new Date().toISOString().split('T')[0];
      tasksToDisplay = filterTasksByDate(today);
    } else {
      tasksToDisplay = filterTasks(activeTab);
    }
    console.log('Tasks before sorting:', tasksToDisplay);
    const sortedTasks = sortTasksByPriority(tasksToDisplay);
    console.log('Tasks after sorting:', sortedTasks);
    setFilteredTasks(sortedTasks);
  }, [tasks, activeTab, filterTasks, filterTasksByDate, focusMode]);
  
 
 


  const filterTasksByStatus = (status) => {
    setActiveTab(status);
  };



  const handleTaskPress = (task) => {
    navigation.navigate('UpdateTask', { task });
  };

  

  return (
    <View style={styles.homeContainer}>
       {/* Focus Mode Toggle */}
       <View style={styles.focusModeToggle}>
        <Text style={styles.focusModeText}>Focus Mode</Text>
        <Switch
          value={focusMode}
          onValueChange={(value) => setFocusMode(value)}
        />
      </View>

 

      <ScrollView>
        <View style={styles.upComings}>
          <Text style={styles.upcomingText}>Today's Tasks</Text>
          <FlatList
            data={todayTasks}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TaskItem task={item} onPress={handleTaskPress} />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
          </View>
          {!focusMode && (
          <>

          <Text style={styles.upcomingText}>My Task List</Text>
          <View style={styles.filterContainer}>
            {['All', 'Pending', 'Progress', 'Done'].map(status => (
              <TouchableOpacity
                key={status}
                onPress={() => filterTasksByStatus(status)}
                style={[styles.filterButton, activeTab === status && styles.activeFilterButton]}
              >
                <Text style={[styles.filterText, activeTab === status && styles.activeFilterText]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {filteredTasks.map((item) => (
            <CustomTaskItem key={item.id} task={item} onPress={handleTaskPress} />
          ))}
        </>
        )}

      </ScrollView>


      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setIsModalVisible(true)}
      >
        <FontAwesome5 name="gamepad" style={styles.floatingButtonText} />
      </TouchableOpacity>

     

<Modal
  visible={isModalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setIsModalVisible(false)}
>
  <View style={styles.modalContent}>
  <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
          <FontAwesome6 name="square-xmark" style={styles.xText} />
          </TouchableOpacity>
    <Text style={styles.modalText}>Complete 3 tasks to unlock</Text>
    <Text style={styles.modalText}>Completed Tasks: {completedTasksCount}</Text>
    <Text style={styles.modalText}>Game Status: {isGameUnlocked ? 'Unlocked' : 'Locked'}</Text>

    <TouchableOpacity
      style={styles.gameButton}
      onPress={() => {
        setIsModalVisible(false); // Close modal before navigating
        if (isGameUnlocked) {
          navigation.navigate('Game');
        } else {
          alert('Complete more tasks to unlock the game!');
        }
      }}
    >
      <Text style={styles.gameButtonText}>Go to Game</Text>
    </TouchableOpacity>
  </View>
</Modal>


    </View>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    padding: 16,
  },
  upComings: {
    marginBottom: 20,
  },
  upcomingText: {
    fontSize: 16,
    fontFamily: 'RubikBubbles-Regular',
    marginBottom: 10,
    color: 'skyblue',
  },
  focusModeToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  focusModeText: {
    fontSize: 16,
    color: 'skyblue',
    fontFamily: 'RubikBubbles-Regular',
  },
  taskContainerT: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    marginRight: 10,
  },
  taskContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    marginRight: 10,
    borderWidth: 2
  },
  taskName: {
    fontSize: 16,
    fontFamily: 'RubikBubbles-Regular',
    color: 'lightblue',
  },
  taskDetails: {
    fontSize: 14,
    color: 'gray',
    fontFamily: 'RubikBubbles-Regular',
  },
  statusCircle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingTask: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  statusDetails: {
    marginTop: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeFilterButton: {
    backgroundColor: 'lightblue',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'RubikBubbles-Regular',
    color: 'lightblue',
  },
  activeFilterText: {
    color: '#fff',
  },
  attachmentImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'lightblue',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'RubikBubbles-Regular',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  modalText: {
    fontSize: 21,
    color: 'white',
    marginBottom: 20,
    fontFamily: 'RubikBubbles-Regular'
  },
  buttonP: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    marginVertical: 20,
    width: 80,
    alignItems: 'center',
  },
  gameButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'RubikBubbles-Regular'
  },
  gameButton: {
    backgroundColor: 'gold',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  xText: {
    color: 'white',
    fontSize: 50,
  },
  closeButton: {
    position: 'absolute',
    top: 1,
    right: 1,
    zIndex: 1, // Ensure it's above other modal content
    padding: 10, // Add some padding to increase pressable area
  },
});

export default HomeScreen;

