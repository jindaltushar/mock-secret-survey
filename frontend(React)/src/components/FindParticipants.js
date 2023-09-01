import React,{useEffect,useState} from "react";
import {get_question_and_options} from "../contracts/secret-survey";
import QuestionnaireComponent from "./QuestionnaireComponent";


const FindParticipants = ({setLoading,viewKey,myAddress,secretjs,contractAddress,contractcodehash}) => {

    const [questions, setQuestions] = useState();

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const questions = await get_question_and_options(secretjs, contractAddress, contractcodehash);
                console.log(questions);
                setQuestions(questions);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, [viewKey]);


    return (
        <>
        {questions && (
        <QuestionnaireComponent questionsData={questions} setLoading={setLoading} viewKey={viewKey} myAddress={myAddress} secretjs={secretjs} contractAddress={contractAddress} contractcodehash={contractcodehash} />
        )}
        </>
      );
}
 
export default FindParticipants;