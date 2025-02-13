import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registering necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AmountChartBar = () => {
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Profit',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  });
  const [totalAmount, setTotalAmount] = useState(0); // To store the total amount

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/chart-api/totalamountchart`,{
          headers: {
              "x-api-key": process.env.REACT_APP_API_KEY, // Use environment variable
          },
      });
        const data = await response.json();

        if (data.success) {
          const last7Days = [...Array(7).keys()]
            .map((i) => {
              const date = new Date();
              date.setDate(date.getDate() - i);
              return date.toISOString().split('T')[0];
            })
            .reverse();

          const amounts = data.orders.reduce((acc, order) => {
            acc[order.paymentDate] = order.totalAmount;
            return acc;
          }, {});

          const amountsForLast7Days = last7Days.map((date) => amounts[date] || 0);

          setChartData({
            labels: last7Days,
            datasets: [
              {
                label: 'Profit',
                data: amountsForLast7Days,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
              },
            ],
          });

          // Calculate the total amount
          setTotalAmount(amountsForLast7Days.reduce((sum, value) => sum + value, 0));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [apiUrl]);

  return (
    <div className="view-count-container">
      <h2>Last 7 Days Profit</h2>
      <Bar data={chartData} />
      <p className="tolvie">Total : {totalAmount.toFixed(2)} INR</p>
    </div>
  );
};

export default React.memo(AmountChartBar);
