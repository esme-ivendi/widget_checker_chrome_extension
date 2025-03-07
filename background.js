console.log("Background script loaded");

// Ensure chrome.storage.local is available before using it
if (!chrome.storage || !chrome.storage.local) {
    console.error("chrome.storage.local is undefined!");
} else {
    console.log("chrome.storage.local is available.");
}
