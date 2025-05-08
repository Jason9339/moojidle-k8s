
import React, { useState, useRef } from "react"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"
import { Bold, Italic, Code as CodeIcon, List as ListIcon, ListOrdered, Quote, Heading } from "lucide-react"

/* Basic UI components */
const Card = ({ className = "", ...props }) => (
    <div {...props} className={`border rounded-2xl shadow ${className}`} />
)
const CardContent = ({ className = "", ...props }) => (
    <div {...props} className={`p-4 ${className}`} />
)
const Button = React.forwardRef(({ variant = "default", size = "default", className = "", children, ...props }, ref) => {
    const variantClass = {
        default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-zinc-200 hover:bg-zinc-300 text-zinc-900 focus:ring-zinc-500",
        ghost: "hover:bg-zinc-100 text-zinc-900",
    }[variant]
    const sizeClass = size === "icon" ? "h-9 w-9 p-0" : "h-9 px-4 py-2 min-w-[72px]"
    return (
        <button
            ref={ref}
            {...props}
            className={`${variantClass} ${sizeClass} ${className} inline-flex items-center justify-center rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none`}
        >
            {children}
        </button>
    )
})

export default function TextEditor({ styles = {}, onTextChange, onSubmit }) {
    const [preview, setPreview] = useState(false)
    const [text, setText] = useState("")
    const textareaRef = useRef(null)
    // Wrap selected text with markers
    const wrapSelection = (before, after = before) => {
        const ta = textareaRef.current
        const start = ta.selectionStart
        const end = ta.selectionEnd
        const selected = text.slice(start, end)
        const newText = text.slice(0, start) + before + selected + after + text.slice(end)
        setText(newText)
        setTimeout(() => ta.focus(), 0)
    }

    // Prefix each selected line with prefix
    const prefixLines = (prefix) => {
        const ta = textareaRef.current
        const start = ta.selectionStart
        const end = ta.selectionEnd
        const before = text.slice(0, start)
        const selection = text.slice(start, end)
        const after = text.slice(end)
        const lines = selection.split("\n")
        const prefixed = lines.map(line => line.startsWith(prefix) ? line : prefix + line).join("\n")
        const newText = before + prefixed + after
        setText(newText)
        setTimeout(() => ta.focus(), 0)
    }

    // Toolbar buttons definition with original icons
    const toolbarItems = [
        { icon: <Bold size={16} />, action: () => wrapSelection("**", "**"), title: "Bold" },
        { icon: <Italic size={16} />, action: () => wrapSelection("*", "*"), title: "Italic" },
        { icon: <CodeIcon size={16} />, action: () => wrapSelection("`", "`"), title: "Code" },
        { icon: <Heading size={16} />, action: () => wrapSelection("## ", ""), title: "Heading" },
        { icon: <Quote size={16} />, action: () => prefixLines("> "), title: "Blockquote" },
        { icon: <ListIcon size={16} />, action: () => prefixLines("- "), title: "Bulleted List" },
        { icon: <ListOrdered size={16} />, action: () => prefixLines("1. "), title: "Numbered List" },
    ]

    return (
        <Card style={{ ...styles }}>
            <CardContent className="flex-1 overflow-auto flex flex-col test123">
                {/* Toolbar */}
                {!preview && (
                    <motion.div
                        layout
                        className="flex gap-1 px-2 py-2 border-b sticky top-0 z-10"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {toolbarItems.map((item, idx) => (
                            <Button
                                key={idx}
                                size="icon"
                                variant="ghost"
                                onClick={item.action}
                                title={item.title}
                            >
                                {item.icon}
                            </Button>
                        ))}
                    </motion.div>
                )}

                {/* Editor / Preview */}
                <div className="flex-1 overflow-auto">
                    {preview ? (
                        <div className="prose prose-blue mx-auto p-4">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                {text}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <textarea
                            ref={textareaRef}
                            value={text}
                            onChange={(e) => { setText(e.target.value); onTextChange && onTextChange(e.target.value) }}
                            placeholder=""
                            className="w-full h-full p-4 font-mono outline-none"
                        />
                    )}
                </div>
            </CardContent>

            <div className="flex justify-between items-center p-4 border-t rounded-b-2xl">
                <Button variant="ghost" onClick={() => setPreview(p => !p)}>
                    {preview ? "Edit" : "Preview"}
                </Button>
                <Button
                    variant="default"
                    onClick={() => onSubmit && onSubmit(text)}
                >
                    Comment
                </Button>
            </div>
        </Card>
    )
}

