// "use client";

// import { useState, useCallback } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import ReactMarkdown from "react-markdown";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
// import remarkGfm from "remark-gfm";
// import {
//   Bold,
//   Italic,
//   List,
//   ListOrdered,
//   Link,
//   Image as ImageIcon,
//   Code,
//   Quote,
//   Heading,
//   FileDown,
//   Copy,
//   FileUp,
//   RotateCcw,
// } from "lucide-react";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

// const SAMPLE_MARKDOWN = `# Welcome to the Markdown Editor

// This is a **bold** text and this is an *italic* text.

// ## Lists
// ### Unordered List
// - Item 1
// - Item 2
//   - Nested Item
//   - Another Nested Item
// - Item 3

// ### Ordered List
// 1. First Item
// 2. Second Item
// 3. Third Item

// ## Code Example
// \`\`\`javascript
// function greet(name) {
//   return \`Hello, \${name}!\`;
// }
// console.log(greet('World'));
// \`\`\`

// ## Links and Images
// [OpenAI](https://www.openai.com)

// ![Sample Image](https://via.placeholder.com/150)

// ## Blockquotes
// > This is a blockquote
// > It can span multiple lines

// ## Tables
// | Header 1 | Header 2 |
// |----------|----------|
// | Cell 1    | Cell 2    |
// | Cell 3    | Cell 4    |

// ## Task Lists
// - [x] Completed task
// - [ ] Incomplete task
// - [ ] Another task

// ---

// You can edit this text to see the live preview!`;

// interface ToolbarButton {
//   icon: React.ComponentType;
//   label: string;
//   action: (text: string) => {
//     text: string;
//     selectionStart: number;
//     selectionEnd: number;
//   };
// }

// export default function MarkdownEditor() {
//   const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
//   const [selection, setSelection] = useState({ start: 0, end: 0 });

//   const buttons: ToolbarButton[] = [
//     {
//       icon: Bold,
//       label: "Bold",
//       action: (text) => {
//         const prefix = "**";
//         const suffix = "**";
//         return {
//           text:
//             text.slice(0, selection.start) +
//             prefix +
//             text.slice(selection.start, selection.end) +
//             suffix +
//             text.slice(selection.end),
//           selectionStart: selection.start + prefix.length,
//           selectionEnd: selection.end + prefix.length,
//         };
//       },
//     },
//     {
//       icon: Italic,
//       label: "Italic",
//       action: (text) => {
//         const prefix = "*";
//         const suffix = "*";
//         return {
//           text:
//             text.slice(0, selection.start) +
//             prefix +
//             text.slice(selection.start, selection.end) +
//             suffix +
//             text.slice(selection.end),
//           selectionStart: selection.start + prefix.length,
//           selectionEnd: selection.end + prefix.length,
//         };
//       },
//     },
//     {
//       icon: Heading,
//       label: "Heading",
//       action: (text) => {
//         const prefix = "## ";
//         return {
//           text:
//             text.slice(0, selection.start) +
//             prefix +
//             text.slice(selection.start),
//           selectionStart: selection.start + prefix.length,
//           selectionEnd: selection.end + prefix.length,
//         };
//       },
//     },
//     {
//       icon: List,
//       label: "Bullet List",
//       action: (text) => {
//         const prefix = "- ";
//         return {
//           text:
//             text.slice(0, selection.start) +
//             prefix +
//             text.slice(selection.start),
//           selectionStart: selection.start + prefix.length,
//           selectionEnd: selection.end + prefix.length,
//         };
//       },
//     },
//     {
//       icon: ListOrdered,
//       label: "Numbered List",
//       action: (text) => {
//         const prefix = "1. ";
//         return {
//           text:
//             text.slice(0, selection.start) +
//             prefix +
//             text.slice(selection.start),
//           selectionStart: selection.start + prefix.length,
//           selectionEnd: selection.end + prefix.length,
//         };
//       },
//     },
//     {
//       icon: Link,
//       label: "Link",
//       action: (text) => {
//         const prefix = "[";
//         const suffix = "](url)";
//         return {
//           text:
//             text.slice(0, selection.start) +
//             prefix +
//             text.slice(selection.start, selection.end) +
//             suffix +
//             text.slice(selection.end),
//           selectionStart: selection.end + prefix.length + 2,
//           selectionEnd: selection.end + prefix.length + 5,
//         };
//       },
//     },
//     {
//       icon: ImageIcon,
//       label: "Image",
//       action: (text) => {
//         const prefix = "![";
//         const suffix = "](url)";
//         return {
//           text:
//             text.slice(0, selection.start) +
//             prefix +
//             text.slice(selection.start, selection.end) +
//             suffix +
//             text.slice(selection.end),
//           selectionStart: selection.end + prefix.length + 2,
//           selectionEnd: selection.end + prefix.length + 5,
//         };
//       },
//     },
//     {
//       icon: Code,
//       label: "Code",
//       action: (text) => {
//         const prefix = "```\n";
//         const suffix = "\n```";
//         return {
//           text:
//             text.slice(0, selection.start) +
//             prefix +
//             text.slice(selection.start, selection.end) +
//             suffix +
//             text.slice(selection.end),
//           selectionStart: selection.start + prefix.length,
//           selectionEnd: selection.end + prefix.length,
//         };
//       },
//     },
//     {
//       icon: Quote,
//       label: "Quote",
//       action: (text) => {
//         const prefix = "> ";
//         return {
//           text:
//             text.slice(0, selection.start) +
//             prefix +
//             text.slice(selection.start),
//           selectionStart: selection.start + prefix.length,
//           selectionEnd: selection.end + prefix.length,
//         };
//       },
//     },
//   ];

