import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/admin/Sidebar_Admin";
import AdminCards from "../components/admin/Cards_Admin";
import WorldMapAdmin from "../components/admin/WorldMap_Admin";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from 'xlsx';

const apiUrl = process.env.REACT_APP_API_URL || '';

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
  const [searchEmail, setSearchEmail] = useState("");
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState('');

  const handleStateChange = (e) => setSelectedState(e.target.value);
  const handleDateChange = (date) => setSelectedDate(date);
  const handleEmailChange = (e) => setSearchEmail(e.target.value);

  const fetchAttendanceData = async () => {
    if (selectedState && selectedDate) {
      const dateInIST = new Date(selectedDate);
      dateInIST.setMinutes(dateInIST.getMinutes() + 330); // Adding 330 minutes (5 hours and 30 minutes) to convert to IST

      const user = JSON.parse(localStorage.getItem('user')); // Get the user object from local storage
      const token = user ? user.token : null; // Extract the token from the user object

      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch(`${apiUrl}/api/attendance/filtered?state=${selectedState}&date=${dateInIST.toISOString().split('T')[0]}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setAttendanceData(data);
      } else {
        console.error('Failed to fetch attendance data:', data.error);
      }
    }
  };

  const fetchUserData = async () => {
    if (searchEmail) {
      const user = JSON.parse(localStorage.getItem('user')); // Get the user object from local storage
      const token = user ? user.token : null; // Extract the token from the user object

      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/attendance/user?email=${searchEmail}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
          if (data.length === 0) {
            setError('User does not exist');
            setUserData([]);
          } else {
            setError('');
            setUserData(data);
          }
        } else {
          console.error('Failed to fetch user data:', data.error);
          setError('An error occurred while fetching user data');
        }
      } catch (error) {
        console.error('An error occurred:', error);
        setError('An error occurred while fetching user data');
      }
    }
  };

  const convertToIST = (dateString) => {
    const date = new Date(dateString);
    const offset = 330; // IST offset in minutes
    date.setMinutes(date.getMinutes() + offset);
    return date.toISOString().replace('T', ' ').substring(0, 19); // Format as YYYY-MM-DD HH:mm:ss
  };

  const downloadExcel = (data, fileName) => {
    if (data.length === 0) {
      alert("No data to download");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(data.map(att => ({
      'Email': att.user.email,
      'Name': att.user.fullName,
      'Mobile Number': att.user.phoneNumber,
      'Login details': convertToIST(att.timestamp),
      'Location Latitude': att.location.lat,
      'Location Longitude': att.location.lng,
      'Reporting Manager': att.user.reportingManager
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Data');

    XLSX.writeFile(wb, `${fileName}.xlsx`);
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
            <button onClick={() => downloadExcel(attendanceData, 'attendance_data')} className="mt-4 p-2 bg-yellow-500 text-white rounded">
              Download Excel
            </button>
            <div className="mt-4">
              <input
                type="email"
                value={searchEmail}
                onChange={handleEmailChange}
                placeholder="Enter email ID"
                className="p-2 border rounded mr-4"
              />
              <button onClick={fetchUserData} className="p-2 bg-blue-500 text-white rounded mr-4">
                Search User
              </button>
              <button onClick={() => downloadExcel(userData, 'user_data')} className="p-2 bg-green-500 text-white rounded">
                Download User Data
              </button>
            </div>
            {error && <div className="mt-4 text-red-500">{error}</div>}
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
