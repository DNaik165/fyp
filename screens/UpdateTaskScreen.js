// // // // screens/UpdateTaskScreen.js
// import React, { useState, useContext } from 'react';
// import { View, TextInput, TouchableOpacity, Text, StyleSheet, Modal, Button, Image } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { TaskContext } from '../context/TaskContext';
// import { Picker } from '@react-native-picker/picker';
// import * as ImagePicker from 'expo-image-picker';
// import * as DocumentPicker from 'expo-document-picker';

// const UpdateTaskScreen = ({ route, navigation }) => {
//   const { task } = route.params;
//   const { updateTask, deleteTask } = useContext(TaskContext);

//   const [taskName, setTaskName] = useState(task.taskName);
//   const [taskDetails, setTaskDetails] = useState(task.taskDetails);
//   const [taskStatus, setTaskStatus] = useState(task.myStatus);
//   const [taskDate, setTaskDate] = useState(new Date(task.date)); // Initialize with existing task date
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showAttachmentModal, setShowAttachmentModal] = useState(false);
//   const [attachments, setAttachments] = useState(task.attachments || []);

//   const handleUpdateTask = () => {
//     const updatedTask = {
//       ...task,
//       taskName,
//       taskDetails,
//       myStatus: taskStatus,
//       date: taskDate.toISOString().split('T')[0], // Include updated date
//       attachments, // Include updated attachments
//     };
//     updateTask(updatedTask);
//     navigation.goBack();
//   };

//   const handleDeleteTask = () => {
//     deleteTask(task.id);
//     navigation.goBack();
//   };

