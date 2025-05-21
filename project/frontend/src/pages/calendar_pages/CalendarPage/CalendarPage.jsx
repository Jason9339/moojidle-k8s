import { useEffect, useState } from "react";

import Calendar from "@/components/Calendar/Calendar";
import LeftBar from "@/components/LeftBar/LeftBar";
import { GetCalendarEventsByUserId } from "@/services/CalendarApi";
import moment from "moment/moment";

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    useEffect(() => {

        const fetchEvents = async () => {

            const userId = JSON.parse(localStorage.getItem("user")).user_id;
            const events = await GetCalendarEventsByUserId(userId);
            console.log("events:", events)
            setEvents(events);
        }

        fetchEvents()

    }, [])
    return (

        <>
            <LeftBar />
            <div>
                <Calendar events={events} />
            </div>
        </>

    );
};


export default CalendarPage;
