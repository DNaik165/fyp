//  screens/ProgressReportScreen.js

import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { TaskContext } from '../context/TaskContext';
import { LineChart } from 'react-native-chart-kit';

const ProgressReportScreen = () => {
  const { completedTasksCount, workSessions, tasks } = useContext(TaskContext);

  // Calculate tasks and work sessions completed each day for the past week
  const getWeeklyData = () => {
    const today = new Date();
    const todayIndex = today.getDay(); // Get today's index (0 = Sunday, 1 = Monday, etc.)
    let taskData = Array(7).fill(0);
    let sessionData = Array(7).fill(0);

    // Calculate completed tasks
    tasks.forEach(task => {
      const taskDate = new Date(task.date);
      const dayDiff = Math.floor((today - taskDate) / (1000 * 3600 * 24));
      if (dayDiff >= 0 && dayDiff < 7 && task.myStatus === 'Done') {
        const dayIndex = (todayIndex - dayDiff + 7) % 7;
        taskData[dayIndex] += 1;
      }
    });

    // Calculate work sessions
    workSessions.forEach(session => {
      const sessionDate = new Date(session.timestamp);
      const dayDiff = Math.floor((today - sessionDate) / (1000 * 3600 * 24));
      if (dayDiff >= 0 && dayDiff < 7) {
        const dayIndex = (todayIndex - dayDiff + 7) % 7;
        sessionData[dayIndex] += 1;
      }
    });

    // Rotate daysOfWeek to start with today
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const orderedDaysOfWeek = daysOfWeek.slice(todayIndex).concat(daysOfWeek.slice(0, todayIndex));

    return {
      taskData: orderedDaysOfWeek.map((_, index) => taskData[(todayIndex + index) % 7]),
      sessionData: orderedDaysOfWeek.map((_, index) => sessionData[(todayIndex + index) % 7]),
      orderedDaysOfWeek,
    };
  };

  const { taskData, sessionData, orderedDaysOfWeek } = getWeeklyData();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Progress Report</Text>

      <View style={styles.card}>
        <Text style={styles.subHeader}>Completed Tasks</Text>
        <Text style={styles.count}>{completedTasksCount}</Text>
      </View>

      <LineChart
        data={{
          labels: orderedDaysOfWeek,
          datasets: [
            {
              data: taskData,
              color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Tasks color
            }
          ],
          legend: ['Tasks'],
        }}
        width={Dimensions.get('window').width-20} // Responsive width
        height={220}
        yAxisLabel=""
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={styles.chart}
      />

      <View style={styles.card}>
        <Text style={styles.subHeader}>Completed Work Sessions</Text>
        <Text style={styles.count}>{workSessions.length}</Text>
      </View>

      <LineChart
        data={{
          labels: orderedDaysOfWeek,
          datasets: [
            {
              data: sessionData,
              color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, // Sessions color
            }
          ],
          legend: ['Sessions'],
        }}
        width={Dimensions.get('window').width -20} // Responsive width
        height={220}
        yAxisLabel=""
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={styles.chart}
        bezier
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
  },
  count: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default ProgressReportScreen;

