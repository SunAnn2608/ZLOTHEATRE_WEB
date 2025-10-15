/* javascripts/contacts.js */
;(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedbackForm')
    if (!form) return

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const data = Object.fromEntries(new FormData(form).entries())
      console.log('Отправлено сообщение:', data)

      // имитация отправки
      alert('Спасибо! Ваше сообщение отправлено.')
      form.reset()
    })
  })
})()
