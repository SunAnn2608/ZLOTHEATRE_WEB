/* javascripts/afisha.js
   Логика фильтров (месяц/тип/поиск) и простая клиентская пагинация.
*/
;(() => {
  const PAGE_SIZE = 12 // сколько карточек на страницу
  const qs = (sel, el = document) => el.querySelector(sel)
  const qsa = (sel, el = document) => [...el.querySelectorAll(sel)]

  const cards = qsa('.card')
  const monthSelect = qs('#monthSelect')
  const typeSelect = qs('#typeSelect')
  const searchInput = qs('#searchInput')
  const pagination = qs('.pagination')

  // ---------- helpers
  const debounce = (fn, ms = 250) => {
    let t
    return (...args) => {
      clearTimeout(t)
      t = setTimeout(() => fn(...args), ms)
    }
  }
  const toParam = (v) => encodeURIComponent(v).replace(/%20/g, '+')

  function readParams() {
    const url = new URL(location.href)
    return {
      m: url.searchParams.get('m') || 'june',
      t: url.searchParams.get('t') || 'all',
      q: url.searchParams.get('q') || ''
    }
  }

  function writeParams({ m, t, q }) {
    const url = new URL(location.href)
    url.searchParams.set('m', m)
    url.searchParams.set('t', t)
    q ? url.searchParams.set('q', q) : url.searchParams.delete('q')
    history.replaceState({}, '', url.toString())
  }

  // ---------- фильтрация
  function filterCards() {
    const m = monthSelect.value
    const t = typeSelect.value
    const q = searchInput.value.trim().toLowerCase()

    const list = []
    cards.forEach((c) => {
      const byMonth = m === 'all' || c.dataset.month === m
      const byType = t === 'all' || c.dataset.type === t
      const title = qs('.card__title', c)?.textContent.toLowerCase() || ''
      const byText = !q || title.includes(q)
      const ok = byMonth && byType && byText
      c.dataset._visible = ok ? '1' : '0' // помечаем для пагинации
      c.style.display = ok ? '' : 'none'
      if (ok) list.push(c)
    })
    return list
  }

  // ---------- пагинация
  function renderPagination(visibleCards, page = 1) {
    if (!pagination) return
    const total = visibleCards.length
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    page = Math.min(Math.max(1, page), pages)

    // показать нужный диапазон карточек
    visibleCards.forEach((c, i) => {
      const idx = i + 1
      const onThisPage = idx > (page - 1) * PAGE_SIZE && idx <= page * PAGE_SIZE
      c.style.display = onThisPage ? '' : 'none'
    })

    // собрать кнопки
    const makeBtn = (txt, p, disabled = false, active = false) => {
      const a = document.createElement('a')
      a.href = '#'
      a.textContent = txt
      a.className =
        'pagination__btn' +
        (active ? ' is-active' : '') +
        (disabled ? ' is-disabled' : '')
      if (!disabled)
        a.addEventListener('click', (e) => {
          e.preventDefault()
          gotoPage(p)
        })
      return a
    }

    pagination.innerHTML = ''
    pagination.appendChild(makeBtn('Назад', page - 1, page === 1))
    // ограничим количество цифр (до 7) и добавим «…» при необходимости
    const maxNums = 7
    let start = Math.max(1, page - 3)
    let end = Math.min(pages, start + maxNums - 1)
    start = Math.max(1, end - maxNums + 1)

    if (start > 1) pagination.appendChild(makeBtn('1', 1))
    if (start > 2) {
      const dots = document.createElement('span')
      dots.className = 'pagination__btn is-disabled'
      dots.textContent = '…'
      pagination.appendChild(dots)
    }

    for (let p = start; p <= end; p++) {
      pagination.appendChild(makeBtn(String(p), p, false, p === page))
    }

    if (end < pages - 1) {
      const dots = document.createElement('span')
      dots.className = 'pagination__btn is-disabled'
      dots.textContent = '…'
      pagination.appendChild(dots)
    }
    if (end < pages) pagination.appendChild(makeBtn(String(pages), pages))

    pagination.appendChild(makeBtn('Вперёд', page + 1, page === pages))
    pagination.setAttribute('aria-label', 'Навигация по странице афиши')

    // прокрутка к началу сетки
    const firstCardTop = qs('.cards')?.offsetTop || 0
    window.scrollTo({ top: firstCardTop - 16, behavior: 'smooth' })
  }

  function gotoPage(p) {
    const visible = cards.filter((c) => c.dataset._visible === '1')
    renderPagination(visible, p)
  }

  // ---------- инициализация
  function initFromURL() {
    const { m, t, q } = readParams()
    if (monthSelect) monthSelect.value = m
    if (typeSelect) typeSelect.value = t
    if (searchInput) searchInput.value = q
  }

  function refresh() {
    const vis = filterCards()
    writeParams({
      m: monthSelect.value,
      t: typeSelect.value,
      q: searchInput.value.trim()
    })
    renderPagination(vis, 1)
  }

  document.addEventListener('DOMContentLoaded', () => {
    // помечаем изображения lazy
    qsa('.card__media img').forEach((img) => {
      img.loading = 'lazy'
    })

    initFromURL()
    // первый рендер
    refresh()

    // события
    monthSelect?.addEventListener('change', refresh)
    typeSelect?.addEventListener('change', refresh)
    searchInput?.addEventListener('input', debounce(refresh, 250))

    // навигация по клавиатуре: Enter на кнопке "Купить билет" переводит фокус к «Подробнее»
    qsa('.card').forEach((card) => {
      const buy = qs('.btn--primary', card)
      const more = qs('.btn--ghost', card)
      buy?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && more) more.focus()
      })
    })
  })
})()
