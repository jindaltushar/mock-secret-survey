import React from 'react';

const SurveyList = ({ onSurveyClick }) => {
    const surveys  = [
        {
            survey_id: 1,
            survey_title: 'Survey 1',
            question1: 'Question 1',
            question2: 'Question 2',
            quest1options: [ 'option1', 'option2', 'option3', 'option4' ],
            quest2options: [ 'option1', 'option2', 'option3', 'option4' ],
            survey_owner: 'secret10zdvm5a8vwsqaldksjldssdsd'
          },
          {
            survey_id: 2,
            survey_title: 'Survey 2',
            question1: 'Question 1',
            question2: 'Question 2',
            quest1options: [ 'option1', 'option2', 'option3', 'option4' ],
            quest2options: [ 'option1', 'option2', 'option3', 'option4' ],
            survey_owner: 'secret10zdvm5a8vwsqaldskjhdklsddsa'
          },
          {
            survey_id: 3,
            survey_title: 'Survey 3',
            question1: 'Question 1',
            question2: 'Question 2',
            quest1options: [ 'option1', 'option2', 'option3', 'option4' ],
            quest2options: [ 'option1', 'option2', 'option3', 'option4' ],
            survey_owner: 'secret10zdvm5a8vwsqdsjkshduidsddsdw2'
          }
        ]
    return (
        <div>
            <h3>Survey List</h3>
            <ul>
                {surveys.map((survey, index) => (
                    <li key={index} onClick={() => onSurveyClick(survey)}>
                        {survey.survey_title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SurveyList;
