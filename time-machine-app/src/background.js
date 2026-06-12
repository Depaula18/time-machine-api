chrome.webRequest.onCompleted.addListener(
    function(details) {
      if (details.type === "main_frame" && details.statusCode === 404) {
        console.log("🚨 404 Detectado! Levando para a Máquina do Tempo...");
        
        const timeMachineUrl = chrome.runtime.getURL("index.html") + "?url=" + encodeURIComponent(details.url);
        
        chrome.tabs.update(details.tabId, { url: timeMachineUrl });
      }
    },
    { urls: ["<all_urls>"] }
  );