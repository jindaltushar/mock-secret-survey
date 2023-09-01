import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CreateSurvey from './components/CreateSurvey';
import ViewAnsweredSurveys from './components/ViewAnsweredSurveys';
import ResearcherDashboard from './components/ResearcherDashboard';
import LoadingComponent from './components/Loading';
import {getKeplr, get_key,sleep} from './contracts/secret-survey'
import { BrowserRouter as Router , Route , Switch } from 'react-router-dom';
import AnswerSurvey from './components/AnswerSurvey';
import FindParticipants from './components/FindParticipants';
import  Footer from './components/FooterWarning';
import Message from './components/Message';
import { get_messages } from './contracts/secret-survey';
const App = () => {
  const [loading, setLoading] = useState(false);
  const [myAddress, setMyAddress] = useState();
  const [viewKey,setViewKey] = useState();
  const [secretjs,setSecretJs] = useState();
  const [showKeplrInstall,setShowKeplrInstall] = useState(false);
  const contractAddress = "secret1dupldnwgc8r7tnj9glpfsjpmydxyjprl95pws8"
  const contractcodehash = "0efaa077478d1b5a75175ee26c0137cc2127e25fa06fea1ec1e112099ee085d4"
  const [messages,setMessages] = useState();

  useEffect(() => {

    async function fetchData() {
      try {
          while (
            !window.keplr &&
            !window.getOfflineSigner &&
            !window.getEnigmaUtils
          ) {
            setShowKeplrInstall(true);
            await sleep(10);
          }
        const { mAddress, secretjsc }  = await getKeplr();   
        setMyAddress(mAddress);
        setSecretJs(secretjsc);
        if (mAddress && secretjsc && !viewKey){
          setLoading(true);
          const view_key = await get_key(secretjsc,mAddress,contractAddress,contractcodehash);
          setViewKey(view_key);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    if (viewKey){
    console.log(viewKey);
    const fetchData = async () => {
      try {
          const messages = await get_messages(secretjs, viewKey, contractAddress, contractcodehash);
          if (!messages['Err']){
            setMessages(messages['Ok']);
          }
      } catch (error) {
          console.error("Error fetching data:", error);
      }
  }
  fetchData();}
  }, [viewKey]);

  return (
    <Router>
    <div className="App">
      <Navbar messages={messages} setLoading={setLoading} viewKey={viewKey} myAddress={myAddress}  secretjs={secretjs} contractAddress={contractAddress} contractcodehash={contractcodehash} />
      <div className="content">
        <Switch>
          <Route exact path="/">
              <Home setLoading={setLoading} viewKey={viewKey} myAddress={myAddress}  secretjs={secretjs} contractAddress={contractAddress} contractcodehash={contractcodehash}/>
          </Route>
          <Route exact path="/create">
              <CreateSurvey setLoading={setLoading} viewKey={viewKey} myAddress={myAddress}  secretjs={secretjs} contractAddress={contractAddress} contractcodehash={contractcodehash}/>
          </Route>
          <Route exact path="/viewAnsweredSurveys">
              <ViewAnsweredSurveys setLoading={setLoading} viewKey={viewKey} myAddress={myAddress}  secretjs={secretjs} contractAddress={contractAddress} contractcodehash={contractcodehash}/>
          </Route>
          <Route exact path="/researcherDash">
              <ResearcherDashboard setLoading={setLoading}  viewKey={viewKey} myAddress={myAddress}  secretjs={secretjs} contractAddress={contractAddress} contractcodehash={contractcodehash}/>
          </Route>
          <Route exact path="/answerSurvey/:id">
              <AnswerSurvey setLoading={setLoading}  viewKey={viewKey} myAddress={myAddress}  secretjs={secretjs} contractAddress={contractAddress} contractcodehash={contractcodehash}/>
          </Route>
          <Route exact path="/findParticipants">
              <FindParticipants setLoading={setLoading}  viewKey={viewKey} myAddress={myAddress}  secretjs={secretjs} contractAddress={contractAddress} contractcodehash={contractcodehash}/> 
          </Route>
          <Route exact path="/messages" >
              <Message messages={messages} setLoading={setLoading}  viewKey={viewKey} myAddress={myAddress}  secretjs={secretjs} contractAddress={contractAddress} contractcodehash={contractcodehash} />
          </Route>
        </Switch>
      </div>
    {loading && (
                <div className="modal-overlay">
                    <div className="modal-content-loading">
                        <LoadingComponent />
                    </div>
                </div>
            )}
    </div>
    {showKeplrInstall && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              textAlign: 'center',
              position: 'relative',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              maxWidth:"30%"
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            >
              &times;
            </span>
            <img
              src="keplr.png"
              alt="Kepler Wallet"
              style={{ width: '250px', height: 'auto' }}
            />
            <h2>Please install Kepler Wallet</h2>
            <p
              style={{
                margin: '0 20px', // Left and right margin
                marginTop: '10px',
                marginBottom: '20px'
              }}
            >
              It's important to use this web3 app with Kepler Wallet installed. Please <a target="_blank" rel="noopener noreferrer"  href="https://help.keplr.app/articles/installation-guide-for-keplr-extension-for-beginners">Click Me</a> to see a detailed instructions on how to install Keplr Wallet. 
            </p>
            <a
              href="https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#252E55', // Button color
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '5px',
                marginTop: '10px',
                marginBottom: '10px'
              }}
            >
              Install Kepler Wallet
            </a>
          </div>
        </div>
      )}
      { !showKeplrInstall && !viewKey && !loading && (
        <Footer />
      )}
    </Router>
  );
};

export default App;
