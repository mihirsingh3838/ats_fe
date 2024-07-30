import { useState } from 'react';
import { toast } from 'react-hot-toast';

const OPENCAGE_API_KEY = process.env.REACT_APP_OPENCAGE_API_KEY;
const apiUrl = process.env.REACT_APP_API_URL || '';

export const useAttendance = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const markAttendance = async (imageSrc, location, userId) => {
    setIsLoading(true);
    setError(null);
    toast.loading('Submitting attendance...');

    const token = JSON.parse(localStorage.getItem('user')).token;

    const formData = new FormData();
    formData.append('image', imageSrc);
    formData.append('location', JSON.stringify(location));
    formData.append('userId', userId);

    try {
      const response = await fetch(`${apiUrl}/api/attendance`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error);
      }
      toast.dismiss();
      toast.success('Attendance marked successfully!');
    } catch (err) {
      setError(err.message);
      toast.dismiss();
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttendanceByDate = async (date) => {
    setIsLoading(true);
    setError(null);
    toast.loading('Fetching attendance...');

    const token = JSON.parse(localStorage.getItem('user')).token;

    try {
      const response = await fetch(`${apiUrl}/api/attendance?date=${date}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error);
      }

      toast.dismiss();
      toast.success('Attendance fetched successfully!');
      return json;
    } catch (err) {
      setError(err.message);
      toast.dismiss();
      toast.error(`Error: ${err.message}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllAttendance = async () => {
    setIsLoading(true);
    setError(null);
    toast.loading('Fetching all attendance...');

    const token = JSON.parse(localStorage.getItem('user')).token;

    try {
      const response = await fetch(`${apiUrl}/api/attendance/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error);
      }

      toast.dismiss();
      toast.success('All attendance fetched successfully!');
      return json.map(attendance => ({
        ...attendance,
        date: new Date(attendance.date).toISOString(),
        timestamp: new Date(attendance.timestamp).toISOString(),
      }));
    } catch (err) {
      setError(err.message);
      toast.dismiss();
      toast.error(`Error: ${err.message}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationName = async (lat, lng) => {
    try {
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_API_KEY}`);
      const data = await response.json();

      if (data.results.length > 0) {
        return data.results[0].formatted;
      } else {
        throw new Error("No results found");
      }
    } catch (error) {
      setError(error.message);
      toast.error(`Error: ${error.message}`);
      return "Unknown location";
    }
  };

  return { markAttendance, fetchAttendanceByDate, fetchAllAttendance, getLocationName, isLoading, error };
};
