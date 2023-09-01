import React,{useEffect, useState} from 'react';
import { get_my_survey_response } from "../contracts/secret-survey"

const SurveyResponseCard = ({ selectedSurvey,secretjs,view_key,contract_address,code_hash,setLoading}) => {
    if (!selectedSurvey) {
        return <div>Select a survey to view details.</div>;
    }
  const [response,setResponse] = useState();
  const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    margin: '0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '100%',
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

  useEffect(()=>{
     const fetchData = async ()=>{
      setLoading(true);
        const res= await get_my_survey_response(secretjs,view_key,contract_address,code_hash,selectedSurvey.survey_id)
        console.log(res)
        setResponse(res['Ok'])
        setLoading(false);
     }
     fetchData();
  },[selectedSurvey])

  if (!response) {
    return null; // Return null if response is not available yet
}
  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>{selectedSurvey.survey_title}</h2>
      <div style={questionStyle}>
        <strong style={boldStyle}>{selectedSurvey.question1}</strong>
        <ul style={listStyle}>
          {selectedSurvey.quest1options.map((option, index) => (
            <li key={index}>{option}</li>
          ))}
        </ul>
        <p style={{ margin:'4px'}}>Your response: {response.answer1}</p>
      </div>
      <div style={questionStyle}>
        <strong style={boldStyle}>{selectedSurvey.question2}</strong>
        <ul style={listStyle}>
          {selectedSurvey.quest2options.map((option, index) => (
            <li key={index}>{option}</li>
          ))}
        </ul>
        <p style={{ margin:'4px'}} >Your response: {response.answer2}</p>
      </div>
      <hr style={{marginTop:'8px',marginBottom:'4px',color:'grey'}}/>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 30px' }}>
  <p style={{ margin: '4px' }}>Your chosen response type:</p>
  <p style={{ margin: '4px' }}>{response.response_type}</p>
</div>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 30px' }}>
  <p style={{ margin: '4px' }}>Response Owner:</p>
  <p style={{ margin: '4px' }}>{response.response_owner}</p>
</div>

    </div>
  );
};

export default SurveyResponseCard;
