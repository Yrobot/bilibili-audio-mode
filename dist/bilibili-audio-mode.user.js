// ==UserScript==
// @name         Bilibili Audio Mode
// @namespace    https://github.com/Yrobot
// @version      1.0.1
// @description  B站音频模式 - 节省带宽和系统资源
// @author       @yrobot
// @homepage     https://github.com/Yrobot/bilibili-audio-mode
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @downloadURL  https://raw.githubusercontent.com/Yrobot/bilibili-audio-mode/main/dist/bilibili-audio-mode.user.js
// @updateURL    https://raw.githubusercontent.com/Yrobot/bilibili-audio-mode/main/dist/bilibili-audio-mode.meta.js
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==
"use strict";(()=>{var i={headphones:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>',headphonesOff:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 14h-1a2 2 0 0 0-2 2v3"/><path d="M3 14h3a2 2 0 0 1 2 2v3"/><path d="M18.5 22H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 13.11-7.95"/><path d="M3 3l18 18"/></svg>',volume2:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>'};var n=class{constructor(){this.state={enabled:!0,videoElement:null};this.fab=null;this.statusBadge=null;this.ensureTimer=null}init(){this.state.enabled=this.getStoredState(),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>this.onReady()):this.onReady()}onReady(){this.createFAB(),this.waitForVideo(),this.state.enabled&&this.startEnsureLoop()}getStoredState(){try{let e=window.GM_getValue?.("bam_enabled");return e!==void 0?e:!0}catch{return!0}}saveState(){try{window.GM_setValue?.("bam_enabled",this.state.enabled)}catch{}}startEnsureLoop(){this.stopEnsureLoop(),this.ensureTimer=setInterval(()=>{let e=this.findVideoElement();e&&e.style.visibility!=="hidden"&&(this.state.videoElement=e,this.applyAudioMode())},1e3)}stopEnsureLoop(){this.ensureTimer&&(clearInterval(this.ensureTimer),this.ensureTimer=null)}waitForVideo(){let e=this.findVideoElement();if(e){this.setupVideo(e);return}let t=new MutationObserver(()=>{let o=this.findVideoElement();o&&(t.disconnect(),this.setupVideo(o))});t.observe(document.body,{childList:!0,subtree:!0})}setupVideo(e){this.state.videoElement=e}applyAudioMode(){let e=this.state.videoElement;e&&(e.style.visibility="hidden",this.showBadge())}disableAudioMode(){let e=this.state.videoElement;e&&(e.style.visibility="",this.hideBadge())}findVideoElement(){let e=[".bpx-player-video video",".bilibili-player-video video","#bilibili-player video","video"];for(let t of e){let o=document.querySelector(t);if(o instanceof HTMLVideoElement)return o}return null}createFAB(){document.querySelector(".bam-fab")?.remove();let e=document.createElement("button");e.className=`bam-fab ${this.state.enabled?"":"disabled"}`,e.innerHTML=`
      ${this.state.enabled?i.headphones:i.headphonesOff}
      <span class="bam-tooltip">${this.state.enabled?"\u97F3\u9891\u6A21\u5F0F\u5DF2\u5F00\u542F":"\u97F3\u9891\u6A21\u5F0F\u5DF2\u5173\u95ED"}</span>
    `,e.addEventListener("click",t=>{t.stopPropagation(),this.state.enabled=!this.state.enabled,this.saveState(),this.updateFAB(),this.state.enabled?this.startEnsureLoop():(this.stopEnsureLoop(),this.disableAudioMode())}),document.body.appendChild(e),this.fab=e}updateFAB(){this.fab&&(this.fab.className=`bam-fab ${this.state.enabled?"":"disabled"}`,this.fab.innerHTML=`
      ${this.state.enabled?i.headphones:i.headphonesOff}
      <span class="bam-tooltip">${this.state.enabled?"\u97F3\u9891\u6A21\u5F0F\u5DF2\u5F00\u542F":"\u97F3\u9891\u6A21\u5F0F\u5DF2\u5173\u95ED"}</span>
    `)}showBadge(){if(this.statusBadge){this.statusBadge.classList.add("visible");return}let e=this.state.videoElement?.closest(".bpx-player-video-wrap, .bilibili-player-video-wrap, .player-wrap");if(!e)return;let t=document.createElement("div");t.className="bam-badge visible",t.innerHTML=`
      <div class="bam-badge-icon">${i.headphones}</div>
      <div class="bam-badge-title">\u97F3\u9891\u6A21\u5F0F</div>
      <div class="bam-badge-author">by <a href="https://github.com/Yrobot" target="_blank" rel="noopener">@yrobot</a></div>
      <button class="bam-badge-close">
        ${i.headphonesOff}
        <span>\u5173\u95ED\u97F3\u9891\u6A21\u5F0F</span>
      </button>
    `,t.addEventListener("click",a=>{a.stopPropagation(),a.preventDefault()}),t.querySelector("a")?.addEventListener("click",a=>{a.stopPropagation(),a.preventDefault(),window.open("https://github.com/Yrobot","_blank","noopener")}),t.querySelector(".bam-badge-close")?.addEventListener("click",a=>{a.stopPropagation(),this.state.enabled=!1,this.saveState(),this.updateFAB(),this.disableAudioMode()}),e.appendChild(t),this.statusBadge=t}hideBadge(){this.statusBadge?.remove(),this.statusBadge=null}};function r(){let s=document.createElement("style");s.textContent=`
    /* ==================== \u60AC\u6D6E\u6309\u94AE (FAB) ==================== */
    .bam-fab {
      position: fixed;
      right: 24px;
      bottom: 24px;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #00a1d6;  /* B\u7AD9\u84DD */
      color: #fff;
      border: none;
      cursor: pointer;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.2s ease;
      user-select: none;
    }

    .bam-fab:hover {
      background: #00b5e5;
      transform: scale(1.05);
      box-shadow: 0 4px 16px rgba(0, 161, 214, 0.3);
    }

    .bam-fab:active {
      transform: scale(0.95);
    }

    .bam-fab.disabled {
      background: #9499a0;  /* \u7070\u8272 - \u7981\u7528\u72B6\u6001 */
    }

    .bam-fab.disabled:hover {
      background: #a7aab0;
      box-shadow: 0 4px 16px rgba(148, 153, 160, 0.3);
    }

    /* ==================== Tooltip ==================== */
    .bam-tooltip {
      position: absolute;
      right: calc(100% + 12px);
      top: 50%;
      transform: translateY(-50%);
      padding: 8px 12px;
      background: #18191c;
      color: #e3e5e7;
      border-radius: 8px;
      font-size: 13px;
      line-height: 1.4;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.15s ease;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
    }

    .bam-fab:hover .bam-tooltip {
      opacity: 1;
    }

    .bam-tooltip::after {
      content: '';
      position: absolute;
      right: -4px;
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
      width: 8px;
      height: 8px;
      background: #18191c;
    }

    /* ==================== \u72B6\u6001\u5FBD\u7AE0 (Badge) ==================== */
    /* \u663E\u793A\u5728\u64AD\u653E\u5668\u4E2D\u592E\uFF0C\u63D0\u793A\u97F3\u9891\u6A21\u5F0F\u72B6\u6001 */
    .bam-badge {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 100;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 24px 32px;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(12px);
      border-radius: 12px;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }

    .bam-badge.visible {
      opacity: 1;
      pointer-events: auto;
    }

    .bam-badge-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 161, 214, 0.2);
      border-radius: 50%;
      color: #00a1d6;
    }

    .bam-badge-icon svg {
      width: 24px;
      height: 24px;
    }

    .bam-badge-title {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .bam-badge-author {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }

    .bam-badge-author a {
      color: #00a1d6;
      text-decoration: none;
    }

    .bam-badge-author a:hover {
      text-decoration: underline;
    }

    .bam-badge-close {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      padding: 10px 20px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: inherit;
    }

    .bam-badge-close:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .bam-badge-close svg {
      width: 16px;
      height: 16px;
    }
  `,document.head.appendChild(s)}r();var d=new n;d.init();})();
