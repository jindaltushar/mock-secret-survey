
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

class ChartComponent extends React.Component {
  render() {
    const { dataDict ,chartName } = this.props;
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: chartName,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
      },
    };
    const labels = Object.keys(dataDict);
    const dataValues = Object.values(dataDict);

    const data = {
      labels,
      datasets: [
        {
          label: 'Frequency',
          data: dataValues,
          backgroundColor: '#252E55', // Updated color
        //   barPercentage: 0.5,
        categoryPercentage: 0.4,
        //    maintain
        barThickness: 'flex',
        },
      ],
    };

    return (
    <div style={{ width:'400px',height:'300px' }}>
    <Bar options={options} data={data} width={null} height={null}/>
    </div>);
  }
}

export default ChartComponent;
