// This is the background script to handle communication between content script and popup
// Add this as background.js

chrome.runtime.onInstalled.addListener(() => {
    console.log('ClipNote extension installed');
  });
  
  // Listen for messages from content script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkAuthStatus') {
      // Get auth token from storage and send back to content script
      chrome.storage.local.get(['token'], (result) => {
        sendResponse({ isAuthenticated: !!result.token, token: result.token });
      });
      return true; // Required for async response
    }
  });