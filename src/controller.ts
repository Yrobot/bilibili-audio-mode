/**
 * Bilibili Audio Mode - 核心控制器
 * 
 * 功能：
 * - 通过 CSS visibility: hidden 隐藏视频画面
 * - 使用 setInterval 持续检测样式是否被 B站播放器重置
 * - 提供悬浮按钮(FAB)和状态徽章(Badge)控制音频模式
 * - 通过油猴脚本的 GM_setValue/GM_getValue 持久化状态
 */

import { ICONS } from './icons'

/**
 * 音频模式状态接口
 */
interface AudioState {
  /** 音频模式是否启用 */
  enabled: boolean
  /** 当前视频元素引用 */
  videoElement: HTMLVideoElement | null
}

/**
 * 音频模式控制器
 * 负责管理 B站视频的音频模式切换、UI 显示和状态持久化
 */
export class AudioModeController {
  /** 当前状态 */
  private state: AudioState = {
    enabled: true,
    videoElement: null,
  }

  /** 悬浮按钮元素 */
  private fab: HTMLButtonElement | null = null
  /** 状态徽章元素 */
  private statusBadge: HTMLElement | null = null
  /** 样式保护定时器 - 用于检测 visibility: hidden 是否被 B站播放器重置 */
  private ensureTimer: ReturnType<typeof setInterval> | null = null

