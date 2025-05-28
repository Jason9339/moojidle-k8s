
import React, { useState } from 'react'
import moment from 'moment'
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
}) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltip, setTooltip] = useState({});

    const weekStartMoment = moment(date).startOf('week');
    const weekEndNextMoment = moment(weekStartMoment).add(7, 'days');
    const totalMs = weekEndNextMoment.valueOf() - weekStartMoment.valueOf();

    const segments = events
        .filter(evt => {
            const evtStartVal = moment(getStart(evt)).valueOf();
            const evtEndVal = moment(getEnd(evt)).valueOf();
            return evtEndVal > weekStartMoment.valueOf() && evtStartVal < weekEndNextMoment.valueOf();
        })
        .map(evt => {
            const evtStartM = moment(getStart(evt));
            const evtEndM = moment(getEnd(evt));
            const startClampedVal = Math.max(evtStartM.valueOf(), weekStartMoment.valueOf());
            const endClampedVal = Math.min(evtEndM.valueOf(), weekEndNextMoment.valueOf());
            const leftPct = ((startClampedVal - weekStartMoment.valueOf()) / totalMs) * 100;
            const widthPct = ((endClampedVal - startClampedVal) / totalMs) * 100;

            if (!evt.child.color) evt.child.color = EVENT_DEFAULT_COLOR;

            return {
                evt,
                startM: evtStartM,
                leftPct,
                widthPct
            };
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
                            className={styles.weekEvent}
                            style={{
                                position: 'absolute',
                                left: `${seg.leftPct}%`,
                                width: `${seg.widthPct}%`,
                                top,
                                height: EVENT_HEIGHT,
                                backgroundColor: seg.evt.child.color
                            }}
                            onMouseEnter={e => {
                                setShowTooltip(true);
                                setTooltip({ top: e.clientY, left: e.clientX, title: seg.evt.title });
                            }}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            <span className={styles.eventTime}>
                                {seg.startM.format('HH:mm')}
                            </span>
                            <span className={styles.eventTitle}>
                                {seg.evt.title}
                            </span>

                            {showTooltip && (
                                <div
                                    className={styles.tooltip}
                                    style={{
                                        top: tooltip.top,
                                        left: tooltip.left - TOOLTIP_OFFSET_LEFT,
                                        width: TOOLTIP_WIDTH,
                                        height: TOOLTIP_HEIGHT
                                    }}
                                >
                                    <span>{tooltip.title}</span>
                                </div>
                            )}
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

