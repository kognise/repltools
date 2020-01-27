chrome.tabs.onUpdated.addListener((id, change, tab) => {
  if (change.status === 'complete' && /^https:\/\/(.+\.)?repl\.it\/@.+\/.+\/?$/.test(tab.url)) {
    chrome.pageAction.show(id)
  } else {
    chrome.pageAction.hide(id)
  }
})

chrome.runtime.onMessage.addListener((message, _, respond) => {
  if (message.action !== 'repltools-get-sid') return
  
  chrome.cookies.get({
    url: message.payload.origin,
    name: 'connect.sid'
  }, (cookie) => {
    chrome.runtime.sendMessage({
      action: 'repltools-got-sid',
      payload: cookie ? cookie.value : 'n/a'
    })
  })
})