  /**
   * 初始化控制器
   * 从存储恢复状态，等待 DOM 加载完成后启动
   */
  init(): void {
    this.state.enabled = this.getStoredState()

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.onReady())
    } else {
      this.onReady()
    }
  }

  /**
   * DOM 加载完成后的初始化逻辑
   * 创建 UI 元素，等待视频元素出现，启动样式保护循环
   */
  private onReady(): void {
    this.createFAB()
    this.waitForVideo()

    // 如果音频模式已启用，启动样式保护循环
    if (this.state.enabled) {
      this.startEnsureLoop()
    }
  }

  /**
   * 从油猴脚本存储获取音频模式状态
   * @returns 音频模式是否启用，默认为 true
   */
  private getStoredState(): boolean {
    try {
      const stored = (window as any).GM_getValue?.('bam_enabled')
      return stored !== undefined ? stored : true
    } catch {
      return true
    }
  }

  /**
   * 保存音频模式状态到油猴脚本存储
   */
  private saveState(): void {
    try {
      (window as any).GM_setValue?.('bam_enabled', this.state.enabled)
    } catch {
      // ignore
    }
  }

  /**
   * 启动样式保护循环
   * 
   * B站播放器会在页面刷新后重置 video 元素的样式，
   * 导致我们设置的 visibility: hidden 丢失。
   * 此方法每 300ms 检测一次，如果发现样式被重置，立即重新应用。
   * 最多运行 15 秒后自动停止。
   */
  private startEnsureLoop(): void {
    this.stopEnsureLoop()

    const startTime = Date.now()
    const MAX_WAIT = 15000 // 最大等待时间 15 秒

    this.ensureTimer = setInterval(() => {
      // 超时自动清理
      if (Date.now() - startTime > MAX_WAIT) {
        this.stopEnsureLoop()
        return
      }

      const video = this.findVideoElement()
      if (!video) return

      // 检测 visibility: hidden 是否丢失
      if (video.style.visibility !== 'hidden') {
        this.state.videoElement = video
        this.applyAudioMode()
      }
    }, 300)
  }

  /**
   * 停止样式保护循环
   */
  private stopEnsureLoop(): void {
    if (this.ensureTimer) {
      clearInterval(this.ensureTimer)
      this.ensureTimer = null
    }
  }

  /**
   * 等待视频元素出现
   * 使用 MutationObserver 监听 DOM 变化，找到 video 元素后调用 setupVideo
   */
  private waitForVideo(): void {
    const video = this.findVideoElement()
    if (video) {
      this.setupVideo(video)
      return
    }

    // 监听 DOM 变化，等待 video 元素出现
    const observer = new MutationObserver(() => {
      const v = this.findVideoElement()
      if (v) {
        observer.disconnect()
        this.setupVideo(v)
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }

  /**
   * 设置视频元素
   * @param video 找到的视频元素
   */
  private setupVideo(video: HTMLVideoElement): void {
    this.state.videoElement = video
  }

  /**
   * 应用音频模式
   * 隐藏视频画面，显示状态徽章
   */
  private applyAudioMode(): void {
    const video = this.state.videoElement
    if (!video) return

    video.style.visibility = 'hidden'
    this.showBadge()
  }

  /**
   * 禁用音频模式
   * 恢复视频画面，隐藏状态徽章
   */
  private disableAudioMode(): void {
    const video = this.state.videoElement
    if (!video) return

    video.style.visibility = ''
    this.hideBadge()
  }

  /**
   * 查找页面中的视频元素
   * 按优先级尝试多个 B站播放器的选择器
   * @returns 找到的视频元素，未找到返回 null
   */
  private findVideoElement(): HTMLVideoElement | null {
    const selectors = [
      '.bpx-player-video video',      // 新版播放器
      '.bilibili-player-video video', // 旧版播放器
      '#bilibili-player video',       // 备用选择器
      'video',                        // 通用选择器
    ]

    for (const selector of selectors) {
      const el = document.querySelector(selector)
      if (el instanceof HTMLVideoElement) {
        return el
      }
    }

    return null
  }

  /**
   * 创建悬浮按钮 (FAB)
   * 页面右下角的圆形按钮，用于切换音频模式
   */
  private createFAB(): void {
    // 移除已存在的按钮
    document.querySelector('.bam-fab')?.remove()

    const fab = document.createElement('button')
    fab.className = `bam-fab ${this.state.enabled ? '' : 'disabled'}`
    fab.innerHTML = `
      ${this.state.enabled ? ICONS.headphones : ICONS.headphonesOff}
      <span class="bam-tooltip">${this.state.enabled ? '音频模式已开启' : '音频模式已关闭'}</span>
    `

    fab.addEventListener('click', (e) => {
      e.stopPropagation() // 防止冒泡影响播放器

      this.state.enabled = !this.state.enabled
      this.saveState()
      this.updateFAB()

      if (this.state.enabled) {
        this.startEnsureLoop()
      } else {
        this.stopEnsureLoop()
        this.disableAudioMode()
      }
    })

    document.body.appendChild(fab)
    this.fab = fab
  }

  /**
   * 更新悬浮按钮状态
   * 根据 enabled 状态切换图标和样式
   */
  private updateFAB(): void {
    if (!this.fab) return

    this.fab.className = `bam-fab ${this.state.enabled ? '' : 'disabled'}`
    this.fab.innerHTML = `
      ${this.state.enabled ? ICONS.headphones : ICONS.headphonesOff}
      <span class="bam-tooltip">${this.state.enabled ? '音频模式已开启' : '音频模式已关闭'}</span>
    `
  }

  /**
   * 显示状态徽章 (Badge)
   * 在播放器中央显示音频模式状态和关闭按钮
   * 包含作者信息和 GitHub 链接
   */
  private showBadge(): void {
    // 如果已存在，只更新可见性
    if (this.statusBadge) {
      this.statusBadge.classList.add('visible')
      return
    }

    // 找到播放器容器
    const videoContainer = this.state.videoElement?.closest(
      '.bpx-player-video-wrap, .bilibili-player-video-wrap, .player-wrap'
    )
    if (!videoContainer) return

    // 创建徽章元素
    const badge = document.createElement('div')
    badge.className = 'bam-badge visible'
    badge.innerHTML = `
      <div class="bam-badge-icon">${ICONS.headphones}</div>
      <div class="bam-badge-title">音频模式</div>
      <div class="bam-badge-author">by <a href="https://github.com/Yrobot" target="_blank" rel="noopener">@yrobot</a></div>
      <button class="bam-badge-close">
        ${ICONS.headphonesOff}
        <span>关闭音频模式</span>
      </button>
    `

    // 阻止徽章整体的点击冒泡，防止影响播放器
    badge.addEventListener('click', (e) => {
      e.stopPropagation()
      e.preventDefault()
    })

    // 链接使用 JS 跳转，避免冒泡
    const link = badge.querySelector('a')
    link?.addEventListener('click', (e) => {
      e.stopPropagation()
      e.preventDefault()
      window.open('https://github.com/Yrobot', '_blank', 'noopener')
    })

    // 关闭按钮事件
    const closeBtn = badge.querySelector('.bam-badge-close')
    closeBtn?.addEventListener('click', (e) => {
      e.stopPropagation()

      this.state.enabled = false
      this.saveState()
      this.updateFAB()
      this.disableAudioMode()
    })

    videoContainer.appendChild(badge)
    this.statusBadge = badge
  }

  /**
   * 隐藏状态徽章
   */
  private hideBadge(): void {
    this.statusBadge?.remove()
    this.statusBadge = null
  }
}
