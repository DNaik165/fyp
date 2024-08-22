// // // //context/TaskContext.js real

// import React, { createContext, useState, useEffect } from 'react';
// import { firestore, auth } from '../firebase'; // Adjust import paths
// import { doc, setDoc, updateDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';

// export const TaskContext = createContext();

// export const TaskProvider = ({ children }) => {
//   const [tasks, setTasks] = useState([]);
//   const [completedTasksCount, setCompletedTasksCount] = useState(0);
//   const [workSessions, setWorkSessions] = useState([]);
//   const [isGameUnlocked, setIsGameUnlocked] = useState(false);
//   const [gameRoundsLeft, setGameRoundsLeft] = useState(3);
//   const [isGameUnlockedRecently, setIsGameUnlockedRecently] = useState(false);

//   const user = auth.currentUser;

//   useEffect(() => {
//     if (user) {
//       fetchTasks(user.uid);
//     }
//   }, [user]);

//   useEffect(() => {
//     const completedCount = tasks.filter(task => task.myStatus === 'Done' && task.isNew).length;
//     setCompletedTasksCount(completedCount);

//     if (completedCount >= 3 && !isGameUnlocked) {
//       setIsGameUnlocked(true);
//       setIsGameUnlockedRecently(true);
//     }
//   }, [tasks, isGameUnlocked]);

//   const fetchTasks = async (userId) => {
//     try {
//       const tasksRef = collection(firestore, 'users', userId, 'tasks');
//       const querySnapshot = await getDocs(tasksRef);
//       const tasksList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setTasks(tasksList);
//       console.log('Tasks fetched:', tasksList);
//     } catch (error) {
//       console.error('Error fetching tasks: ', error);
//     }
//   };

//   const addTask = async (task) => {
//     try {
//       if (user) {
//         const newTask = { ...task, isNew: true };
//         const taskRef = doc(firestore, 'users', user.uid, 'tasks', task.id);
//         await setDoc(taskRef, newTask);
//         setTasks(prevTasks => [...prevTasks, newTask]);
//         console.log('Task added:', newTask);
//       }
//     } catch (error) {
//       console.error('Error adding task: ', error);
//     }
//   };

//   const updateTask = async (updatedTask) => {
//     try {
//       if (user) {
//         const taskRef = doc(firestore, 'users', user.uid, 'tasks', updatedTask.id);
//         await updateDoc(taskRef, {
//           ...updatedTask,
//           isNew: tasks.find(task => task.id === updatedTask.id).myStatus !== 'Done' && updatedTask.myStatus === 'Done' ? true : updatedTask.isNew
//         });
//         setTasks(tasks.map(task =>
//           task.id === updatedTask.id
//             ? { ...updatedTask, isNew: task.myStatus !== 'Done' && updatedTask.myStatus === 'Done' ? true : updatedTask.isNew }
//             : task
//         ));
//         console.log('Task updated:', updatedTask);
//       }
//     } catch (error) {
//       console.error('Error updating task: ', error);
//     }
//   };

//   const deleteTask = async (taskId) => {
//     try {
//       if (user) {
//         const taskRef = doc(firestore, 'users', user.uid, 'tasks', taskId);
//         await deleteDoc(taskRef);
//         setTasks(tasks.filter(task => task.id !== taskId));
//         console.log('Task deleted:', taskId);
//       }
//     } catch (error) {
//       console.error('Error deleting task: ', error);
//     }
//   };

//   const filterTasks = (status) => {
//     if (status === 'All') {
//       return tasks;
//     }
//     return tasks.filter(task => task.myStatus === status);
//   };

//   const filterTasksByDate = (date) => {
//     return tasks.filter(task => task.date === date);
//   };

//   const addAttachmentToTask = async (taskId, attachment) => {
//     try {
//       if (user) {
//         const taskRef = doc(firestore, 'users', user.uid, 'tasks', taskId);
//         await updateDoc(taskRef, {
//           attachments: [...(tasks.find(task => task.id === taskId).attachments || []), attachment]
//         });
//         setTasks(tasks.map(task =>
//           task.id === taskId
//             ? { ...task, attachments: [...(task.attachments || []), attachment] }
//             : task
//         ));
//         console.log('Attachment added to task:', { taskId, attachment });
//       }
//     } catch (error) {
//       console.error('Error adding attachment: ', error);
//     }
//   };

//   const updateTaskAttachment = async (taskId, updatedAttachment) => {
//     try {
//       if (user) {
//         const taskRef = doc(firestore, 'users', user.uid, 'tasks', taskId);
//         await updateDoc(taskRef, {
//           attachments: (tasks.find(task => task.id === taskId).attachments || []).map(attachment =>
//             attachment.id === updatedAttachment.id ? updatedAttachment : attachment
//           )
//         });
//         setTasks(tasks.map(task =>
//           task.id === taskId
//             ? {
//                 ...task,
//                 attachments: (task.attachments || []).map(attachment =>
//                   attachment.id === updatedAttachment.id ? updatedAttachment : attachment
//                 )
//               }
//             : task
//         ));
//         console.log('Attachment updated for task:', { taskId, updatedAttachment });
//       }
//     } catch (error) {
//       console.error('Error updating attachment: ', error);
//     }
//   };

