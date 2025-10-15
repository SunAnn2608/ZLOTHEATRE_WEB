document.addEventListener('DOMContentLoaded', () => {
  console.log('ZLOTHEATRE — сайт загружен')

  // Плавная прокрутка для якорей
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const id = link.getAttribute('href').substring(1)
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    })
  })
})
<script src="javascripts/afisha.js"></script>
