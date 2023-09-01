import React, { useState } from 'react';
import {  useForm } from "react-cool-form";
import {get_stats_for_ques_ans,reach_participants} from "../contracts/secret-survey";

const QuestionnaireComponent = ({ questionsData,setLoading,viewKey,myAddress,secretjs,contractAddress,contractcodehash }) => {
  const { form } = useForm();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [stat, setStat] = useState();
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  const filteredQuestions = questionsData.filter((question) =>
    question.question.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleQuestionSelect = (event) => {
    const selectedQuestionId = event.target.value;
    const selectedQuestion = questionsData.find((q) => q.question === selectedQuestionId);
    setSelectedQuestion(selectedQuestion);
    setSelectedAnswer(null); // Clear selected answer when question changes
    setShowStats(false); // Clear statistics when question changes
    setShowSuccessMsg(false);
  };

  const handleAnswerSelect = (event) => {
    setSelectedAnswer(event.target.value);
    setShowStats(false); // Clear statistics when answer changes
    setShowSuccessMsg(false);
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
    setSelectedQuestion(null); // Clear selected question when filter changes
    setSelectedAnswer(null); // Clear selected answer when filter changes
  };

  const handleGetStats = () => {
    setShowSuccessMsg(false);
    if (selectedQuestion && selectedAnswer) {
      // Implement logic to get statistics
      const fetchData = async () => {
        try {
          setLoading(true);
            const stats = await get_stats_for_ques_ans(secretjs,contractAddress,contractcodehash,selectedQuestion.question,selectedAnswer);
            setStat(stats);
            setShowStats(true);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    fetchData();
      console.log("Getting statistics...");
    }
  };

  const handleCallForParticipation = () => {
    if (selectedQuestion && selectedAnswer) {
      // Implement logic to call for participation
      const fetchData = async () => {
        try {
          setLoading(true);
          let res = await reach_participants(secretjs,myAddress,contractAddress,contractcodehash,selectedQuestion.question,selectedAnswer);
          setLoading(false);
          if (res === 'true'){
            console.log('hjjhkyukfgyhuytrdtfyguh');
          setShowSuccessMsg(true);}
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    fetchData();
      console.log("Calling for participation...");
    }
  };

  return (
    <>
    <div>
    <form ref={form} noValidate style={{ margin: '0.1rem auto 0', width: '30rem' }}>
                <div className="heading" style={{ padding: '0.5rem 0.5rem', textAlign: 'center', color: '#252E55', background: '#f4f4f4', borderRadius: '4px' }}>
                    Reach your target participants 
                </div>
                <div style={{ marginBottom: '1rem', width: 'inherit' ,marginTop: '1rem'}}>
                    <input name="filter_question" placeholder="Just write here to filter from available question" required style={{ padding: '0 0.5rem', width: 'inherit', height: '2rem', borderRadius: '4px', border: 'none', boxSizing: 'border-box' }} value={filterText}
                onChange={handleFilterChange}/>
                </div>
                <div style={{ marginBottom: '1rem', width: 'inherit' ,marginTop: '1rem'}}>
                <select name="selectedques" onChange={handleQuestionSelect} value={selectedQuestion ? selectedQuestion.question : ''} style={{ padding: '0 0.5rem', width: 'inherit', height: '2rem', borderRadius: '4px', border: 'none', boxSizing: 'border-box' }} >
                          <option value="" disabled>
                                  Select a question
                          </option>
                          {filteredQuestions.map((question, index) => (
                            <option key={index} value={question.question}>
                                {question.question}
                            </option>
                            ))}
                </select>
                </div>
                <div style={{ marginBottom: '1rem', width: 'inherit' ,marginTop: '1rem'}}>
                      {selectedQuestion && (
                      <select name="selectedans" onChange={handleAnswerSelect} value={selectedAnswer || ''} style={{ padding: '0 0.5rem', width: 'inherit', height: '2rem', borderRadius: '4px', border: 'none', boxSizing: 'border-box' }}>
                          <option value="" disabled>
                                    Select an option
                          </option>
                          {selectedQuestion.options.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                    </select>
                    )}
                </div>
                {showStats && (
                        <div className="heading" style={{
                            padding: '0.5rem 0.5rem',
                            textAlign: 'center',
                            color: 'white',
                            background: stat === 0 ? '#dc3545' : '#28a745', // Conditional background color
                            borderRadius: '4px'
                        }}>
                            {stat} Participants Found
                        </div>
                    )}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                      <button type="button" onClick={handleGetStats}
                          style={{
                              backgroundColor: '#252E55',
                              color: 'white',
                              padding: '10px 20px',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              marginTop: '20px'
                          }}
                      >Get Statistics</button>
                </div>  
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                      <button type="button" onClick={handleCallForParticipation}
                          style={{
                              backgroundColor: '#252E55',
                              color: 'white',
                              padding: '10px 20px',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              marginTop: '20px'
                          }}
                      >Request Participation</button>
                </div>  
                {showSuccessMsg && (
                        <div className="heading" style={{
                            padding: '0.5rem 0.5rem',
                            textAlign: 'center',
                            color: 'white',
                            background: '#28a745', 
                            borderRadius: '4px',
                            marginTop: '20px'
                        }}>
                            Message sent to participants.
                        </div>
                    )}
      </form>

    </div>
    </>
  );
};

export default QuestionnaireComponent;
