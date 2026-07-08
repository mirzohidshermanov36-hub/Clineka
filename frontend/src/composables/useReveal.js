// Global scroll-reveal via a Vue directive: v-reveal
// Adds .is-visible when element enters viewport.
export const reveal = {
  mounted(el, binding) {
    const delay = binding.value?.delay ?? 0
    el.classList.add('reveal-init')
    if (delay) el.style.transitionDelay = `${delay}ms`
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          el.classList.add('is-visible')
          io.unobserve(el)
        }
      })
    }, { threshold: 0.12 })
    io.observe(el)
    el._reveal_io = io
  },
  unmounted(el) {
    el._reveal_io?.disconnect()
  },
}
