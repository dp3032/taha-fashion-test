import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const OrderRefundChart  = () => {
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const [orderCount, setOrderCount] = useState(0);
  const [ordersuccessCount, setordersuccessCount] = useState(0);

  // Fetch data from your backend
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const orderResponse = await fetch(`${apiUrl}/chart-api/orderchart`,{
          headers: {
              "x-api-key": process.env.REACT_APP_API_KEY, // Use environment variable
          },
      })
        const orderData = await orderResponse.json();
        setOrderCount(orderData.totalProducts); // Assuming totalProducts is the count you need
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    const fetchOrderSuccesData = async () => {
      try {
        const ordersuccessResponse = await fetch(`${apiUrl}/order-api/ordersonlysuccess`,{
          headers: {
              "x-api-key": process.env.REACT_APP_API_KEY, 
          },
      })
        const { orders } = await ordersuccessResponse.json(); // Destructure the orders array from the response
        setordersuccessCount(orders.length); // Use the length of the orders array
      } catch (error) {
        console.error('Error fetching order success data:', error);
      }
    };
    fetchOrderData();
    fetchOrderSuccesData();
  },[apiUrl]);

  // Doughnut chart data
  const chartData = {
    labels: ['Orders' , 'Payment-Success'],
    datasets: [
      {
        data: [orderCount , ordersuccessCount ],
        backgroundColor: ['#36A2EB', '#FF6384', '#de5c40' ],
        hoverBackgroundColor: ['#1E8BC3', '#FF2A52', '#dc4322' ],
      },
    ],
  };

  return (
    <div className="product-pie-chart-container ">
      {/* <h4>Order and Refund Chart</h4> */}
      <Doughnut data={chartData} className="chart-container"/>
    </div>
  );
};

export default React.memo(OrderRefundChart);
