import React, { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Bold, Italic, Code as CodeIcon, Quote, Heading } from "lucide-react"
import { FaList as ListIcon } from "react-icons/fa";
import { GoListOrdered as ListOrdered } from "react-icons/go"
import Button from "@/components/Button/Button"
import TextArea from "@/components/TextArea/TextArea"

import styles from "./TextEditor.module.css"
/* Basic UI components */
const Card = ({ className = "", ...props }) => (
    <div {...props} className={`border rounded-2xl shadow ${className}`} />
)
const CardContent = ({ className = "", ...props }) => (
    <div {...props} className={`p-4 ${className}`} />
)


export default function TextEditor({ className = "", height, onChange, value, toolbarItemSize = 16 }) {
    const [preview, setPreview] = useState(false)
    const [text, setText] = useState("")
    const textareaRef = useRef(null)

    useEffect(() => {
        if (value !== undefined) {
            setText(value)
        }
    }, [value])


    // Wrap selected text with markers
    const wrapSelection = (before, after = before) => {
        const ta = textareaRef.current;
        if (!ta) return;

        const prevScroll = ta.scrollTop;

        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = text.slice(start, end);
        const newText =
            text.slice(0, start) + before + selected + after + text.slice(end);

        setText(newText);

        setTimeout(() => {
            ta.focus();
            const newEnd = end + before.length;
            ta.setSelectionRange(newEnd, newEnd);
            ta.scrollTop = prevScroll;
        }, 0);
    };

    // Prefix each selected line with prefix
    const prefixLines = (prefix) => {
        const ta = textareaRef.current;
        if (!ta) return;

        const prevScroll = ta.scrollTop;

        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const before = text.slice(0, start);
        const selection = text.slice(start, end);
        const after = text.slice(end);

        const lines = selection.split("\n");
        let addedChars = 0;

        const prefixedLines = lines.map((line) => {
            if (line.startsWith(prefix)) {
                return line;
            } else {
                addedChars += prefix.length;
                return prefix + line;
            }
        });
        const newSelection = prefixedLines.join("\n");

        const newText = before + newSelection + after;
        setText(newText);

        setTimeout(() => {
            ta.focus();
            const newStart = start;
            const newEnd = end + addedChars;
            ta.setSelectionRange(newStart, newEnd);
            ta.scrollTop = prevScroll;
        }, 0);
    };



    const handleKeyDown = e => {

        if (e.key == "Enter") {
            const ta = textareaRef.current
            const { selectionStart, selectionEnd } = ta
            const val = text
            const before = val.slice(0, selectionStart)
            const after = val.slice(selectionEnd)

            // find current line
            const lastNL = before.lastIndexOf("\n")
            const line = before.slice(lastNL + 1)

            const numMatch = line.match(/^(\s*)(\d+)\.\s/)

            if (numMatch) {

                e.preventDefault();
                const leadingSpaces = numMatch[1];
                const currNum = parseInt(numMatch[2], 10);
                const nextNum = currNum + 1;

                const fullPrefix = `${leadingSpaces}${currNum}. `;
                const shouldContinue = line.length > fullPrefix.length;
                const insert = shouldContinue
                    ? `\n${leadingSpaces}${nextNum}. `
                    : "\n";


                const newText = before + insert + after;
                setText(newText);

                setTimeout(() => {
                    ta.focus();
                    const newPos = selectionStart + insert.length;
                    ta.setSelectionRange(newPos, newPos);
                }, 0);
                return;
            }



            // capture > , -, or # 
            const otherMatch = line.match(/^(\s*(?:> |#{1,6}\s|- )+)/)

            if (otherMatch) {
                e.preventDefault()
                const prefix = otherMatch[1]
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
    }    // Toolbar buttons definition with original icons
    const toolbarItems = [
        { icon: <Bold size={toolbarItemSize} />, action: () => wrapSelection("**", "**"), title: "Bold" },
        { icon: <Italic size={toolbarItemSize} />, action: () => wrapSelection("*", "*"), title: "Italic" },
        { icon: <CodeIcon size={toolbarItemSize} />, action: () => wrapSelection("`", "`"), title: "Code" },
        { icon: <Heading size={toolbarItemSize} />, action: () => wrapSelection("## ", ""), title: "Heading" },
        { icon: <Quote size={toolbarItemSize} />, action: () => prefixLines("> "), title: "Blockquote" },
        { icon: <ListIcon size={toolbarItemSize} />, action: () => prefixLines("- "), title: "Bulleted List" },
        { icon: <ListOrdered size={toolbarItemSize} />, action: () => prefixLines("1. "), title: "Numbered List" },
    ]

    return (
        <Card className={`flex ${className}`} style={{ height: height }}>
            <CardContent className="flex-1 overflow-auto flex flex-col">
                {/* Toolbar */}

                <motion.div
                    layout
                    className={styles.toolbar}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Button variant="ghost" onClick={() => setPreview(p => !p)}>
                        {preview ? "Edit" : "Preview"}
                    </Button>


                    {toolbarItems.map((item, idx) => (
                        <Button
                            key={idx}
                            variant="ghost"
                            onClick={item.action}
                            title={item.title}
                        >
                            {item.icon}
                        </Button>
                    ))}
                </motion.div>


                {preview ? (
                    <div className={`markdown-body ${styles['markdown-body']}`}>
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

