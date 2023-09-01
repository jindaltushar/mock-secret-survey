import React, { useState, useEffect } from 'react';

const Message = ({ messages }) => {
  const [currentMessages, setCurrentMessages] = useState([]);
  const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '10px',
    maxWidth: '60%',
    margin: '10px auto',
    padding: '10px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  };
  const cardBodyStyle = {
    /* Add any additional styles you want for the card body */
    textAlign: 'center',
  };
  useEffect(() => {
    // Update the local state whenever the 'messages' prop changes
    setCurrentMessages(messages);
  }, [messages]);

  if (!currentMessages || currentMessages.length === 0) {
    return (
      <h2>No Messages</h2>
    );
  }
  console.log(currentMessages);
  return (
    <div className="co">
    {currentMessages.map((message, index) => (
      <div key={index} style={cardStyle}>
        <div style={cardBodyStyle}>
          {message}
        </div>
      </div>
    ))}
  </div>
  );
}

export default Message;

