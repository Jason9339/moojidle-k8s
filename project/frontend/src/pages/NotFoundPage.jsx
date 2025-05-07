import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <div>
            <h1> Page Not Found</h1>
            <Link to={"/"}>
                <button>Back</button>
            </Link> 
        </div>
    )
}

export default NotFoundPage;