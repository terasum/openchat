import React from "react";
import MarkdownIt from "markdown-it";
import MarkdownItHighlight from "markdown-it-highlightjs";
import mk from "@traptitech/markdown-it-katex";
import { copyCode, alink } from "../../lib/copy";
import "./MarkdownContent.scss";
import "highlight.js/styles/default.css"

interface MarkdownContentProps {
  content: string;
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const marked = new MarkdownIt({
  linkify: true,
})
  .use(MarkdownItHighlight, {
    register: {
      react: () => {
        return {
          name: "react",
          subLanguage: ["html", "xml", "javascript", "css"],
        };
      },
    },
  })
  .use(copyCode)
  .use(alink)
  .use(mk, {
    blockClass: "block-math",
    output: "mathml",
    errorColor: "#cc0000",
  });

export const MarkdownContent: React.FC<MarkdownContentProps> = ({
  content,
  onMouseUp
}) => {
  if (content) {
    let markdownContent = marked.render(content, { sanitize: true });
    return <div className="openchat-markdown-content" onMouseUp={onMouseUp} dangerouslySetInnerHTML={{ __html: markdownContent }} />;
  } else {
    return <div className="openchat-markdown-content"></div>;
  }
};
