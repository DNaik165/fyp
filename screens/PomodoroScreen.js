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
import { LinearGradient } from 'expo-linear-gradient';


// <!-- License: PD. Made by Mary Akveo: https://maryakveo.com/ -->
const cloudPath = "M17,9a4.08,4.08,0,0,0-.93.12,5,5,0,0,0-9,2.09A3,3,0,1,0,6,17H17a4,4,0,0,0,0-8Z";


 const circlePath = "M9.353 3C5.849 4.408 3 7.463 3 11.47A9.53 9.53 0 0 0 12.53 21c4.007 0 7.062-2.849 8.47-6.353C8.17 17.065 8.14 8.14 9.353 3z";
const gradientOptions = [
  { colors: ['pink', '#FFFDD0'], label: 'Pastel' },
  { colors: ['#ff7e5f', '#feb47b'], label: 'Sunset' },
  { colors: ['#36d1dc', '#5b86e5'], label: 'Ocean' },
  { colors: ['#00c6ff', '#0072ff'], label: 'Sky' },
  { colors: ['#a1c4fd', '#c2e9fb'], label: 'Cloudy' },
];

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


//  Gradient background
 const [selectedGradient, setSelectedGradient] = useState(gradientOptions[0].colors); // Default gradient


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
    if (isRunning) {
      setIsRunning(false);
      // Save current playback position
      if (sound) {
        const status = await sound.getStatusAsync();
        setPlaybackPosition(status.positionMillis);
      }
      if (sound) {
        await sound.pauseAsync();
      }
    } else {
      setIsRunning(true);
      // Resume playback from saved position
      if (isMusicEnabled && musicUri) {
        await playMusic(playbackPosition);
      }
    }
  };

  const handleReset = async () => {
    setIsRunning(false);
    setIsWorkInterval(true);
    setSessionCount(0);
    setTime(workTime * 60);
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
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
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
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
  if (sound) {
    await sound.stopAsync();
    await sound.unloadAsync();
  }
  setPlaybackPosition(0); // Reset playback position for new song
  console.log('Selected music URI:', selectedAsset.uri);
  setMusicUri(selectedAsset.uri);
  await playMusic(0); // Play the new music from the beginning
}
}
};




const playMusic = async (positionMillis) => {
  console.log('Playing music from URI:', musicUri);
  if (musicUri) {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: musicUri },
        { shouldPlay: true, positionMillis, isLooping: true,} // Start from saved position
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
  <LinearGradient
  colors={selectedGradient}
  style={styles.container}
>
  <View style={styles.innerContainer}>
    <View style={styles.header}>
      <Text style={styles.headerText}>{isWorkInterval ? 'Work Time' : 'Break Time'}</Text>
    </View>

    <Text style={styles.timer}>{formatTime(time)}</Text>

    <Animated.View style={[styles.cloudContainer, animatedCloudStyle]}>
    <Svg width="100" height="100" viewBox="0 -4.04 20.088 20.088">
      <G id="shape" transform="translate(-1.912 -5.986)">
        <Path d={isWorkInterval ? cloudPath : circlePath} fill={isWorkInterval ? "white" : "#FFFDD0"} />
      </G>
    </Svg>
  </Animated.View>

  <View style={styles.buttonK}>
    <TouchableOpacity style={styles.button} onPress={handleStartStop}>
      <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={handleReset}>
      <Text style={styles.buttonText}>Reset</Text>
    </TouchableOpacity>
  </View>

  </View>

  <TouchableOpacity
    style={styles.floatingButton}
    onPress={() => setIsSettingsModalVisible(true)}
  >
    <AntDesign name="setting" style={styles.floatingButtonText} />
  </TouchableOpacity>

  {/* Settings Modal */}
  <Modal
    visible={isSettingsModalVisible}
    transparent={true}
    animationType="slide"
    onRequestClose={() => setIsSettingsModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Settings</Text>
        <View style={styles.modalSection}>
          <Text style={styles.modalLabel}>Work Time </Text>
          <Picker
            selectedValue={workTime}
            style={styles.picker}
            onValueChange={(itemValue) => setWorkTime(itemValue)}
          >
            {[...Array(60).keys()].map((num) => (
              <Picker.Item key={num} label={`${num + 1}`} value={num + 1} />
            ))}
          </Picker>
        </View>
        <View style={styles.modalSection}>
          <Text style={styles.modalLabel}>Short Break Time</Text>
          <Picker
            selectedValue={shortBreakTime}
            style={styles.picker}
            onValueChange={(itemValue) => setShortBreakTime(itemValue)}
          >
            {[...Array(30).keys()].map((num) => (
              <Picker.Item key={num} label={`${num + 1}`} value={num + 1} />
            ))}
          </Picker>
        </View>
        <View style={styles.modalSection}>
          <Text style={styles.modalLabel}>Long Break Time </Text>
          <Picker
            selectedValue={longBreakTime}
            style={styles.picker}
            onValueChange={(itemValue) => setLongBreakTime(itemValue)}
          >
            {[...Array(60).keys()].map((num) => (
              <Picker.Item key={num} label={`${num + 1}`} value={num + 1} />
            ))}
          </Picker>
        </View>
        <View style={styles.modalSection}>
          <Text style={styles.modalLabel}>Enable Animation</Text>
          <Switch
            value={isAnimationEnabled}
            onValueChange={setIsAnimationEnabled}
          />
        </View>
        {/* <View style={styles.modalSection}>
          <Text style={styles.modalLabel}>Animation Speed (ms)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={animationSpeed}
            onChangeText={setAnimationSpeed}
          />
        </View> */}
        <View style={styles.pickerContainer}>
          <Text style={styles.EMs}>Animation Speed:</Text>
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
        <View style={styles.modalSection}>
          <Text style={styles.modalLabel}>Gradient Background</Text>
          <Picker
            selectedValue={selectedGradient}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedGradient(itemValue)}
          >
            {gradientOptions.map((option) => (
              <Picker.Item key={option.label} label={option.label} value={option.colors} />
            ))}
          </Picker>
        </View>
        <View style={styles.switchContainer}>
            <Text style={styles.EMs}>Enable Music:</Text>
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
            <View style={styles.buttonS}>
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
          style={styles.buttonP}
          onPress={() => setIsSettingsModalVisible(false)}
        >
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
</LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  cloudContainer: {
        marginBottom: 20,
      },
  EMs: {
    color: 'skyblue'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
    innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 50,
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
  modalLabel: {
    color: 'skyblue'
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
  buttonK: {
    marginTop: 30
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 20,
    marginVertical: 10,
    width: 100,
    alignItems: 'center',
  },
  buttonS:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonP: {
    backgroundColor: 'lightblue',
    padding: 4,
    borderRadius: 20,
    marginVertical: 10,
    width: 120,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',

  },
  header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
      },
      headerText: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
      },
});

export default PomodoroScreen;





