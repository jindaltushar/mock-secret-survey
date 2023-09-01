import React from 'react';
import { Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

const SurveyDetails = () => {
    const selectedSurvey = {
        survey_title: 'Sample Survey',
        questions: ['Question 1', 'Question 2'],
        quest1options: ['Option A', 'Option B', 'Option C', 'Option D'],
        quest2options: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
    };
    if (!selectedSurvey) {
        return <div>Select a survey to view details</div>;
    }

    // Dummy data for options frequency
    const question1OptionsFrequency = [15, 10, 5, 20];
    const question2OptionsFrequency = [8, 12, 18, 15];

    const data = {
        labels: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        datasets: [
            {
                label: 'Question 1',
                data: question1OptionsFrequency,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            },
            {
                label: 'Question 2',
                data: question2OptionsFrequency,
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <h2>{selectedSurvey.survey_title}</h2>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>Questions</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedSurvey.questions.map((question, index) => (
                        <tr key={index}>
                            <td>{question}</td>
                            <td>{selectedSurvey[`quest${index + 1}options`].join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div style={{ marginTop: '20px' }}>
                <Bar data={data} />
            </div>
        </div>
    );
};

export default SurveyDetails;
