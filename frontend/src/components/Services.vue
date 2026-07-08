<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import AppIcon from './AppIcon.vue'
import { useI18n } from '../i18n.js'
import { getServices, fileUrl } from '../composables/useApi.js'

const { t } = useI18n()
const icons = ['kidney', 'drop', 'ribbon', 'shield']
const openIndex = ref(null)
function toggle(i) { openIndex.value = openIndex.value === i ? null : i }

// Bot orqali (Telegram admin panel) qo'shilgan xizmatlar shu yerga tortiladi
// va statik ro'yxat davomiga qo'shiladi. Bot hech narsa qo'shmagan bo'lsa,
// faqat standart (tarjima qilingan) ro'yxat ko'rsatiladi.
const botServices = ref([])
onMounted(async () => {
  botServices.value = await getServices()
})

// Rasm yuklanmasa (masalan, fayl Telegramda o'chirilgan/eskirgan bo'lsa),
// buzilgan-rasm belgisi o'rniga standart ikonkaga qaytish uchun.
const brokenImages = reactive(new Set())

const items = computed(() => {
  const staticItems = t.value.services.items.map((s) => ({
    title: s.title,
    short: s.short,
    detail: s.detail,
    image: '',
  }))
  const dynamicItems = botServices.value.map((s) => ({
    title: s.name,
    short: s.description?.length > 90 ? s.description.slice(0, 90) + '…' : s.description,
    detail: s.description,
    image: s.image ? fileUrl(s.image) : '',
  }))
  return [...staticItems, ...dynamicItems]
})
</script>

<template>
  <section class="py-16 md:py-21" id="xizmatlar">
    <div class="max-w-[1180px] mx-auto px-6">
      <div v-reveal class="text-center max-w-[620px] mx-auto mb-11">
        <span class="inline-flex items-center gap-2 font-[var(--font-display)] font-semibold text-[13px] tracking-[0.03em] text-blue-deep bg-blue-soft px-3.5 py-1.5 rounded-full">
          <span class="w-1.5 h-1.5 rounded-full bg-cilak inline-block"></span> {{ t.services.badge }}
        </span>
        <h2 class="text-[24px] sm:text-[32px] lg:text-[38px] mt-3.5">{{ t.services.title }}</h2>
        <p class="text-ink-soft mt-3 text-[15.5px] leading-[1.6]">{{ t.services.sub }}</p>
      </div>

      <div v-if="items.length === 0" class="text-center text-ink-soft text-[14px] py-8">
        {{ t.services.empty || "Hozircha ma'lumot yo'q" }}
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <button v-for="(s, i) in items" :key="i"
          v-reveal="{ delay: (i % 4) * 100 }"
          class="text-left bg-white border-[1.5px] rounded-[18px] px-5 py-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card)] hover:border-blue-soft"
          :class="openIndex === i ? 'border-blue shadow-[var(--shadow-card)]' : 'border-line'"
          @click="toggle(i)" :aria-expanded="openIndex === i">
          <span v-if="s.image && !brokenImages.has(i)" class="inline-flex items-center justify-center w-13 h-13 rounded-2xl overflow-hidden bg-blue-soft mb-4">
            <img :src="s.image" alt="" class="w-full h-full object-cover" loading="lazy" @error="brokenImages.add(i)" />
          </span>
          <span v-else class="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-blue-soft text-blue-deep mb-4">
            <AppIcon :name="icons[i % icons.length]" :size="26" />
          </span>
          <h3 class="text-[16.5px] mb-2">{{ s.title }}</h3>
          <p class="text-[13.5px] text-ink-soft leading-[1.6]">{{ s.short }}</p>
          <Transition enter-active-class="transition-opacity duration-200" leave-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-to-class="opacity-0">
            <p v-if="openIndex === i" class="mt-2.5 pt-2.5 border-t border-dashed border-line text-[13.5px] text-ink-soft leading-[1.6]">{{ s.detail }}</p>
          </Transition>
          <span class="inline-flex items-center gap-1.5 mt-3.5 text-[12.5px] font-bold text-cilak">
            {{ openIndex === i ? t.services.less : t.services.more }}
            <AppIcon name="chevron-down" :size="14" class="transition-transform duration-200" :style="{ transform: openIndex === i ? 'rotate(180deg)' : 'none' }" />
          </span>
        </button>
      </div>
    </div>
  </section>
</template>
