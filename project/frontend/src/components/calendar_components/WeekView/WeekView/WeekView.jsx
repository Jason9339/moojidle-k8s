import React, { useState } from 'react'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import startOfWeek from 'date-fns/startOfWeek'
import styles from './WeekView.module.css'

const EVENT_DEFAULT_COLOR = "#3174ad";
const EVENT_HEIGHT = 30;
const EVENT_GAP = 4;
const TOOLTIP_OFFSET_LEFT = -20;
const TOOLTIP_WIDTH = '200px';
const TOOLTIP_HEIGHT = '100px';


function WeekTimeView({
    date,
    events,
    accessors: { start: getStart, end: getEnd },
    localizer,
}) {

    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltip, setTooltip] = useState({});
    const weekStart = WeekTimeView.range(date).start
    const weekEndNext = addDays(weekStart, 7)
    const totalMs = weekEndNext.getTime() - weekStart.getTime()


    // segments keeps the information of a bar
    const segments = events
        .filter(evt => {

            // keep only events in current week 
            const evtStart = getStart(evt).getTime()
            const evtEnd = getEnd(evt).getTime()
            return evtEnd > weekStart.getTime() && evtStart < weekEndNext.getTime()
        })
        .map(evt => {
            const evtStart = getStart(evt)
            const evtEnd = getEnd(evt)
            const startClamped = Math.max(evtStart.getTime(), weekStart.getTime())
            const endClamped = Math.min(evtEnd.getTime(), weekEndNext.getTime())
            const leftPct = ((startClamped - weekStart.getTime()) / totalMs) * 100
            const widthPct = ((endClamped - startClamped) / totalMs) * 100

            // fill in evt missing data
            if (!evt.child.color) evt.child.color = EVENT_DEFAULT_COLOR;
            return { evt: evt, start: evtStart, leftPct, widthPct }
        });

    // Stack vertically
    const rows = []
    segments.forEach(seg => {
        let placed = false
        for (let r = 0; r < rows.length; r++) {
            const clash = rows[r].some(s =>
                !(seg.leftPct + seg.widthPct <= s.leftPct || seg.leftPct >= s.leftPct + s.widthPct)
            )
            if (!clash) {
                rows[r].push(seg)
                seg.row = r
                placed = true
                break
            }
        }
        if (!placed) {
            seg.row = rows.length
            rows.push([seg])
        }
    })

    console.log("segments", segments);
    return (
        <div className={styles.container}>


            <div className={styles.header}>
                {Array.from({ length: 7 }).map((_, i) => {
                    const d = addDays(weekStart, i)
                    return (
                        <div key={d.toISOString()} className={styles.headerCell}>
                            {localizer.format(d, 'EEE MM/dd')}
                        </div>
                    )
                })}
            </div>


            <div className={styles.body}>
                <div className={styles.gridOverlay} />

                {/* Event bars */}
                {segments.map((seg, idx) => {
                    const top = seg.row * (EVENT_HEIGHT + EVENT_GAP);
                    return (
                        <div
                            key={idx}
                            className={styles.weekEvent}
                            style={{
                                position: 'absolute',
                                left: `${seg.leftPct}%`,
                                width: `${seg.widthPct}%`,
                                top: top,
                                height: EVENT_HEIGHT,
                                backgroundColor: seg.evt.child.color
                            }}
                            onMouseEnter={(e) => {
                                setShowTooltip(true);
                                setTooltip({ top: e.clientY, left: e.clientX, title: seg.evt.title });
                            }
                            }
                            onMouseLeave={() => setShowTooltip(false)}
                        >

                            <span className={styles.eventTime}>
                                {format(seg.start, 'HH:mm')}
                            </span>

                            <span className={styles.eventTitle}>
                                {seg.evt.title}
                            </span>

                            {/* tooltip */}
                            {
                                showTooltip &&
                                <div
                                    className={styles.tooltip}
                                    style={{
                                        top: tooltip.top,
                                        left: tooltip.left - TOOLTIP_OFFSET_LEFT,
                                        width: TOOLTIP_WIDTH,
                                        height: TOOLTIP_HEIGHT
                                    }}>

                                    <span> {tooltip.title}</span>

                                </div>
                            }
                        </div>


                    )
                })}
            </div>


        </div>
    )
}

WeekTimeView.range = date => {

    // Sunday -> Saturday
    const start = startOfWeek(date)
    const end = addDays(start, 6)
    return { start, end }
}

WeekTimeView.navigate = (date, action) => {
    switch (action) {
        case 'PREV': return addDays(date, -7)
        case 'NEXT': return addDays(date, 7)
        default: return date
    }
}

WeekTimeView.title = date => {
    const { start, end } = WeekTimeView.range(date)
    return `${format(start, 'MMM d')} – ${format(end, 'MMM d')}`
}


export default WeekTimeView
