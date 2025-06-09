import React from "react"

const Button = React.forwardRef(({ variant = "default", size = "default", className = "", children, ...props }, ref) => {
    const variantClass = {
        default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-zinc-200 hover:bg-zinc-300 text-zinc-900 focus:ring-zinc-500",
        ghost: "hover:bg-zinc-100 text-zinc-900",
        cancel: "bg-gray-300 text-[#222222] hover:bg-gray-400",
        confirm: "bg-[#60A5FA] text-[#222222] hover:bg-[#3B82F6]"
    }[variant]
    const sizeClass = size === "icon" ? "h-11 w-11 p-0" : "h-11 px-4 py-2 min-w-[72px]"
    return (
        <button
            type="button"
            ref={ref}
            {...props}
            className={`${variantClass} ${sizeClass} ${className} inline-flex items-center justify-center rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none`}
        >
            {children}
        </button>
    )
})

export default Button;
