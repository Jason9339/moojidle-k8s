import { useState, useRef, useLayoutEffect } from "react";
const TextArea = ({ height = "200px", className, ...props }) => {

    const ref = useRef(null);
    const [rows, setRows] = useState(1);

    useLayoutEffect(() => {

        if (!ref.current) return;

        const el = ref.current;
        const cs = window.getComputedStyle(el);
        const lineHeight = parseFloat(cs.lineHeight);

        const heightPx = el.clientHeight;

        const computedRows = Math.max(1, Math.floor(heightPx / lineHeight));
        setRows(computedRows);
    }, [height]);
    return (
        <textarea
            {...props}
            ref={ref}
            rows={rows}
            className={`${className} h-[${height}]`
            }
        />)


}

export default TextArea;
