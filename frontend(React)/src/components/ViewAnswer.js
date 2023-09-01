import React from "react";

const ViewSurveyAnswer = () => {
    const [surveys,setSurveys] = useState([
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
        ]);
    return ( 
        <div className="view-ans">
        <SurveyList surveys={surveys} title="Answered Surveys"  />
        </div>
     );
}
 
export default ViewSurveyAnswer;