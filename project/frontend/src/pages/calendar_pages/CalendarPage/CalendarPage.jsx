import { useEffect, useState } from "react";
import LeftBar from "@/components/LeftBar/LeftBar";

import Calendar from "@/components/calendar_components/Calendar/Calendar";

// API
import { GetCalendarEventsByUserId } from "@/services/CalendarApi";

import styles from "./CalendarPage.module.css";

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    useEffect(() => {

        const fetchEvents = async () => {

            const userId = JSON.parse(localStorage.getItem("user")).user_id;
            const events = await GetCalendarEventsByUserId(userId);
            setEvents(events);
        }

        fetchEvents()

    }, [])
    return (

        <>
            <LeftBar />
            <div className={styles.container}>

                {/* 左側：主日曆 Placeholder */}
                <div id="main-calendar" className={styles.mainCalendar}>
                    <Calendar events={events} />
                </div>

                {/* 右側：小日曆 + 圖例 Placeholder */}
                <aside id="sidebar" className={styles.sidebar}>
                    Sidebar Placeholder
                </aside>
            </div>
        </>

    );
};


export default CalendarPage;
