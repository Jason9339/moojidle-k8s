import React, { useState, useRef } from "react"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Bold, Italic, Code as CodeIcon, List as ListIcon, ListOrdered, Quote, Heading } from "lucide-react"
import Button from "@/components/Button/Button"
/* Basic UI components */
const Card = ({ className = "", ...props }) => (
    <div {...props} className={`border rounded-2xl shadow ${className}`} />
)
const CardContent = ({ className = "", ...props }) => (
    <div {...props} className={`p-4 ${className}`} />
)


export default function TextEditor({ className = "", rows = 10, onChange, onSubmit }) {
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
        <Card className={className}>
            <CardContent className="flex-1 overflow-auto flex flex-col">
                {/* Toolbar */}

                <motion.div
                    layout
                    className="flex gap-1 px-2 py-2 border-b sticky top-0 z-10"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Button variant="ghost" onClick={() => setPreview(p => !p)}>
                        {preview ? "Edit" : "Preview"}
                    </Button>


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


                {preview ? (
                    <div className="markdown-body prose prose-blue mx-auto p-4">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} >
                            {text}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => { setText(e.target.value); onChange && onChange(e.target.value) }}
                        placeholder=""
                        className={`flex-2 w-full p-4 font-mono outline-none overflow-scroll resize-none`}
                        rows={rows}
                    />
                )}
            </CardContent>
        </Card >
    )
}

