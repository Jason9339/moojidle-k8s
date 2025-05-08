
function TagLabel({ text, color }) {
    const colorMap = {
        "red": "bg-[#CE0000]",
        "blue": "bg-[#0000E3]",
        "yellow": "bg-[#FFE153]"
    }
    return (
        <div
            className={`${colorMap[color] || "bg-[#ADADAD]"} w-fit h-fit rounded-[4px] ml-2.5`}
        > {text} </div >
    )
}


export default TagLabel;
