import React, { useState, useEffect, useCallback } from "react";
import AdminSidebar from "../components/admin/Sidebar_Admin";
import AdminCards from "../components/admin/Cards_Admin";
import WorldMapAdmin from "../components/admin/WorldMap_Admin";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';

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
  const [fetchingData, setFetchingData] = useState(false); // Added fetching state

  const handleStateChange = (e) => setSelectedState(e.target.value);
  const handleDateChange = (date) => setSelectedDate(date);
  const handleEmailChange = (e) => setSearchEmail(e.target.value);

  const fetchAttendanceData = useCallback(async () => {
    if (selectedState && selectedDate) {
      const dateInIST = new Date(selectedDate);
      dateInIST.setMinutes(dateInIST.getMinutes() + 330); // Adding 330 minutes (5 hours and 30 minutes) to convert to IST

      const user = JSON.parse(localStorage.getItem('user')); // Get the user object from local storage
      const token = user ? user.token : null; // Extract the token from the user object

      if (!token) {
        toast.error('No token found');
        return;
      }

      setFetchingData(true); // Set fetching state to true
      try {
        const response = await fetch(`${apiUrl}/api/attendance/filtered?state=${selectedState}&date=${dateInIST.toISOString().split('T')[0]}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        const data = await response.json();

        if (response.ok) {
          setAttendanceData(data);
          toast.success('Attendance data fetched successfully');
        } else {
          console.error('Failed to fetch attendance data:', data.error);
          toast.error('Failed to fetch attendance data');
        }
      } catch (error) {
        console.error('An error occurred:', error);
        toast.error('An error occurred while fetching attendance data');
      } finally {
        setFetchingData(false); // Reset fetching state
      }
    }
  }, [selectedState, selectedDate]);

  const fetchUserData = async () => {
    if (searchEmail) {
      const user = JSON.parse(localStorage.getItem('user')); // Get the user object from local storage
      const token = user ? user.token : null; // Extract the token from the user object

      if (!token) {
        toast.error('No token found');
        return;
      }

      setFetchingData(true); // Set fetching state to true
      try {
        const response = await fetch(`${apiUrl}/api/attendance/user?email=${searchEmail}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        const data = await response.json();

        if (response.ok) {
          if (data.length === 0) {
            setError('User does not exist');
            setUserData([]);
            toast.error('User does not exist');
          } else {
            setError('');
            setUserData(data);
            toast.success('User data fetched successfully');
          }
        } else {
          console.error('Failed to fetch user data:', data.error);
          setError('An error occurred while fetching user data');
          toast.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('An error occurred:', error);
        setError('An error occurred while fetching user data');
        toast.error('An error occurred while fetching user data');
      } finally {
        setFetchingData(false); // Reset fetching state
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
      toast.error("No data to download");
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
    toast.success(`${fileName} downloaded successfully`);
  };

  useEffect(() => {
    if (selectedState && selectedDate) {
      fetchAttendanceData();
    }
  }, [fetchAttendanceData, selectedState, selectedDate]);

  return (
    <div className="md:flex flex-wrap">
      <AdminSidebar className="w-full md:w-1/4" />
      <div className="flex flex-col w-full md:w-3/4 p-4">
        <div className="mb-5 w-full">
          <AdminCards />
        </div>
        <div className="flex flex-col md:flex-row md:mx-5 space-y-5 md:space-y-0 md:space-x-5">
          <div className="md:w-1/3 lg:w-2/3 w-full mb-2 space-y-4">
            <div className="flex flex-col space-y-4">
              <select
                value={selectedState}
                onChange={handleStateChange}
                className="p-2 border rounded"
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
                className="p-2 border rounded w-full"
                placeholderText="Select Date"
              />
              <button
                onClick={() => downloadExcel(attendanceData, 'attendance_data')}
                className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-700 transition duration-300 w-full"
              >
                Download State Data
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <input
                type="email"
                value={searchEmail}
                onChange={handleEmailChange}
                placeholder="Enter registered email"
                className="p-2 border rounded w-full"
              />
              <button
                onClick={fetchUserData}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 w-full"
              >
                Search User Data
              </button>
              {error && <div className="text-red-600">{error}</div>}
              <button
                onClick={() => downloadExcel(userData, 'user_data')}
                className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 transition duration-300 w-full"
              >
                Download User Data
              </button>
            </div>
          </div>
          <div className="md:w-2/3 lg:w-1/3 w-full">
            <WorldMapAdmin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
