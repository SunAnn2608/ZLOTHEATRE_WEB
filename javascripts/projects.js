/* javascripts/projects.js */
;(() => {
  document.addEventListener('DOMContentLoaded', () => {
    // лениво грузим изображения
    document.querySelectorAll('img').forEach((img) => (img.loading = 'lazy'))

    // гладкий скролл для якорей
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href').slice(1)
        const target = document.getElementById(id)
        if (target) {
          e.preventDefault()
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          history.replaceState(null, '', `#${id}`)
        }
      })
    })

    // имитация клика "Подробнее" по карточкам архива (можно заменить на реальные ссылки)
    document.querySelectorAll('.card .btn--ghost').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        alert('Страница проекта в разработке. Замените ссылку на нужную.')
      })
    })
  })
})()
