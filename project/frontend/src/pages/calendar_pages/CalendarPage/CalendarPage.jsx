
import { useEffect, useState } from "react";
import LeftBar from "@/components/LeftBar/LeftBar";
import Calendar from "@/components/calendar_components/Calendar/Calendar";

// API
import { GetCalendarEventsByUserId } from "@/services/CalendarApi";

import styles from "./CalendarPage.module.css";

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [legendItems, setLegendItems] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const userId = JSON.parse(localStorage.getItem("user")).user_id;
            const data = await GetCalendarEventsByUserId(userId);

            const e = [];

            // (Legend) For course variants record. 
            const map = new Map();
            data.forEach(item => {

                if (item?.name && item?.color && !map.has(item.name)) {

                    map.set(item.name, item.color)
                }
                item.events.forEach((event) => {
                    e.push({ ...event, child: { name: event.title, color: item.color } });
                })

            })

            setLegendItems(Array.from(map, ([name, color]) => ({ name, color })))
            setEvents(e.flat());
        };
        fetchEvents();
    }, []);

    console.log("events:", events);
    // Extract unique legend items from event.child

    return (
        <>
            <LeftBar />
            <div className={styles.container}>
                {/* 左側：主日曆 */}
                <div id="main-calendar" className={styles.mainCalendar}>
                    <Calendar events={events} />
                </div>

                {/* 右側：小日曆 + 圖例 */}
                <aside id="sidebar" className={styles.sidebar}>
                    <div className={styles.legend}>
                        <h3 className={styles.legendTitle}>Legend</h3>
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

