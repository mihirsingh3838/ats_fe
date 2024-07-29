import { useState } from 'react';


const OPENCAGE_API_KEY= process.env.REACT_APP_OPENCAGE_API_KEY
const apiUrl = process.env.REACT_APP_API_URL || '';

export const useAttendance = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const markAttendance = async (imageSrc, location, userId) => {
    setIsLoading(true);
    setError(null);

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
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttendanceByDate = async (date) => {
    setIsLoading(true);
    setError(null);

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

      return json;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllAttendance = async () => {
    setIsLoading(true);
    setError(null);
  
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
  
      // Assuming your API returns an array of attendance objects with date and timestamp
      return json.map(attendance => ({
        ...attendance,
        date: new Date(attendance.date).toISOString(),
        timestamp: new Date(attendance.timestamp).toISOString(),
      }));
    } catch (err) {
      setError(err.message);
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
      return "Unknown location";
    }
  };

  return { markAttendance, fetchAttendanceByDate, fetchAllAttendance, getLocationName, isLoading, error };
};

// Helper function to convert DataURI to Blob
// const dataURItoBlob = (dataURI) => {
//   const byteString = atob(dataURI.split(',')[1]);
//   const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
//   const ab = new ArrayBuffer(byteString.length);
//   const ia = new Uint8Array(ab);
//   for (let i = 0; i < byteString.length; i++) {
//     ia[i] = byteString.charCodeAt(i);
//   }
//   return new Blob([ab], { type: mimeString });
// };
