// //context/TaskContext.js real
import React, { createContext, useState } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
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

  // Function to add an attachment to a task
  const addAttachmentToTask = (taskId, attachment) => {
    setTasks(tasks.map(task => 
      task.id === taskId
        ? { ...task, attachments: [...(task.attachments || []), attachment] }
        : task
    ));
  };

  // Function to update an attachment of a task
  const updateTaskAttachment = (taskId, updatedAttachment) => {
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
  };

  // Function to remove an attachment from a task
  const removeTaskAttachment = (taskId, attachmentId) => {
    setTasks(tasks.map(task => 
      task.id === taskId
        ? { 
            ...task, 
            attachments: (task.attachments || []).filter(attachment => attachment.id !== attachmentId)
          }
        : task
    ));
  };


  const getDailyTasks = () => {
    const today = format(new Date(), 'yyyy-MM-dd'); // Format today's date
    const dailyTasks = tasks.filter(task => task.date === today);
    
    // Sort tasks by priority (if applicable) and take the top 3
    const sortedTasks = dailyTasks.sort((a, b) => a.priority - b.priority);
    return sortedTasks.slice(0, 3);
  };

  return (
    <TaskContext.Provider 
      value={{
        tasks, 
        addTask, 
        updateTask, 
        deleteTask, 
        filterTasks, 
        filterTasksByDate,
        addAttachmentToTask,
        updateTaskAttachment,
        removeTaskAttachment,
        getDailyTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
