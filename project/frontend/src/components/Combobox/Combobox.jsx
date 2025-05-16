
import React, { useState, useRef, useEffect } from 'react';

/**
 * Simple Combobox without filter: always shows full options list.
 * @param {{ value: string, label: string }[]} options - Option list.
 * @param {string} placeholder - Input placeholder.
 * @param {string|null} defaultValue - Value of the default selected option.
 * @param {(value: string) => void} onChange - Callback when an option is selected.
 * @param {string} className - Extra container classes.
 */
export default function Combobox({
    options = [],
    placeholder = '請選擇…',
    defaultValue = null,
    onChange = () => { },
    className = '',
    enable = true
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const containerRef = useRef(null);

    useEffect(() => {
        if (defaultValue !== null) {
            const opt = options.find(o => o.value === defaultValue);
            if (opt) {
                setQuery(opt.label);
            }
        }
    }, [defaultValue, options]);

    useEffect(() => {
        const onClickOutside = e => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const handleSelect = opt => {
        setQuery(opt.label);
        setOpen(false);
        onChange(opt.value);
    };

    return (
        <div
            ref={containerRef}
            className={`relative w-64 ${className}`}
        >
            <input
                type="text"
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={placeholder}
                value={query}
                onClick={() => { if (enable) setOpen(v => !v) }}
            />

            {open && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {options.map((opt) => (
                        <li
                            key={opt.value}
                            className="px-3 py-2 cursor-pointer flex items-center hover:bg-gray-100"
                            onClick={() => handleSelect(opt)}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

