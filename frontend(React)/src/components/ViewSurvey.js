import React from 'react';

const SurveyCard = ({ survey }) => {
  const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const titleStyle = {
    fontSize: '24px',
    marginBottom: '10px',
    textAlign: 'center'
  };

  const questionStyle = {
    marginTop: '10px',
  };

  const boldStyle = {
    fontWeight: 'bold',
  };

  const listStyle = {
    listStyleType: 'disc',
    marginLeft: '20px',
    marginTop: '5px',
  };

  const ownerStyle = {
    marginTop: '15px',
    fontStyle: 'italic',
  };

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>{survey.survey_title}</h2>
      <div style={questionStyle}>
        <strong style={boldStyle}>{survey.question1}</strong>
        <ul style={listStyle}>
          {survey.quest1options.map((option, index) => (
            <li key={index}>{option}</li>
          ))}
        </ul>
      </div>
      <div style={questionStyle}>
        <strong style={boldStyle}>{survey.question2}</strong>
        <ul style={listStyle}>
          {survey.quest2options.map((option, index) => (
            <li key={index}>{option}</li>
          ))}
        </ul>
      </div>
      <p style={ownerStyle}>Survey Owner: {survey.survey_owner}</p>
    </div>
  );
};

export default SurveyCard;
