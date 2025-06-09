import Select from "react-select"
import { useMemo } from "react";
import styles from './PostEditDestSelector.module.css'

const customStyles = {
    menu: (provided) => ({
        ...provided,
        marginTop: 0,      // remove the default gutter
    }),
};
const PostEditDestSelector = ({ courseData, selectedCourse, selectedBoard, userTags, onCourseChange, onBoardChange, isDisabled }) => {
    // Memoize course options
    const courseOptions = useMemo(
        () => courseData.map(c => ({ value: c.course_id, label: c.course_name })),
        [courseData]
    );

    // Compute board options based on selected course
    const boardOptions = useMemo(() => {
        if (!selectedCourse) return [];
        const course = courseData.find(c => c.course_id === selectedCourse.value);

        return course?.boards.map(b => ({ value: b.board_id, label: b.board_name })) || [];
    }, [courseData, selectedCourse]);

    return (

        <div className={styles.container}>
            <Select
                className={styles.select}
                options={courseOptions}
                isDisabled={isDisabled}
                onChange={onCourseChange}
                value={selectedCourse}
                styles={customStyles}
                isClearable
            />


            <Select

                className={styles.select}
                options={boardOptions}
                isDisabled={isDisabled}
                onChange={onBoardChange}
                value={selectedBoard}
                styles={customStyles}
                isClearable
            />


        </div>

    )

}
export default PostEditDestSelector;
