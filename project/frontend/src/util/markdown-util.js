import { unified } from "unified"
import remarkParse from 'remark-parse'
import remarkSlate from 'remark-slate'
import remarkStringify from 'remark-stringify'
import { slateToRemark } from 'remark-slate-transformer'
function markdownToSlateSync(markdownString) {
    const file = unified()
        .use(remarkParse)
        .use(remarkSlate)
        .processSync(markdownString)

    return file.result // Node[] 
}

async function markdownToSlate(markdownString) {
    const file = await unified()
        .use(remarkParse)
        .use(remarkSlate)
        .process(markdownString)

    return file.result   // Node[]
}

function slateToMarkdownSync(nodes) {
    const mdast = slateToRemark(nodes)

    const processor = unified().use(remarkStringify)
    const ast = processor.runSync(mdast)

    const md = processor.stringify(ast)
    console.log("STM: ", md.charAt(0))
    return processor.stringify(ast)
}

export {
    markdownToSlate,
    markdownToSlateSync,
    slateToMarkdownSync
}
