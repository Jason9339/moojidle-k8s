import React, {
    useCallback,
    useMemo,
    useState,
    forwardRef,
  } from "react";
  import {
    createEditor,
    Editor,
    Transforms,
    Element as SlateElement,
    Text,
  } from "slate";
  import { Slate, Editable, withReact, useSlate } from "slate-react";
  import { withHistory } from "slate-history";
  import isHotkey from "is-hotkey";
  import {
    Bold,
    Italic,
    Code as CodeIcon,
    List as ListIcon,
    ListOrdered,
    Quote,
    Heading,
  } from "lucide-react";
  import { motion } from "framer-motion";
  
  /* Basic UI components */
  const Card = ({ className = "", ...props }) => (
    <div
      {...props}
      className={`border rounded-2xl shadow bg-white dark:bg-zinc-900 ${className}`}
    />
  );
  const CardContent = ({ className = "", ...props }) => (
    <div {...props} className={`p-4 ${className}`} />
  );
  const Button = forwardRef(function Button(
    { variant = "default", size = "default", className = "", children, ...props },
    ref
  ) {
    const variantClass = {
      default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary: "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-50 focus:ring-zinc-500",
      ghost: "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-50",
    }[variant];
    const sizeClass = size === "icon" ? "h-9 w-9 p-0" : "h-9 px-4 py-2 min-w-[72px]";
    return (
      <button
        ref={ref}
        {...props}
        className={`${variantClass} ${sizeClass} ${className} inline-flex items-center justify-center rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none`}
      >
        {children}
      </button>
    );
  });
  
  /* Slate utilities */
  const HOTKEYS = { "mod+b": "bold", "mod+i": "italic", "mod+`": "code" };
  const LIST_TYPES = ["numbered-list", "bulleted-list"];
  const isMarkActive = (editor, format) => !!Editor.marks(editor)?.[format];
  const toggleMark = (editor, format) => {
    isMarkActive(editor, format) ? Editor.removeMark(editor, format) : Editor.addMark(editor, format, true);
  };
  const isBlockActive = (editor, format) => !!Editor.nodes(editor, { match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format })[0];
  const toggleBlock = (editor, format) => {
    const isList = LIST_TYPES.includes(format);
    Transforms.unwrapNodes(editor, { match: n => !Editor.isEditor(n) && LIST_TYPES.includes(n.type), split: true });
    const newType = isBlockActive(editor, format) ? "paragraph" : isList ? "list-item" : format;
    Transforms.setNodes(editor, { type: newType });
    if (!isBlockActive(editor, format) && isList) Transforms.wrapNodes(editor, { type: format, children: [] });
  };
  
  /* Renderers */
  const Element = ({ attributes, children, element }) => {
    switch (element.type) {
      case "heading": return React.createElement(`h${element.level || 2}`, { ...attributes, className: "font-semibold my-2" }, children);
      case "quote": return <blockquote {...attributes} className="border-l-2 pl-4 my-2 italic text-zinc-500 dark:text-zinc-400">{children}</blockquote>;
      case "numbered-list": return <ol {...attributes} className="list-decimal list-inside my-2">{children}</ol>;
      case "bulleted-list": return <ul {...attributes} className="list-disc list-inside my-2">{children}</ul>;
      case "list-item": return <li {...attributes}>{children}</li>;
      default: return <p {...attributes} className="my-2 leading-7">{children}</p>;
    }
  };
  const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) children = <strong className="font-bold">{children}</strong>;
    if (leaf.italic) children = <em className="italic">{children}</em>;
    if (leaf.code) children = <code className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">{children}</code>;
    return <span {...attributes}>{children}</span>;
  };
  
  /* Toolbar inside Slate context */
  const ToolbarButton = ({ format, icon: Icon }) => {
    const editor = useSlate();
    const active = ["bold","italic","code"].includes(format) ? isMarkActive(editor, format) : isBlockActive(editor, format);
    return (
      <Button size="icon" variant={active?"secondary":"ghost"} onMouseDown={e=>{e.preventDefault(); ["bold","italic","code"].includes(format)? toggleMark(editor,format): toggleBlock(editor,format); }} aria-label={format}>
        <Icon size={16}/>
      </Button>
    );
  };
  const Toolbar = () => (
    <motion.div layout className="flex gap-1 px-2 py-2 border-b sticky top-0 bg-white dark:bg-zinc-900 z-10" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}>
      { [
          ["bold",Bold], ["italic",Italic], ["code",CodeIcon],
          ["heading",Heading], ["quote",Quote], ["bulleted-list",ListIcon], ["numbered-list",ListOrdered]
        ].map(([fmt,Icon])=><ToolbarButton key={fmt} format={fmt} icon={Icon}/>) }
    </motion.div>
  );
  
  /* Markdown serializer */
  const toMarkdown = nodes => nodes.map(n=>{
    if (Text.isText(n)) return `${n.code?"`":``}${n.text}${n.code?"`":``}`.replace(/\*/g, m=> m==='*'? '*' : '*');
    const children = n.children.map(c=>toMarkdown([c])).join("");
    switch(n.type){ case"heading":return"## "+children+"\n\n"; case"quote":return"> "+children+"\n\n"; case"numbered-list": case"bulleted-list": return children+"\n"; case"list-item": return"- "+children+"\n"; default: return children+"\n\n"; }
  }).join('').trim();
  
  /* Main component */
  const initialValue = [{ type:"paragraph", children:[{ text:"Leave a comment…" }] }];
  export default function GitHubCommentEditor({ onSubmit }){
    const editor = useMemo(()=>withHistory(withReact(createEditor())),[]);
    const [value,setValue]=useState(initialValue), [preview,setPreview]=useState(false);
    const renderElement=useCallback(props=><Element {...props}/>,[]), renderLeaf=useCallback(props=><Leaf {...props}/>,[]);
    const handleKeyDown=useCallback(e=>{ for(const hot in HOTKEYS) if(isHotkey(hot,e)){ e.preventDefault(); toggleMark(editor,HOTKEYS[hot]); }
      if(e.key==="Enter"&&(e.metaKey||e.ctrlKey)){ e.preventDefault(); onSubmit&&onSubmit(toMarkdown(value)); } },[editor,value,onSubmit]);
  
    return (
      <Card className="w-full max-w-3xl">
        <CardContent className="p-0">
          <Slate editor={editor} initialValue={value} onChange={setValue}>
            <Toolbar />
            { !preview ? <Editable renderElement={renderElement} renderLeaf={renderLeaf} placeholder="Leave a comment…" className="prose dark:prose-invert p-4 outline-none min-h-[140px]" spellCheck autoFocus onKeyDown={handleKeyDown}/> 
              : <motion.div className="prose dark:prose-invert p-4 min-h-[140px]" initial={{opacity:0}} animate={{opacity:1}}>
                  {value.map((el,i)=><React.Fragment key={i}>{renderElement({element:el,children:el.children.map((l,j)=><Leaf key={j} leaf={l} attributes={{}}>{l.text}</Leaf>)})}</React.Fragment>)}
                </motion.div>
            }
          </Slate>
        </CardContent>
        <div className="flex justify-between items-center p-4 border-t bg-zinc-50 dark:bg-zinc-800/40 rounded-b-2xl">
          <Button variant="ghost" onClick={()=>setPreview(p=>!p)}>{preview?"Edit":"Preview"}</Button>
          <Button variant="default" onClick={()=>onSubmit&&onSubmit(toMarkdown(value))}>Comment</Button>
        </div>
      </Card>
    );
  }
  