const sketchilyUpdateUi = (model) => {
  for (let key in model) {
    document.getElementById(key).innerText = model[key]
  }
}

const waitForMessage = (action) => new Promise((resolve) => {
  const listener = (message) => {
    if (message.action !== action) return
    chrome.runtime.onMessage.removeListener(listener)
    resolve(message.payload)
  }
  chrome.runtime.onMessage.addListener(listener)
})

chrome.tabs.executeScript({
  file: 'inject.js'
}, async () => {
  const data = await waitForMessage('repltools-inject-response')

  sketchilyUpdateUi({
    title: data.repl.title,
    url: data.repl.url,
    id: data.repl.id
  })

  waitForMessage('repltools-got-sid').then(async (sid) => {
    sketchilyUpdateUi({ sid })

    const res = await fetch('https://CrosisServer.kognise.repl.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sid,
        id: data.repl.id
      })
    })
    const { token } = await res.json()
    if (typeof token === 'string') {
      sketchilyUpdateUi({ token })
    } else {
      sketchilyUpdateUi({ token: 'error!' })
    }
  })
  chrome.runtime.sendMessage({
    action: 'repltools-get-sid',
    payload: { origin: data.origin }
  })
})