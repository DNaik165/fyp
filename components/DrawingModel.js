// // components/DrawingModel.js
import React, { useState } from 'react';
import { Modal, View, Text, Image, TextInput, TouchableOpacity, StyleSheet, PanResponder } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const AttachmentPreviewModal = ({ visible, onClose, attachment, onSave }) => {
    console.log('Attachment in Modal:', attachment);
  const [annotations, setAnnotations] = useState([]);

  const [currentText, setCurrentText] = useState('');
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);

  const addTextAnnotation = () => {
    if (currentText.trim()) {
      const newAnnotation = {
        id: Math.random().toString(),
        text: currentText,
        position: { x: 50, y: 50 },
      };
      setAnnotations([...annotations, newAnnotation]);
      setCurrentText('');
    }
  };

  const deleteAnnotation = (id) => {
    setAnnotations(annotations.filter((annotation) => annotation.id !== id));
  };

  const handleMove = (id, gestureState) => {
    setAnnotations(annotations.map(annotation =>
      annotation.id === id
        ? { ...annotation, position: { x: annotation.position.x + gestureState.dx, y: annotation.position.y + gestureState.dy } }
        : annotation
    ));
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

  const panResponder = (id) => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => handleMove(id, gestureState),
    onPanResponderRelease: () => setSelectedAnnotation(null),
  });

  if (!attachment || !attachment.uri) {
    return (
      <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>No attachment available</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image source={{ uri: attachment.uri }} style={styles.attachmentImage} />

          {annotations.map((annotation) => (
            <TextInput
              key={annotation.id}
              style={[
                styles.annotationText,
                { top: annotation.position.y, left: annotation.position.x },
              ]}
              value={annotation.text}
              onChangeText={(text) => setAnnotations(annotations.map(a => a.id === annotation.id ? { ...a, text } : a))}
              onFocus={() => setSelectedAnnotation(annotation.id)}
              {...panResponder(annotation.id).panHandlers}
            />
          ))}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add text"
              value={currentText}
              onChangeText={setCurrentText}
            />
            <TouchableOpacity style={styles.addButton} onPress={addTextAnnotation}>
              <Text style={styles.addButtonText}>Add Text</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.previewButtonContainer}>
              <TouchableOpacity onPress={handleDeleteAttachment}>
              <Ionicons name="trash-outline" size={24} color="pink" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShareAttachment}>
              <Ionicons name="share-outline" size={24} color="lightblue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onSave(annotations)}>
              <FontAwesome name="save" size={24} color="lightblue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="grey" />
              </TouchableOpacity>
            </View>

          
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  attachmentImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: 'lightblue',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
  },
  annotationText: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    padding: 5,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: 'lightgreen',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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
    paddingTop: 10
  },
});

export default AttachmentPreviewModal;




// components/DrawingModel.js
// import React, { useState } from 'react';
// import { Modal, View, Text, Image, TextInput, TouchableOpacity, StyleSheet, PanResponder } from 'react-native';
// import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

// const AttachmentPreviewModal = ({ visible, onClose, attachment, onSave }) => {
//   console.log('Attachment in Modal:', JSON.stringify(attachment, null, 2)); // For debugging

//   const [annotations, setAnnotations] = useState(attachment?.annotations || []);
//   const [currentText, setCurrentText] = useState('');
//   const [selectedAnnotation, setSelectedAnnotation] = useState(null);

//   const addTextAnnotation = () => {
//     if (currentText.trim()) {
//       const newAnnotation = {
//         id: Math.random().toString(),
//         text: currentText,
//         position: { x: 50, y: 50 },
//       };
//       setAnnotations([...annotations, newAnnotation]);
//       setCurrentText('');
//     }
//   };

//   const deleteAnnotation = (id) => {
//     setAnnotations(annotations.filter((annotation) => annotation.id !== id));
//   };

//   const handleMove = (id, gestureState) => {
//     setAnnotations(annotations.map(annotation =>
//       annotation.id === id
//         ? { ...annotation, position: { x: annotation.position.x + gestureState.dx, y: annotation.position.y + gestureState.dy } }
//         : annotation
//     ));
//   };

//   const panResponder = (id) => PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onPanResponderMove: (_, gestureState) => handleMove(id, gestureState),
//     onPanResponderRelease: () => setSelectedAnnotation(null),
//   });

//   if (!attachment || !attachment.uri) {
//     return (
//       <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text>No attachment available</Text>
//             <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//               <Text style={styles.buttonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     );
//   }

//   return (
//     <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <Image source={{ uri: attachment.uri }} style={styles.attachmentImage} />

//           {annotations.map((annotation) => (
//             <TextInput
//               key={annotation.id}
//               style={[
//                 styles.annotationText,
//                 { top: annotation.position.y, left: annotation.position.x },
//               ]}
//               value={annotation.text}
//               onChangeText={(text) => setAnnotations(annotations.map(a => a.id === annotation.id ? { ...a, text } : a))}
//               onFocus={() => setSelectedAnnotation(annotation.id)}
//               {...panResponder(annotation.id).panHandlers}
//             />
//           ))}

//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="Add text"
//               value={currentText}
//               onChangeText={setCurrentText}
//             />
//             <TouchableOpacity style={styles.addButton} onPress={addTextAnnotation}>
//               <Text style={styles.addButtonText}>Add Text</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.previewButtonContainer}>
//             <TouchableOpacity onPress={() => onSave(annotations)}>
//               <FontAwesome name="save" size={24} color="lightblue" />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={onClose}>
//               <Ionicons name="close" size={24} color="grey" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     width: '90%',
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 10,
//   },
//   attachmentImage: {
//     width: '100%',
//     height: 300,
//     borderRadius: 10,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 8,
//     borderRadius: 5,
//   },
//   addButton: {
//     backgroundColor: 'lightblue',
//     padding: 8,
//     borderRadius: 5,
//     marginLeft: 10,
//   },
//   addButtonText: {
//     color: 'white',
//   },
//   annotationText: {
//     position: 'absolute',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     color: 'white',
//     padding: 5,
//     borderRadius: 5,
//   },
//   previewButtonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     paddingTop: 10
//   },
// });

// export default AttachmentPreviewModal;


