import React from "react";
import { Link } from 'react-router-dom';

const SurveyList = ({ surveys,title }) => {
    return (
        <div className="survey-list">
        <h2 style={{textAlign:'center'}}>{ title }</h2>
        {surveys.map((survey) => (
            <div className="survey-preview" key={survey.survey_id}>
                <Link to={`/answersurvey/${survey.survey_id}` }>
            <h2>{survey.survey_title}</h2>
            <p>Posted by {survey.survey_owner}</p>
            </Link>
            </div>
        ))}
        </div>
    );
    }

export default SurveyList;