//   const handleTakePhoto = async () => {
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== 'granted') {
//       alert('Camera permission is required!');
//       return;
//     }

//     let result = await ImagePicker.launchCameraAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });

//     if (!result.canceled && result.assets && result.assets.length > 0) {
//       const { uri } = result.assets[0];
//       console.log('Photo taken:', uri);
//       setAttachments([...attachments, { uri }]); // Add new image to attachments
//     }
//     setShowAttachmentModal(false);
//   };

//   const handlePickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       alert('Gallery permission is required!');
//       return;
//     }

//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });

//     if (!result.canceled && result.assets && result.assets.length > 0) {
//       const { uri } = result.assets[0];
//       console.log('Image selected:', uri);
//       setAttachments([...attachments, { uri }]); // Add new image to attachments
//     }
//     setShowAttachmentModal(false);
//   };

//   const handlePickFile = async () => {
//     try {
//       // Request permission to access document files (if required)
//       const result = await DocumentPicker.getDocumentAsync();

//       // Log the full result to inspect the outcome
//       console.log('Document picker result:', result);

//       // Check if the result is successful
//       if (!result.canceled && result.assets && result.assets.length > 0) {
//         // Extract the first document from the assets array
//         const file = result.assets[0];
//         console.log('File selected:', file.uri);

//         // Handle the selected file (e.g., save URI, display file info, etc.)
//         setAttachments([...attachments, { uri: file.uri }]); // Add new file to attachments
//       } else {
//         // Handle cases where no file is selected or the operation was canceled
//         console.log('File selection was canceled or failed.');
//       }
//     } catch (error) {
//       // Handle any errors that may occur
//       console.error('Error picking file:', error);
//     }

//     // Close the attachment modal after handling the file
//     setShowAttachmentModal(false);
//   };

//   const handleRemoveAttachment = (uri) => {
//     setAttachments(attachments.filter(att => att.uri !== uri));
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         placeholder="Task Name"
//         value={taskName}
//         onChangeText={setTaskName}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Task Details"
//         value={taskDetails}
//         onChangeText={setTaskDetails}
//         style={styles.textArea}
//         multiline
//       />
//       <View style={styles.pickerContainer}>
//         <Text>Status:</Text>
//         <Picker
//           selectedValue={taskStatus}
//           style={styles.picker}
//           onValueChange={(itemValue) => setTaskStatus(itemValue)}
//         >
//           <Picker.Item label="Pending" value="Pending" />
//           <Picker.Item label="In Progress" value="In Progress" />
//           <Picker.Item label="Done" value="Done" />
//         </Picker>
//       </View>

//       <TouchableOpacity
//         style={styles.addButton}
//         onPress={() => setShowDatePicker(true)}
//       >
//         <Text style={styles.buttonTextD}>Select Date</Text>
//       </TouchableOpacity>

//       {showDatePicker && (
//         <DateTimePicker
//           value={taskDate}
//           mode="date"
//           display="calendar"
//           onChange={(event, selectedDate) => {
//             setShowDatePicker(false);
//             if (selectedDate) {
//               setTaskDate(selectedDate);
//             }
//           }}
//         />
//       )}

//       <Text style={styles.dateText}>
//         {taskDate.toISOString().split('T')[0]} {/* Display the selected date */}
//       </Text>

//       <TouchableOpacity
//         style={styles.addButton}
//         onPress={() => setShowAttachmentModal(true)}
//       >
//         <Text style={styles.buttonTextD}>Add Attachment</Text>
//       </TouchableOpacity>

//       {attachments.length > 0 && (
//         <View style={styles.attachmentsContainer}>
//           {attachments.map((attachment, index) => (
//             <View key={index} style={styles.attachmentWrapper}>
//               <Image
//                 source={{ uri: attachment.uri }}
//                 style={styles.attachmentImage}
//               />
//               <TouchableOpacity onPress={() => handleRemoveAttachment(attachment.uri)} style={styles.removeButton}>
//                 <Text style={styles.removeButtonText}>Remove</Text>
//               </TouchableOpacity>
//             </View>
//           ))}
//         </View>
//       )}

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={styles.button} onPress={handleUpdateTask}>
//           <Text style={styles.buttonText}>Update Task</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteTask}>
//           <Text style={styles.buttonText}>Delete Task</Text>
//         </TouchableOpacity>
//       </View>

//       <Modal
//         visible={showAttachmentModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowAttachmentModal(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Add Attachment</Text>
//             <Button title="Take Photo" onPress={handleTakePhoto} />
//             <Button title="Attach from Gallery" onPress={handlePickImage} />
//             <Button title="Attach a File" onPress={handlePickFile} />
//             <Button title="Cancel" onPress={() => setShowAttachmentModal(false)} />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   pickerContainer: {
//     marginBottom: 14,
//   },
//   input: {
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//     paddingVertical: 8,
//     marginBottom: 16,
//   },
//   textArea: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 8,
//     marginBottom: 16,
//     textAlignVertical: 'top',
//     minHeight: 100,
//     borderRadius: 8,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   button: {
//     backgroundColor: 'lightblue',
//     padding: 16,
//     borderRadius: 8,
//     flex: 1,
//     alignItems: 'center',
//     margin: 4,
//   },
//   addButton: {
//     backgroundColor: 'lightblue',
//     padding: 15,
//     borderRadius: 8,
//     marginVertical: 8,
//   },
//   buttonTextD: {
//     color: 'white',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   deleteButton: {
//     backgroundColor: 'salmon',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//   },
//   dateText: {
//     fontSize: 16,
//     marginVertical: 8,
//     textAlign: 'center',
//     color: 'white',
//     backgroundColor: 'lightblue',
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 8,
//     width: '80%',
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 18,
//     marginBottom: 20,
//   },
//   attachmentsContainer: {
//     marginTop: 16,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   attachmentWrapper: {
//     position: 'relative',
//     margin: 5,
//   },
//   attachmentImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 8,
//   },
//   removeButton: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 20,
//     padding: 5,
//   },
//   removeButtonText: {
//     color: 'white',
//     fontSize: 12,
//   },
// });

// export default UpdateTaskScreen;
// // 


import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Modal, Button, Image, Share, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TaskContext } from '../context/TaskContext';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';


