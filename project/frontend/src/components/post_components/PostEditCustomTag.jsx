import React from 'react'
import Select from 'react-select'

export default function PostEditCustomTag({
    allUserTags,
    onChange   // default to no-op if not provided
}) {
    const tagOptions = allUserTags.map(tag => ({ label: tag, value: tag }))

    const handleChange = newOpts => {
        const values = newOpts ? newOpts.map(o => o.value) : []

        // call parent change
        onChange(values)
    }

    const customStyles = {
        control: base => ({
            ...base,
            minHeight: 36,
            borderRadius: 8,
            borderColor: 'rgba(14,165,233,0.5)',
            '&:hover': { borderColor: 'rgba(14,165,233,0.7)' },
            boxShadow: 'none',
        }),
        multiValue: base => ({
            ...base,
            backgroundColor: 'rgba(14,165,233,0.5)',
            borderRadius: 8,
            padding: '2px 6px',
        }),
        multiValueLabel: base => ({
            ...base,
            color: '#fff',
            fontSize: '1rem',
            padding: 0,
            margin: 0,
        }),
        multiValueRemove: base => ({
            ...base,
            color: '#fff',
            marginLeft: 4,
            '&:hover': {
                backgroundColor: 'transparent',
                color: '#f87171',
            },
        }),
        placeholder: base => ({
            ...base,
            color: 'rgba(14,165,233,0.7)',
        }),
        menu: base => ({
            ...base,
            borderRadius: 8,
            overflow: 'hidden',
        }),
    }

    return (
        <div className="w-[60vw] h-[8vh] pt-[1vh] pb-[1vh] mt-[4vh]">
            <Select
                isMulti
                options={tagOptions}
                onChange={handleChange}
                styles={customStyles}
                closeMenuOnSelect={false}
                placeholder="Select tags…"
            />
        </div>
    )
}
