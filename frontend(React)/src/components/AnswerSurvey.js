import React, { useState ,useEffect} from 'react';
import { get_survey_by_id ,submit_survey_response } from '../contracts/secret-survey';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom'; 

      // A function to generate a random string
const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};


      const AnswerSurvey = ({setLoading,viewKey,myAddress,secretjs,contractAddress,contractcodehash}) => {
        const { id } = useParams();
        const [survey,setSurvey] = useState()
          const [responses, setResponses] = useState({});
          const [selectedAccessType, setSelectedAccessType] = useState('');
          const history = useHistory();
      
          const handleResponseChange = (question, response) => {
              setResponses(prevResponses => ({
                  ...prevResponses,
                  [question]: response
              }));
          };
      
          const handleAccessTypeChange = (accessType) => {
              setSelectedAccessType(accessType);
          };

          const handleSubmit = async (event) => {
            event.preventDefault();
            if (responses.question1 && responses.question2 && selectedAccessType) {
                setLoading(true);
                const submission = {
                    survey_id: survey.survey_id,
                    answer1: responses.question1,
                    answer2: responses.question2,
                    response_type: selectedAccessType,
                    seed: generateRandomString(8) // Generate a random seed of length 8
                };
                const result = await submit_survey_response(secretjs, myAddress, contractAddress, contractcodehash, submission);
                console.log('response id :', result);
                    setLoading(false);
                    history.push('/viewAnsweredSurveys');;
                } else {
                console.log('Please fill out all fields.');
            }
        };        

        useEffect(()=>{
            const fetchData = async()=>{
                setLoading(true);
                const results = await get_survey_by_id(secretjs,id,contractAddress,contractcodehash);
                console.log(results);
                setSurvey(results);
                setLoading(false);
            }
            fetchData();
        },[viewKey])
      
          return (

            <div  style={{maxWidth:"70%", margin: "0 auto"}}>
                {survey ? (
              <div className="survey-form" style={{ backgroundColor: 'white', color: '#252E55', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <h2 style={{ marginBottom: '20px',textAlign:"center" }}>{survey.survey_title}</h2>
                  <form onSubmit={handleSubmit}>
                      <div className="question">
                          <p>{survey.question1}</p>
                          <ul>
                              {survey.quest1options.map((option, index) => (
                                  <li key={index}>
                                      <label>
                                          <input
                                              type="radio"
                                              name="question1"
                                              value={option}
                                              style={{ marginRight: '8px' }} 
                                              onChange={(e) => handleResponseChange('question1', e.target.value)}
                                          />
                                          {option}
                                      </label>
                                  </li>
                              ))}
                          </ul>
                      </div>
                      <div className="question">
                          <p>{survey.question2}</p>
                          <ul>
                              {survey.quest2options.map((option, index) => (
                                  <li key={index}>
                                      <label>
                                          <input
                                              type="radio"
                                              name="question2"
                                              value={option}
                                              style={{ marginRight: '8px' }} 
                                              onChange={(e) => handleResponseChange('question2', e.target.value)}
                                          />
                                          {option}
                                      </label>
                                  </li>
                              ))}
                          </ul>
                      </div>
                      <div style={{ marginTop: '20px' }}>
                          <p>Select Access Type:</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <label>
                                  <input
                                      type="radio"
                                      name="accessType"
                                      value="public_read"
                                      style={{ marginRight: '8px' }} 
                                      checked={selectedAccessType === 'public_read'}
                                      onChange={() => handleAccessTypeChange('public_read')}
                                  />
                                  Public 
                              </label>
                              <label>
                                  <input
                                      type="radio"
                                      name="accessType"
                                      value="public_stats"
                                      style={{ marginRight: '8px' }} 
                                      checked={selectedAccessType === 'public_stats'}
                                      onChange={() => handleAccessTypeChange('public_stats')}
                                  />
                                  Public Stats Only
                              </label>
                              <label>
                                  <input
                                      type="radio"
                                      name="accessType"
                                      value="researcher_read"
                                      style={{ marginRight: '8px' }} 
                                      checked={selectedAccessType === 'researcher_read'}
                                      onChange={() => handleAccessTypeChange('researcher_read')}
                                  />
                                  Researcher
                              </label>
                              <label>
                                  <input
                                      type="radio"
                                      name="accessType"
                                      value="researcher_stats"
                                      style={{ marginRight: '8px' }} 
                                      checked={selectedAccessType === 'researcher_stats'}
                                      onChange={() => handleAccessTypeChange('researcher_stats')}
                                  />
                                  Researcher Stats only
                              </label>
                          </div>
                      </div>
                      <button
                          type="submit"
                          style={{
                              backgroundColor: '#252E55',
                              color: 'white',
                              padding: '10px 20px',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              marginTop: '20px',
                              opacity: responses.question1 && responses.question2 && selectedAccessType ? 1 : 0.6
                          }}
                          disabled={!responses.question1 || !responses.question2 || !selectedAccessType}
                      >
                          Submit
                      </button>
                  </form>
             </div> 
                ):(<></>)}
             </div>
          );
      };
      
      export default AnswerSurvey;
      