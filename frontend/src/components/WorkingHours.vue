<script setup>
import { ref, computed, onMounted } from 'vue'
import AppIcon from './AppIcon.vue'
import { useI18n } from '../i18n.js'
import { getSchedule, getSettings } from '../composables/useApi.js'

const { t } = useI18n()

// dow (JS getDay(): 0=Yakshanba/Sunday ... 6=Shanba/Saturday) -> bot/schedule.json kaliti
const dayKeyByDow = ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba']
const defaultRanges = ['Dam olish kuni', '09:00 – 18:00', '09:00 – 18:00', '09:00 – 18:00', '09:00 – 18:00', '09:00 – 18:00', '09:00 – 15:00']

const now = new Date()
const todayDow = now.getDay()

const schedule = ref(null) // bot/schedule.json dan kelgan xom ma'lumot
const settings = ref(null) // bot/settings.json dan kelgan xom ma'lumot

onMounted(async () => {
  const [sch, set] = await Promise.all([getSchedule(), getSettings()])
  schedule.value = Object.keys(sch || {}).length ? sch : null
  settings.value = Object.keys(set || {}).length ? set : null
})

// Har bir kun uchun { dayOff, range } ni bot ma'lumotidan yoki standart qiymatdan hisoblaydi
const rangesByDow = computed(() => {
  return dayKeyByDow.map((key, dow) => {
    const d = schedule.value?.[key]
    if (d) {
      return d.dayOff ? { dayOff: true, range: '' } : { dayOff: false, range: `${d.start || '--:--'} – ${d.end || '--:--'}` }
    }
    return { dayOff: dow === 0, range: defaultRanges[dow] }
  })
})

const isOpenNow = computed(() => {
  const today = rangesByDow.value[todayDow]
  if (!today || today.dayOff) return false
  const [start, end] = today.range.split(' – ').map((x) => parseInt(x.split(':')[0], 10))
  if (Number.isNaN(start) || Number.isNaN(end)) return false
  const hour = now.getHours()
  return hour >= start && hour < end
})

const days = computed(() => t.value.hours.days.map((name, dow) => ({
  name,
  dow,
  dayOff: rangesByDow.value[dow].dayOff,
  range: rangesByDow.value[dow].dayOff ? t.value.hours.dayOff : rangesByDow.value[dow].range,
})))

const address = computed(() => settings.value?.address || "Toshkent shahri, Shayxontohur tumani,\nNavoiy ko'chasi, 18-uy")
const phone = computed(() => settings.value?.phone || '+998711234567')
const phoneHref = computed(() => `tel:${phone.value.replace(/[^\d+]/g, '')}`)
</script>

