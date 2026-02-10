document.addEventListener('DOMContentLoaded', () => {
  // ====== базовая инициализация ======
  console.log('ZLOTHEATRE — сайт загружен')

  // ====== Active state for navigation (current page) ======
  // Adds .active to matching links inside .main-nav
  ;(() => {
    const currentFile = (() => {
      const p = window.location.pathname
      const last = p.split('/').filter(Boolean).pop() || ''
      // GitHub Pages: sometimes index is served as a folder
      return last === '' ? 'index.html' : last
    })()

    document.querySelectorAll('.main-nav a[href]').forEach((a) => {
      const href = a.getAttribute('href')
      if (!href) return

      // ignore anchors and external links
      if (href.startsWith('#')) return
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return

      let url
      try {
        url = new URL(href, window.location.href)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) return

      const file = url.pathname.split('/').filter(Boolean).pop() || 'index.html'
      if (file === currentFile) a.classList.add('active')
    })
  })()

  // ====== Плавная прокрутка для якорей ======
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href')
      if (!href || href === '#') return
      const id = href.substring(1)
      const el = document.getElementById(id)
      if (!el) return
      e.preventDefault()
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })

  // ====== Лёгкий "живой" UI: reveal-анимации при скролле ======
  const revealCandidates = Array.from(
    document.querySelectorAll(
      [
        'main h1',
        'main h2',
        'main h3',
        'main p',
        'main section',
        'main article',
        'main .card',
        'main .show-card',
        'main .poster',
        'main img',
        'main .inner-content > *',
      ].join(',')
    )
  )

  // Не трогаем совсем мелкие элементы (иконки/логотипы) и то, что уже размечено
  const toReveal = revealCandidates
    .filter((el) => el && el.nodeType === 1)
    .filter((el) => !el.classList.contains('reveal'))
    .filter((el) => !(el.closest('.main-header') || el.closest('.main-footer')))
    .filter((el) => {
      const rect = el.getBoundingClientRect()
      return rect.height > 12 // отсечь "пустые" штуки
    })

  toReveal.forEach((el, i) => {
    el.classList.add('reveal')
    // небольшая "лесенка" — но без фанатизма
    const delay = Math.min(i * 35, 280)
    el.style.transitionDelay = `${delay}ms`
  })

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 }
  )

  document.querySelectorAll('.reveal').forEach((el) => io.observe(el))

  // ====== Переходы между страницами (мягкий fade-out) ======
  const isModifiedClick = (e) =>
    e.defaultPrevented ||
    e.button !== 0 ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey

  document.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href')
    if (!href) return

    // якоря и спец-схемы не трогаем
    if (href.startsWith('#')) return
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return

    // Внешние ссылки/таргеты не трогаем
    if (a.target && a.target !== '_self') return

    // Попробуем распарсить как URL (относительные тоже норм)
    let url
    try {
      url = new URL(href, window.location.href)
    } catch {
      return
    }

    // Только внутренняя навигация по сайту
    if (url.origin !== window.location.origin) return

    a.addEventListener('click', (e) => {
      if (isModifiedClick(e)) return
      e.preventDefault()
      document.body.classList.add('is-leaving')
      window.setTimeout(() => {
        window.location.href = url.href
      }, 180)
    })
  })
})
