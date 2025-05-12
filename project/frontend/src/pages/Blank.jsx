import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Blank() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("user");

        if (user == null) {
            navigate("/login");
        } else {
            navigate("/dashboard");
        }
    }, [navigate]);

    return null; // no need for empty fragment
}

export default Blank;
