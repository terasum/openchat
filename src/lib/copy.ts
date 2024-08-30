import Clipboard from "clipboard";
import { writeText } from "@tauri-apps/api/clipboard";
import { nanoid } from "nanoid";

type RulesArgs = [Array<{ content: string }>, number];

const PLUGIN_CLASS = "code-copy";

new Clipboard(`.${PLUGIN_CLASS}`, {
  text: (trigger: HTMLElement) => {
    const uuid = Number(trigger.getAttribute("data-uuid"));

    const copyValue = trigger.getAttribute("data-clipboard-text");

    if (!uuid || !copyValue || window[uuid]) return "";

    trigger.classList.add("copied");
    // @ts-ignore
    window[uuid] = setTimeout(() => {
      trigger.classList.remove("copied");
      // @ts-ignore
      clearTimeout(window[uuid]);
      // @ts-ignore
      window[uuid] = null;
    }, 3000);

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

    return `
    <div class='relative'>
      ${originRendered}
      <div class="${PLUGIN_CLASS}" data-clipboard-text="${copyContent}" data-uuid="${nanoid()}" title="success"></div>
    </div>
    `;
  };
};

export const copyCode = (md: any) => {
  md.renderer.rules.code_block = renderCode(md.renderer.rules.code_block);
  md.renderer.rules.fence = renderCode(md.renderer.rules.fence);
};

export const copyText = async (
  event: MouseEvent,
  payload: { nodeId?: string; content?: string }
) => {
  try {
    const element = event.target as HTMLElement;
    const uuid = "_" + element.getAttribute("id");
    // @ts-ignore
    if (!uuid || window[uuid]) {
      return;
    }

    element.classList.add("copied");
    // @ts-ignore
    window[uuid] = setTimeout(() => {
      element.classList.remove("copied");
      // @ts-ignore
      clearTimeout(window[uuid]);
      // @ts-ignore
      window[uuid] = null;
    }, 3000);

    const { nodeId } = payload;
    let { content } = payload;

    if (nodeId) {
      content = document.getElementById(nodeId)?.innerText;
    }

    if (!content) return;

    await writeText(content);

    console.log("success");
  } catch (error) {
    console.error("tips.copyFail");
  }
};