//   const handleToolbarAction = (action: ToolbarButton["action"]) => {
//     const textarea = document.querySelector("textarea");
//     if (textarea) {
//       const result = action(markdown);
//       setMarkdown(result.text);
//       // Need to wait for state update
//       setTimeout(() => {
//         textarea.focus();
//         textarea.setSelectionRange(result.selectionStart, result.selectionEnd);
//       }, 0);
//     }
//   };

//   const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
//     const target = e.target as HTMLTextAreaElement;
//     setSelection({
//       start: target.selectionStart,
//       end: target.selectionEnd,
//     });
//   };

//   const downloadMarkdown = () => {
//     const blob = new Blob([markdown], { type: "text/markdown" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "document.md";
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//     toast.success("Downloaded markdown file");
//   };

//   const copyMarkdown = () => {
//     navigator.clipboard.writeText(markdown);
//     toast.success("Copied to clipboard");
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const content = e.target?.result;
//         if (typeof content === "string") {
//           setMarkdown(content);
//           toast.success("File loaded successfully");
//         }
//       };
//       reader.readAsText(file);
//     }
//   };

//   return (
//     <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
//       <div className="flex justify-between items-center p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div>
//           <h1 className="text-3xl font-bold">Markdown Editor</h1>
//           <p className="text-muted-foreground mt-1">
//             Edit and preview markdown in real-time
//           </p>
//         </div>
//       </div>

//       <div className="flex-1 overflow-hidden p-6">
//         <div className="max-w-7xl mx-auto space-y-4">
//           <Card className="p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <TooltipProvider>
//                   {buttons.map((button, index) => (
//                     <Tooltip key={index}>
//                       <TooltipTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => handleToolbarAction(button.action)}
//                         >
//                           <button.icon className="h-4 w-4" />
//                         </Button>
//                       </TooltipTrigger>
//                       <TooltipContent>
//                         <p>{button.label}</p>
//                       </TooltipContent>
//                     </Tooltip>
//                   ))}
//                 </TooltipProvider>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={() => setMarkdown(SAMPLE_MARKDOWN)}
//                 >
//                   <RotateCcw className="h-4 w-4" />
//                 </Button>
//                 <Button variant="outline" size="icon" onClick={copyMarkdown}>
//                   <Copy className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={downloadMarkdown}
//                 >
//                   <FileDown className="h-4 w-4" />
//                 </Button>
//                 <Button variant="outline" size="icon" >
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept=".md,.markdown,text/markdown"
//                     onChange={handleFileUpload}
//                   />
//                   <FileUp className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </Card>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-16rem)]">
//             <Card className="flex flex-col min-h-0">
//               <div className="p-2 bg-muted font-medium text-sm border-b">
//                 Editor
//               </div>
//               <div className="flex-1 overflow-hidden">
//                 <textarea
//                   value={markdown}
//                   onChange={(e) => setMarkdown(e.target.value)}
//                   onSelect={handleSelect}
//                   className="w-full h-full font-mono text-sm p-4 resize-none focus:outline-none bg-background"
//                   placeholder="Enter markdown here..."
//                   spellCheck="false"
//                   style={{
//                     minHeight: "100%",
//                     overflow: "auto",
//                   }}
//                 />
//               </div>
//             </Card>

//             <Card className="flex flex-col min-h-0">
//               <div className="p-2 bg-muted font-medium text-sm border-b">
//                 Preview
//               </div>
//               <div className="flex-1 overflow-auto prose prose-sm dark:prose-invert max-w-none p-4">
//                 <ReactMarkdown
//                   remarkPlugins={[remarkGfm]}
//                   components={{
//                     code({ node, inline, className, children, ...props }) {
//                       const match = /language-(\w+)/.exec(className || "");
//                       return !inline && match ? (
//                         <SyntaxHighlighter
//                           style={vscDarkPlus}
//                           language={match[1]}
//                           PreTag="div"
//                         >
//                           {String(children).replace(/\n$/, "")}
//                         </SyntaxHighlighter>
//                       ) : (
//                         <code className={className} {...props}>
//                           {children}
//                         </code>
//                       );
//                     },
//                   }}
//                 >
//                   {markdown}
//                 </ReactMarkdown>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
