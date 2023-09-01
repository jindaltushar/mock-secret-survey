import React from 'react';

const SurveyList = ({ surveys, title, handleSurveyClick }) => {
    return (
        <div className="survey-list">
            <h2>{title}</h2>
            <ul>
                {surveys.map((survey, index) => (
                    <li key={survey.survey_id} onClick={() => handleSurveyClick(survey)}>
                        {survey.survey_title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SurveyList;
