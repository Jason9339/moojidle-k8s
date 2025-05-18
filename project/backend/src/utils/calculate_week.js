// 計算週次的輔助函數
function CalculateWeek(courseStartDate, itemDate, courseWeekNum = 16) {
    const courseDate = new Date(courseStartDate);
    const itemDate2 = new Date(itemDate);

    if (isNaN(courseDate) || isNaN(itemDate2)) return 1;

    // 將課程起始日對齊到當週的週日
    const dayOfWeek = courseDate.getDay(); // Sunday=0, Monday=1, ..., Saturday=6
    courseDate.setDate(courseDate.getDate() - dayOfWeek); // 往前推到週日

    const diffTime = itemDate2 - courseDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekNumber = Math.floor(diffDays / 7) + 1;

    return Math.min(Math.max(weekNumber, 1), courseWeekNum);
}

export default CalculateWeek;