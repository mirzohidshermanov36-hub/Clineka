<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import AppIcon from './AppIcon.vue'
import FlagIcon from './FlagIcon.vue'
import logo from '../assets/logo-transparent.png'
import { useI18n, languages } from '../i18n.js'

const emit = defineEmits(['book'])
const { t, lang, setLang } = useI18n()

const linkIds = ['doktor', 'xizmatlar', 'natijalar', 'savol-javob', 'sertifikatlar', 'ish-vaqti']
const links = computed(() => linkIds.map(id => ({ id, label: t.value.nav.links[id] })))

const active = ref('doktor')
const mobileOpen = ref(false)
const scrolled = ref(false)
const langDropdownOpen = ref(false)
let observer

function go(id) {
  mobileOpen.value = false
  langDropdownOpen.value = false
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function onScroll() { scrolled.value = window.scrollY > 8 }
function pickLang(code) { setLang(code); langDropdownOpen.value = false }

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  observer = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) active.value = e.target.id }),
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
  )
  setTimeout(() => {
    linkIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
  }, 100)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  observer?.disconnect()
})
</script>

<template>
  <header class="sticky top-0 z-[100] bg-white transition-[box-shadow] duration-200"
    :class="scrolled ? 'shadow-[0_8px_24px_-18px_rgba(15,42,74,0.3)]' : ''">
    <div class="hidden md:block bg-teal-deep text-white">
      <div class="max-w-[1180px] mx-auto px-6 h-10 flex items-center justify-between gap-4 text-[12.5px]">
        <div class="flex items-center gap-4 min-w-0">
          <span class="flex items-center gap-1.5 min-w-0 opacity-95">
            <AppIcon name="pin" :size="14" class="flex-shrink-0" />
            <span class="truncate">{{ t.nav.address }}</span>
          </span>
          <span class="w-px h-3.5 bg-white/25 flex-shrink-0"></span>
          <span class="flex items-center gap-1.5 whitespace-nowrap opacity-95">
            <AppIcon name="clock" :size="14" class="flex-shrink-0" />
            <span>{{ t.nav.hours }}</span>
          </span>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <a href="https://t.me/drbekzodabdiyev" target="_blank" rel="noopener noreferrer" aria-label="Telegram"
            class="w-6 h-6 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/15 transition-colors">
            <AppIcon name="telegram" :size="14" />
          </a>
          <a href="https://www.instagram.com/dr_bekzodabdiyev_urolog/" target="_blank" rel="noopener noreferrer"
            aria-label="Instagram"
            class="w-6 h-6 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/15 transition-colors">
            <AppIcon name="instagram" :size="14" />
          </a>
          <a href="https://www.youtube.com/@%D0%91%D0%B5%D0%BA%D0%B7%D0%BE%D0%B4%D0%90%D0%B1%D0%B4%D0%B8%D0%B5%D0%B2-%D0%B95%D1%8B4%D0%B4"
            target="_blank" rel="noopener noreferrer" aria-label="YouTube"
            class="w-6 h-6 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/15 transition-colors">
            <AppIcon name="youtube" :size="14" />
          </a>
        </div>
      </div>
    </div>

    <div class="border-b border-line">
      <div class="max-w-[1050px] mx-auto px-6 flex items-center gap-6 h-24">
        <a href="#doktor" class="flex items-center mr-auto py-2.5 -ml-1" @click.prevent="go('doktor')">
          <img :src="logo" alt="Bekzod Abdiev — Bolalar urologi" class="h-[70px] w-auto flex-shrink-0" />
        </a>

        <nav class="hidden lg:flex gap-1 flex-nowrap" aria-label="Menu">
          <a v-for="l in links" :key="l.id" href="#"
            class="relative text-[13.5px] font-semibold whitespace-nowrap px-3 py-2.5 transition-colors duration-150"
            :class="active === l.id ? 'text-teal' : 'text-ink-soft hover:text-teal'" @click.prevent="go(l.id)">{{
              l.label }}<span v-if="active === l.id"
              class="absolute left-3 right-3 -bottom-0.5 h-[2px] bg-teal rounded-full"></span></a>
        </nav>

        <div class="relative flex-shrink-0 hidden lg:block">
          <button
            class="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-line text-[14px] font-medium text-ink-soft hover:border-teal/40 hover:bg-teal-soft/60 transition-colors"
            @click="langDropdownOpen = !langDropdownOpen" :aria-expanded="langDropdownOpen">
            <FlagIcon :code="lang" :size="18" />
            <span class="uppercase text-xs font-semibold text-ink-light">{{ lang }}</span>
            <AppIcon name="chevron-down" :size="12" class="text-ink-light transition-transform"
              :class="langDropdownOpen ? 'rotate-180' : ''" />
          </button>
          <div v-if="langDropdownOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] border border-line py-1.5 overflow-hidden z-50 animate-fade-up">
            <button v-for="l in languages" :key="l.code"
              class="flex items-center gap-3 w-full px-4 py-2.5 text-[14px] font-medium hover:bg-teal-soft transition-colors"
              :class="lang === l.code ? 'text-teal bg-teal-soft/50' : 'text-ink-soft'" @click="pickLang(l.code)">
              <FlagIcon :code="l.code" :size="20" />
              <span>{{ l.label }}</span>
              <span v-if="lang === l.code" class="ml-auto text-teal">✓</span>
            </button>
          </div>
        </div>

        <button
          class="hidden lg:inline-flex items-center justify-center gap-2 font-[var(--font-display)] font-semibold text-sm px-5 py-2.5 rounded-full text-white bg-teal shadow-[0_14px_30px_-14px_rgba(15,90,115,0.6)] transition-all duration-200 hover:bg-teal-light hover:-translate-y-0.5 flex-shrink-0"
          @click="emit('book')">
          <AppIcon name="phone" :size="16" />
          {{ t.nav.book }}
        </button>

        <button
          class="lg:hidden flex items-center justify-center bg-teal-soft border-none w-11 h-11 rounded-xl text-teal-deep flex-shrink-0"
          @click="mobileOpen = !mobileOpen" :aria-expanded="mobileOpen" :aria-label="t.nav.menu">
          <AppIcon :name="mobileOpen ? 'close' : 'menu'" :size="22" />
        </button>
      </div>
    </div>

    <Teleport to="body">
      <Transition enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-to-class="opacity-0">
        <div v-if="mobileOpen" class="lg:hidden fixed inset-0 z-[150] bg-[rgba(11,90,115,0.45)] backdrop-blur-[2px]"
          @click="mobileOpen = false"></div>
      </Transition>
      <Transition enter-active-class="transition-transform duration-300 ease-out"
        leave-active-class="transition-transform duration-300 ease-in" enter-from-class="translate-x-full"
        leave-to-class="translate-x-full">
        <aside v-if="mobileOpen"
          class="lg:hidden fixed top-0 right-0 h-full w-[80vw] max-w-[420px] z-[160] bg-white shadow-[-24px_0_60px_-20px_rgba(15,42,74,0.35)] flex flex-col"
          aria-label="Mobile menu">
          <div class="relative flex items-center justify-center px-5 h-20 border-b border-line">
            <img :src="logo" alt="Logo" class="h-14 w-auto" />
            <button
              class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-teal-soft text-teal-deep flex items-center justify-center"
              @click="mobileOpen = false" :aria-label="t.nav.menu">
              <AppIcon name="close" :size="22" />
            </button>
          </div>

          <nav class="flex-1 overflow-y-auto flex flex-col gap-1 px-4 py-5">
            <a v-for="(l, i) in links" :key="l.id" href="#"
              class="px-3.5 py-3.5 rounded-xl font-semibold text-[15px] transition-all duration-200 hover:bg-teal-soft hover:translate-x-1"
              :class="active === l.id ? 'text-teal bg-teal-soft' : 'text-ink-soft'"
              :style="{ animation: `slideInRight .4s ease ${i * 60}ms both` }" @click.prevent="go(l.id)">{{ l.label
              }}</a>

            <div class="mt-3 pt-3 border-t border-line">
              <div class="text-[11px] font-semibold uppercase tracking-wide text-ink-light px-3.5 mb-2">Til</div>
              <div class="flex flex-wrap gap-2 px-2">
                <button v-for="l in languages" :key="l.code" type="button"
                  class="flex items-center gap-2 px-3 py-2 rounded-xl border text-[13.5px] font-semibold transition-colors"
                  :class="lang === l.code ? 'border-teal bg-teal-soft text-teal' : 'border-line text-ink-soft hover:border-teal/40 hover:bg-teal-soft/60'"
                  @click="pickLang(l.code)">
                  <FlagIcon :code="l.code" :size="18" />
                  <span class="uppercase">{{ l.code }}</span>
                </button>
              </div>
            </div>
          </nav>

          <div class="px-4 pb-6 pt-2 border-t border-line">
            <button
              class="w-full inline-flex items-center justify-center gap-2 font-[var(--font-display)] font-semibold text-sm px-5 py-3.5 rounded-full text-white bg-teal shadow-[0_14px_30px_-14px_rgba(15,90,115,0.6)] transition-all duration-200 hover:bg-teal-light hover:-translate-y-0.5"
              @click="emit('book'); mobileOpen = false">
              <AppIcon name="phone" :size="16" />
              {{ t.nav.book }}
            </button>
          </div>
        </aside>
      </Transition>
    </Teleport>
  </header>
</template>
