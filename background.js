chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {
            hostSuffix: 'repl.it',
            schemes: [ 'https' ],
            originAndPathMatches: '.*repl\\.it/@.+/.+'
          }
        })
      ],
      actions: [ new chrome.declarativeContent.ShowPageAction() ]
    }])
  })
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