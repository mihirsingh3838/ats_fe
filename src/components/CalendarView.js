import React from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the styles for the calendar

const CalendarView = () => {
  return (
    <>
     
      <div className="flex mx-2">
        <div className="w-full flex flex-col items-center p-2 bg-white shadow-md rounded-md">
          <Calendar className="w-full p-5" />
        </div>
      </div>
    </>
  );
};

export default CalendarView;