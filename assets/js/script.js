const iFrameTemplate = 'iframe-template'
const iFrameWidth = 410 //pixels
const iFrameHeight = 500  //pixels

const load = () => {
  const addBtn = document.getElementById('add-frame')

  let framesCount = 0;
  // add frame on screen
  addBtn.addEventListener('click', (e) => {
    e.preventDefault()
    document.querySelector('.manual').style.display = 'none'
    const iFrame = createIFrame()
    // end if no iframe found
    if (!frameIsSet(iFrame)) return;

    isLoaded(iFrame, () => {
      setupIFrame(iFrame)
      window.addEventListener("message", receiveMessage, false)
      setJoiningMessage(iFrame)
    })
  })

  // set messege when iframe added
  const setJoiningMessage = (iFrame) => {
    const frames = window.frames
    const frameName = iFrame.contentWindow.frames.name
    for (let i = 0; i < frames.length; i++) {
      if (frameName === frames[i].name) return;
      const frameDoc = frames[i].document

      const newMessageDiv = frameDoc.createElement('div')
      newMessageDiv.className = 'message'

      const messageSpan = frameDoc.createElement('span')
      messageSpan.className = 'system-text'
      const newMessageText = frameDoc.createTextNode('iframe ' + framesCount + ' joined to the conversation')
      messageSpan.appendChild(newMessageText)

      const hostSpan = frameDoc.createElement('span')
      const newMessageHost = frameDoc.createTextNode('[system]: ')
      hostSpan.className = 'system-host'
      hostSpan.appendChild(newMessageHost)

      newMessageDiv.appendChild(hostSpan)
      newMessageDiv.appendChild(messageSpan)

      const messageHistoryDiv = frameDoc.getElementById('message-history')
      messageHistoryDiv.appendChild(newMessageDiv)
    }
  }

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
    iFrame.setAttribute('class', 'draggable')
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
    const header = frameDoc.querySelector('.header')
    header.innerHTML = header.innerHTML + ' ' + framesCount
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
    if (frameWin.frames.name === senderName)
      insert(frameDoc, senderName, message, true)
    else insert(frameDoc, senderName, message)
    frameWin.scrollTo(frameDoc.body.scrollTop, frameDoc.body.scrollHeight)
  }

  // insert message template
  const insert = (frameDoc, senderName, message, isSender = null) => {
    const newMessageDiv = frameDoc.createElement('div')
    const mesageBlock = frameDoc.createElement('blockquote')
    mesageBlock.className = 'sender'

    const messageSpan = frameDoc.createElement('span')
    messageSpan.className = 'sender-text'
    newMessageDiv.className = 'message'

    const newMessageText = frameDoc.createTextNode(message)
    messageSpan.appendChild(newMessageText)
    // messageSpan.appendChild(newMessageText)
    // if sender is set then don't insert its name
    if (isSender) {
      mesageBlock.className += ' sender-right'
    } else {
      const newMessageHost = frameDoc.createTextNode('[' + senderName + ']')
      const hostSpan = frameDoc.createElement('span')
      hostSpan.className = 'sender-name'
      hostSpan.appendChild(newMessageHost)
      mesageBlock.appendChild(hostSpan)
    }
    mesageBlock.appendChild(messageSpan)
    newMessageDiv.appendChild(mesageBlock)
    // newMessageDiv.appendChild(messageSpan)
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
  localStorage.removeItem('styles')
}

// store stylesheets
const storeStyles = () => {
  clearStorage()
  const loadedStyles = document.styleSheets
  if (!localStorage.getItem('styles'))
    localStorage.setItem('styles', JSON.stringify([]))
  const styles = JSON.parse(localStorage.getItem('styles'))
  for (let i = 0; i < loadedStyles.length; i++) {
    const styleToStore = {
      'href': loadedStyles[i].href
    }
    styles.push(styleToStore)
  }
  localStorage.setItem('styles', JSON.stringify(styles))
}
storeStyles()