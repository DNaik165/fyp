// components/MotivationalHeader.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fetchMotivationalQuote } from '../utils/fetchQuotes'; // Adjust path as needed

const MotivationalHeader = () => {
  const [quote, setQuote] = useState('');

  const getQuote = async () => {
    const fetchedQuote = await fetchMotivationalQuote();
    setQuote(fetchedQuote);
  };

  useEffect(() => {
    // Fetch quote initially
    getQuote();

    // Set interval to fetch new quote every hour (3600000 ms)
    const intervalId = setInterval(() => {
      getQuote();
    }, 3600000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.quoteText}>"{quote}"</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    backgroundColor: 'skyblue',
  },
  quoteText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default MotivationalHeader;
