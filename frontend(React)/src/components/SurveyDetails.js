import React from 'react';

const SurveyDetails = ({ selectedSurvey }) => {
    if (!selectedSurvey) {
        return <div>Select a survey to view details.</div>;
    }

    const surveyResponses = [
        {
            response_id:1,
            survey_id:1,
            answer1:'option1',
            answer2:'option2',
            response_type:"hide",
            response_owner:"43290-"
        },
        {
            response_id:1,
            survey_id:2,
            answer1:'option3',
            answer2:'option3',
            response_type:"hiddsdse",
            response_owner:"43290-dsfs"
        }

    ]; 

    return (
        <div className="survey-details">
            <div className="survey-questions">
                <h3>{selectedSurvey.survey_title}</h3>
                <p>{selectedSurvey.question1}</p>
                <p>{selectedSurvey.question2}</p>
            </div>
            <div className="survey-responses">
                <h3>Survey Responses</h3>
                <ul>
                    {surveyResponses.map(response => (
                        <li key={response.response_id}>
                            Answer 1: {response.answer1}<br />
                            Answer 2: {response.answer2}<br />
                            Response Type: {response.response_type}<br />
                            Response Owner: {response.response_owner}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SurveyDetails;
