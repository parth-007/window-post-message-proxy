interface Window {
  isIframe: boolean;
  onMessage: (event: MessageEvent) => void;
}

// Only register the event listener if current window is iframe.
if(window.isIframe) {
  window.onMessage = function onMessage(event: MessageEvent) {
    console.log(`echo.html received message: ${event.data}`);
    console.log(`window.parent === event.source: ${window.parent === event.source}`);
    window.parent.postMessage(event.data, "*");
  };
  
  window.addEventListener('message', window.onMessage, false);
}