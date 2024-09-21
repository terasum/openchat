import Clipboard from "clipboard";

import { nanoid } from "nanoid";

type RulesArgs = [
  Array<{ type: string; content: string; attrs?: Array<string> }>,
  number
];
type LinkArgs = [Array<{ attrs: string }>, number];

const PLUGIN_CLASS = "code-copy";

new Clipboard(`.${PLUGIN_CLASS}`, {
  text: (trigger: HTMLElement) => {
    const uuid = trigger.getAttribute("data-uuid");
    const copyValue = trigger.getAttribute("data-clipboard-text");
    console.log("code-copy.text", { uuid, copyValue });
    new Promise(async () => {
      const tipContainer = document.getElementById(uuid + "-tip-container");
      const tipMessage = document.createElement("span");
      tipMessage.innerText = "复制成功！";
      if (!tipContainer?.hasChildNodes()) {
        tipContainer?.appendChild(tipMessage);
        setTimeout(() => {
          tipContainer?.removeChild(tipMessage);
        }, 1000);
      }
    });
    if (!uuid || !copyValue) return "";
    return copyValue;
  },
});

const renderCode = (originRule: (...args: RulesArgs) => string) => {
  return (...args: RulesArgs) => {
    const [tokens, idx] = args;

    const content = tokens[idx].content;

    const copyContent = content
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&apos;");

    const originRendered = originRule(...args);

    if (!content) return originRendered;
    const nanoidStr = nanoid(32).replaceAll("-", "");

    return `
    <div class='relative' ">
      ${originRendered}
      <div class="${PLUGIN_CLASS}" data-clipboard-text="${copyContent}" data-uuid="${nanoidStr}" title="success"></div>
      <div id="${
        nanoidStr + "-tip-container"
      }" style="width: 60px; font-size:11px; color: #c1c1c1; display: block; position: absolute; top: 12px; right: 25px;" ></div>
      </div>
    `;
  };
};

const renderLink = (originRule: (...args: RulesArgs) => string) => {
  return (...args: RulesArgs) => {
    const [tokens, _] = args;
    const token_open = tokens[0];
    if (!token_open) return "";
    if (token_open.type !== "link_open") return "";
    const href = token_open.attrs ? token_open.attrs[0][1] : "";
    if (!href) return "";
    return `<a href="${href}" onclick="event.preventDefault()" rel="noopener noreferrer">`;
  };
};

export const copyCode = (md: any) => {
  md.renderer.rules.code_block = renderCode(md.renderer.rules.code_block);
  md.renderer.rules.fence = renderCode(md.renderer.rules.fence);
};

export const alink = (md: any) => {
  md.renderer.rules.link_open = renderLink(md.renderer.rules.link_open);
};
