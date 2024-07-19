import React from "react";
import { FaChartLine } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
      text: "",
    },
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day',
        tooltipFormat: 'PP',
      },
      title: {
        display: true,
        text: 'Date',
      },
    },
    y: {
      type: 'time',
      time: {
        unit: 'hour',
        parser: 'HH:mm',
        displayFormats: {
          hour: 'ha',
        },
      },
      min: '08:00',
      max: '12:00',
      title: {
        display: true,
        text: 'Time',
      },
    },
  },
  elements: {
    point: {
      radius: 0, // Set point radius to 0 to hide the points
    },
  },
};

// Function to generate dates for the past week
const generateDates = () => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
  }
  return dates;
};

const labels = generateDates();

export const data = {
  labels,
  datasets: [
    {
      label: "Checkin Time",
      data: labels.map(date => ({
        x: date,
        y: new Date(
          new Date(date).setHours(8 + Math.random() * 4, Math.random() * 60)
        ).toISOString(),
      })),
      borderWidth: 3,
      borderColor: "#6366f1",
      fill: "start",
      tension: 0.3,
    },
  ],
};

const LineChart = () => {
  return (
    <div className="w-full mt-20"> {/* Increased top margin */}
      <div className="flex items-center mb-4">
        <FaChartLine className="mr-2 text-blue-500" />
        <span className="text-gray-400 font-normal">Checkin Time</span>
      </div>
      <div className="w-full">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default LineChart;