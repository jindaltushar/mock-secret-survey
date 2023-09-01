import React, { useState ,useEffect} from 'react';
import SurveyList from "./surveyListforResearcher";
import SurveyResponseCard from './ViewSurveyWithAnswer';
import { get_answered_surveys } from '../contracts/secret-survey';

const ViewAnsweredSurveys = ({setLoading,viewKey,myAddress,secretjs,contractAddress,contractcodehash}) => {
    const [selectedSurvey, setSelectedSurvey] = useState(null); // State for tracking selected survey
    const [surveys,setSurveys] = useState([])
    const handleSurveyClick = (survey) => {
        setSelectedSurvey(survey);
    };

    useEffect(()=>{
        if(viewKey){
            const fetchData= async () =>{
                setLoading(true);
                const response = await get_answered_surveys(secretjs,viewKey,contractAddress,contractcodehash);
                console.log(response);
                setSurveys(response);
                setLoading(false);
            }
            fetchData();
        }
    },[viewKey])

    return ( 
            <div style={{ display: 'flex', height: '100vh' }}>
                { surveys.length > 0 ? (
                    <>
            <div className='leftside' style={{ flex: '0 0 30%', overflow: 'auto', display: 'block'}}>
                {/* Content for the left column (list of surveys) */}
                <SurveyList surveys={surveys} title="Answered Surveys" handleSurveyClick={handleSurveyClick} />
            </div>

            <div className='rightside' style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {!selectedSurvey ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', textAlign: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p>Please choose a survey from the list on the left.</p>
                    </div>
                  </div>
                ) : (
                    <>
                        {/* Render the other components here */}
                        <div style={{ flex: 1, margin: '10px', marginTop: '0px' }}>
                            {/* First vertical stacked div */}
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <div style={{ width: '90%' }}>
                                <SurveyResponseCard selectedSurvey={selectedSurvey} secretjs={secretjs} view_key={viewKey} contract_address={contractAddress} code_hash={contractcodehash} setLoading={setLoading}/>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
              </>  ):(<></>)}
        </div>
    );
}
 
export default ViewAnsweredSurveys;
