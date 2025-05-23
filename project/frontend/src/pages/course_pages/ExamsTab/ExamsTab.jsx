import { useOutletContext } from "react-router-dom";

function ExamsTab() {
    const { role } = useOutletContext();
    return <div>ExamsTab</div>;
}

export default ExamsTab;