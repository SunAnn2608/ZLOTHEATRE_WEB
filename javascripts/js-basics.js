// Буфет/карусель (безопасный запуск: если элементов нет — просто выходим)
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carouselTrack')
  const nextBtn = document.getElementById('nextBtn')
  const prevBtn = document.getElementById('prevBtn')

  if (!track || !nextBtn || !prevBtn) return

  nextBtn.addEventListener('click', () => {
    const maxScroll = track.scrollWidth - track.clientWidth
    if (track.scrollLeft >= maxScroll - 5) {
      track.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      track.scrollBy({ left: 235, behavior: 'smooth' })
    }
  })

  prevBtn.addEventListener('click', () => {
    if (track.scrollLeft <= 5) {
      track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' })
    } else {
      track.scrollBy({ left: -235, behavior: 'smooth' })
    }
  })
})
