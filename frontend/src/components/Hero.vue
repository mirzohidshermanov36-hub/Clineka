<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'
import doctorImg from '../assets/doctor.png'
import { useI18n } from '../i18n.js'

const emit = defineEmits(['book'])
const { t } = useI18n()

const schedule = { start: 9, end: 18, days: [1, 2, 3, 4, 5, 6] }
const now = new Date()
const isOpen = computed(() => {
  const day = now.getDay(); const hour = now.getHours()
  return schedule.days.includes(day) && hour >= schedule.start && hour < schedule.end
})
</script>

<template>
  <section class="relative overflow-hidden bg-navy" id="doktor">
    <video class="absolute inset-0 w-full h-full object-cover z-0" autoplay muted loop playsinline preload="auto"
      aria-hidden="true">
      <source src="/hero.mp4" type="video/mp4" />
    </video>
    <div class="absolute inset-0 z-[1] bg-gradient-to-r from-[#071427]/70 via-[#071427]/30 to-transparent"></div>

    <div class="relative z-10 max-w-[1180px] mx-auto px-6 py-16 lg:py-24">
      <div class="max-w-[600px] animate-fade-up">
        <span
          class="inline-flex items-center gap-2 font-[var(--font-display)] font-semibold text-[13px] tracking-[0.03em] text-white bg-white/10 backdrop-blur-sm border border-white/15 px-3.5 py-1.5 rounded-full">
          <span class="w-1.5 h-1.5 rounded-full bg-blue inline-block"></span>
          {{ t.hero.badge }}
        </span>

        <h1
          class="text-[28px] sm:text-[36px] lg:text-[48px] leading-[1.15] mt-3.5 mb-3 font-bold [text-shadow:0_2px_16px_rgba(0,0,0,0.55)]">
          <span class="text-white">{{ t.hero.title1 }}</span><span class="text-blue">{{ t.hero.title2 }}</span>
          <span class="text-white">{{ t.hero.title3 }} </span>
          <span class="text-white">{{ t.hero.title4 }}</span>
        </h1>
        <p
          class="text-white text-[15px] sm:text-base leading-[1.7] max-w-[560px] [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]">
          {{ t.hero.desc }}
        </p>
        <div class="flex gap-3 my-6 flex-wrap">
          <button
            class="inline-flex items-center justify-center gap-2 font-[var(--font-display)] font-semibold text-[15px] px-6 py-3.5 rounded-full text-white bg-blue-deep shadow-[var(--shadow-soft)] transition-all duration-200 hover:bg-blue hover:-translate-y-0.5"
            @click="emit('book')">
            <AppIcon name="calendar" :size="18" />
            {{ t.hero.book }}
          </button>
          <a href="#xizmatlar"
            class="inline-flex items-center justify-center gap-2 font-[var(--font-display)] font-semibold text-[15px] px-6 py-3.5 rounded-full text-white bg-white/10 backdrop-blur-sm border-[1.5px] border-white/25 transition-colors duration-200 hover:border-white/60">
            <AppIcon name="phone" :size="17" />
            {{ t.hero.services }}
          </a>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
          <div
            class="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-3.5 py-3">
            <span class="w-9 h-9 rounded-xl bg-white/15 text-white flex items-center justify-center flex-shrink-0">
              <AppIcon name="users" :size="18" />
            </span>
            <div class="min-w-0">
              <strong class="block font-[var(--font-display)] text-[15px] text-white leading-tight">1000+</strong>
              <span class="text-[11.5px] text-white/70 leading-tight">{{ t.hero.stats.patients }}</span>
            </div>
          </div>
          <div
            class="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-3.5 py-3">
            <span class="w-9 h-9 rounded-xl bg-white/15 text-white flex items-center justify-center flex-shrink-0">
              <AppIcon name="calendar" :size="18" />
            </span>
            <div class="min-w-0">
              <strong class="block font-[var(--font-display)] text-[15px] text-white leading-tight">8+</strong>
              <span class="text-[11.5px] text-white/70 leading-tight">{{ t.hero.stats.years }}</span>
            </div>
          </div>
          <div
            class="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-3.5 py-3">
            <span class="w-9 h-9 rounded-xl bg-white/15 text-white flex items-center justify-center flex-shrink-0">
              <AppIcon name="shield" :size="18" />
            </span>
            <div class="min-w-0">
              <strong class="block font-[var(--font-display)] text-[15px] text-white leading-tight">98%</strong>
              <span class="text-[11.5px] text-white/70 leading-tight">{{ t.hero.stats.success }}</span>
            </div>
          </div>
          <div
            class="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-3.5 py-3 col-span-2 sm:col-span-1">
            <span class="w-9 h-9 rounded-xl bg-white/15 text-white flex items-center justify-center flex-shrink-0">
              <AppIcon name="clock" :size="18" />
            </span>
            <div class="min-w-0">
              <span class="block text-[12.5px] text-white/70 leading-tight">{{ t.hero.stats.todayLabel }}</span>
              <strong class="block font-[var(--font-display)] text-[14px]"
                :class="isOpen ? 'text-blue' : 'text-white/70'">{{ isOpen ? '09:00–18:00' : t.hero.stats.dayOff
                }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="pt-14 pb-14 bg-gradient-to-b from-blue-mist to-white to-70%">
    <div class="max-w-[1180px] mx-auto px-6">
      <div v-reveal
        class="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] bg-white border border-line rounded-[28px] overflow-hidden shadow-[var(--shadow-card)]">
        <div class="p-6 sm:p-8 lg:p-12 order-2 lg:order-1">
          <span
            class="inline-flex items-center gap-2 font-[var(--font-display)] font-semibold text-[13px] tracking-[0.03em] text-blue-deep bg-blue-soft px-3.5 py-1.5 rounded-full">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-deep inline-block"></span> {{ t.hero.cardBadge }}
          </span>
          <h2 class="text-[30px] sm:text-[40px] lg:text-[52px] leading-[1.1] mt-5 mb-1 text-navy font-bold">{{
            t.hero.doctorName }}</h2>
          <p class="text-blue-deep font-semibold text-[18px] mb-4">{{ t.hero.doctorRole }}</p>
          <div class="flex items-center gap-1 text-sun">
            <AppIcon v-for="n in 5" :key="n" name="star" :size="18" />
            <span class="text-ink-soft text-[14px] ml-2 font-semibold">{{ t.hero.reviews }}</span>
          </div>
          <div class="w-14 h-1 rounded-full bg-blue-deep mt-3 mb-6"></div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-blue-mist/60 border border-line rounded-2xl p-4 mb-6">
            <div class="flex items-center gap-3">
              <span
                class="w-11 h-11 rounded-full bg-blue-soft text-blue-deep flex items-center justify-center flex-shrink-0">
                <AppIcon name="users" :size="20" />
              </span>
              <div class="min-w-0">
                <strong class="block font-[var(--font-display)] text-[15px] text-navy leading-tight">{{ t.hero.exp
                  }}</strong>
                <span class="text-[12.5px] text-ink-soft leading-tight">{{ t.hero.expSub }}</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span
                class="w-11 h-11 rounded-full bg-blue-soft text-blue-deep flex items-center justify-center flex-shrink-0">
                <AppIcon name="shield" :size="20" />
              </span>
              <div class="min-w-0">
                <strong class="block font-[var(--font-display)] text-[15px] text-navy leading-tight">{{ t.hero.patients
                  }}</strong>
                <span class="text-[12.5px] text-ink-soft leading-tight">{{ t.hero.patientsSub }}</span>
              </div>
            </div>
          </div>

          <p class="text-ink-soft leading-[1.75] mb-3 text-[15px]">{{ t.hero.bio1 }}</p>
          <p class="text-ink-soft leading-[1.75] mb-6 text-[15px]">{{ t.hero.bio2 }}</p>

          <div class="flex items-center gap-3 flex-wrap">
            <button
              class="inline-flex items-center justify-center gap-2 font-[var(--font-display)] font-semibold text-[15px] px-6 py-3.5 rounded-full text-white bg-blue-deep shadow-[var(--shadow-soft)] transition-all duration-200 hover:bg-blue hover:-translate-y-0.5"
              @click="emit('book')">
              <AppIcon name="calendar" :size="18" />
              {{ t.hero.more }}
            </button>
            <a href="tel:+998909012355" aria-label="Call"
              class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-line text-blue-deep shadow-[var(--shadow-card)] transition-colors hover:border-blue">
              <AppIcon name="phone" :size="18" />
            </a>
          </div>
        </div>

        <!-- Right image (kattaroq) -->
        <div
          class="relative bg-blue-mist order-1 lg:order-2 min-h-[480px] sm:min-h-[580px] lg:min-h-full flex items-center justify-center overflow-hidden p-2 lg:p-3">
          <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(95%,750px)] aspect-square rounded-full bg-blue-soft animate-pulse-soft">
          </div>
          <img :src="doctorImg" alt="Dr. Bekzod Abdiev — pediatric urologist"
            class="relative z-10 w-auto max-w-[160%] sm:max-w-[180%] lg:max-w-[220%] h-auto max-h-[700px] sm:max-h-[880px] lg:max-h-[1050px] object-contain drop-shadow-[0_24px_40px_rgba(22,87,199,0.18)] animate-floaty mr-30" />
        </div>
      </div>
    </div>
  </section>
</template>