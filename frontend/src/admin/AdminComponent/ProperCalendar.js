import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const ProperCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
        <div className="mt-3">
          <div style={{ display: "inline-block" }}>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              locale="en-IN" // Set locale for India
            />
          </div>
        </div>
    </>
  );
};

export default React.memo(ProperCalendar);
