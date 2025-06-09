import Select from "react-select"
import { useMemo } from "react";
import styles from './PostEditDestSelector.module.css'

const customStyles = {
    valueContainer: (base) => ({
        ...base,
        display: "flex",
        flexWrap: "nowrap",
        overflowX: "hidden",
    }),
    control: (base) => ({
        ...base,
        minHeight: 36,
        borderRadius: 8,
        borderColor: "#444444",
        "&:hover": null,
        cursor: "pointer",
        boxShadow: "none",
    }),

    placeholder: (base) => ({
        ...base,
        color: "#6B7280",
    }),
    menu: (base) => ({
        ...base,
        borderRadius: 8,
        overflow: "hidden",
    }),

    singleValue: (provided) => ({
        ...provided,
        color: "#444444",
        fontWeight: 500,
    }),

    // 右邊的 x
    clearIndicator: (provided) => ({
        ...provided,
        color: "#DD2222",
        "&:hover": { color: "#FF0000" }
    }),

    // Dropdown 的每個選項
    option: (provided, { isFocused, isSelected }) => ({
        ...provided,
        cursor: 'pointer',
        zIndex: 8000,
    }),

    noOptionsMessage: (provided) => ({
        ...provided,
        color: '#999',
        fontStyle: 'italic',
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
                placeholder="選擇課程..."
                isClearable
            />


            <Select

                className={styles.select}
                options={boardOptions}
                isDisabled={isDisabled}
                onChange={onBoardChange}
                value={selectedBoard}
                styles={customStyles}
                placeholder="選擇討論版..."
                isClearable
            />


        </div>

    )

}
export default PostEditDestSelector;
