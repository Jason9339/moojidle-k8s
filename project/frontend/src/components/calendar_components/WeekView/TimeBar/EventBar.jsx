import styles from './EventBar.module.css'
const EventBar = ({ text }) => {
    return (

        <div
            className={styles.weekEvent}
        >
            <span className={styles.eventTime}>
                {text}
                {/* {format(seg.start, 'HH:mm')} */}
            </span>
            {/* <span className={styles.eventTitle}>{seg.evt.title}</span> */}
        </div>
    )
}

export default EventBar;
