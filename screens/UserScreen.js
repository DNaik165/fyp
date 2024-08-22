// screens/UserProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { auth, firestore } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const UserProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const { logout } = useAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const userDoc = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setNewName(data.name);
        } else {
          console.log('No such document!');
        }
        setLoading(false);
      };

      fetchData();
    } else {
      // Handle the case when user is null
      setLoading(false);
    }
  }, [user]);

  const handleSaveName = async () => {
    if (user && newName.trim() !== '') {
      const userDoc = doc(firestore, 'users', user.uid);

      try {
        await updateDoc(userDoc, { name: newName.trim() });
        setUserData((prevState) => ({ ...prevState, name: newName.trim() }));
        alert('Name updated successfully!');
      } catch (error) {
        console.error("Error updating document: ", error);
        alert('Failed to update name. Please try again.');
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

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Text>No user is logged in.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={newName}
        onChangeText={setNewName}
      />
      <Button title="Save Name" onPress={handleSaveName} />
      <Text style={styles.info}>Email: {user.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginVertical: 10,
  },
});

export default UserProfileScreen;
