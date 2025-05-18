import React, { useState, useRef } from "react"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Bold, Italic, Code as CodeIcon, List as ListIcon, ListOrdered, Quote, Heading } from "lucide-react"
import Button from "@/components/Button/Button"
import TextArea from "@/components/TextArea/TextArea"
/* Basic UI components */
const Card = ({ className = "", ...props }) => (
    <div {...props} className={`border rounded-2xl shadow ${className}`} />
)
const CardContent = ({ className = "", ...props }) => (
    <div {...props} className={`p-4 ${className}`} />
)


export default function TextEditor({ className = "", height, onChange }) {
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

    const handleKeyDown = e => {

        if (e.key == "Enter") {
            const ta = textareaRef.current
            const { selectionStart, selectionEnd } = ta
            // console.log("selectionStart:", selectionStart, "selectionEnd:", selectionEnd)
            const val = text
            const before = val.slice(0, selectionStart)
            const after = val.slice(selectionEnd)

            // console.log("before:", before, "after:", after);
            // find current line
            const lastNL = before.lastIndexOf("\n")
            const line = before.slice(lastNL + 1)

            // console.log("line", line)
            // capture > , #, or 1. prefixes (with trailing space)
            const regex = /^(\s*(?:>#{1,3}|\#{1,6}|\d+\.|-|)\s+)/
            const m = line.match(regex)

            // console.log("m=", m)
            if (m) {
                e.preventDefault()
                const prefix = m[1]
                // console.log("prefix:", prefix)
                // if line is just the prefix (empty after it), don't re-insert
                const insert = "\n" + (line.length > prefix.length ? prefix : "")
                const newText = before + insert + after

                setText(newText)
                // restore cursor right after our inserted text
                const newPos = selectionStart + insert.length
                setTimeout(() => {
                    ta.selectionStart = ta.selectionEnd = newPos
                }, 0)
            }
        }
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
        <Card className={`flex ${className}`} style={{ height: height }}>
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
                    <div className="flex-2 markdown-body prose prose-blue mx-auto p-4">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} >
                            {text}
                        </ReactMarkdown>
                    </div>
                ) : (

                    <TextArea height={height}
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => { setText(e.target.value); onChange?.(e.target.value) }}
                        onKeyDown={handleKeyDown}
                        placeholder=""
                        className={`flex-2 w-full p-4 font-mono outline-none overflow-y-scroll resize-none bg-[#ffffff] rounded-[15px]`}
                    >

                    </TextArea>
                )}
            </CardContent>
        </Card >
    )
}

