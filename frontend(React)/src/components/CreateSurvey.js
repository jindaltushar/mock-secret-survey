import React, { useState } from 'react';
import { useForm } from "react-cool-form";
import { submit_survey } from "../contracts/secret-survey"
import { useHistory } from 'react-router-dom'; 
// A function to generate a random string
const generateRandomString = (length) => {
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let result = '';
for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
}
return result;
};

const CreateSurvey = ({setLoading,viewKey,myAddress,secretjs,contractAddress,contractcodehash}) => {

    const { form } = useForm();
    const history = useHistory();

    const [surveyData, setSurveyData] = useState({
        survey_title: '',
        question1: '',
        question2: '',
        quest1options: ['', '', '', ''],
        quest2options: ['', '', '', ''],
        seed: generateRandomString(10)
    })

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSurveyData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleOptionChange = (event, questionIndex, optionIndex) => {
        const newOptions = [...surveyData[`quest${questionIndex}options`]];
        newOptions[optionIndex] = event.target.value;

        setSurveyData(prevData => ({
            ...prevData,
            [`quest${questionIndex}options`]: newOptions
        }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const jsonData = {
            survey_title: surveyData.survey_title,
            question1: surveyData.question1,
            question2: surveyData.question2,
            quest1options: surveyData.quest1options,
            quest2options: surveyData.quest2options,
            seed: surveyData.seed
        };
        console.log(jsonData);
        const result = await submit_survey(secretjs,myAddress,contractAddress,contractcodehash,jsonData);
        console.log('survey id :', result);
        setLoading(false);
        history.push('/researcherDash');
        }

    return (
        <>
            <form ref={form} noValidate style={{ margin: '0.1rem auto 0', width: '30rem' }}>
                <div className="heading" style={{ padding: '0.5rem 0.5rem', textAlign: 'center', color: '#252E55', background: '#f4f4f4', borderRadius: '4px' }}>
                    Please fill in these details to submit a Secret Survey
                </div>
                <div style={{ marginBottom: '1rem', width: 'inherit' ,marginTop: '1rem'}}>
                    <input name="survey_title" placeholder="Give your Survey a title" required style={{ padding: '0 0.5rem', width: 'inherit', height: '2rem', borderRadius: '4px', border: 'none', boxSizing: 'border-box' }} value={surveyData.survey_title}
                onChange={handleInputChange}/>
                </div>
                <div style={{ marginBottom: '0.1rem', width: 'inherit' }}>
                    <input name="question1" placeholder="Your First Question" required style={{ padding: '0 0.5rem', width: 'inherit', height: '2rem', borderRadius: '4px', border: 'none', boxSizing: 'border-box' }} value={surveyData.question1}
                onChange={handleInputChange} />
                </div>
                <div style={{ marginBottom: '0.1rem', width: 'inherit', display: 'flex', alignItems: 'center',marginLeft:'1rem' }}>
                    <label style={{ marginRight: '10px', fontSize: '12px' }}>Option-1</label>
                    <input
                    name="q1o1"
                    placeholder="First Choice"
                    required
                    value={surveyData.quest1options[0]}  // Bind the value to the state
    onChange={(event) => handleOptionChange(event, 1, 0)}  // Pass questionIndex and optionIndex
                    style={{
                    padding: '0 0.5rem',
                    width: '80%', // Use the entire available width
                    height: '2rem',
                    borderRadius: '4px',
                    border: 'none',
                    boxSizing: 'border-box'
                    }}
                />
                </div>
                <div style={{ marginBottom: '0.1rem', width: 'inherit', display: 'flex', alignItems: 'center',marginLeft:'1rem' }}>
                <label style={{ marginRight: '10px', fontSize: '12px' }}>Option-2</label>
                <input
                    name="q1o2"
                    placeholder="Second Choice"
                    required
                    value={surveyData.quest1options[1]}  // Bind the value to the state
    onChange={(event) => handleOptionChange(event, 1, 1)}  // Pass questionIndex and optionIndex
                    style={{
                    padding: '0 0.5rem',
                    width: '80%', // Use the entire available width
                    height: '2rem',
                    borderRadius: '4px',
                    border: 'none',
                    boxSizing: 'border-box'
                    }}
                />
                </div>
                <div style={{ marginBottom: '0.1rem', width: 'inherit', display: 'flex', alignItems: 'center',marginLeft:'1rem' }}>
                <label style={{ marginRight: '10px', fontSize: '12px' }}>Option-3</label>
                <input
                    name="q1o3"
                    placeholder="Third Choice"
                    required
                    value={surveyData.quest1options[2]}  // Bind the value to the state
    onChange={(event) => handleOptionChange(event, 1, 2)}  // Pass questionIndex and optionIndex
                    style={{
                    padding: '0 0.5rem',
                    width: '80%', // Use the entire available width
                    height: '2rem',
                    borderRadius: '4px',
                    border: 'none',
                    boxSizing: 'border-box'
                    }}
                />
                </div>
                <div style={{ marginBottom: '1rem', width: 'inherit', display: 'flex', alignItems: 'center',marginLeft:'1rem' }}>
                <label style={{ marginRight: '10px', fontSize: '12px' }}>Option-4</label>
                <input
                    name="q1o4"
                    placeholder="Fourth Choice"
                    required
                    value={surveyData.quest1options[3]}  // Bind the value to the state
    onChange={(event) => handleOptionChange(event, 1, 3)}  // Pass questionIndex and optionIndex
                    style={{
                    padding: '0 0.5rem',
                    width: '80%', // Use the entire available width
                    height: '2rem',
                    borderRadius: '4px',
                    border: 'none',
                    boxSizing: 'border-box'
                    }}
                />
                </div>

                <div style={{ marginBottom: '0.1rem', width: 'inherit' }}>
                    <input name="question2" placeholder="Your Second Question" required style={{ padding: '0 0.5rem', width: 'inherit', height: '2rem', borderRadius: '4px', border: 'none', boxSizing: 'border-box' }} value={surveyData.question2}
                onChange={handleInputChange} />
                </div>

                <div style={{ marginBottom: '0.1rem', width: 'inherit', display: 'flex', alignItems: 'center',marginLeft:'1rem' }}>
                <label style={{ marginRight: '10px', fontSize: '12px' }}>Option-1</label>
                <input
                    name="q2o1"
                    placeholder="First Choice"
                    required
                    value={surveyData.quest2options[0]}  // Bind the value to the state
    onChange={(event) => handleOptionChange(event, 2, 0)}  // Pass questionIndex and optionIndex
                    style={{
                    padding: '0 0.5rem',
                    width: '80%', // Use the entire available width
                    height: '2rem',
                    borderRadius: '4px',
                    border: 'none',
                    boxSizing: 'border-box'
                        }}
                />
                </div>
                <div style={{ marginBottom: '0.1rem', width: 'inherit', display: 'flex', alignItems: 'center',marginLeft:'1rem' }}>
                <label style={{ marginRight: '10px', fontSize: '12px' }}>Option-2</label>
                <input
                    name="q2o2"
                    placeholder="Second Choice"
                    required
                    value={surveyData.quest2options[1]}  // Bind the value to the state
    onChange={(event) => handleOptionChange(event, 2, 1)}  // Pass questionIndex and optionIndex
                    style={{
                    padding: '0 0.5rem',
                    width: '80%', // Use the entire available width
                    height: '2rem',
                    borderRadius: '4px',
                    border: 'none',
                    boxSizing: 'border-box'
                    }}
                />
                </div>
                <div style={{ marginBottom: '0.1rem', width: 'inherit', display: 'flex', alignItems: 'center',marginLeft:'1rem' }}>
                <label style={{ marginRight: '10px', fontSize: '12px' }}>Option-3</label>
                <input
                    name="q2o3"
                    placeholder="Third Choice"
                    required
                    value={surveyData.quest2options[2]}  // Bind the value to the state
    onChange={(event) => handleOptionChange(event, 2, 2)}  // Pass questionIndex and optionIndex
                    style={{
                    padding: '0 0.5rem',
                    width: '80%', // Use the entire available width
                    height: '2rem',
                    borderRadius: '4px',
                    border: 'none',
                    boxSizing: 'border-box'
                    }}
                />
                </div>
                <div style={{ marginBottom: '1rem', width: 'inherit', display: 'flex', alignItems: 'center',marginLeft:'1rem' }}>
                <label style={{ marginRight: '10px', fontSize: '12px' }}>Option-4</label>
                <input
                    name="q2o4"
                    placeholder="Fourth Choice"
                    required
                    value={surveyData.quest2options[3]}  // Bind the value to the state
    onChange={(event) => handleOptionChange(event, 2, 3)}  // Pass questionIndex and optionIndex
                    style={{
                    padding: '0 0.5rem',
                    width: '80%', // Use the entire available width
                    height: '2rem',
                    borderRadius: '4px',
                    border: 'none',
                    boxSizing: 'border-box'
                    }}
                />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <button
                    type="button"
                    onClick={handleSubmit}
                    style={{
                        backgroundColor: '#252E55',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '20px'
                    }}
                >Submit</button>
                </div>  
            </form>
        </>
    );
}

export default CreateSurvey;