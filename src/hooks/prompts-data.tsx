export const prompts = [
  {
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    name: "ChatGPT",
    desc: "通用人工智能助理",
    text: "你需要作为一名人工智能助理辅助我工作，你的答案需要简洁清晰有条理，并且使用 Markdown 格式输出。",
    date: "2023-10-22T09:00:00",
    favoriate: true,
    labels: ["gpt", "assistant"],
  },
  {
    id: "110e8400-e29b-11d4-a716-446655440000",
    name: "背单词助手",
    desc: "背单词助手",
    text: '将英文单词转换为包括音标、中文翻译、英文释义、词根词源、助记和3个例句。中文翻译应以词性的缩写表示例如adj.作为前缀。如果存在多个常用的中文释义，请列出最常用的3个。3个例句请给出完整中文解释。注意如果英文单词拼写有小的错误，请务必在输出的开始，加粗显示正确的拼写，并给出提示信息，这很重要。请检查所有信息是否准确，并在回答时保持简洁，不需要任何其他反馈。第一个单词是"metroplitan"',
    date: "2023-10-22T10:30:00",
    favoriate: false,
    labels: ["english"],
  },
];

export type Prompt = (typeof prompts)[number];
