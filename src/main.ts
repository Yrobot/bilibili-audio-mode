/**
 * Bilibili Audio Mode - 油猴脚本入口
 *
 * 功能：B站音频模式，隐藏视频画面只播放音频
 * 作者：@yrobot (https://github.com/Yrobot)
 */

import { AudioModeController } from './controller'
import { injectStyles } from './styles'

// 注入 CSS 样式
injectStyles()

// 初始化控制器
const controller = new AudioModeController()
controller.init()
