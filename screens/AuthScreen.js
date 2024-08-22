// // // screens/AuthScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';
import { useAuth } from '../context/AuthContext';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Switch between register and login
  const [error, setError] = useState(null); // State to handle errors
  const navigation = useNavigation();
  const { login, logout } = useAuth();

  useEffect(() => {
    // Clear inputs and errors on logout
    if (!auth.currentUser) {
      setEmail('');
      setPassword('');
      setName('');
      setError(null); // Clear error on logout
    }
  }, [auth.currentUser]);

  const saveUserData = async (user) => {
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        // Only set data if the document doesn't exist (new registration)
        await setDoc(userDocRef, {
          name: name, // Save the name provided during registration
          email: user.email,
        });
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleAuth = async () => {
    try {
      setError(null); // Clear previous errors before attempting auth
      let userCredential;
      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Save user data after successful registration
        await saveUserData(userCredential.user);
        login(email, password); // Update context with login info
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        login(email, password); // Update context with login info
      }

      navigation.navigate('Home');
    } catch (error) {
      setError(getErrorMessage(error.code));
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      logout(); // Clear auth state
      setEmail('');
      setPassword('');
      setName('');
      setError(null); // Clear error on logout
      navigation.navigate('Auth');
    } catch (error) {
      console.error('Error signing out: ', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'The email address is not valid. Please check and try again.';
      case 'auth/user-not-found':
        return 'No user found with this email address. Please register first.';
      case 'auth/wrong-password':
        return 'The password is incorrect. Please try again.';
      case 'auth/email-already-in-use':
        return 'This email address is already in use. Please use a different email.';
      case 'auth/weak-password':
        return 'The password is too weak. Please choose a stronger password.';
      default:
        return 'An unknown error occurred. Please try again.';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Register' : 'Login'}</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {isRegistering && (
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>{isRegistering ? 'Register' : 'Login'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.switchButton} onPress={() => setIsRegistering(!isRegistering)}>
        <Text style={styles.switchText}>
          {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
        </Text>
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
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#007bff',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 15,
  },
  switchText: {
    color: '#007bff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
});

export default AuthScreen;

