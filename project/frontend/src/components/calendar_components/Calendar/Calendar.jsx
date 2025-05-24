import React, { useState, useCallback } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import Toolbar from '../Toolbar/Toolbar';
import WeekView from '../WeekView/WeekView/WeekView';
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from './Calendar.module.css';

import { format, parse, startOfWeek, getDay } from 'date-fns'
import zhTW from 'date-fns/locale/zh-TW'

const locales = { 'zh-TW': zhTW }
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales })

const Calendar = ({ events, ...props }) => {

    const [date, setDate] = useState(new Date())
    const [view, setView] = useState('month');
    const handleNavigate = useCallback(newDate => setDate(newDate), [setDate]);
    const handleView = useCallback(newView => setView(newView), [setView]);
    return (

        <BigCalendar

            className={styles.calendar}
            events={events}
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"

            views={{
                month: true,
                week: WeekView,
                day: true,
            }}

            view={view}
            date={date}
            onNavigate={handleNavigate}
            onView={handleView}
            components={{ toolbar: Toolbar }}

            dayLayoutAlgorithm="no-overlap"
            eventPropGetter={event => {
                const backgroundColor = event.child?.color || '#3174ad'
                return {
                    style: {
                        backgroundColor,
                        borderColor: backgroundColor,
                        color: '#fff',
                    }
                }
            }}
            {...props}
        />
    );
};

export default Calendar;

