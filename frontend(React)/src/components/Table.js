import React from 'react';

const BeautifulTable = ({ tableData }) => {
  return (
    <table style={{ borderCollapse: 'collapse', width: '90%' }}>
      <thead>
        <tr>
          <th style={{ backgroundColor: '#252E55', color: 'white', padding: '10px', textAlign: 'left' }}>
            <span style={{ fontWeight: 'bold', color: 'white' }}>Respondent</span>
          </th>
          <th style={{ backgroundColor: '#252E55', color: 'white', padding: '10px', textAlign: 'left' }}>
            <span style={{ fontWeight: 'bold', color: 'white' }}>Answer 1</span>
          </th>
          <th style={{ backgroundColor: '#252E55', color: 'white', padding: '10px', textAlign: 'left' }}>
            <span style={{ fontWeight: 'bold', color: 'white' }}>Answer 2</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => (
          <tr key={index}>
            <td style={{ border: '1px solid gray', padding: '10px' }}>{row.respondent}</td>
            <td style={{ border: '1px solid gray', padding: '10px' }}>
              {row.answer1 === false ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span role="img" aria-label="locked" style={{ marginRight: '5px' }}>🔒</span> {/* Lock symbol */}
                  Hidden {/* Display the value */}
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {row.answer1}
                </span>
              )}
            </td>
            <td style={{ border: '1px solid gray', padding: '10px' }}>
              {row.answer2 === false ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span role="img" aria-label="locked" style={{ marginRight: '5px' }}>🔒</span> {/* Lock symbol */}
                  Hidden {/* Display the value */}
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {row.answer2}
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BeautifulTable;
