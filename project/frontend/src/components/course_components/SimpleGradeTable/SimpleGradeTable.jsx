import { useState } from "react";

// css style
import styles from "./SimpleGradeTable.module.css";

function SimpleGradeTable() {

    const data = [
        { name: 'Alice', age: 25, city: 'New York' },
        { name: 'Bob', age: 30, city: 'London' },
        { name: 'Charlie', age: 28, city: 'Paris' },
    ];
    const columns = Object.keys(data[0]);

    return (
        <>
            <table className={styles["grade-table"]}>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col} className={styles["header-row"]}>
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className={styles["content-row"]}>
                            {columns.map((col) => (
                                <td key={col} className={styles["vlaue"]}>
                                    {row[col]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default SimpleGradeTable;
