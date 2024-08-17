// // screens/PomodoroScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Vibration, Animated, Easing, Modal, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker for dropdown menu
import Svg, { G, Path } from 'react-native-svg';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import { TaskContext } from '../context/TaskContext';
import { AntDesign } from '@expo/vector-icons';

const cloudPath = "M17,9a4.08,4.08,0,0,0-.93.12,5,5,0,0,0-9,2.09A3,3,0,1,0,6,17H17a4,4,0,0,0,0-8Z";

const PomodoroScreen = () => {
  const { addWorkSession } = useContext(TaskContext);
  const [workTime, setWorkTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [time, setTime] = useState(workTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkInterval, setIsWorkInterval] = useState(true);
  const [sessionCount, setSessionCount] = useState(0);
  const [animation] = useState(new Animated.Value(1));
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState('2000'); // Default speed in milliseconds
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

  // Music-related states
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  const [musicUri, setMusicUri] = useState(null);
  const [sound, setSound] = useState(null);
  const [playbackPosition, setPlaybackPosition] = useState(0); // Track playback position

  useEffect(() => {
    if (isRunning && isAnimationEnabled) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 2.1,
            duration: parseInt(animationSpeed, 10) / 2,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 1,
            duration: parseInt(animationSpeed, 10) / 2,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      animation.stopAnimation();
      animation.setValue(1);
    }

    if (time === 0) {
      animation.stopAnimation();
      animation.setValue(1);
    }
  }, [isRunning, time, isAnimationEnabled, animationSpeed]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(interval);
            handleTimeUp();
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  useEffect(() => {
    if (time === 0 && isWorkInterval) {
      addWorkSession();
    }
  }, [time, isWorkInterval]);

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

const handleStartStop = async () => {
  console.log(`isRunning: ${isRunning}`);
  setIsRunning(!isRunning);
  if (!isRunning && isMusicEnabled && musicUri) {
    playMusic();
  } else if (isRunning && sound) {
    sound.pauseAsync();
    const status = await sound.getStatusAsync();
    setPlaybackPosition(status.positionMillis); // Save playback position
  }
};

const handleReset = () => {
  console.log(`Resetting timer. Stopping music.`);
  setIsRunning(false);
  setIsWorkInterval(true);
  setSessionCount(0);
  setTime(workTime * 60);
  stopMusic();
  setPlaybackPosition(0); // Reset playback position
};

  const handleTimeUp = async () => {
    Vibration.vibrate([500, 1000, 500], false);
    Alert.alert(
      'Times Up!',
      isWorkInterval ? 'Good job! Take a break.' : 'Break over! Back to work.',
      [
        { text: 'OK', onPress: () => switchInterval() }
      ],
      { cancelable: false }
    );
  };

  const switchInterval = () => {
    if (isWorkInterval) {
      setSessionCount((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount % 4 === 0) {
          setIsWorkInterval(false);
          setTime(longBreakTime * 60);
        } else {
          setIsWorkInterval(false);
          setTime(shortBreakTime * 60);
        }
        return newCount;
      });
    } else {
      setIsWorkInterval(true);
      setTime(workTime * 60);
    }
  };

  const animatedCloudStyle = {
    transform: [
      {
        scale: animation
      }
    ]
  };

const selectMusic = async () => {
  console.log('Selecting music...');
  let result = await DocumentPicker.getDocumentAsync({
    type: 'audio/*',
  });
  console.log('DocumentPicker result:', result);

  if (result.canceled) {
    console.log('Music selection was canceled');
    return;
  }

  if (result.assets && result.assets.length > 0) {
    const selectedAsset = result.assets[0];
    console.log('Selected asset details:', selectedAsset);
    if (selectedAsset.uri) {
      console.log('Selected music URI:', selectedAsset.uri);
      setMusicUri(selectedAsset.uri); // Update the URI state
    } else {
      console.log('Selected asset does not have a URI');
    }
  } else {
    console.log('No assets found in the result');
  }
};


const playMusic = async () => {
  console.log('Playing music from URI:', musicUri);
  if (musicUri) {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: musicUri },
        { shouldPlay: true, positionMillis: playbackPosition } // Start from saved position
      );
      setSound(newSound);
      await newSound.playAsync();
      console.log('Music is playing');
    } catch (error) {
      console.error('Error playing music:', error);
    }
  } else {
    console.log('No valid music URI to play');
  }
};


  const stopMusic = async () => {
    if (sound) {
      console.log('Stopping music');
      await sound.stopAsync();
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.cloudContainer, animatedCloudStyle]}>
        <Svg width="100" height="100" viewBox="0 -4.04 20.088 20.088">
          <G id="cloud" transform="translate(-1.912 -5.986)">
            <Path d={cloudPath} fill="lightblue" />
            <Path d={cloudPath} fill="none" />
          </G>
        </Svg>
      </Animated.View>
      <Text style={styles.timer}>{formatTime(time)}</Text>
      
      <View style={styles.inputContainer}>
        <Text>Work Time (minutes):</Text>
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          value={workTime.toString()}
          onChangeText={(value) => setWorkTime(Number(value))}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text>Short Break Time (minutes):</Text>
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          value={shortBreakTime.toString()}
          onChangeText={(value) => setShortBreakTime(Number(value))}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Long Break Time (minutes):</Text>
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          value={longBreakTime.toString()}
          onChangeText={(value) => setLongBreakTime(Number(value))}
        />
      </View>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setIsSettingsModalVisible(true)}
      >
        <AntDesign name="setting" style={styles.floatingButtonText} />
      </TouchableOpacity>

      <Modal
        visible={isSettingsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsSettingsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Settings</Text>
            
            <View style={styles.switchContainer}>
              <Text>Animation Enabled:</Text>
              <Switch
                value={isAnimationEnabled}
                onValueChange={(value) => setIsAnimationEnabled(value)}
              />
            </View>

            <View style={styles.pickerContainer}>
              <Text>Animation Speed:</Text>
              <Picker
                selectedValue={animationSpeed}
                style={styles.picker}
                onValueChange={(itemValue) => setAnimationSpeed(itemValue)}
              >
                
                
                <Picker.Item label="Fast" value="500" />
                <Picker.Item label="Medium" value="1000" />
                <Picker.Item label="Slow" value="2000" />
                <Picker.Item label="Very Slow" value="5000" />
              </Picker>
            </View>

            <View style={styles.switchContainer}>
              <Text>Enable Music:</Text>
              <Switch
                value={isMusicEnabled}
                onValueChange={(value) => {
                  setIsMusicEnabled(value);
                  if (value) {
                    playMusic(); // Start music if enabled
                  } else {
                    stopMusic(); // Stop music if disabled
                  }
                }}
              />
            </View>

            {isMusicEnabled && (
              <TouchableOpacity
                style={styles.buttonP}
                onPress={selectMusic}
              >
                <Text style={styles.buttonText}>
                  {musicUri ? 'Change Music' : 'Select Music'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.buttonP, styles.modalButton]}
              onPress={() => setIsSettingsModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.button}
        onPress={handleStartStop}
      >
        <Text style={styles.buttonText}>
          {isRunning ? 'Pause' : 'Start'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleReset}
      >
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Add your existing styles here, and modify as needed
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    width: 60,
    marginLeft: 10,
  },
  cloudContainer: {
    marginBottom: 20,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'lightblue',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'skyblue'
  },
  modalButton: {
    marginTop: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  pickerContainer: {
    marginVertical: 10,
  },
  picker: {
    width: '100%',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 20,
    marginVertical: 10,
    width: 100,
    alignItems: 'center',
  },
  buttonP: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 20,
    marginVertical: 10,
    width: 150,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});

export default PomodoroScreen;






