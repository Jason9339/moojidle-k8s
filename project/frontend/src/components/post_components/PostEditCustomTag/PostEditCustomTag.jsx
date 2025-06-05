import React, { useMemo, useCallback, useEffect, useState } from "react";
import Select, { components } from "react-select";
import styles from "./PostEditCustomTag.module.css";

const MAX_VISIBLE = 3;
export default function PostEditCustomTag({
    allUserTags,
    onChange,
    postTags = [],
}) {
    const tagOptions = useMemo(() =>
        allUserTags.map((tag) => ({ label: tag, value: tag })),
        [allUserTags]
    );

    const [selectedTags, setSelectedTags] = useState(() =>
        postTags.map(tag => ({ label: tag, value: tag })) || []
    );

    useEffect(() => {
        const newSelected = postTags.map(tag => ({ label: tag, value: tag }));
        const isSame = newSelected.length === selectedTags.length &&
            newSelected.every((v, i) => v.value === selectedTags[i].value);
        if (!isSame) {
            setSelectedTags(newSelected);
        }
    }, [postTags, selectedTags]);

    const handleChange = useCallback(
        (newOpts) => {
            const values = newOpts ? newOpts.map((o) => o.value) : [];
            onChange?.(values);
        },
        [onChange]
    );

    const handleSelectChange = (newOpts) => {
        setSelectedTags(newOpts || []);
        handleChange(newOpts);
    };



    // 自訂 MultiValue 元件：只顯示前 MAX_VISIBLE 個，之後顯示 "+X more"
    const MultiValue = (props) => {
        const { index, getValue } = props;
        const selectedValues = getValue() || [];
        const totalSelected = selectedValues.length;
        const hiddenCount = totalSelected - MAX_VISIBLE;

        if (index < MAX_VISIBLE) {
            return <components.MultiValue {...props} />;
        }
        if (index === MAX_VISIBLE) {
            return (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "4px",
                        padding: "2px 6px",
                        backgroundColor: "rgba(14,165,233,0.5)",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        color: "#fff",
                    }}
                >
                    +{hiddenCount} more
                </div>
            );
        }
        return null;
    };

    const customStyles = {
        valueContainer: (base) => ({
            ...base,
            display: "flex",
            flexWrap: "nowrap",
            overflowX: "hidden",
        }),
        control: (base) => ({
            ...base,
            minHeight: 36,
            borderRadius: 8,
            borderColor: "rgba(14,165,233,0.5)",
            "&:hover": { borderColor: "rgba(14,165,233,0.7)" },
            boxShadow: "none",
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: "rgba(14,165,233,0.5)",
            borderRadius: 8,
            padding: "2px 6px",
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: "#fff",
            fontSize: "1rem",
            padding: 0,
            margin: 0,
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: "#fff",
            marginLeft: 4,
            "&:hover": {
                backgroundColor: "transparent",
                color: "#f87171",
            },
        }),
        placeholder: (base) => ({
            ...base,
            color: "rgba(14,165,233,0.7)",
        }),
        menu: (base) => ({
            ...base,
            borderRadius: 8,
            overflow: "hidden",
            zIndex: 1000,
        }),
    };

    return (
        <div className={styles.container}>
            <Select
                isMulti
                value={selectedTags}
                options={tagOptions}
                onChange={handleSelectChange}
                styles={customStyles}
                closeMenuOnSelect={false}
                placeholder="Select tags..."
                components={{ MultiValue }}
            />
        </div>
    );
}

