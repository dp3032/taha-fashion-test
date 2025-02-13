import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { format } from "date-fns"; // Optional for formatting dates

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ViewCountChart = () => {
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const [viewCounts, setViewCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch view counts from the backend
  useEffect(() => {
    axios
      .get(`${apiUrl}/chart-api/api/views`, {
        headers: {
          "x-api-key": process.env.REACT_APP_API_KEY,
        },
      })
      .then((response) => {
        setViewCounts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching view counts:", error);
        setLoading(false);
        setError("Error loading view counts. Please try again later.");
      });
  }, [apiUrl]);

  // Calculate total view count
  const totalViewCount = viewCounts.reduce((acc, entry) => acc + entry.viewCount, 0);

  // Prepare data for the chart
  const chartData = {
    labels: viewCounts.map((entry) => format(new Date(entry.date), "MM/dd/yyyy")), // Formatting date
    datasets: [
      {
        label: "Views",
        data: viewCounts.map((entry) => entry.viewCount),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="view-count-container">
      <h2>Views in the Last 7 Days</h2>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="chart-container">
          <Bar data={chartData} />
        </div>
      )}
      <p className="tolvie"> Total Views: {totalViewCount}</p>
    </div>
  );
};

export default React.memo(ViewCountChart);
