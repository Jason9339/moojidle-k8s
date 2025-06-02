
import React from 'react'
import moment from 'moment'
import styles from './WeekView.module.css'

const EVENT_DEFAULT_COLOR = "#3174ad";
const EVENT_HEIGHT = 30;
const EVENT_GAP = 4;

function WeekTimeView({
    date,
    events,
    accessors: { start: getStart, end: getEnd },
    onSelectEvent,
}) {

    const weekStartMoment = moment(date).startOf('week');
    const weekEndNextMoment = moment(weekStartMoment).add(7, 'days');

    const segments = events
        .filter(evt => {
            const evtStartVal = moment(getStart(evt)).valueOf();
            const evtEndVal = moment(getEnd(evt)).valueOf();
            return evtEndVal > weekStartMoment.valueOf() && evtStartVal < weekEndNextMoment.valueOf();
        })
        .map(evt => {
            const startM = moment(getStart(evt))
            const endM = moment(getEnd(evt))

            // To current week
            const startClamped = moment.max(startM, weekStartMoment)
            const endClamped = moment.min(endM, weekEndNextMoment)

            // start day index of the week
            const dayIndex = startClamped.diff(weekStartMoment, 'days')

            const rawDays = endClamped
                .clone()
                .endOf('day')
                .diff(startClamped.clone().startOf('day'), 'days', true)

            // how many days last of the events
            const spanDays = Math.max(1, Math.ceil(rawDays))

            const leftPct = (dayIndex / 7) * 100
            const widthPct = (spanDays / 7) * 100

            if (!evt.child?.color) evt.child.color = EVENT_DEFAULT_COLOR;

            return {
                evt,
                startM,
                dayIndex,
                spanDays,
                leftPct,
                widthPct,
            }
        });

    const rows = [];
    segments.forEach(seg => {
        let placed = false;
        for (let r = 0; r < rows.length; r++) {
            const clash = rows[r].some(s =>
                !(seg.leftPct + seg.widthPct <= s.leftPct || seg.leftPct >= s.leftPct + s.widthPct)
            );
            if (!clash) {
                rows[r].push(seg);
                seg.row = r;
                placed = true;
                break;
            }
        }
        if (!placed) {
            seg.row = rows.length;
            rows.push([seg]);
        }
    });

    return (
        <div className={styles.container}>
            {/* Header: 用 moment 產生每一天 */}
            <div className={styles.header}>
                {Array.from({ length: 7 }).map((_, i) => {
                    const dM = moment(weekStartMoment).add(i, 'days');
                    return (
                        <div key={dM.toISOString()} className={styles.headerCell}>
                            {dM.format('ddd MM/DD')}
                        </div>
                    );
                })}
            </div>

            <div className={styles.body}>
                <div className={styles.gridOverlay} />

                {segments.map((seg, idx) => {
                    const top = seg.row * (EVENT_HEIGHT + EVENT_GAP);
                    return (
                        <div
                            key={idx}
                            className={`${styles.weekEvent} rbc-event`}
                            style={{
                                position: 'absolute',
                                left: `${seg.leftPct}%`,
                                width: `${seg.widthPct}%`,
                                top,
                                height: EVENT_HEIGHT,
                                backgroundColor: seg.evt.child.color
                            }}
                            onClick={() => onSelectEvent(seg.evt)}
                        >
                            <span className={`${styles.eventTitle} rbc-event-content`}>
                                {seg.evt.title}
                            </span>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}

WeekTimeView.range = date => {
    const startM = moment(date).startOf('week');
    const endM = moment(startM).add(6, 'days');
    return { start: startM.toDate(), end: endM.toDate() };
};

WeekTimeView.navigate = (date, action) => {
    switch (action) {
        case 'PREV': return moment(date).add(-7, 'days').toDate();
        case 'NEXT': return moment(date).add(7, 'days').toDate();
        default: return date;
    }
};

WeekTimeView.title = date => {
    const startM = moment(date).startOf('week');
    const endM = moment(startM).add(6, 'days');
    return `${startM.format('MMM D')} – ${endM.format('MMM D')}`;
};

export default WeekTimeView;

