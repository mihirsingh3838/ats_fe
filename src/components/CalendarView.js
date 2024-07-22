import React, { useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the styles for the calendar
import { useAttendance } from '../hooks/useAttendance';
import Modal from './Modal'; // Import the Modal component

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { fetchAttendanceByDate } = useAttendance();

  const handleDateClick = async (date) => {
    const formattedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0];
    setSelectedDate(formattedDate);

    const data = await fetchAttendanceByDate(formattedDate);
    setAttendanceData(data);
    setShowModal(true);
  };

  const convertToIST = (timestamp) => {
    const date = new Date(timestamp);
    const options = { timeZone: 'Asia/Kolkata', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return date.toLocaleTimeString('en-IN', options);
  };

  return (
    <>
      <div className="flex mx-2">
        <div className="w-full flex flex-col items-center p-2 bg-white shadow-md rounded-md">
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
