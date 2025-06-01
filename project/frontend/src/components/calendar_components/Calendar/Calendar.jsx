import React, { useState, useCallback, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import Toolbar from '../Toolbar/Toolbar';
import WeekView from '../WeekView/WeekView/WeekView';
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from './Calendar.module.css';
import moment from 'moment';
moment.locale('zh-tw')
const localizer = momentLocalizer(moment)

const Calendar = ({ events, ...props }) => {

    const [date, setDate] = useState(new Date())
    const [view, setView] = useState('month')
    const handleNavigate = useCallback(newDate => setDate(newDate), [setDate]);
    const [monthEvents, setMonthEvents] = useState([]);


    useEffect(() => {
        const monthEvts = events.map(({ end, ...rest }) => (
            {
                ...rest,
                start: moment(end).startOf('day').toDate(),
                end: end
            }
        ))
        setMonthEvents(monthEvts);
    }, [events])
    const handleViewChange = useCallback(view => {

        setView(view);
    }, [])
    return (

        <BigCalendar

            className={styles.calendar}
            events={view === 'month' ? monthEvents : events}
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"

            views={{
                month: true,
                week: WeekView,
                day: true,
            }}

            date={date}
            onNavigate={handleNavigate}
            view={view}
            onView={handleViewChange}
            components={{ toolbar: Toolbar }}

            dayLayoutAlgorithm="no-overlap"
            eventPropGetter={event => {
                const backgroundColor = event.child?.color || '#3174ad'
                return {
                    style: {
                        backgroundColor,
                        borderColor: backgroundColor,
                        color: '#000000',
                    }
                }
            }}
            {...props}
        />
    );
};

export default Calendar;

