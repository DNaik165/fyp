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
  
  // const sortTasksByPriority = (tasksList) => {
  //   return tasksList.sort((a, b) => {
  //     const priorityOrder = { High: 1, Medium: 2, Low: 3 };
  //     return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
  //   });
  // };
  const sortTasksByPriority = (tasksList) => {
    return tasksList.sort((a, b) => a.priority - b.priority);
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
        sortTasksByPriority,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
