import React, { useState, useEffect } from "react";
import {
  bootstrap,
  getAddress,
  onAccountAvailable,
  getNativeCoinBalance,
  coinConvert
} from '@stakeordie/griptape.js';
import { secretSurvey } from "./contracts/secret-survey";
function App() {

    async function getSecret() {
      const secret = await secretSurvey.getSecret('3282199233');
      console.log(secret);
    };  
  var [address, setAddress] = useState('');
  var [coins, setCoins] = useState(undefined);
  var [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const removeOnAccountAvailable = onAccountAvailable(() => {
      setIsConnected(true);
      setAddress(getAddress());
      getBalance();
      getSecret();
    })

    return ()=>{
      removeOnAccountAvailable()
    }
  }, []);

  const getBalance = async () => {
    var balance = await getNativeCoinBalance();
    balance = coinConvert(balance, 6, 'human');
    setCoins(balance);
  }

  return (
    <>
      <h1>Hello, Griptape!</h1>
      <p>Is connected? {isConnected ? "Yes" : "No"}</p>
      <button
        onClick={() => { bootstrap(); }}
        disabled={isConnected}>Bootstrap
      </button>
      <p>Your address is: {address}</p>
      <p>Your balance is: {coins}</p>
    </>
  );
}
export default App;
