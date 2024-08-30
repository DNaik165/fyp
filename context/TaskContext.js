// // // //context/TaskContext.js real


import React, { createContext, useState, useEffect } from 'react';
import { firestore, auth } from '../firebase'; // Adjust import paths
import { doc, setDoc, updateDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { addDays, format, parseISO, startOfDay, endOfDay, isValid,  getISOWeek, getISOWeekYear } from 'date-fns';


// Create a context object to manage task-related state and provide access to it throughout the app.
export const TaskContext = createContext();

// TaskProvider component to wrap the part of the app that needs access to task-related state.
export const TaskProvider = ({ children }) => {

  // State variables for managing tasks, game state, work sessions, etc
  const [tasks, setTasks] = useState([]); // List of tasks
  const [completedTasksCount, setCompletedTasksCount] = useState(0); // Count of completed tasks
  const [workSessions, setWorkSessions] = useState([]); // List of work sessions
  const [isGameUnlocked, setIsGameUnlocked] = useState(false); // Game unlock status
  const [gameRoundsLeft, setGameRoundsLeft] = useState(3); // Rounds left for the game
  const [isGameUnlockedRecently, setIsGameUnlockedRecently] = useState(false); // Recently unlocked game status
  const [completedTasksToday, setCompletedTasksToday] = useState(0); // Number of tasks completed today
  const [user, setUser] = useState(auth.currentUser); // Current logged-in user




const today = format(new Date(), 'yyyy-MM-dd'); // Get today's date in 'yyyy-MM-dd' format


 // Effect to update the count of tasks completed today whenever the tasks state changes.
useEffect(() => {
    const completedTodayCount = tasks.filter(task => task.myStatus === 'Done' && task.date === today).length;
    setCompletedTasksToday(completedTodayCount); // Set the count of tasks completed today
}, [tasks]);


 // Effect to handle user authentication state changes and fetch tasks when user logs in.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchTasks(currentUser.uid);
      } else {
        // Clear tasks and work sessions when user logs out
        setTasks([]);
        setWorkSessions([]);
      }
    });

    return () => unsubscribe();
  }, []);


  // Effect to update completed tasks count and game unlock status when tasks or game unlock status changes.
  useEffect(() => {
    const completedCount = tasks.filter(task => task.myStatus === 'Done' && task.isNew).length;
    setCompletedTasksCount(completedCount);


    if (completedCount >= 3 && !isGameUnlocked) {
      setIsGameUnlocked(true);
      setIsGameUnlockedRecently(true);
    }
  }, [tasks, isGameUnlocked]);




// Function to predict the completion date of a task based on the average completion time of previous tasks.
  const predictTaskCompletion = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return null;

    if (!task.date || isNaN(new Date(task.date).getTime())) {
      console.error('Invalid task date:', task.date);
      return null;
    }

    const completedTasks = tasks.filter(t => t.myStatus === 'Done');

    if (completedTasks.length === 0) return 'N/A'; // No completed tasks, can't predict

    const avgCompletionTime = completedTasks.reduce((sum, t) => {
      const taskCompletionTime = t.completionTime ? new Date(t.completionTime) : new Date();
      const taskDate = new Date(t.date);

      if (isNaN(taskCompletionTime.getTime()) || isNaN(taskDate.getTime())) {
        console.error('Invalid date values:', t.completionTime, t.date);
        return sum; // Skip this entry
      }

      return sum + (taskCompletionTime - taskDate);
    }, 0) / completedTasks.length;

    const predictedCompletionDate = addDays(new Date(task.date), avgCompletionTime / (1000 * 60 * 60 * 24));
    return format(predictedCompletionDate, 'yyyy-MM-dd');
  };


  // Function to calculate the task completion rate as a ratio of completed to total tasks.
  const getTaskCompletionRate = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.myStatus === 'Done').length;
    return completedTasks / totalTasks;
  };



