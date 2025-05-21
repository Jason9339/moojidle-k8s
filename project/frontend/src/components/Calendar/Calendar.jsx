import React, { useState, useCallback } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';

import moment from 'moment';
import 'moment/locale/zh-tw'

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css"
moment.locale('zh-tw')

console.log(moment().format('LL'))
const localizer = momentLocalizer(moment)
const Calendar = ({ events }) => {

    const [date, setDate] = useState(new Date())
    const [view, setView] = useState('month')

    const handleNavigate = useCallback(newDate => setDate(newDate), [setDate])
    const handleView = useCallback(newView => setView(newView), [setView])
    return (
        <BigCalendar

            events={events}
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"
            defaultView="week"
            views={["month", "week", "day"]}
            date={date}
            view={view}

            onNavigate={handleNavigate}
            onView={handleView}

            messages={{
                today: '今天',
                previous: '‹',
                next: '›',
                month: '月',
                week: '週',
                day: '日',
                agenda: '行程表',
                date: '日期',
                time: '時間',
                event: '事件'
            }}
        />
    );
};

export default Calendar;

