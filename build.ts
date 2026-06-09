/// <reference types="node" />
import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync } from "fs";

const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
const version = pkg.version;

const USER = "Yrobot";
const REPONAME = "bilibili-audio-mode";
const BRANCH = "main";
const SCRIPT_NAME = REPONAME;
const RAW_BASE = `https://raw.githubusercontent.com/${USER}/${REPONAME}/${BRANCH}/dist`;

const banner = `// ==UserScript==
// @name         Bilibili Audio Mode
// @namespace    https://github.com/${USER}
// @version      ${version}
// @description  B站音频模式 - 节省带宽和系统资源
// @author       @yrobot
// @homepage     https://github.com/${USER}/${REPONAME}
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @downloadURL  ${RAW_BASE}/${SCRIPT_NAME}.user.js
// @updateURL    ${RAW_BASE}/${SCRIPT_NAME}.meta.js
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==`;

mkdirSync("dist", { recursive: true });

const result = await build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  write: false,
  minify: true,
  banner: { js: banner },
});

const code = result.outputFiles[0].text;

// .meta.js — 纯 UserScript 头，用于版本检测
const headerEnd =
  code.indexOf("// ==/UserScript==") + "// ==/UserScript==".length;
const meta = code.slice(0, headerEnd);

// .user.js — 完整脚本（header + code）
writeFileSync(`dist/${SCRIPT_NAME}.meta.js`, meta);
writeFileSync(`dist/${SCRIPT_NAME}.user.js`, code);

console.log(`Build complete! v${version}`);
console.log(`  dist/${SCRIPT_NAME}.meta.js`);
console.log(`  dist/${SCRIPT_NAME}.user.js`);
