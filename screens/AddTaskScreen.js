// // // // screens/AddTaskScreen.js real

import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Button, Image, ScrollView } from 'react-native';
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

const AddTaskScreen = ({ navigation }) => {
  const { addTask } = useContext(TaskContext);
  const [taskName, setTaskName] = useState('');
  const [taskDetails, setTaskDetails] = useState('');
  const [taskStatus, setTaskStatus] = useState('Pending');
  const [taskDate, setTaskDate] = useState(new Date());
  const [taskPriority, setTaskPriority] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const handleAddTask = () => {
    const newTask = {
      id: Date.now().toString(),
      taskName,
      taskDetails,
      myStatus: taskStatus,
      date: taskDate.toISOString().split('T')[0],
      priority: taskPriority,
      attachments,
    };
    addTask(newTask);
    setTaskName('');
    setTaskDetails('');
    setTaskStatus('Pending');
    setTaskDate(new Date());
    setTaskPriority(1);
    setAttachments([]);
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
      console.log('Photo taken:', uri);
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
      console.log('Image selected:', uri);
      setAttachments([...attachments, { uri }]);
    }
    setShowAttachmentModal(false);
  };


  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: [
          "text/plain",
          "text/csv",
          "text/html",
          "text/xml",
          "application/pdf",
          "application/xml",
          "video/*",
          "audio/*"
        ]
      });
      console.log('Document picker result:', result);
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        console.log('File selected:', fileUri);
        setAttachments([...attachments, { uri: fileUri }]);
      } else {
        console.log('File selection was canceled or failed.');
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
    setShowAttachmentModal(false);
  };
  



  const handleRemoveAttachment = (uri) => {
    setAttachments(attachments.filter(att => att.uri !== uri));
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

      {attachments.length > 0 && (
        <View style={styles.attachmentsContainer}>
          {attachments.map((attachment, index) => (
            <View key={index} style={styles.attachmentWrapper}>
              <Image
                source={{ uri: attachment.uri }}
                style={styles.attachmentImage}
              />
              <TouchableOpacity onPress={() => handleRemoveAttachment(attachment.uri)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddTask}
      >
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>

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
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  pickerContainer: {
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  addButton: {
    backgroundColor: 'lightblue',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonTextD: {
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

export default AddTaskScreen;
