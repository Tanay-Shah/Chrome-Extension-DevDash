// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchChallenges') {
    fetch('https://leetcode.com/api/problems/all/')
      .then(response => response.json())
      .then(data => sendResponse({ data: data }))
      .catch(error => sendResponse({ error: error.toString() }));
    return true; // Will respond asynchronously
  }
});
