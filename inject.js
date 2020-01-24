if (typeof script === 'undefined') {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('injected.js')
  script.addEventListener('load', () => script.remove())

  document.addEventListener('repltools-inject-response', ({ detail }) => {
    chrome.runtime.sendMessage({
      action: 'repltools-inject-response',
      payload: detail
    })
  })
  document.body.appendChild(script)
} else {
  console.warn('ReplTools script already injected')
}