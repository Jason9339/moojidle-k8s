import { useEffect, useState } from "react";
import LeftBar from "@/components/LeftBar/LeftBar";
import Calendar from "@/components/calendar_components/Calendar/Calendar";

// API
import { GetCalendarEventsByUserId } from "@/services/CalendarApi";

import styles from "./CalendarPage.module.css";


const typeColorMap = {
    'assignment': '#D3A4FF',
    'exam': '#7D7DFF',
}
const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [legendItems, setLegendItems] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const userId = JSON.parse(localStorage.getItem("user")).user_id;
            const events = await GetCalendarEventsByUserId(userId);

            // (Legend) For course variants record. 
            const map = new Map();

            events.forEach(evt => {

                evt.child.color = typeColorMap[evt.type];
                if (!map.has(evt.type)) {
                    map.set(evt.type, evt.child.color);
                }
            })

            setLegendItems(Array.from(map, ([name, color]) => ({ name, color })))
            console.log("events:", events)
            setEvents(events);
        };
        fetchEvents();
    }, []);



    return (
        <>
            <LeftBar />
            <div className={styles.container}>
                {/* 主日曆 */}
                <div id="main-calendar" className={styles.mainCalendar}>
                    <Calendar events={events} />
                </div>

                {/* 圖例 */}
                <aside id="sidebar" className={styles.sidebar}>
                    <div className={styles.legend}>
                        <h3 className={styles.legendTitle}>類別</h3>
                        <ul className={styles.legendList}>
                            {legendItems.map(item => (
                                <li key={item.name} className={styles.legendItem}>
                                    <div
                                        className={styles.legendColor}
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className={styles.legendLabel}>{item.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </>
    );
};

export default CalendarPage;

