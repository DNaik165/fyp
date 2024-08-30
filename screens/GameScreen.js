// screens/GameScreen.js

import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { TaskContext } from '../context/TaskContext';

const rockImage = require('../assets/rock.png');
const paperImage = require('../assets/paper.png');
const scissorsImage = require('../assets/scissors.png');

const GameScreen = ({ navigation }) => {
  const { isGameUnlocked, gameRoundsLeft, decrementGameRounds } = useContext(TaskContext);
  const [gameMessage, setGameMessage] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [randomNumber, setRandomNumber] = useState(null);
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [resultMessage, setResultMessage] = useState('');
  const [revealChoices, setRevealChoices] = useState(false);
  const [currentGame, setCurrentGame] = useState(null); // Track which game is being played

  const choices = [
    { name: 'Rock', image: rockImage },
    { name: 'Paper', image: paperImage },
    { name: 'Scissors', image: scissorsImage },
  ];

  useEffect(() => {
    setRandomNumber(Math.floor(Math.random() * 10) + 1);
  }, []);
  
  const resetGameState = () => {
    setRevealChoices(false);
    setResultMessage('');
    setUserChoice(null);
    setComputerChoice(null);
    setGameMessage('');
    setUserGuess('');
  };

  const handleBackToMenu = () => {
    resetGameState();
    setCurrentGame(null);
  };

  const handlePlayGame = () => {
    if (parseInt(userGuess) === randomNumber) {
      setGameMessage('Congratulations! You guessed the correct number!');
      Alert.alert('You won!');
    } else {
      setGameMessage('Wrong guess. Try again!');
      decrementGameRounds();
      if (gameRoundsLeft - 1 === 0) {
        setTimeout(() => {
          Alert.alert('Game Over', 'You have no rounds left. The game is now locked.');
          handleBackToMenu();
        }, 800); 
       
      }
    }
    setUserGuess('');
  };



  const handleUserChoice = (choice) => {
    // Log initial rounds left
    console.log("Initial gameRoundsLeft:", gameRoundsLeft);
  
    if (gameRoundsLeft <= 0) {
      Alert.alert('Game Over', 'You have no rounds left. The game is now locked.');
      return;
    }
  
    const computerChoice = choices[Math.floor(Math.random() * 3)].name;
    setUserChoice(choice);
    setComputerChoice(computerChoice);
    setRevealChoices(true);
    
      decrementGameRounds();
      if (gameRoundsLeft - 1 === 0) {
        setTimeout(() => {
          Alert.alert('Game Over', 'You have no rounds left. The game is now locked.');
          handleBackToMenu();
        }, 800); 
      }

     setTimeout(() => {
      determineWinner(choice, computerChoice);
      
    }, 100); // 1-second delay before showing the result
  };
  


  const determineWinner = (user, computer) => {
    if (user === computer) {
      setResultMessage("It's a tie!");
    } else if (
      (user === 'Rock' && computer === 'Scissors') ||
      (user === 'Paper' && computer === 'Rock') ||
      (user === 'Scissors' && computer === 'Paper')
    ) {
      setResultMessage('You win!');
    } else {
      setResultMessage('Computer wins!');
    }
  };

  if (!isGameUnlocked) {
    return (
      <View style={styles.lockedContainer}>
        <Text style={styles.lockedText}>Complete 3 tasks to unlock the game!</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} color="gold" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!currentGame && (
        <>
          <Text style={styles.title}>Choose a Game</Text>
         
          <TouchableOpacity  style={styles.gchoice} onPress={() => setCurrentGame('number')} >
                  <Text style={styles.gchoiceT}> Guess the Number </Text>
          </TouchableOpacity>

          <TouchableOpacity  style={styles.gchoice} onPress={() => setCurrentGame('rps')}  >
                  <Text style={styles.gchoiceT} > Rock-Paper-Scissors </Text>
          </TouchableOpacity>

          <Text style={styles.roundsLeft}>Rounds left: {gameRoundsLeft}</Text>
      <TouchableOpacity  style={styles.gchoice} onPress={() => navigation.goBack()} >
                  <Text style={styles.gbackT}> Go Back </Text>
                </TouchableOpacity>

        </>
      )}

      {currentGame === 'number' && (
        <>
          <Text style={styles.title}>Guess the Number Game</Text>
          <Text style={styles.instructions}>
            I'm thinking of a number between 1 and 10. Can you guess it?
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={userGuess}
            onChangeText={setUserGuess}
            placeholder="Enter your guess"
            placeholderTextColor="#888"
          />
          <Button title="Submit Guess" onPress={handlePlayGame} color="#28A745" />
          <Text style={styles.gameMessage}>{gameMessage}</Text>
          <Text style={styles.roundsLeft}>Rounds left: {gameRoundsLeft}</Text>
<TouchableOpacity style={styles.gchoice} onPress={() => setCurrentGame(null)}>
  <Text style={styles.gbackT}>Go Back</Text>
</TouchableOpacity>
        </>
      )}

      {currentGame === 'rps' && (
        <>
          <Text style={styles.title}>Rock-Paper-Scissors</Text>

          {!revealChoices && (
            <View style={styles.choiceContainer}>
              {choices.map((choice) => (
                <TouchableOpacity key={choice.name} onPress={() => handleUserChoice(choice.name)}>
                  <Image source={choice.image} style={styles.choiceImage} />
                </TouchableOpacity>
              ))}
              
            </View>
          )}
          <Text style={styles.roundsLeft}>Rounds left: {gameRoundsLeft}</Text>
<TouchableOpacity style={styles.gchoice} onPress={() => setCurrentGame(null)}>
  <Text style={styles.gbackT}>Go Back</Text>
</TouchableOpacity>

          {revealChoices && (
            <View style={styles.resultContainer}>
              <View style={styles.choiceResult}>
                <Text>You Chose:</Text>
                <Image source={choices.find((c) => c.name === userChoice).image} style={styles.choiceImage} />
              </View>
              <View style={styles.choiceResult}>
                <Text>Computer Chose:</Text>
                <Image source={choices.find((c) => c.name === computerChoice).image} style={styles.choiceImage} />
              </View>
              <Text style={styles.resultMessage}>{resultMessage}</Text>
              <Button
                title="Play Again"
                onPress={() => {
                  setRevealChoices(false);
                  setResultMessage('');
                }}
              />
            </View>
          )}
        </>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    padding: 20,
  },
  lockedText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'RubikBubbles-Regular'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: 'midnightblue',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'RubikBubbles-Regular'
  },
  instructions: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'RubikBubbles-Regular'
  },
  input: {
    height: 40,
    borderColor: '#CED4DA',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '80%',
    textAlign: 'center',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    color: '#343A40',
  },
  gameMessage: {
    fontSize: 18,
    color: '#17A2B8',
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'RubikBubbles-Regular'
  },
  roundsLeft: {
    fontSize: 22,
    color: 'mediumblue',
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'RubikBubbles-Regular'
  },
  choiceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  choiceImage: {
    width: 100,
    height: 100,
    margin: 10,
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  choiceResult: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultMessage: {
    fontSize: 22,
    color: '#28A745',
    marginTop: 10,
    textAlign: 'center',
  },
  gchoice: {
    // backgroundColor: 'white',
    padding: 15,
    borderRadius: 50,
    marginBottom: 10,
  },
  gchoiceT: {
    fontFamily: 'RubikBubbles-Regular',
    fontSize: 27,
    color: 'darkblue'
  },
  gbackT: {
    fontFamily: 'RubikBubbles-Regular',
    fontSize: 24,
    color: 'mediumblue'
  },
});

export default GameScreen;
