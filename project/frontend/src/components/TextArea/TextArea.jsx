import { useState, useLayoutEffect, forwardRef } from "react";
const TextArea = forwardRef(({ height = "200px", className, ...props }, ref) => {

    const [rows, setRows] = useState(1);

    useLayoutEffect(() => {

        if (!ref.current) return;

        const el = ref.current;
        const cs = window.getComputedStyle(el);
        const lineHeight = parseFloat(cs.lineHeight);

        const heightPx = el.clientHeight;

        const computedRows = Math.max(1, Math.floor(heightPx / lineHeight));
        setRows(computedRows);
    }, [height, ref]);
    return (
        <textarea
            {...props}
            ref={ref} rows={rows}
            className={`${className} h-[${height}]`
            }
        />)


}
);
export default TextArea;