const priorityColors = {
  1: 'crimson', // High
  2: 'plum', // Medium
  3: 'pink', // Low
};


const UpdateTaskScreen = ({ route, navigation }) => {
  const { task } = route.params;
  const { updateTask, deleteTask } = useContext(TaskContext);

  const [taskName, setTaskName] = useState(task.taskName);
  const [taskDetails, setTaskDetails] = useState(task.taskDetails);
  const [taskStatus, setTaskStatus] = useState(task.myStatus);
  const [taskDate, setTaskDate] = useState(new Date(task.date));
  const [taskPriority, setTaskPriority] =  useState(task.priority);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [attachments, setAttachments] = useState(task.attachments || []);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  

  const handleUpdateTask = () => {
    const updatedTask = {
      ...task,
      taskName,
      taskDetails,
      myStatus: taskStatus,
      date: taskDate.toISOString().split('T')[0],
      priority: taskPriority,
      attachments,
    };
    updateTask(updatedTask);
    navigation.goBack();
  };

  const handleDeleteTask = () => {
    deleteTask(task.id);
    navigation.goBack();
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const { uri } = result.assets[0];
      setAttachments([...attachments, { uri }]);
    }
    setShowAttachmentModal(false);
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Gallery permission is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const { uri } = result.assets[0];
      setAttachments([...attachments, { uri }]);
    }
    setShowAttachmentModal(false);
  };

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setAttachments([...attachments, { uri: file.uri }]);
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
    setShowAttachmentModal(false);
  };

  const handleAttachmentPress = (attachment) => {
    setSelectedAttachment(attachment);
    console.log('Selected Attachment:', attachment);
    setShowPreviewModal(true);
  };

  const handleShareAttachment = async () => {
    if (selectedAttachment) {
      try {
        await Share.share({
          url: selectedAttachment.uri,
        });
      } catch (error) {
        console.error('Error sharing attachment:', error);
      }
    }
  };

  const handleDeleteAttachment = () => {
    setAttachments(attachments.filter((attachment) => attachment.uri !== selectedAttachment.uri));
    setShowPreviewModal(false);
  };

 
  
  
  return (
    <ScrollView>
    <View style={styles.container}>
      <TextInput
        placeholder="Task Name"
        value={taskName}
        onChangeText={setTaskName}
        style={styles.input}
      />
      <TextInput
        placeholder="Task Details"
        value={taskDetails}
        onChangeText={setTaskDetails}
        style={styles.textArea}
        multiline
      />
      <View style={styles.pickerContainer}>
        <Text>Status:</Text>
        <Picker
          selectedValue={taskStatus}
          style={styles.picker}
          onValueChange={(itemValue) => setTaskStatus(itemValue)}
        >
          <Picker.Item label="Pending" value="Pending" />
          <Picker.Item label="In Progress" value="Progress" />
          <Picker.Item label="Done" value="Done" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text>Priority:</Text>
        <Picker
          selectedValue={taskPriority}
          style={styles.picker}
          onValueChange={(itemValue) => setTaskPriority(itemValue)}
        >
          <Picker.Item label="High" value={1} color={priorityColors[1]}/>
          <Picker.Item label="Medium" value={2} color={priorityColors[2]}/>
          <Picker.Item label="Low" value={3} color={priorityColors[3]}/>
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.buttonText}>Select Date</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={taskDate}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setTaskDate(selectedDate);
            }
          }}
        />
      )}

      <Text style={styles.dateText}>
        {taskDate.toISOString().split('T')[0]}
      </Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAttachmentModal(true)}
      >
        <Text style={styles.buttonTextD}>Add Attachment</Text>
      </TouchableOpacity>

      {/* {attachments.length > 0 && (
        <View style={styles.attachmentsContainer}>
          {attachments.map((attachment, index) => (
            <TouchableOpacity key={index} onPress={() => handleAttachmentPress(attachment)}>
              <Image
                source={{ uri: attachment.uri }}
                style={styles.attachmentImage}
              />
            </TouchableOpacity>
          ))}
        </View>
      )} */}
      {attachments.length > 0 && (
  <View style={styles.attachmentsContainer}>
    {attachments.map((attachment, index) => {
      console.log('Attachments:', attachments); // Log all attachments
      return (
        <TouchableOpacity key={index} onPress={() => handleAttachmentPress(attachment)}>
          <Image
            source={{ uri: attachment.uri }}
            style={styles.attachmentImage}
          />
        </TouchableOpacity>
      );
    })}
  </View>
)}


      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleUpdateTask}>
          <Text style={styles.buttonText}>Update Task</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteTask}>
          <Text style={styles.buttonText}>Delete Task</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showAttachmentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAttachmentModal(false)}
      >