<template>
  <section class="py-16 md:py-21" id="ish-vaqti">
    <div class="max-w-[1180px] mx-auto px-6">
      <div v-reveal class="text-center max-w-[620px] mx-auto mb-11">
        <span class="inline-flex items-center gap-2 font-[var(--font-display)] font-semibold text-[13px] tracking-[0.03em] text-blue-deep bg-blue-soft px-3.5 py-1.5 rounded-full">
          <span class="w-1.5 h-1.5 rounded-full bg-cilak inline-block"></span> {{ t.hours.badge }}
        </span>
        <h2 class="text-[24px] sm:text-[32px] lg:text-[38px] mt-3.5">{{ t.hours.title }}</h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1.1fr] gap-5 items-stretch">
        <!-- Schedule -->
        <div v-reveal class="bg-white border border-line rounded-[24px] p-6 shadow-[var(--shadow-card)]">
          <h3 class="text-[15px] font-bold text-navy mb-1">Qabul jadvali</h3>
          <p class="text-[12.5px] text-ink-soft mb-4">Ish kunlari bo'yicha qabul soatlari</p>
          <ul class="flex flex-col gap-1">
            <li v-for="d in days" :key="d.dow"
              class="flex items-center justify-between text-[14px] border-b border-line last:border-b-0 px-2 py-2.5 rounded-lg"
              :class="d.dow === todayDow ? 'bg-blue-mist font-bold' : ''">
              <span class="flex items-center gap-2 text-navy font-semibold">
                <AppIcon name="clock" :size="14" class="text-blue-deep opacity-70" />
                {{ d.name }}
              </span>
              <span :class="d.dayOff ? 'text-cilak font-semibold' : 'text-ink-soft'">{{ d.range }}</span>
            </li>
          </ul>
          <div class="mt-4 flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12.5px] font-bold"
            :class="isOpenNow ? 'bg-[#E6F9F1] text-leaf' : 'bg-cilak-soft text-cilak'">
            <AppIcon name="clock" :size="14" />
            <span>{{ isOpenNow ? t.hours.open : t.hours.closed }}</span>
          </div>
        </div>

        <!-- Contact -->
        <div v-reveal="{ delay: 80 }" class="bg-white border border-line rounded-[24px] p-6 shadow-[var(--shadow-card)] flex flex-col gap-4">
          <div>
            <h3 class="text-[15px] font-bold text-navy flex items-center gap-2 mb-1">
              <AppIcon name="pin" :size="16" class="text-blue-deep" /> Bizning manzil
            </h3>
            <p class="text-[13px] text-ink-soft leading-[1.55] whitespace-pre-line">{{ address }}</p>
          </div>
          <div class="flex items-start gap-3 pt-3 border-t border-line">
            <span class="w-9 h-9 rounded-full bg-blue-mist flex items-center justify-center text-blue-deep flex-shrink-0"><AppIcon name="phone" :size="16" /></span>
            <div>
              <div class="text-[12px] text-ink-soft font-medium">Telefon</div>
              <a :href="phoneHref" class="text-[14px] font-semibold text-navy hover:text-blue-deep">{{ phone }}</a>
            </div>
          </div>
          <div class="flex items-start gap-3 pt-3 border-t border-line">
            <span class="w-9 h-9 rounded-full bg-blue-mist flex items-center justify-center text-blue-deep flex-shrink-0"><AppIcon name="mail" :size="16" /></span>
            <div>
              <div class="text-[12px] text-ink-soft font-medium">Email</div>
              <a href="mailto:info@urolog.uz" class="text-[14px] font-semibold text-navy hover:text-blue-deep">info@urolog.uz</a>
            </div>
          </div>
          <div class="flex items-start gap-3 pt-3 border-t border-line">
            <span class="w-9 h-9 rounded-full bg-blue-mist flex items-center justify-center text-blue-deep flex-shrink-0"><AppIcon name="shield" :size="16" /></span>
            <div>
              <div class="text-[12px] text-ink-soft font-medium">Avtomobil bilan</div>
              <div class="text-[14px] font-semibold text-navy">Bekatlar yaqin</div>
            </div>
          </div>
          <div class="flex items-start gap-3 pt-3 border-t border-line">
            <span class="w-9 h-9 rounded-full bg-blue-mist flex items-center justify-center text-blue-deep flex-shrink-0"><AppIcon name="star" :size="16" /></span>
            <div>
              <div class="text-[12px] text-ink-soft font-medium">Metro</div>
              <div class="text-[14px] font-semibold text-navy">Pushkin bekatidan 5 daqiqa</div>
            </div>
          </div>
        </div>

        <!-- Map -->
        <div v-reveal="{ delay: 160 }" class="rounded-[24px] overflow-hidden border border-line shadow-[var(--shadow-card)] min-h-[380px] relative bg-blue-mist">
          <iframe
            title="Xarita"
            class="absolute inset-0 w-full h-full border-0"
            src="https://www.openstreetmap.org/export/embed.html?bbox=69.264%2C41.302%2C69.296%2C41.320&layer=mapnik&marker=41.311%2C69.280"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
  </section>
</template>