//   const removeTaskAttachment = async (taskId, attachmentId) => {
//     try {
//       if (user) {
//         const taskRef = doc(firestore, 'users', user.uid, 'tasks', taskId);
//         await updateDoc(taskRef, {
//           attachments: (tasks.find(task => task.id === taskId).attachments || []).filter(attachment => attachment.id !== attachmentId)
//         });
//         setTasks(tasks.map(task =>
//           task.id === taskId
//             ? { ...task, attachments: (task.attachments || []).filter(attachment => attachment.id !== attachmentId) }
//             : task
//         ));
//         console.log('Attachment removed from task:', { taskId, attachmentId });
//       }
//     } catch (error) {
//       console.error('Error removing attachment: ', error);
//     }
//   };

//   const sortTasksByPriority = (tasksList) => {
//     return tasksList.sort((a, b) => a.priority - b.priority);
//   };

//   // const addWorkSession = async () => {
//   //   try {
//   //     const newSession = { id: Date.now(), timestamp: new Date().toISOString() };
//   //     setWorkSessions(prevSessions => [...prevSessions, newSession]);
//   //     console.log('Work session added:', newSession);
//   //   } catch (error) {
//   //     console.error('Error adding work session: ', error);
//   //   }
//   // };

//   const addWorkSession = async () => {
//     try {
//       if (user) {
//         const newSession = { id: Date.now(), timestamp: new Date().toISOString() };
//         // Add work session to Firestore
//         const sessionsRef = collection(firestore, 'users', user.uid, 'workSessions');
//         await setDoc(doc(sessionsRef, newSession.id.toString()), newSession);
        
//         // Update local state
//         setWorkSessions(prevSessions => [...prevSessions, newSession]);
//         console.log('Work session added to Firestore and state:', newSession);
//       } else {
//         console.log('No user is logged in');
//       }
//     } catch (error) {
//       console.error('Error adding work session: ', error);
//     }
//   };
  

//   const decrementGameRounds = () => {
//     if (gameRoundsLeft > 1) {
//       setGameRoundsLeft(gameRoundsLeft - 1);
//     } else {
//       setGameRoundsLeft(3);

//       if (isGameUnlockedRecently) {
//         setTasks(prevTasks =>
//           prevTasks.map(task => ({
//             ...task,
//             isNew: false
//           }))
//         );
//         setIsGameUnlockedRecently(false);
//       }

//       setTimeout(() => {
//         setIsGameUnlocked(false);
//       }, 5000);
//     }
//   };

//   return (
//     <TaskContext.Provider
//       value={{
//         tasks,
//         completedTasksCount,
//         isGameUnlocked,
//         gameRoundsLeft,
//         workSessions,
//         decrementGameRounds,
//         addTask,
//         updateTask,
//         deleteTask,
//         filterTasks,
//         filterTasksByDate,
//         addAttachmentToTask,
//         updateTaskAttachment,
//         removeTaskAttachment,
//         sortTasksByPriority,
//         addWorkSession
//       }}
//     >
//       {children}
//     </TaskContext.Provider>
//   );
// };



import React, { createContext, useState, useEffect } from 'react';
import { firestore, auth } from '../firebase'; // Adjust import paths
import { doc, setDoc, updateDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [workSessions, setWorkSessions] = useState([]);
  const [isGameUnlocked, setIsGameUnlocked] = useState(false);
  const [gameRoundsLeft, setGameRoundsLeft] = useState(3);
  const [isGameUnlockedRecently, setIsGameUnlockedRecently] = useState(false);

  const [user, setUser] = useState(auth.currentUser);

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

  useEffect(() => {
    const completedCount = tasks.filter(task => task.myStatus === 'Done' && task.isNew).length;
    setCompletedTasksCount(completedCount);

    if (completedCount >= 3 && !isGameUnlocked) {
      setIsGameUnlocked(true);
      setIsGameUnlockedRecently(true);
    }
  }, [tasks, isGameUnlocked]);

  const fetchTasks = async (userId) => {
    try {
      const tasksRef = collection(firestore, 'users', userId, 'tasks');
      const querySnapshot = await getDocs(tasksRef);
      const tasksList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksList);
      console.log('Tasks fetched:', tasksList);
    } catch (error) {
      console.error('Error fetching tasks: ', error);
    }
  };

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

  const filterTasks = (status) => {
    if (status === 'All') {
      return tasks;
    }
    return tasks.filter(task => task.myStatus === status);
  };

  const filterTasksByDate = (date) => {
    return tasks.filter(task => task.date === date);
  };

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

  const sortTasksByPriority = (tasksList) => {
    return tasksList.sort((a, b) => a.priority - b.priority);
  };

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
      }, 900);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        completedTasksCount,
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
        addWorkSession
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
