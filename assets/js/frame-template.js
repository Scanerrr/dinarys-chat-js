const load = () => {
  // sending data to iFrame
  const sendMessage = () => {
    const inputMessage = document.getElementById('message-text').value
    const data = {
      message: inputMessage,
      frameName: window.frames.name
    }
    window.top.postMessage(data, document.location.origin)
  }

  const sendMessageBtn = document.getElementById('send-message')
  sendMessageBtn.addEventListener('click', (event) => {
    event.preventDefault()
    const message = document.getElementById('message-text')
    const label = document.getElementById('message-text-label')
    if (message.value.length !== 0) {
      sendMessage()
      message.value = ''
      label.className = ''
    }
  })

  // send on enter click
  document.getElementById('message-text')
    .addEventListener('keyup', (event) => {
    event.preventDefault()
    if (event.keyCode == 13) {
        document.getElementById('send-message').click()
        const label = document.getElementById('message-text-label')
        label.className = 'active'
    }
  });

  // add active class for label
  document.getElementById('message-text')
    .addEventListener('focus', (event) => {
      event.preventDefault()
      const label = document.getElementById('message-text-label')
      label.className += ' active'
    })
  // remove active class for label
  document.getElementById('message-text')
    .addEventListener('blur', (event) => {
      event.preventDefault()
      const message = document.getElementById('message-text').value
      if (message.length !== 0) {
        return;
      } else {
        const label = document.getElementById('message-text-label')
        label.className = ''
      }
    })
}
window.onload = load

