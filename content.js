// content.js

// 已处理的元素集合
const processedElements = new Set();

// 查找符合条件的元素
function findMatchingElements() {
  const items = document.querySelectorAll('.timeline__item.J_slide, .timeline__item.J_slide.active');
  const matchingElements = [];

  items.forEach(item => {
    if (item.textContent.includes('正在放映')) {
      const problemElements = item.querySelectorAll('.timeline__ppt.problem');
      matchingElements.push(...problemElements);
    }
  });

  return matchingElements;
}

// 检查页面中是否有符合条件的元素，并发送消息
function checkAndSendMessage() {
  const matchingElements = findMatchingElements();
  for (const element of matchingElements) {
    if (!processedElements.has(element)) {
      chrome.runtime.sendMessage({ type: 'triggerReminder', element: element });
      processedElements.add(element);
      // 移除 break 语句，继续处理其他新元素
    }
  }
}

// 初始检查
function initialCheck() {
  checkAndSendMessage();
}

// 监听页面变化，确保动态加载的内容也能触发提醒
function setupMutationObserver() {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            checkAndSendMessage();
          }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// 创建浮动通知框
function createFloatingNotification() {
  const notification = document.createElement('div');
  notification.style.position = 'fixed';
  notification.style.bottom = '10px';
  notification.style.right = '10px';
  notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  notification.style.color = 'white';
  notification.style.padding = '10px';
  notification.style.borderRadius = '5px';
  notification.style.zIndex = '10000';
  notification.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
  notification.innerHTML = `
    <strong>雨课堂提醒插件正在运行</strong><br>
    版本: 0.2
  `;

  document.body.appendChild(notification);
}

// 主入口
(function main() {
  initialCheck();
  setupMutationObserver();
  createFloatingNotification();
})();