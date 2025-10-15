/* javascripts/repertuar.js */
;(() => {
  document.addEventListener('DOMContentLoaded', () => {
    // лениво грузим все <img> этой страницы
    document.querySelectorAll('img').forEach((img) => {
      img.loading = 'lazy'
    })

    // простая галерея: клик по картинке открывает её в полном размере
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,.85);
      display:none;align-items:center;justify-content:center;z-index:9999;
    `
    const big = document.createElement('img')
    big.style.cssText = 'max-width:92vw;max-height:92vh;border-radius:12px'
    overlay.appendChild(big)
    overlay.addEventListener('click', () => {
      overlay.style.display = 'none'
      big.src = ''
    })
    document.body.appendChild(overlay)

    document
      .querySelectorAll(
        '.media-strip__row img, .cards--memory img, .orchestra__cover img'
      )
      .forEach((img) => {
        img.style.cursor = 'zoom-in'
        img.addEventListener('click', () => {
          big.src = img.currentSrc || img.src
          overlay.style.display = 'flex'
        })
      })
  })
})()
