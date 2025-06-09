import React, { useMemo, useCallback, useEffect, useState } from "react";
import Select, { components } from "react-select";

const MAX_VISIBLE = 3;
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
                    backgroundColor: "#BFDBFE",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    color: "#444444",
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
        borderColor: "#444444",
        "&:hover": null,
        boxShadow: "none",
        cursor: "pointer",
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: "#F0F0F0",
        borderRadius: "1em",
        borderColor: "#CCCCCC",
        borderWidth: "1px",
        padding: "2px 6px",
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: "#333333",
        fontSize: "1rem",
        padding: 0,
        margin: 0,
    }),
    multiValueRemove: (base) => ({
        ...base,
        color: "#ff2222",
        marginLeft: 4,

        "&:hover": {
            backgroundColor: "transparent",
            color: "#f87171",
        },
    }),
    placeholder: (base) => ({
        ...base,
        color: "#6B7280",
    }),
    menu: (base) => ({
        ...base,
        borderRadius: 8,
        overflow: "hidden",
    }),
    // 右邊的 x
    clearIndicator: (provided) => ({
        ...provided,
        color: "#DD2222",
    }),
    // Dropdown 的每個選項
    option: (provided, { isFocused, isSelected }) => ({
        ...provided,
        cursor: 'pointer',
        zIndex: 8000,
    }),

    noOptionsMessage: (provided) => ({
        ...provided,
        color: '#999',
        fontStyle: 'italic',
    }),

};

export default function PostEditCustomTag({
    allUserTags,
    onChange,
    postTags = [],
    className = ""
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




    return (
        <Select
            className={`${className}`}
            isMulti
            isSearchable={false}
            value={selectedTags}
            options={tagOptions}
            onChange={handleSelectChange}
            styles={customStyles}
            closeMenuOnSelect={false}
            placeholder="選擇要顯示的 tag..."
            components={{ MultiValue }}
        />
    );
}

