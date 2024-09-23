<div style="display: flex; justify-content: center;" align="center">
<img src='./docs/images/icon.png' width='80'>
</div>

<div style="display: flex; justify-content: center;" align="center">
<h1 style="text-align: center"><span>OpenChat</span></h1>
</div>
<div style="display: flex; justify-content: center;" align="center">
<h3 style="text-align: center">v0.2.12</h3>
</div>
<div style="display: flex; justify-content: center;" align="center">
      <img alt="MacOS" src="https://img.shields.io/badge/-MacOS-black?style=flat&logo=apple&logoColor=white" />
      <img alt="Windows" src="https://img.shields.io/badge/-Windows-blue?style=flat&logo=tauri&logoColor=white" />
      <!-- <img alt="Linux" src="https://img.shields.io/badge/-Linux-gray?style=flat&logo=linux&logoColor=white" />-->
<!-- <img alt="Downloads" src="https://img.shields.io/github/downloads/terasum/openchat/total.svg?style=flat" /> -->
</div>

<h3 style="text-align: center" align="center">
    A Local-First lightweight and elegant AI chat client for ChatGPT and other LLMs.
</h3>

<p style="text-align: left">
    <em>OpenChat focuses on the Propmt sharing function to solve the current users' problems of "being able to use" and "making good use of" AI software. Users can get started easily, quickly create personalized AI assistants, and exchange experiences with others through the sharing function.</em>
</p>



<div align="center">
<table cellspacing="0" cellpadding="0" style="border:none">
<tr style="border:none">
<td style="border:none"><img src="./docs/images/ui-index.png" width="480"/></td>
<td style="border:none"><img src="./docs/images/ui-prompts.png" width="480"/></td>
</tr>
</table>
</div>

## Download

You can download the prebuild binary at [release page](https://github.com/terasum/openchat/releases)

## Usage

1. Open the Settings page (the 'Gear' icon)
2. Select a model provider
3. Input the API Key, and tap the "SAVE" button
4. Switch to Chat page, and go chating with AI!

## How to use with Ollama

1. Installing Ollama，reference to [ollama](https://ollama.com/)
2. Runing Ollama, take `tinyllama` a light weight model as an example, type the command `ollama run tinyllama` as below:

   <img alt="ollama tinyollama" src="./docs/images/ollama-tinyllama.png" width="480"/>

3. Configurating OpenChat, select the 'ollama' as the provider, then chose the `tinyllama` model

   <img alt="ollama tinyollama" src="./docs/images/ollama-settings.png" width="480"/>

4. If the selection doesn't contains your model, PR is welcome!

## License

[LICENSE](./LICENSE)
