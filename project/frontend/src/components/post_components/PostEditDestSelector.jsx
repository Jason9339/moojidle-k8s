import Select from "react-select"
import { useMemo } from "react";
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

        <div className="flex w-[60vw] h-[20%] pt-[5vh] ">
            <Select
                className="w-[40%]"
                options={courseOptions}
                isDisabled={isDisabled}
                onChange={onCourseChange}
                value={selectedCourse}
                isClearable
            />


            <Select

                className="w-[40%]"
                options={boardOptions}
                isDisabled={isDisabled}
                onChange={onBoardChange}
                value={selectedBoard}
                isClearable
            />


        </div>

    )

}
export default PostEditDestSelector;
