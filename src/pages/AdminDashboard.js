import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/admin/Sidebar_Admin";
import AdminCards from "../components/admin/Cards_Admin";
import WorldMapAdmin from "../components/admin/WorldMap_Admin";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from 'xlsx';

const statesAndUTs = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", 
  "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const AdminDashboard = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);

  const handleStateChange = (e) => setSelectedState(e.target.value);
  const handleDateChange = (date) => setSelectedDate(date);

  const fetchAttendanceData = async () => {
    if (selectedState && selectedDate) {
      const response = await fetch(`/api/filtered?state=${selectedState}&date=${selectedDate.toISOString().split('T')[0]}`);
      
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setAttendanceData(data);
      } else {
        console.error('Failed to fetch attendance data:', data.error);
      }
    }
  };

  const downloadCSV = () => {
    if (attendanceData.length === 0) {
      alert("No data to download");
      return;
    }

    const csvRows = [
      ['Email', 'Date', 'Location Latitude', 'Location Longitude', 'Image URL'],
      ...attendanceData.map(att => [
        att.user.email,
        att.date,
        att.location.lat,
        att.location.lng,
        att.image
      ])
    ];

    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'attendance_data.csv');
    link.click();
  };

  const downloadExcel = () => {
    if (attendanceData.length === 0) {
      alert("No data to download");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(attendanceData.map(att => ({
      'Email': att.user.email,
      'Date': att.date,
      'Location Latitude': att.location.lat,
      'Location Longitude': att.location.lng,
      'Image URL': att.image
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Data');

    XLSX.writeFile(wb, 'attendance_data.xlsx');
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedState, selectedDate]);

  return (
    <div className="md:flex">
      <AdminSidebar />
      <div className="flex flex-col w-full">
        <div className="mb-5 w-full flex items-center">
          
        </div>
        <div className="mb-5 w-full">
          <AdminCards />
        </div>
        <div className="flex md:mx-5 space-x-5">
          <div className="md:w-1/3 lg:w-2/3 w-full mb-2">
            <select
            value={selectedState}
            onChange={handleStateChange}
            className="p-2 border rounded mr-4"
          >
            <option value="">Select State/UT</option>
            {statesAndUTs.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className="p-2 border rounded"
          />
          <button onClick={fetchAttendanceData} className="ml-4 p-2 bg-blue-500 text-white rounded">
            Filter
          </button>
          <button onClick={downloadCSV} className="ml-4 p-2 bg-green-500 text-white rounded">
            Download CSV
          </button>
          <button onClick={downloadExcel} className="ml-4 p-2 bg-yellow-500 text-white rounded">
            Download Excel
          </button>
          </div>
          <div className="md:w-1/2 lg:w-1.2/3 w-full mb-2">
            <WorldMapAdmin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
