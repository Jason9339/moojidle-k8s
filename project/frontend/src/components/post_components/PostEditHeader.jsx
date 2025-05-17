import Combobox from "@/components/Combobox/Combobox";

const PostEditHeader = ({ courseData, boardData, defaultCourseId, defaultBoardId, userTags, onCourseFilterChange, onBoardFilterChange, enable }) => {

    return (

        <>
            <div className="flex w-[70vw] h-[7.5vh] p-[5px]">
                <Combobox options={courseData} onChange={onCourseFilterChange} defaultValue={defaultCourseId} enable={enable} />
                <Combobox options={boardData} onChange={onBoardFilterChange} defaultValue={defaultBoardId} enable={enable} />
            </div>

            <div className="flex w-[70vw] h-[5vh] pl-[5px] text-center items-center">
                {userTags.map((tag, index) => (
                    <span id={`user${tag.user_id}${tag.user_tag}`} className="text-[#548C00] pl-[2vw]" key={index}>
                        {tag}
                    </span>

                ))}

            </div>

        </>




    )

}
export default PostEditHeader;
