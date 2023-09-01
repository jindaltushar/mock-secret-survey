import React, { useState ,useEffect} from 'react';
import SurveyList from './surveyListforResearcher';
import ChartComponent from './ChartComponent';
import BeautifulTable from './Table';
import SurveyCard from './ViewSurvey';
import {extractFormattedResponses,extractQuestion1Stats,extractQuestion2Stats} from "../helper"
import { get_my_created_surveys,get_researcher_summary } from '../contracts/secret-survey'

const ResearcherDashboard = ({setLoading,viewKey,myAddress,secretjs,contractAddress,contractcodehash}) => {
    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [surveys,setSurveys] = useState([])
    const [tableData,setTableData] = useState()
    const [ques1Stats,setQues1Stats] = useState()
    const [ques2Stats,setQues2Stats] = useState()

    const handleSurveyClick = (survey) => {
        const fetchData = async () =>{
            setLoading(true);
            const res = await get_researcher_summary(secretjs,viewKey,contractAddress,contractcodehash,survey.survey_id);
            console.log(res);
            // check if 'Ok' is in the response
            if (!('Ok' in res)) {
                console.log('Error in fetching survey summary');
                setLoading(false);
                return;
            }
            let table_data = extractFormattedResponses(JSON.stringify(res['Ok']));
            let extractQuestion1StatsRes = extractQuestion1Stats(JSON.stringify(res['Ok']));
            console.log(extractQuestion1StatsRes);
            let extractQuestion2StatsRes = extractQuestion2Stats(JSON.stringify(res['Ok']));
            setTableData(table_data);
            setQues1Stats(extractQuestion1StatsRes);
            setQues2Stats(extractQuestion2StatsRes);
            setSelectedSurvey(survey);
            setLoading(false);
        }
        fetchData();
    };


      useEffect(()=>{
        if(viewKey){
            const fetchData= async () =>{
                setLoading(true);
                const response = await get_my_created_surveys(secretjs,viewKey,contractAddress,contractcodehash);
                console.log(response);
                setSurveys(response);
                setLoading(false);
            }
            fetchData();
        }
    },[viewKey])

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div className='leftside' style={{ flex: '0 0 30%', overflow: 'auto', display: 'block'}}>
                {/* Content for the left column (list of surveys) */}
                <SurveyList surveys={surveys} title="Your Surveys" handleSurveyClick={handleSurveyClick} />
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
                                    <SurveyCard survey={selectedSurvey} />
                                </div>
                            </div>
                        </div>
                        <div style={{ flex: 1, margin: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                {/* Second vertical stacked div */}
                                <BeautifulTable  tableData={tableData}/>
                            </div>
                        </div>
                        <div style={{ flex: 1, margin: '10px' }}>
                            {/* Third vertical stacked div */}
                            <div className="subcomponent">
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <ChartComponent dataDict={ques1Stats} chartName="Ques1 Stats"/>
                                    <ChartComponent dataDict={ques2Stats} chartName="Ques2 Stats"/>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResearcherDashboard;
