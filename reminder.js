// reminder.js

// 获取关闭按钮
const closeButton = document.getElementById('closeButton');

// 获取音频元素
const audio = new Audio(chrome.runtime.getURL('audio/reminder.mp3'));
audio.loop = true;
audio.play();

// 添加关闭按钮点击事件
closeButton.addEventListener('click', () => {
  // 停止播放音频
  audio.pause();
  audio.currentTime = 0;

  // 关闭当前窗口
  window.close();
});