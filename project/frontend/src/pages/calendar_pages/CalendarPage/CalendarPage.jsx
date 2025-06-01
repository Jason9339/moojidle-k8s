import { useEffect, useState } from "react";
import LeftBar from "@/components/LeftBar/LeftBar";
import Calendar from "@/components/calendar_components/Calendar/Calendar";

// API
import { GetCalendarEventsByUserId } from "@/services/CalendarApi";

import styles from "./CalendarPage.module.css";

const DEFAULT_COLORS = ['#D3A4FF', '#7D7DFF', '#C4E1E1', '#7AFEC6', '#D9B300', '#82D900', '#C48888', '#9999CC'];
const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [legendItems, setLegendItems] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const userId = JSON.parse(localStorage.getItem("user")).user_id;
            const data = await GetCalendarEventsByUserId(userId);

            let evts = [];
            let colorSet = new Set();
            // (Legend) For course variants record. 
            const map = new Map();
            data.forEach(item => {

                let icolor = item?.color;
                if (item?.name && icolor && !map.has(item.name)) {

                    if (colorSet.has(item.color)) {

                        for (const color of DEFAULT_COLORS) {

                            if (!colorSet.has(color)) {
                                icolor = color;
                                colorSet.add(color);
                                break;
                            }
                        }
                    }

                    colorSet.add(icolor);
                    map.set(item.name, icolor)
                }
                item.events.forEach((event) => {
                    evts.push({ ...event, child: { name: event.title, color: icolor, event } });
                })

            })

            evts = evts.flat();
            setLegendItems(Array.from(map, ([name, color]) => ({ name, color })))
            setEvents(evts);
        };
        fetchEvents();
    }, []);

    // Extract unique legend items from event.child

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
                        <h3 className={styles.legendTitle}>我的課程</h3>
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

