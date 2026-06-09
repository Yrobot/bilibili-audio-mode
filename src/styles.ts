/**
 * 样式注入模块
 * 参考 Bilibili 设计规范，定义音频模式相关的 UI 样式
 */

/**
 * 注入音频模式所需的 CSS 样式
 * 包含：悬浮按钮(FAB)、Tooltip、状态徽章(Badge)
 */
export function injectStyles(): void {
  const style = document.createElement('style')
  style.textContent = `
    /* ==================== 悬浮按钮 (FAB) ==================== */
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
      background: #00a1d6;  /* B站蓝 */
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
      background: #9499a0;  /* 灰色 - 禁用状态 */
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

    /* ==================== 状态徽章 (Badge) ==================== */
    /* 显示在播放器中央，提示音频模式状态 */
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
  `

  document.head.appendChild(style)
}
