<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import doctorImg from '../assets/doctor.png'
import { useI18n } from '../i18n.js'
import { getVideos, fileUrl } from '../composables/useApi.js'

const { t } = useI18n()

// Bot orqali (Telegram admin panel) qo'shilgan haqiqiy natija videolari.
// Bular pastdagi karuselga matnli fikrlar bilan birga aralashtirib qo'shiladi.
const botVideos = ref([])
onMounted(async () => {
  botVideos.value = await getVideos()
})

const targets = [0, 0, 0, 0]
const suffixes = ['+', '+', '%', '+']
const icons = ['users', 'calendar', 'shield', 'check']
const stats = computed(() => t.value.results.stats.map((label, i) => ({
  label, target: targets[i], suffix: suffixes[i], icon: icons[i],
})))

// Karusel: avval statik matnli fikrlar, keyin bot qo'shgan haqiqiy videolar.
const slides = computed(() => [
  ...t.value.results.testimonials.map((tst, i) => ({
    type: 'testimonial', key: `t-${i}`, text: tst.text, name: tst.name, city: tst.city,
  })),
  ...botVideos.value.map((v) => ({
    type: 'video', key: `v-${v.id}`, src: fileUrl(v.fileId), name: v.name, description: v.description,
  })),
])

const displayed = ref(targets.map(() => 0))
const sectionRef = ref(null)
let started = false
let observer

