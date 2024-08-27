// // // screens/UserProfileScreen.js


import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { auth, firestore, storage } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';

const UserProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({ name: '', email: '', birthday: '', profilePic: '' });
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newBirthday, setNewBirthday] = useState('');
  const [profilePicUri, setProfilePicUri] = useState(null);
  const { logout } = useAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const userDoc = doc(firestore, 'users', user.uid);
          const docSnap = await getDoc(userDoc);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setNewName(data.name || '');
            setNewBirthday(data.birthday || '');
            setProfilePicUri(data.profilePic || null);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleSaveDetails = async () => {
    if (user && newName.trim() !== '') {
      try {
        const userDoc = doc(firestore, 'users', user.uid);
        await updateDoc(userDoc, { name: newName.trim(), birthday: newBirthday.trim(), profilePic: profilePicUri });
        setUserData((prevState) => ({
          ...prevState,
          name: newName.trim(),
          birthday: newBirthday.trim(),
          profilePic: profilePicUri
        }));
        alert('Details updated successfully!');
      } catch (error) {
        console.error("Error updating document: ", error);
        alert('Failed to update details. Please try again.');
      }
    } else {
      alert('Name cannot be empty.');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      logout(); // Clear auth state
      navigation.navigate('Auth');
    } catch (error) {
      console.error('Error signing out: ', error);
      alert('Failed to log out. Please try again.');
    }
  };


  const handleProfilePicUpload = async () => {
    try {
      // Open the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
  
      console.log('ImagePicker result:', result);
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const { uri } = result.assets[0];
        setProfilePicUri(uri);
  
        // Fetch the image and convert to blob
        const response = await fetch(uri);
        const blob = await response.blob();
  
        // Verify the blob
        console.log('Blob created:', blob);
  
        // Upload the image to Firebase Storage
        const fileRef = ref(storage, `profilePics/${user.uid}`);
        await uploadBytes(fileRef, blob);
  
        // Get the download URL
        const downloadURL = await getDownloadURL(fileRef);
  
        // Update Firestore with the new profile picture URL
        const userDoc = doc(firestore, 'users', user.uid);
        await updateDoc(userDoc, { profilePic: downloadURL });
        setUserData(prevState => ({ ...prevState, profilePic: downloadURL }));
        alert('Profile picture uploaded successfully!');
      } else {
        console.error('ImagePicker result is invalid:', result);
      }
    } catch (error) {
      // console.error('Error uploading profile picture:', error);
      // alert('Failed to upload profile picture. Please try again.');
    }
  };
  

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user is logged in.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        {profilePicUri ? (
          <Image source={{ uri: profilePicUri }} style={styles.profilePic} />
        ) : (
          <View style={styles.profilePicPlaceholder} />
        )}
        <TouchableOpacity onPress={handleProfilePicUpload} style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Upload Profile Picture</Text>
        </TouchableOpacity>
        <Text style={styles.header}>{userData.name}</Text>
        <Text style={styles.info}>Email: {user.email}</Text>
        <Text style={styles.info}>Birthday: {userData.birthday || 'Not set'}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Update your name"
        value={newName}
        onChangeText={setNewName}
      />
      <TextInput
        style={styles.input}
        placeholder="Update your birthday"
        value={newBirthday}
        onChangeText={setNewBirthday}
      />
       <TouchableOpacity style={styles.uploadButton} onPress={handleSaveDetails}>
        <Text style={styles.uploadButtonText}>Save Details</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.uploadButton} onPress={handleLogout}>
        <Text style={styles.uploadButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5', // Light background color
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profilePicPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#fff',
    // fontWeight: 'bold',
    fontFamily: 'RubikBubbles-Regular',
  },
  header: {
    fontSize: 28,
    fontFamily: 'RubikBubbles-Regular',
    color: 'lightblue',
  },
  info: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'RubikBubbles-Regular',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
  },
});

export default UserProfileScreen;

