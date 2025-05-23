
import { useEffect, useState, useMemo } from "react";
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
            const data = await GetCalendarEventsByUserId(userId);

            const e = [];
            data.forEach(item => {

                const eventsWithColor = item.events.map((event) => (
                    { ...event, color: item.color }
                ))

                e.push(eventsWithColor);
            })

            setEvents(e.flat());
        };
        fetchEvents();
    }, []);

    // console.log("events:", events);
    // Extract unique legend items from event.child
    const legendItems = useMemo(() => {
        const map = new Map();
        events.forEach(evt => {
            // assume evt.child has fields: name and color
            const { child } = evt;
            if (child?.name && child?.color && !map.has(child.name)) {
                map.set(child.name, child.color);
            }
        });
        return Array.from(map, ([name, color]) => ({ name, color }));
    }, [events]);

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
                                    <span
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

