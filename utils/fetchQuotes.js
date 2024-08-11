// utils/fetchQuotes.js

export const fetchMotivationalQuote = async () => {
    try {
      const response = await fetch('https://zenquotes.io/api/quotes'); // Replace with your API endpoint
      const data = await response.json();
      console.log('Fetched quote data:', data[0]?.q );
      return data[0]?.q ; // Adjust based on API response structure
    } catch (error) {
      console.error("Error fetching quote:", error);
      return "Stay positive and keep going!";
    }
  };
  