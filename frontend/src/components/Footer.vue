<script setup>
import { ref } from 'vue'
import AppIcon from './AppIcon.vue'
import logoIcon from '../assets/logo-icon.png'
import { useI18n } from '../i18n.js'

const emit = defineEmits(['book'])
const { t } = useI18n()
const year = new Date().getFullYear()

const email = ref('')
const subscribed = ref(false)
function subscribe() {
  if (!/^\S+@\S+\.\S+$/.test(email.value)) return
  subscribed.value = true
  email.value = ''
  setTimeout(() => (subscribed.value = false), 5000)
}
function go(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <footer
    class="relative bg-gradient-to-b from-[#F5FAFB] to-[#EAF2F4] text-ink-soft pt-16 md:pt-20 mt-4 overflow-hidden">
    <!-- Decorative wave -->
    <svg class="absolute -top-1 left-0 w-full h-10 text-white" viewBox="0 0 1440 60" preserveAspectRatio="none"
      aria-hidden="true">
      <path fill="currentColor"
        d="M0,32L60,29.3C120,27,240,21,360,26.7C480,32,600,48,720,45.3C840,43,960,21,1080,16C1200,11,1320,21,1380,26.7L1440,32L1440,0L0,0Z" />
    </svg>

    <div
      class="max-w-[1180px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.4fr] gap-10 pb-10">
      <!-- Brand -->
      <div v-reveal>
        <div class="flex items-center gap-2.5 mb-4">
          <img :src="logoIcon" alt="Bekzod Abdiev"
            class="w-11 h-11 rounded-[12px] bg-white shadow-sm object-contain p-1.5" />
          <div>
            <strong class="block text-navy font-[var(--font-display)] text-[16px] leading-tight">{{ t.hero.doctorName
            }}</strong>
            <span class="text-teal text-[12px] font-semibold">{{ t.hero.doctorRole }}</span>
          </div>
        </div>
        <p class="text-[13.5px] leading-[1.7] mb-4 max-w-[260px]">{{ t.footer.about }}</p>
        <div class="flex gap-2">
          <a href="https://www.youtube.com/@%D0%91%D0%B5%D0%BA%D0%B7%D0%BE%D0%B4%D0%90%D0%B1%D0%B4%D0%B8%D0%B5%D0%B2-%D0%B95%D1%8B4%D0%B4"
            target="_blank" rel="noopener noreferrer" aria-label="YouTube"
            class="w-9 h-9 rounded-full bg-white text-blue-deep flex items-center justify-center shadow-sm hover:bg-teal-soft hover:text-teal transition-colors">
            <AppIcon name="youtube" :size="16" />
          </a>
          <a href="https://t.me/drbekzodabdiyev" target="_blank" rel="noopener noreferrer" aria-label="Telegram"
            class="w-9 h-9 rounded-full bg-white text-teal flex items-center justify-center shadow-sm hover:bg-teal-soft hover:text-white transition-colors">
            <AppIcon name="telegram" :size="16" />
          </a>
          <a href="https://www.instagram.com/dr_bekzodabdiyev_urolog/" target="_blank" rel="noopener noreferrer"
            aria-label="Instagram"
            class="w-9 h-9 rounded-full bg-white text-cilak flex items-center justify-center shadow-sm hover:bg-cilak-soft transition-colors">
            <AppIcon name="instagram" :size="16" />
          </a>
        </div>


      </div>

      <!-- Services -->
      <div v-reveal="{ delay: 80 }">
        <h4
          class="text-navy text-[15px] font-[var(--font-display)] font-bold mb-4 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-8 after:h-[2px] after:bg-teal">
          {{ t.footer.services }}
        </h4>
        <ul class="flex flex-col gap-2.5">
          <li v-for="item in t.footer.serviceLinks" :key="item.label">
            <a href="#"
              class="group flex items-center gap-2 text-[13.5px] text-ink-soft hover:text-teal transition-colors"
              @click.prevent="go(item.id)">
              <span class="w-4 h-4 rounded-full text-teal flex items-center justify-center flex-shrink-0">
                <AppIcon :name="item.icon" :size="14" />
              </span>
              <span class="group-hover:translate-x-0.5 transition-transform">{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Info -->
      <div v-reveal="{ delay: 160 }">
        <h4
          class="text-navy text-[15px] font-[var(--font-display)] font-bold mb-4 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-8 after:h-[2px] after:bg-teal">
          {{ t.footer.info }}
        </h4>
        <ul class="flex flex-col gap-2.5">
          <li v-for="item in t.footer.infoLinks" :key="item.label">
            <a href="#"
              class="group flex items-center gap-2 text-[13.5px] text-ink-soft hover:text-teal transition-colors"
              @click.prevent="go(item.id)">
              <span class="w-4 h-4 rounded-full text-teal flex items-center justify-center flex-shrink-0">
                <AppIcon :name="item.icon" :size="14" />
              </span>
              <span class="group-hover:translate-x-0.5 transition-transform">{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Telegram Kanal -->
      <div class="border-t border-teal/10">
        <div class="flex items-center gap-3 bg-gradient-to-r from-teal/10 to-teal-soft/30 rounded-2xl px-2 py-4.5">
          <div
            class="w-10 h-10 rounded-xl bg-teal text-white flex items-center justify-center flex-shrink-0 shadow-[0_8px_16px_-8px_rgba(15,112,137,0.4)]">
            <AppIcon name="telegram" :size="20" />
          </div>
          <div class="flex-1 min-w-0">
            <strong class="block text-navy text-[14px] font-[var(--font-display)] leading-tight">Telegram kanal</strong>
            <span class="text-[12px] text-ink-soft">Barcha yangiliklar va maslahatlar</span>
          </div>
          <a href="https://t.me/drbekzodabdiyev" target="_blank" rel="noopener noreferrer"
            class="flex-shrink-0 px-4 py-2 rounded-xl bg-teal text-white text-[13px] font-semibold hover:bg-teal-light transition-all shadow-[0_8px_16px_-8px_rgba(15,112,137,0.4)] hover:shadow-[0_12px_24px_-10px_rgba(15,112,137,0.5)] hover:-translate-y-0.5">
            Obuna bo'lish
          </a>
        </div>
      </div>
    </div>


  </footer>
</template>