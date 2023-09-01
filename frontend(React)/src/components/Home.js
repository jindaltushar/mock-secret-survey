import React,{useState,useEffect} from 'react';
import SurveyList from './surveyList';
import { get_unanswered_surveys } from '../contracts/secret-survey';
const Home = ({setLoading,viewKey,myAddress,secretjs,contractAddress,contractcodehash}) => {

    const [unansweredSurveys,setUnansweredSurveys] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            if (viewKey) {
                setLoading(true);
                const results = await get_unanswered_surveys(secretjs, viewKey, contractAddress, contractcodehash);
                console.log(results);
                setUnansweredSurveys(results);
                setLoading(false);
            }
        };
        fetchData();
    }, [viewKey]);
    
    return ( <div className="home" style={{maxWidth:"70%", margin: "0 auto"}}>
        <SurveyList surveys={unansweredSurveys} title="All Surveys available for answering" />
        </div> 
        );
}
 
export default Home;