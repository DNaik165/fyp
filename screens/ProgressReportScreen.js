// //  screens/ProgressReportScreen.js

// import React, { useContext } from 'react';
// import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
// import { TaskContext } from '../context/TaskContext';
// import { LineChart } from 'react-native-chart-kit';

// const ProgressReportScreen = () => {
//   const { completedTasksCount, workSessions, tasks } = useContext(TaskContext);

//   // Calculate tasks and work sessions completed each day for the past week
//   const getWeeklyData = () => {
//     const today = new Date();
//     const todayIndex = today.getDay(); // Get today's index (0 = Sunday, 1 = Monday, etc.)
//     let taskData = Array(7).fill(0);
//     let sessionData = Array(7).fill(0);

//     // Calculate completed tasks
//     tasks.forEach(task => {
//       const taskDate = new Date(task.date);
//       const dayDiff = Math.floor((today - taskDate) / (1000 * 3600 * 24));
//       if (dayDiff >= 0 && dayDiff < 7 && task.myStatus === 'Done') {
//         const dayIndex = (todayIndex - dayDiff + 7) % 7;
//         taskData[dayIndex] += 1;
//       }
//     });

//     // Calculate work sessions
//     workSessions.forEach(session => {
//       const sessionDate = new Date(session.timestamp);
//       const dayDiff = Math.floor((today - sessionDate) / (1000 * 3600 * 24));
//       if (dayDiff >= 0 && dayDiff < 7) {
//         const dayIndex = (todayIndex - dayDiff + 7) % 7;
//         sessionData[dayIndex] += 1;
//       }
//     });

//     // Rotate daysOfWeek to start with today
//     const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     const orderedDaysOfWeek = daysOfWeek.slice(todayIndex).concat(daysOfWeek.slice(0, todayIndex));

//     return {
//       taskData: orderedDaysOfWeek.map((_, index) => taskData[(todayIndex + index) % 7]),
//       sessionData: orderedDaysOfWeek.map((_, index) => sessionData[(todayIndex + index) % 7]),
//       orderedDaysOfWeek,
//     };
//   };

//   const { taskData, sessionData, orderedDaysOfWeek } = getWeeklyData();

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.header}>Progress Report</Text>

//       <View style={styles.card}>
//         <Text style={styles.subHeader}>Completed Tasks</Text>
//         <Text style={styles.count}>{completedTasksCount}</Text>
//       </View>

//       <LineChart
//         data={{
//           labels: orderedDaysOfWeek,
//           datasets: [
//             {
//               data: taskData,
//               color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Tasks color
//             }
//           ],
//           legend: ['Tasks'],
//         }}
//         width={Dimensions.get('window').width-20} // Responsive width
//         height={220}
//         yAxisLabel=""
//         yAxisInterval={1}
//         chartConfig={{
//           backgroundColor: '#ffffff',
//           backgroundGradientFrom: '#ffffff',
//           backgroundGradientTo: '#ffffff',
//           decimalPlaces: 0,
//           color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//           labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//           style: {
//             borderRadius: 16,
//           },
//         }}
//         style={styles.chart}
//       />

//       <View style={styles.card}>
//         <Text style={styles.subHeader}>Completed Work Sessions</Text>
//         <Text style={styles.count}>{workSessions.length}</Text>
//       </View>

//       <LineChart
//         data={{
//           labels: orderedDaysOfWeek,
//           datasets: [
//             {
//               data: sessionData,
//               color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, // Sessions color
//             }
//           ],
//           legend: ['Sessions'],
//         }}
//         width={Dimensions.get('window').width -20} // Responsive width
//         height={220}
//         yAxisLabel=""
//         yAxisInterval={1}
//         chartConfig={{
//           backgroundColor: '#ffffff',
//           backgroundGradientFrom: '#ffffff',
//           backgroundGradientTo: '#ffffff',
//           decimalPlaces: 0,
//           color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//           labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//           style: {
//             borderRadius: 16,
//           },
//         }}
//         style={styles.chart}
//         bezier
//       />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: 'lightblue',
//     marginBottom: 20,
//   },
//   card: {
//     width: '100%',
//     padding: 15,
//     marginBottom: 20,
//     borderRadius: 10,
//     backgroundColor: '#ffffff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//     alignItems: 'center',
//   },
//   subHeader: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'lightblue',
//   },
//   count: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     color: 'skyblue',
//     marginTop: 10,
//   },
//   chart: {
//     marginVertical: 8,
//     borderRadius: 16,
//   },
// });

