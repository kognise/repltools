document.dispatchEvent(new CustomEvent('repltools-inject-response', {
  detail: {
    repl: store.getState().plugins.fs.state.repl,
    origin: document.location.origin
  }
}))