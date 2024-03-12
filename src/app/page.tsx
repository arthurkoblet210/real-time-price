"use client"
import { useEffect, useState } from 'react';
let historyprice = "";
const StockPrice = ({ symbol = "", apiKey = "" }) => {
  const [price, setPrice] = useState(null);


  useEffect(() => {
    // Check if running in the browser
    if (typeof window === 'undefined') {
      return; // Do nothing if executed server-side
    }

    // Create a WebSocket connection to the Twelve Data endpoint
    const ws = new WebSocket(`wss://ws.twelvedata.com/v1/quotes/price?apikey=${apiKey}`);

    // Event listener for when the WebSocket connection is open
    ws.onopen = () => {
      // Subscribe to the symbol
      ws.send(JSON.stringify({ action: 'subscribe', params: { symbols: symbol } }));
      console.log("open")
    };

    // Event listener for when a message is received from the WebSocket server
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log(response.price)
      console.log(response)
      // Check if the message contains price data for the requested symbol
      if (response.event === 'price') {
        setPrice(response.price);
        historyprice = historyprice + '--> $' + response.price;
      }
    };

    // Event listener for WebSocket errors
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        // Unsubscribe before closing the connection
        ws.send(JSON.stringify({ action: 'unsubscribe', params: { symbols: symbol } }));
        ws.close();
      }
    };
  }, [symbol, apiKey]); // Dependencies for the useEffect hook

  return (
    <div>
      <h1>Real-Time Stock Price</h1>
      <p>{symbol}: {price ? `${historyprice}` : 'Loading...'}</p>
    </div>
  );
};

const Home = () => {
  const API_KEY = '46f4bea5f0684accb3397d3fcba0b3b1'; // Replace with your Twelve Data API key

  return <StockPrice symbol="AAPL" apiKey={API_KEY} />;
};

export default Home;