"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  TextFormatType,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingTagType,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List as ListIcon,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Type as FontSizeIcon,
  Underline,
  Undo2,
} from "lucide-react";

type BlockType = "paragraph" | "h1" | "h2" | "h3" | "quote" | "ul" | "ol";

export function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrike, setIsStrike] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>("paragraph");
  const [elementFormat, setElementFormat] = useState<ElementFormatType>("left");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;
    setIsBold(selection.hasFormat("bold"));
    setIsItalic(selection.hasFormat("italic"));
    setIsUnderline(selection.hasFormat("underline"));
    setIsStrike(selection.hasFormat("strikethrough"));

    const anchorNode = selection.anchor.getNode();
    const element = anchorNode.getTopLevelElementOrThrow();
    setElementFormat(element.getFormatType());

    if ($isHeadingNode(element)) {
      const tag = element.getTag();
      setBlockType(tag as HeadingTagType as BlockType);
      return;
    }

    if (element instanceof ListNode) {
      const type = element.getListType();
      setBlockType(type === "number" ? "ol" : "ul");
      return;
    }

    const type = element.getType();
    if (type === "paragraph") setBlockType("paragraph");
    else if (type === "quote") setBlockType("quote");
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        editor.getEditorState().read(updateToolbar);
        return false;
      },
      1
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(updateToolbar);
    });
  }, [editor, updateToolbar]);

  const applyBlockType = useCallback(
    (type: BlockType) => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        if (type === "paragraph") {
          $setBlocksType(selection, () => $createParagraphNode());
        } else if (type === "quote") {
          $setBlocksType(selection, () => $createQuoteNode());
        } else if (type === "h1" || type === "h2" || type === "h3") {
          $setBlocksType(selection, () =>
            $createHeadingNode(type as HeadingTagType)
          );
        } else if (type === "ul") {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        } else if (type === "ol") {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }
      });
      setBlockType(type);
    },
    [editor]
  );

  const toggleLink = useCallback(() => {
    const url = prompt("Enter URL") || "";
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url || null);
  }, [editor]);

  const clearFormatting = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if ($isTextNode(node)) {
            node.setFormat(0);
            node.setStyle("");
          }
        });
      }
    });
  }, [editor]);

  const align = useCallback(
    (format: ElementFormatType) =>
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format),
    [editor]
  );

  const renderBlockLabel = useMemo(() => {
    switch (blockType) {
      case "h1":
        return "Heading 1";
      case "h2":
        return "Heading 2";
      case "h3":
        return "Heading 3";
      case "quote":
        return "Quote";
      case "ul":
        return "Bulleted List";
      case "ol":
        return "Numbered List";
      default:
        return "Paragraph";
    }
  }, [blockType]);

  const applyFontSize = useCallback(
    (px: number) => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        selection.getNodes().forEach((node) => {
          if ($isTextNode(node)) {
            const style = node.getStyle() || "";
            const without = style
              .split(";")
              .map((s) => s.trim())
              .filter((s) => !!s && !s.startsWith("font-size:"));
            without.push(`font-size: ${px}px`);
            node.setStyle(without.join("; "));
          }
        });
      });
    },
    [editor]
  );

  const toolbarButton = (
    children: React.ReactNode,
    onClick: () => void,
    isActive?: boolean,
    ariaLabel?: string
  ) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={isActive ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={onClick}
            aria-label={ariaLabel}
          >
            {children}
          </Button>
        </TooltipTrigger>
        {ariaLabel ? <TooltipContent>{ariaLabel}</TooltipContent> : null}
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="vertical-align-middle sticky top-0 z-10 flex flex-wrap gap-2 overflow-auto border-b bg-background p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="min-w-[140px] justify-between"
          >
            {renderBlockLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem onClick={() => applyBlockType("paragraph")}>
            Paragraph
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => applyBlockType("h1")}>
            <div className="flex items-center gap-2">
              <Heading1 className="h-4 w-4" />
              Heading 1
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => applyBlockType("h2")}>
            <div className="flex items-center gap-2">
              <Heading2 className="h-4 w-4" />
              Heading 2
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => applyBlockType("h3")}>
            <div className="flex items-center gap-2">
              <Heading3 className="h-4 w-4" />
              Heading 3
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => applyBlockType("quote")}>
            <div className="flex items-center gap-2">
              <Quote className="h-4 w-4" />
              Quote
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => applyBlockType("ul")}>
            <div className="flex items-center gap-2">
              <ListIcon className="h-4 w-4" />
              Bulleted List
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => applyBlockType("ol")}>
            <div className="flex items-center gap-2">
              <ListOrdered className="h-4 w-4" />
              Numbered List
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-8" />

      {toolbarButton(
        <Bold className="h-4 w-4" />,
        () =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold" as TextFormatType),
        isBold,
        "Bold"
      )}
      {toolbarButton(
        <Italic className="h-4 w-4" />,
        () =>
          editor.dispatchCommand(
            FORMAT_TEXT_COMMAND,
            "italic" as TextFormatType
          ),
        isItalic,
        "Italic"
      )}
      {toolbarButton(
        <Underline className="h-4 w-4" />,
        () =>
          editor.dispatchCommand(
            FORMAT_TEXT_COMMAND,
            "underline" as TextFormatType
          ),
        isUnderline,
        "Underline"
      )}
      {toolbarButton(
        <Strikethrough className="h-4 w-4" />,
        () =>
          editor.dispatchCommand(
            FORMAT_TEXT_COMMAND,
            "strikethrough" as TextFormatType
          ),
        isStrike,
        "Strikethrough"
      )}
      {toolbarButton(
        <Code className="h-4 w-4" />,
        () =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code" as TextFormatType),
        false,
        "Code"
      )}

      <Separator orientation="vertical" className="h-8" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <FontSizeIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-28">
          {[12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
            <DropdownMenuItem key={size} onClick={() => applyFontSize(size)}>
              {size}px
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-8" />

      {toolbarButton(
        <AlignLeft className="h-4 w-4" />,
        () => align("left"),
        elementFormat === "left",
        "Align Left"
      )}
      {toolbarButton(
        <AlignCenter className="h-4 w-4" />,
        () => align("center"),
        elementFormat === "center",
        "Align Center"
      )}
      {toolbarButton(
        <AlignRight className="h-4 w-4" />,
        () => align("right"),
        elementFormat === "right",
        "Align Right"
      )}

      <Separator orientation="vertical" className="h-8" />

      {toolbarButton(
        <Link2 className="h-4 w-4" />,
        toggleLink,
        false,
        "Insert Link"
      )}

      <Separator orientation="vertical" className="h-8" />

      <div className="ml-auto flex items-center gap-2">
        {toolbarButton(
          <Undo2 className="h-4 w-4" />,
          () => editor.dispatchCommand("history-undo" as any, undefined),
          false,
          "Undo"
        )}
        {toolbarButton(
          <Redo2 className="h-4 w-4" />,
          () => editor.dispatchCommand("history-redo" as any, undefined),
          false,
          "Redo"
        )}
        <Button variant="outline" size="sm" onClick={clearFormatting}>
          Clear formatting
        </Button>
      </div>

      {/* Mount required plugins used by toolbar */}
      <HistoryPlugin />
      <ListPlugin />
      <LinkPlugin />
    </div>
  );
}

export default Toolbar;