// Function to fetch tasks from Firestore for a given user.
  const fetchTasks = async (userId) => {
    try {
      const tasksRef = collection(firestore, 'users', userId, 'tasks');
      const querySnapshot = await getDocs(tasksRef);
      const tasksList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Log fetched tasks
      console.log('Fetched Tasks:', tasksList);

      // Optional: Adjust the 'isNew' flag for tasks based on their status
      const updatedTasksList = tasksList.map(task => ({
        ...task,
        isNew: task.myStatus === 'Done' ? false : task.isNew
      }));

      setTasks(updatedTasksList);
    } catch (error) {
      console.error('Error fetching tasks: ', error);
    }
  };




 // Function to add a new task to Firestore and update the local state.
  const addTask = async (task) => {
    try {
      if (user) {
        const newTask = { ...task, isNew: true };
        const taskRef = doc(firestore, 'users', user.uid, 'tasks', task.id);
        await setDoc(taskRef, newTask);
        setTasks(prevTasks => [...prevTasks, newTask]);
        console.log('Task added:', newTask);
      }
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  };

// Function to update an existing task in Firestore and update the local state.
  const updateTask = async (updatedTask) => {
    try {
      if (user) {
        const taskRef = doc(firestore, 'users', user.uid, 'tasks', updatedTask.id);
        await updateDoc(taskRef, {
          ...updatedTask,
          isNew: tasks.find(task => task.id === updatedTask.id).myStatus !== 'Done' && updatedTask.myStatus === 'Done' ? true : updatedTask.isNew
        });
        setTasks(tasks.map(task =>
          task.id === updatedTask.id
            ? { ...updatedTask, isNew: task.myStatus !== 'Done' && updatedTask.myStatus === 'Done' ? true : updatedTask.isNew }
            : task
        ));
        console.log('Task updated:', updatedTask);
      }
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };




// Function to delete a task from Firestore and update the local state.
  const deleteTask = async (taskId) => {
    try {
      if (user) {
        const taskRef = doc(firestore, 'users', user.uid, 'tasks', taskId);
        await deleteDoc(taskRef);
        setTasks(tasks.filter(task => task.id !== taskId));
        console.log('Task deleted:', taskId);
      }
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };



// Function to filter tasks based on their status.
  const filterTasks = (status) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

    // Calculate the date range for done tasks
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 3); // 3 days before today
    const startDateStr = startDate.toISOString().split('T')[0];


    if (status === 'All') {
      return tasks.filter(task => {
        // Exclude tasks that are done and have a past date
        return !(task.myStatus === 'Done' && task.date < todayStr);
      });
    }

    if (status === 'Done') {
      return tasks.filter(task => {
        // Include done tasks within the specified date range
        return task.myStatus === 'Done' && task.date >= startDateStr;
      });
    }

    // For other statuses, simply filter based on status
    return tasks.filter(task => task.myStatus === status);
  };


  // Function to filter tasks based on their date.
  const filterTasksByDate = (date) => {
    return tasks.filter(task => task.date === date);
  };


// Function to add attachment to tasks.
  const addAttachmentToTask = async (taskId, attachment) => {
    try {
      if (user) {
        const taskRef = doc(firestore, 'users', user.uid, 'tasks', taskId);
        await updateDoc(taskRef, {
          attachments: [...(tasks.find(task => task.id === taskId).attachments || []), attachment]
        });
        setTasks(tasks.map(task =>
          task.id === taskId
            ? { ...task, attachments: [...(task.attachments || []), attachment] }
            : task
        ));
        console.log('Attachment added to task:', { taskId, attachment });
      }
    } catch (error) {
      console.error('Error adding attachment: ', error);
    }
  };


// Function to update attachment to tasks.
  const updateTaskAttachment = async (taskId, updatedAttachment) => {
    try {
      if (user) {
        const taskRef = doc(firestore, 'users', user.uid, 'tasks', taskId);
        await updateDoc(taskRef, {
          attachments: (tasks.find(task => task.id === taskId).attachments || []).map(attachment =>
            attachment.id === updatedAttachment.id ? updatedAttachment : attachment
          )
        });
        setTasks(tasks.map(task =>
          task.id === taskId
            ? {
                ...task,
                attachments: (task.attachments || []).map(attachment =>
                  attachment.id === updatedAttachment.id ? updatedAttachment : attachment
                )
              }
            : task
        ));
        console.log('Attachment updated for task:', { taskId, updatedAttachment });
      }
    } catch (error) {
      console.error('Error updating attachment: ', error);
    }
  };


 // Function to remove attachment from tasks.
  const removeTaskAttachment = async (taskId, attachmentId) => {
    try {
      if (user) {
        const taskRef = doc(firestore, 'users', user.uid, 'tasks', taskId);
        await updateDoc(taskRef, {
          attachments: (tasks.find(task => task.id === taskId).attachments || []).filter(attachment => attachment.id !== attachmentId)
        });
        setTasks(tasks.map(task =>
          task.id === taskId
            ? { ...task, attachments: (task.attachments || []).filter(attachment => attachment.id !== attachmentId) }
            : task
        ));
        console.log('Attachment removed from task:', { taskId, attachmentId });
      }
    } catch (error) {
      console.error('Error removing attachment: ', error);
    }
  };



// Function to sort based on priority.
  const sortTasksByPriority = (tasksList) => {
    return tasksList.sort((a, b) => a.priority - b.priority);
  };


// Function to add worksessions.  
  const addWorkSession = async () => {
    try {
      if (user) {
        const newSession = { id: Date.now(), timestamp: new Date().toISOString() };
        // Add work session to Firestore
        const sessionsRef = collection(firestore, 'users', user.uid, 'workSessions');
        await setDoc(doc(sessionsRef, newSession.id.toString()), newSession);

        // Update local state
        setWorkSessions(prevSessions => [...prevSessions, newSession]);
        console.log('Work session added to Firestore and state:', newSession);
      } else {
        console.log('No user is logged in');
      }
    } catch (error) {
      console.error('Error adding work session: ', error);
    }
  };


// Function to decrease game rounds and locking.
  const decrementGameRounds = () => {
    if (gameRoundsLeft > 1) {
      setGameRoundsLeft(gameRoundsLeft - 1);
    } else {
      setGameRoundsLeft(3);

      if (isGameUnlockedRecently) {
        setTasks(prevTasks =>
          prevTasks.map(task => ({
            ...task,
            isNew: false
          }))
        );
        setIsGameUnlockedRecently(false);
      }

      setTimeout(() => {
        setIsGameUnlocked(false);
      }, 950);
    }
  };




  return (
    <TaskContext.Provider
      value={{
        tasks,
        completedTasksCount,
        completedTasksToday,
        isGameUnlocked,
        gameRoundsLeft,
        workSessions,
        decrementGameRounds,
        addTask,
        updateTask,
        deleteTask,
        filterTasks,
        filterTasksByDate,
        addAttachmentToTask,
        updateTaskAttachment,
        removeTaskAttachment,
        sortTasksByPriority,
        addWorkSession,
        predictTaskCompletion,
        getTaskCompletionRate,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