<View style={styles.modalContainer}>
  <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>Add Attachment</Text>

    <TouchableOpacity style={styles.iconButton} onPress={handleTakePhoto}>
      <Ionicons name="camera-outline" style={styles.iconButtonText} />
      {/* <Text style={styles.iconButtonText}>Take Photo</Text> */}
    </TouchableOpacity>

    <TouchableOpacity style={styles.iconButton} onPress={handlePickImage}>
      <Ionicons name="image-outline" style={styles.iconButtonText} />
      {/* <Text style={styles.iconButtonText}>Attach from Gallery</Text> */}
    </TouchableOpacity>

    <TouchableOpacity style={styles.iconButton} onPress={handlePickFile}>
      <MaterialIcons name="attach-file" style={styles.iconButtonText} />
      {/* <Text style={styles.iconButtonText}>Attach a File</Text> */}
    </TouchableOpacity>

    <TouchableOpacity style={styles.iconButton} onPress={() => setShowAttachmentModal(false)}>
      <Ionicons name="close" style={styles.iconButtonText}  />
      {/* <Text style={styles.iconButtonText}>Cancel</Text> */}
    </TouchableOpacity>
  </View>
</View>

      </Modal>

      {/* <AttachmentPreviewModal
      visible={showPreviewModal}
      onClose={() => setShowPreviewModal(false)}
      attachment={selectedAttachment}
      onSave={handleSaveAnnotations}
    /> */}

      <Modal
        visible={showPreviewModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPreviewModal(false)}
      >
        <View style={styles.previewModalContainer}>
          <View style={styles.previewModalContent}>
            {selectedAttachment && (
              <Image
                source={{ uri: selectedAttachment.uri }}
                style={styles.previewImage}
              />
            )}

            <View style={styles.previewButtonContainer}>
              <TouchableOpacity onPress={handleDeleteAttachment}>
              <Ionicons name="trash-outline" size={24} color="pink" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShareAttachment}>
              <Ionicons name="share-outline" size={24} color="lightblue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowPreviewModal(false)}>
              <Ionicons name="close" size={24} color="grey" />
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
   container: {
    flex: 1,
    padding: 16,
  },
  pickerContainer: {
    marginBottom: 14,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    textAlignVertical: 'top',
    minHeight: 100,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    margin: 4,
  },
  addButton: {
    backgroundColor: 'lightblue',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonTextD: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: 'pink',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 16,
    marginVertical: 8,
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'lightblue',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '60%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: 'lightblue',
    borderRadius: 8,
    padding: 8,
    color: 'white'
  },
  attachmentsContainer: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  attachmentWrapper: {
    position: 'relative',
    margin: 5,
  },
  attachmentImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    flexWrap: 'wrap',
  },
  attachmentImage: {
    width: 50,
    height: 50,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  previewModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  previewModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  previewButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: 'lightblue',
    borderRadius: 10,
    padding: 5,

  },
  iconButtonText: {
    fontSize: 24,
     color: 'white'

  },
});

export default UpdateTaskScreen;
