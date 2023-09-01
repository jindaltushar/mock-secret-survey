import React from 'react';

const Footer = () => {
  const footerStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#ffc107',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const warningTextStyle = {
    textAlign: 'center',
    textColor: 'white',
    paddingTop:'5px',
    paddingBottom:'5px'
  };

  return (
    <div style={footerStyle}>
      <p style={warningTextStyle}>If you see this warning message ! Then please visit <a target="_blank" rel="noopener noreferrer" href="https://faucet.pulsar3.scrttestnet.com/">this Link</a> to get some test SECRET Tokens to test this application. Come back and please refresh this page.</p>
    </div>
  );
};

export default Footer;
