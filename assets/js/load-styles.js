// link stylesheet from parent document
const styles = JSON.parse(localStorage.getItem('styles'))
styles.forEach((style) => {
  const link = document.createElement('link')
  link.href = style.href
  link.rel = 'stylesheet'
  document.head.appendChild(link)
})