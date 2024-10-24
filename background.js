console.log('Background script loaded');

const triggeredObjects = new Set();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  if (message.type === 'triggerReminder' && !triggeredObjects.has(message.id)) {
    triggeredObjects.add(message.id);
    showCustomReminder();
  }
});

function showCustomReminder() {
  chrome.windows.create({
    url: 'reminder.html',
    type: 'popup',
    width: 300,
    height: 300
  });

  const audio = new Audio(chrome.runtime.getURL('audio/reminder.mp3'));
  audio.play();
}