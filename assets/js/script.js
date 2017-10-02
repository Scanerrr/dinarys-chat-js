const iFrameTemplate = 'iframe-template'
const iFrameWidth = 240 //pixels
const iFrameHeight = 240  //pixels

const load = () => {
  const addBtn = document.getElementById('add-frame')

  let framesCount = 0;
  // add frame on screen
  addBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const iFrame = createIFrame()
    // end if no iframe found
    if (!frameIsSet(iFrame)) return;

    isLoaded(iFrame, () => {
      setupIFrame(iFrame)
      window.addEventListener("message", receiveMessage, false)
    })
  })

  // receive message from the iframe
  const receiveMessage = (event) => {
    const { data, origin, source } = event
    if (origin !== document.location.origin) return;
    sendToFrames(source, data.message)
  }

  // init and create frame
  const createIFrame = () => {
    const iFrame = document.createElement('iframe')
    iFrame.setAttribute('src', iFrameTemplate + '.html')
    iFrame.style.width = iFrameWidth + 'px'
    iFrame.style.height = iFrameHeight + 'px'
    framesCount++
    iFrame.setAttribute('name', 'frame-' + framesCount)

    return document.body.appendChild(iFrame)
  }

  // wrapper for loaded iframes
  const isLoaded = (iFrame, callback) => {
    iFrame.onload = () => {
      callback()
    }
  }

  // setup iframe
  const setupIFrame = (iFrame) => {
    const frameDoc = iFrame.contentDocument
    const header = frameDoc.querySelector('h1.header')
    header.innerHTML = header.innerHTML + ' ' + framesCount
    // set joining message
    const messageHistory = frameDoc.querySelectorAll('.message span')
    const host = messageHistory[0]
    const message = messageHistory[1]
    host.innerHTML = '[system]: '
    message.innerHTML = 'iframe ' + framesCount + ' joined the conversation'
    // get message history
    if (!localStorage.getItem('chat-history')) return;
    const chatHistory = JSON.parse(localStorage.getItem('chat-history'))
    insertMessageHistory(iFrame, chatHistory)
  }

  // insert message history
  const insertMessageHistory = (iFrame, chatHistory) => {
    const frameDoc = iFrame.contentDocument
    chatHistory.forEach((value) => {
      insert(frameDoc, value.sender, value.message)
    })
  }

  // sending data to iFrames
  const sendToFrames = (frameWin, message) => {
    const frames = window.frames
    const frameName = frameWin.frames.name
    for (let i = 0; i < frames.length; i++) {
      insertNewMessage(frames[i], message, frameName)
    }
    // store message
    saveHistory(frameName, message)
  }

  // arrange inserting new message
  const insertNewMessage = (frameWin, message, senderName) => {
    const frameDoc = frameWin.document
    insert(frameDoc, senderName, message)
  }

  // insert message template
  const insert = (frameDoc, senderName, message) => {
    const newMessageDiv = frameDoc.createElement('div')
    const hostSpan = frameDoc.createElement('span')
    const messageSpan = frameDoc.createElement('span')
    newMessageDiv.className = 'message'
    const newMessageHost = frameDoc.createTextNode('[' + senderName + ']: ')
    hostSpan.appendChild(newMessageHost)
    newMessageDiv.appendChild(hostSpan)
    const newMessageText = frameDoc.createTextNode(message)
    messageSpan.appendChild(newMessageText)
    newMessageDiv.appendChild(messageSpan)
    const messageHistoryDiv = frameDoc.getElementById('message-history')
    messageHistoryDiv.appendChild(newMessageDiv)
  }

  // store message in localstorage
  const saveHistory = (senderName, message) => {
    if (!localStorage.getItem('chat-history'))
      localStorage.setItem('chat-history', JSON.stringify([]))
    const chatHistory = JSON.parse(localStorage.getItem('chat-history'))
    const messageToStore = {
      'sender': senderName,
      'message': message
    }
    chatHistory.push(messageToStore)
    localStorage.setItem('chat-history', JSON.stringify(chatHistory))
  }

  // check if iframe is set
  const frameIsSet = (iFrame) => {
    if (typeof iFrame === 'undefined') {
      console.log('There is no frame found!')
      return false
    }
    return true;
  }
}

window.onload = load

// clear localstorage
const clearStorage = () => {
  localStorage.removeItem('chat-history')
}
clearStorage()