// export default ProgressReportScreen;






import React, { useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { TaskContext } from '../context/TaskContext';
import { LineChart } from 'react-native-chart-kit';

// Utility function to get the start of the week (Monday) for a given date
const getStartOfWeek = (date) => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay(); // Sunday is 0, Monday is 1, etc.
  const diff = (day === 0 ? -6 : 1) - day; // Adjust to get Monday as the start of the week
  startOfWeek.setDate(startOfWeek.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0); // Normalize to the start of the day
  return startOfWeek;
};

// Function to get the day index of a given date in the week
const getDayIndex = (date, weekStartDate) => {
  const dayDiff = Math.floor((date - weekStartDate) / (1000 * 3600 * 24));
  return (dayDiff + 7) % 7; // Ensures the index is between 0 and 6
};

const ProgressReportScreen = () => {
  const { completedTasksCount, workSessions, tasks } = useContext(TaskContext);
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));

  
  // Calculate tasks and work sessions completed each day for the given week
  const getWeeklyData = useCallback((weekStart) => {
    const weekStartDate = new Date(weekStart);
    weekStartDate.setHours(0, 0, 0, 0); // Normalize to the start of the day
    let taskData = Array(7).fill(0);
    let sessionData = Array(7).fill(0);

    // Calculate completed tasks
    tasks.forEach(task => {
      const taskDate = new Date(task.date);
      taskDate.setHours(0, 0, 0, 0); // Normalize task date to the start of the day
      if (taskDate >= weekStartDate && taskDate < new Date(weekStartDate).setDate(weekStartDate.getDate() + 7)) {
        const dayIndex = getDayIndex(taskDate, weekStartDate);
        if (task.myStatus === 'Done') {
          taskData[dayIndex] += 1;
        }
      }
    });

    // Calculate work sessions
    workSessions.forEach(session => {
      const sessionDate = new Date(session.timestamp);
      sessionDate.setHours(0, 0, 0, 0); // Normalize session date to the start of the day
      if (sessionDate >= weekStartDate && sessionDate < new Date(weekStartDate).setDate(weekStartDate.getDate() + 7)) {
        const dayIndex = getDayIndex(sessionDate, weekStartDate);
        sessionData[dayIndex] += 1;
      }
    });
    
  

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStartDate);
      day.setDate(day.getDate() + i);
      weekDays.push(daysOfWeek[(day.getDay() + 6) % 7]); // Adjust for Monday start
    }

    return {
      taskData,
      sessionData,
      orderedDaysOfWeek: weekDays
    };
  }, [tasks, workSessions]);

  const { taskData, sessionData, orderedDaysOfWeek } = getWeeklyData(currentWeekStart);

  const handlePrevWeek = () => {
    setCurrentWeekStart(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 6);
      return getStartOfWeek(newDate);
    });
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return getStartOfWeek(newDate);
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Progress Report</Text>

      <View style={styles.navigation}>
        <TouchableOpacity onPress={handlePrevWeek} style={styles.navButton}>
          <Text style={styles.navText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.navText}>
          Week of {currentWeekStart.toDateString()}
        </Text>
        <TouchableOpacity onPress={handleNextWeek} style={styles.navButton}>
          <Text style={styles.navText}>{">"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.subHeader}>Completed Tasks</Text>
        <Text style={styles.count}>{completedTasksCount}</Text>
      </View>

      <View style={styles.chartContainer}>
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
          width={Dimensions.get('window').width - 40} // Responsive width
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
          // bezier
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.subHeader}>Completed Work Sessions</Text>
        <Text style={styles.count}>{workSessions.length}</Text>
      </View>

      <View style={styles.chartContainer}>
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
          width={Dimensions.get('window').width - 40} // Responsive width
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
      </View>
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
    navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 10,
  },
  navText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'lightblue'
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'lightblue',
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
  //   card: {
  //   alignItems: 'center',
  //   marginVertical: 10,
  // },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'lightblue',
  },
  count: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'skyblue',
    marginTop: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    paddingBottom: 10
  },
});

export default ProgressReportScreen;
