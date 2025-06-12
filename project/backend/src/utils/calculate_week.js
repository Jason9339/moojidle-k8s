// 計算週次的輔助函數
function CalculateWeek(courseStartDate, itemDate, courseWeekNum = 16) {
    // 確保輸入是有效的日期物件，並標準化到午夜時間
    const courseDate = new Date(courseStartDate);
    const itemDate2 = new Date(itemDate);

    if (isNaN(courseDate) || isNaN(itemDate2)) return 1;

    // 標準化時間到午夜，避免時間部分影響計算
    courseDate.setHours(0, 0, 0, 0);
    itemDate2.setHours(0, 0, 0, 0);

    // 將課程起始日對齊到當週的週日
    const dayOfWeek = courseDate.getDay(); // Sunday=0, Monday=1, ..., Saturday=6
    const courseWeekStart = new Date(courseDate);
    courseWeekStart.setDate(courseDate.getDate() - dayOfWeek); // 往前推到週日

    // 計算天數差異
    const diffTime = itemDate2.getTime() - courseWeekStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // 計算週數：diffDays / 7 + 1
    // 如果 diffDays 是負數（itemDate 在課程開始前），則返回 1
    const weekNumber = Math.floor(diffDays / 7) + 1;

    // 回傳實際的週數，不限制最大值，以便判斷是否過期
    return Math.max(weekNumber, 1);
}

export default CalculateWeek;