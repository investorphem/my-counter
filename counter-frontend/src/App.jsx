import { useState, useEffect } from 'react';
import { 
  AppConfig, 
  UserSession, 
  openContractCall,
  connect
} from '@stacks/connect';
import { STACKS_MAINNET } from '@stacks/network';
import { uintCV, cvToValue } from '@stacks/transactions';
import './App.css';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

const CONTRACT_ADDRESS = 'SP2GTM2ZVYXQKNYMT3MNJY49RQ2MW8Q1DGXZF8519';
const CONTRACT_NAME = 'counter';
const STACKS_API_URL = 'https://api.hiro.so';

function App() {
  const [userData, setUserData] = useState(null);
  const [counter, setCounter] = useState(0);
  const [owner, setOwner] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  useEffect(() => {
    fetchCounterData();
    const interval = setInterval(fetchCounterData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchCounterData = async () => {
    try {
      const counterResponse = await fetch(
        `${STACKS_API_URL}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/get-counter`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender: CONTRACT_ADDRESS,
            arguments: [],
          }),
        }
      );
      const counterData = await counterResponse.json();
      if (counterData.okay && counterData.result) {
        const counterHex = counterData.result;
        const match = counterHex.match(/^0x01([0-9a-f]+)$/);
        if (match) {
          setCounter(parseInt(match[1], 16));
        }
      }

      const ownerResponse = await fetch(
        `${STACKS_API_URL}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/get-owner`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender: CONTRACT_ADDRESS,
            arguments: [],
          }),
        }
      );
      const ownerData = await ownerResponse.json();
      if (ownerData.okay && ownerData.result) {
        const ownerHex = ownerData.result;
        const match = ownerHex.match(/^0x05([0-9a-f]{40})$/);
        if (match) {
          const versionByte = parseInt(match[1].substring(0, 2), 16);
          const hashBytes = match[1].substring(2);
          const c32check = await import('c32check');
          setOwner(c32check.c32address(versionByte, hashBytes));
        }
      }

      const pausedResponse = await fetch(
        `${STACKS_API_URL}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/is-paused`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender: CONTRACT_ADDRESS,
            arguments: [],
          }),
        }
      );
      const pausedData = await pausedResponse.json();
      if (pausedData.okay && pausedData.result) {
        setIsPaused(pausedData.result === '0x03');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const connectWallet = async () => {
    console.log('Connect wallet clicked');
    
    // Check if wallet is available
    if (!window.StacksProvider && !window.LeatherProvider && !window.XverseProviders) {
      alert('No Stacks wallet detected. Please install Leather Wallet or Xverse from your browser extension store.');
      window.open('https://leather.io/install-extension', '_blank');
      return;
    }

    try {
      const result = await connect({
        appDetails: {
          name: 'Counter DApp',
          icon: window.location.origin + '/vite.svg',
        },
        onFinish: (data) => {
          console.log('Wallet connected', data);
          setUserData(data.userSession.loadUserData());
        },
        onCancel: () => {
          console.log('Wallet connection cancelled');
        },
        userSession,
      });
      console.log('Connect result:', result);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert(`Error connecting wallet: ${error.message || 'Unknown error'}. Please try again or install a Stacks wallet.`);
    }
  };

  const disconnectWallet = () => {
    userSession.signUserOut('/');
    setUserData(null);
  };

  const callContractFunction = async (functionName, functionArgs = []) => {
    if (!userData) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName,
        functionArgs,
        network: STACKS_MAINNET,
        onFinish: (data) => {
          console.log('Transaction:', data.txId);
          setTimeout(fetchCounterData, 3000);
          setLoading(false);
        },
        onCancel: () => {
          setLoading(false);
        },
      });
    } catch (error) {
      console.error('Error calling function:', error);
      setLoading(false);
    }
  };

  const increment = () => callContractFunction('increment');
  const decrement = () => callContractFunction('decrement');
  const togglePause = () => callContractFunction('toggle-pause');
  const setCounterValue = () => {
    const value = parseInt(newValue);
    if (isNaN(value) || value < 0) {
      alert('Please enter a valid number');
      return;
    }
    callContractFunction('set-counter', [uintCV(value)]);
    setNewValue('');
  };

  const isOwner = userData && userData.profile.stxAddress.mainnet === owner;

  return (
    <div className="App">
      <header>
        <h1>🔢 Counter DApp</h1>
        <p className="contract-id">
          {CONTRACT_ADDRESS}.{CONTRACT_NAME}
        </p>
      </header>

      <main>
        {!userData ? (
          <div className="connect-section">
            <button onClick={connectWallet} className="btn-primary">
              Connect Wallet
            </button>
            <p className="hint">Connect your Stacks wallet to interact with the counter</p>
          </div>
        ) : (
          <div className="wallet-info">
            <p>
              Connected: {userData.profile.stxAddress.mainnet.slice(0, 8)}...
              {userData.profile.stxAddress.mainnet.slice(-6)}
            </p>
            <button onClick={disconnectWallet} className="btn-secondary">
              Disconnect
            </button>
          </div>
        )}

        <div className="counter-display">
          <div className="counter-value">{counter}</div>
          {isPaused && <div className="paused-badge">⏸️ PAUSED</div>}
        </div>

        <div className="status-info">
          <div className="status-item">
            <span className="label">Owner:</span>
            <span className="value">
              {owner.slice(0, 8)}...{owner.slice(-6)}
            </span>
          </div>
          <div className="status-item">
            <span className="label">Status:</span>
            <span className={`value ${isPaused ? 'paused' : 'active'}`}>
              {isPaused ? 'Paused' : 'Active'}
            </span>
          </div>
          {isOwner && (
            <div className="status-item owner-badge">
              <span>👑 You are the owner</span>
            </div>
          )}
        </div>

        <div className="actions">
          <h2>Actions</h2>
          
          <div className="action-group">
            <h3>Counter Operations</h3>
            <div className="button-group">
              <button
                onClick={decrement}
                disabled={loading || !userData || isPaused}
                className="btn-action"
              >
                ➖ Decrement
              </button>
              <button
                onClick={increment}
                disabled={loading || !userData || isPaused}
                className="btn-action"
              >
                ➕ Increment
              </button>
            </div>
          </div>

          {isOwner && (
            <>
              <div className="action-group">
                <h3>Owner Controls</h3>
                <div className="input-group">
                  <input
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Enter new value"
                    disabled={loading}
                  />
                  <button
                    onClick={setCounterValue}
                    disabled={loading || !newValue}
                    className="btn-action"
                  >
                    Set Counter
                  </button>
                </div>
                <button
                  onClick={togglePause}
                  disabled={loading}
                  className="btn-action btn-pause"
                >
                  {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                </button>
              </div>
            </>
          )}
        </div>

        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Processing transaction...</p>
          </div>
        )}
      </main>

      <footer>
        <p>
          Built with ❤️ on Stacks |{' '}
          <a
            href={`https://explorer.hiro.so/txid/${CONTRACT_ADDRESS}.${CONTRACT_NAME}?chain=mainnet`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Contract
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