function animate() {
  if (started) return
  started = true
  const duration = 1400
  const start = performance.now()
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    targets.forEach((tv, i) => { displayed.value[i] = Math.round(tv * eased) })
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

const index = ref(0)
const isPlaying = ref(false)
const videoRef = ref(null)
const current = computed(() => slides.value[index.value] || slides.value[0] || null)

let timer
function nextT() { if (!slides.value.length) return; index.value = (index.value + 1) % slides.value.length }
function prevT() { if (!slides.value.length) return; index.value = (index.value - 1 + slides.value.length) % slides.value.length }
function goTo(i) { index.value = i }
function startAutoplay() { stopAutoplay(); if (!isPlaying.value && slides.value.length > 1) timer = setInterval(nextT, 5000) }
function stopAutoplay() { if (timer) clearInterval(timer) }

function togglePlay() {
  const el = videoRef.value
  if (!el) return
  if (el.paused) { el.play(); isPlaying.value = true; stopAutoplay() } else { el.pause(); isPlaying.value = false; startAutoplay() }
}

watch(index, () => {
  isPlaying.value = false
  if (videoRef.value) videoRef.value.pause()
})

onMounted(() => {
  observer = new IntersectionObserver((entries) => entries.forEach(e => { if (e.isIntersecting) animate() }), { threshold: 0.3 })
  if (sectionRef.value) observer.observe(sectionRef.value)
  startAutoplay()
})
onUnmounted(() => { observer?.disconnect(); stopAutoplay() })
</script>

<template>
  <section class="py-16 md:py-21 bg-blue-mist" id="natijalar" ref="sectionRef">
    <div class="max-w-[1180px] mx-auto px-6">
      <div class="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div v-reveal>
          <span class="inline-flex items-center gap-2 font-[var(--font-display)] font-semibold text-[12px] tracking-[0.06em] uppercase text-blue-deep bg-blue-soft px-3.5 py-1.5 rounded-full">
            <span class="w-1.5 h-1.5 rounded-full bg-cilak inline-block"></span> {{ t.results.badge }}
          </span>
          <h2 class="text-[26px] sm:text-[34px] lg:text-[40px] leading-[1.15] mt-4">
            {{ t.results.title1 }}<br class="hidden sm:block" /> {{ t.results.title2 }}
          </h2>
          <p class="text-ink-soft leading-[1.65] text-[15px] mt-4 max-w-[430px]">{{ t.results.desc }}</p>

          <div class="mt-8 space-y-1">
            <div v-for="(s, i) in stats" :key="s.label" class="flex items-center gap-4 py-4 border-b border-line last:border-b-0">
              <span class="w-11 h-11 rounded-xl bg-blue-soft text-blue-deep flex items-center justify-center flex-shrink-0"><AppIcon :name="s.icon" :size="20" /></span>
              <div class="min-w-0">
                <strong class="block font-[var(--font-display)] text-[22px] sm:text-[26px] text-blue-deep leading-none">{{ displayed[i].toLocaleString('en-US') }}{{ s.suffix }}</strong>
                <span class="text-[13.5px] text-ink-soft font-medium">{{ s.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!current" v-reveal="{ delay: 150 }" class="bg-white rounded-[22px] border border-line shadow-[var(--shadow-card)] overflow-hidden flex items-center justify-center aspect-[16/10] text-ink-soft text-[14px] px-8 text-center">
          {{ t.results.empty || "Hozircha ma'lumot yo'q" }}
        </div>
        <div v-else v-reveal="{ delay: 150 }" class="bg-white rounded-[22px] border border-line shadow-[var(--shadow-card)] overflow-hidden">
          <div class="relative aspect-[16/10] bg-navy" @mouseenter="stopAutoplay" @mouseleave="!isPlaying && startAutoplay()">
            <template v-if="current.type === 'video'">
              <video :key="current.key" ref="videoRef" :src="current.src" class="w-full h-full object-cover"
                playsinline preload="metadata" @ended="isPlaying = false; startAutoplay()" @click="togglePlay"></video>
              <div v-if="!isPlaying" class="absolute inset-0 bg-navy/10 pointer-events-none"></div>
              <button v-if="!isPlaying"
                class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-blue-deep text-white flex items-center justify-center shadow-[0_16px_40px_-12px_rgba(22,87,199,0.7)] transition-transform duration-200 hover:scale-110"
                aria-label="Play video" @click="togglePlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg>
              </button>
            </template>
            <template v-else>
              <img :src="doctorImg" alt="Doctor and patient" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-navy/10"></div>
            </template>
            <button class="absolute left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-navy flex items-center justify-center shadow-sm hover:bg-white" @click="prevT" aria-label="Prev"><AppIcon name="arrow-left" :size="16" /></button>
            <button class="absolute right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-navy flex items-center justify-center shadow-sm hover:bg-white" @click="nextT" aria-label="Next"><AppIcon name="arrow-right" :size="16" /></button>
          </div>

          <div class="px-6 py-6 sm:px-8 sm:py-7">
            <template v-if="current.type === 'video'">
              <Transition name="lang-fade" mode="out-in">
                <div :key="current.key" class="min-h-[72px]">
                  <strong class="block text-[15px] text-navy mb-1.5">{{ current.name }}</strong>
                  <p class="text-ink-soft leading-[1.6] text-[14px]">{{ current.description }}</p>
                </div>
              </Transition>
            </template>
            <template v-else>
              <div class="flex gap-1 text-sun mb-3"><AppIcon v-for="n in 5" :key="n" name="star" :size="15" /></div>
              <Transition name="lang-fade" mode="out-in">
                <p :key="current.key" class="text-ink leading-[1.6] text-[15px] min-h-[72px]">"{{ current.text }}"</p>
              </Transition>
              <div class="flex items-center gap-3 mt-4">
                <span class="w-10 h-10 rounded-full bg-blue-soft text-blue-deep flex items-center justify-center font-[var(--font-display)] font-bold">{{ current.name.charAt(0) }}</span>
                <div>
                  <strong class="block text-sm text-navy">{{ current.name }}</strong>
                  <small class="text-ink-soft text-[12.5px]">{{ current.city }}</small>
                </div>
              </div>
            </template>
            <div class="flex gap-2 mt-6 flex-wrap">
              <button v-for="(s, i) in slides" :key="'dot-' + s.key"
                class="h-2 rounded-full border-none p-0 transition-all duration-200"
                :class="[i === index ? 'bg-blue-deep w-5.5 rounded-[5px]' : 'bg-line w-2', s.type === 'video' ? 'ring-1 ring-blue-deep/40' : '']"
                @click="goTo(i)" :aria-label="`Slayd ${i + 1}`"></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
