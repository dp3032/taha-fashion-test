import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

// Register chart elements
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const ProductPieChart = () => {

  const apiUrl = process.env.REACT_APP_BASE_URL;
  const [productdata, Setproductdata] = useState([]);

  // Fetch product data from the backend
   useEffect(() => {
      fetch(`${apiUrl}/product-api/products`,{
        headers: {
            "x-api-key": process.env.REACT_APP_API_KEY, 
        },
    })
      .then((response) => response.json())
      .then((data) => {
          Setproductdata(data);
      })
      .catch((error) => console.log("Something Wrong", error));
  });
  const totalProducts = productdata.length;
  // Pie chart data
  const data = {
    labels: ['Total Product'],
    datasets: [
      {
        data: [totalProducts],
        backgroundColor: ['#c2527d'],
        hoverBackgroundColor: ['#C70039'],
      },
    ],
  };

  return (
    <div className="product-pie-chart-container">
      {/* <h2>Order Chart</h2> */}
      <div className="chart-container">
        <Pie data={data} />
      </div>
    </div>
  );
};

export default React.memo(ProductPieChart);
