import React from "react";
import MarkdownIt from "markdown-it";
import MarkdownItHighlight from "markdown-it-highlightjs";
import mk from "@traptitech/markdown-it-katex";
import { copyCode } from "../../lib/copy";
import "./MarkdownContent.scss";
import "highlight.js/styles/default.css"

interface MarkdownContentProps {
  content: string;
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
  .use(mk, {
    blockClass: "block-math",
    output: "mathml",
    errorColor: "#cc0000",
  });

export const MarkdownContent: React.FC<MarkdownContentProps> = ({
  content,
}) => {
  if (content) {
    let markdownContent = marked.render(content, { sanitize: true });
    return <div className="openchat-markdown-content" dangerouslySetInnerHTML={{ __html: markdownContent }} />;
  } else {
    return <div className="openchat-markdown-content"></div>;
  }
};
