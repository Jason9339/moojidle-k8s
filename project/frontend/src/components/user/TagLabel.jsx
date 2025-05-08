
function TagLabel({ text, color }) {
    const colorMap = {
        "red": "bg-[#CE0000]",
        "blue": "bg-[#0000E3]",
        "yellow": "bg-[#FFE153]"
    }
    console.log(text, color);
    return (
        <div
            className={`${colorMap[color] || "bg-[#ADADAD]"} w-fit h-fit rounded-[4px]`}
        > {text} </div >
    )
}


export default TagLabel;
