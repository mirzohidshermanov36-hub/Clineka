<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import AppIcon from './AppIcon.vue'
import { useI18n } from '../i18n.js'
import { getCertificates, fileUrl } from '../composables/useApi.js'

const { t } = useI18n()

// Bot orqali qo'shilgan sertifikatlar (rasm + nom + yil)
const botCerts = ref([])
onMounted(async () => {
  botCerts.value = await getCertificates()
})

// Rasm yuklanmasa, buzilgan-rasm belgisi o'rniga standart ikonkaga qaytish uchun.
const brokenImages = reactive(new Set())

const certs = computed(() => {
  const staticItems = t.value.certs.items.map((c, i) => ({ id: `static-${i}`, title: c.title, year: c.year, image: '' }))
  const dynamicItems = botCerts.value.map((c) => ({ id: c.id, title: c.name, year: c.year, image: c.image ? fileUrl(c.image) : '' }))
  return [...staticItems, ...dynamicItems]
})

const start = ref(0)
const visible = 3
const lightbox = ref(null)

function next() { if (!certs.value.length) return; start.value = (start.value + 1) % certs.value.length }
function prev() { if (!certs.value.length) return; start.value = (start.value - 1 + certs.value.length) % certs.value.length }
const shown = computed(() => Array.from({ length: Math.min(visible, certs.value.length) }, (_, i) => certs.value[(start.value + i) % certs.value.length]))
</script>

<template>
  <section class="py-16 md:py-21 bg-blue-mist" id="sertifikatlar">
    <div class="max-w-[1180px] mx-auto px-6">
      <div v-reveal class="text-center max-w-[620px] mx-auto mb-11">
        <span class="inline-flex items-center gap-2 font-[var(--font-display)] font-semibold text-[13px] tracking-[0.03em] text-blue-deep bg-blue-soft px-3.5 py-1.5 rounded-full">
          <span class="w-1.5 h-1.5 rounded-full bg-cilak inline-block"></span> {{ t.certs.badge }}
        </span>
        <h2 class="text-[24px] sm:text-[32px] lg:text-[38px] mt-3.5">{{ t.certs.title }}</h2>
      </div>

      <div v-if="certs.length === 0" class="text-center text-ink-soft text-[14px] py-8">
        {{ t.certs.empty || "Hozircha ma'lumot yo'q" }}
      </div>
      <div v-else class="flex items-center gap-4">
        <button class="hidden sm:flex w-10.5 h-10.5 rounded-full bg-white border border-line items-center justify-center text-blue-deep flex-shrink-0 hover:bg-blue-soft transition-colors" @click="prev" :aria-label="t.certs.prev">
          <AppIcon name="arrow-left" :size="18" />
        </button>

        <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
          <button v-for="c in shown" :key="c.id"
            class="bg-white border border-line rounded-[18px] px-4.5 py-6 text-center shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-1"
            @click="lightbox = c">
            <div class="w-full aspect-[4/3] rounded-xl bg-blue-soft text-blue-deep flex items-center justify-center mb-3.5 overflow-hidden">
              <img v-if="c.image && !brokenImages.has(c.id)" :src="c.image" alt="" class="w-full h-full object-cover" loading="lazy" @error="brokenImages.add(c.id)" />
              <AppIcon v-else name="ribbon" :size="30" />
            </div>
            <strong class="block text-[13.5px] text-navy leading-[1.4] mb-1.5">{{ c.title }}</strong>
            <span class="text-xs text-ink-soft">{{ c.year }}</span>
          </button>
        </div>

        <button class="hidden sm:flex w-10.5 h-10.5 rounded-full bg-white border border-line items-center justify-center text-blue-deep flex-shrink-0 hover:bg-blue-soft transition-colors" @click="next" :aria-label="t.certs.next">
          <AppIcon name="arrow-right" :size="18" />
        </button>
      </div>

      <div class="flex sm:hidden justify-center gap-3 mt-6">
        <button class="w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center text-blue-deep" @click="prev" :aria-label="t.certs.prev"><AppIcon name="arrow-left" :size="16" /></button>
        <button class="w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center text-blue-deep" @click="next" :aria-label="t.certs.next"><AppIcon name="arrow-right" :size="16" /></button>
      </div>
    </div>

    <Teleport to="body">
      <Transition enter-active-class="transition-opacity duration-200" leave-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-to-class="opacity-0">
        <div v-if="lightbox" class="fixed inset-0 z-[200] bg-[rgba(15,42,74,0.6)] flex items-center justify-center p-5" @click.self="lightbox = null">
          <div class="relative bg-white rounded-[20px] p-10 text-center max-w-[380px] animate-fade-up">
            <button class="absolute top-3.5 right-3.5 w-8 h-8 rounded-full border-none bg-blue-mist flex items-center justify-center" @click="lightbox = null" :aria-label="t.certs.close">
              <AppIcon name="close" :size="18" />
            </button>
            <div class="w-[140px] h-[140px] rounded-2xl mx-auto mb-4.5 bg-blue-soft text-blue-deep flex items-center justify-center overflow-hidden">
              <img v-if="lightbox.image && !brokenImages.has(lightbox.id)" :src="lightbox.image" alt="" class="w-full h-full object-cover" @error="brokenImages.add(lightbox.id)" />
              <AppIcon v-else name="ribbon" :size="60" />
            </div>
            <h4 class="text-[17px] mb-1.5">{{ lightbox.title }}</h4>
            <p class="text-ink-soft text-[13.5px]">{{ lightbox.year }} {{ t.certs.issued }}</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>
