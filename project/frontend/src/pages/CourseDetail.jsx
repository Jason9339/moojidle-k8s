import { useParams } from "react-router-dom";

function CourseDetail() {
  const { courseId } = useParams();

  return (
    <div style={{ padding: "24px" }}>
      <h2>課程專頁：{courseId}</h2>
      {/* 後續可加上分頁、公告列表、成員、教材、討論區等 */}
    </div>
  );
}

export default CourseDetail;
