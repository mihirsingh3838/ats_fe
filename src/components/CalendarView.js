import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the styles for the calendar
import { useAttendance } from '../hooks/useAttendance';
import Modal from './Modal'; // Import the Modal component

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [locationNames, setLocationNames] = useState({});
  const { fetchAttendanceByDate, getLocationName } = useAttendance();

  const handleDateClick = async (date) => {
    const formattedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0];
    setSelectedDate(formattedDate);

    const data = await fetchAttendanceByDate(formattedDate);
    setAttendanceData(data);
    setShowModal(true);
  };

  useEffect(() => {
    if (showModal && attendanceData.length > 0) {
      attendanceData.forEach(async (attendance) => {
        const locationKey = `${attendance.location.lat},${attendance.location.lng}`;
        if (!locationNames[locationKey]) {
          const locationName = await getLocationName(attendance.location.lat, attendance.location.lng);
          setLocationNames((prev) => ({ ...prev, [locationKey]: locationName }));
        }
      });
    }
  }, [showModal, attendanceData]);

  const convertToIST = (timestamp) => {
    const date = new Date(timestamp);
    const options = { timeZone: 'Asia/Kolkata', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return date.toLocaleTimeString('en-IN', options);
  };

  return (
    <>
      <div className="flex mx-2">
        <div className="w-full flex flex-col items-center p-2 bg-white rounded-md">
          <Calendar className="w-full p-5" onClickDay={handleDateClick} />
        </div>
      </div>

      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        title={`Attendance for ${selectedDate}`}
        desc={
          attendanceData.length > 0 ? (
            attendanceData.map((attendance) => (
              <div key={attendance._id} className="border p-2 mb-2">
                <p>Time: {convertToIST(attendance.timestamp)}</p>
                <p>Latitude: {attendance.location.lat}</p>
                <p>Longitude: {attendance.location.lng}</p>
                <p>Location: {locationNames[`${attendance.location.lat},${attendance.location.lng}`] || "Loading..."}</p>
                <img src={attendance.image} alt="Attendance" className="mt-2 w-32 h-32 object-cover rounded" />
              </div>
            ))
          ) : (
            <p>No attendance records for this date.</p>
          )
        }
      />
    </>
  );
};

export default CalendarView;
