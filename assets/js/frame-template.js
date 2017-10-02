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
    sendMessage()
  })

  // send on enter click
  document.getElementById('message-text')
    .addEventListener('keyup', (event) => {
    event.preventDefault();
    if (event.keyCode == 13) {
        document.getElementById('send-message').click();
    }
  });
}
window.onload = load