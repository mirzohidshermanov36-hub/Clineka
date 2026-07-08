<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import AppIcon from './AppIcon.vue'
import logoIcon from '../assets/logo-icon.png'
import { useI18n } from '../i18n.js'

const props = defineProps({
  open: { type: Boolean, default: false },
  presetPackage: { type: String, default: '' },
})
const emit = defineEmits(['close'])
const { t } = useI18n()

const name = ref('')
const phone = ref('')
const note = ref('')
const errors = ref({})
const submitted = ref(false)
const submitting = ref(false)
const submitError = ref('')
const dialogRef = ref(null)

const API_URL = import.meta.env.VITE_API_URL ?? ''

// Calendar / time
const today = new Date(); today.setHours(0, 0, 0, 0)
const viewMonth = ref(today.getMonth())
const viewYear = ref(today.getFullYear())
const selectedDate = ref(null)
const selectedTime = ref('14:30')
const calendarOpen = ref(false)

const monthNames = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr']
const dayShort = ['Du','Se','Ch','Pa','Ju','Sh','Ya']
const times = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30']

const calendarCells = computed(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1)
  // Monday-first: getDay Sunday=0..Sat=6 -> shift to Mon=0..Sun=6
  const offset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(viewYear.value, viewMonth.value, d)
    cells.push({ day: d, date, past: date < today })
  }
  return cells
})

const monthLabel = computed(() => `${monthNames[viewMonth.value]} ${viewYear.value}`)
const selectedDateLabel = computed(() => selectedDate.value
  ? `${selectedDate.value.getDate()} ${monthNames[selectedDate.value.getMonth()]} ${selectedDate.value.getFullYear()}`
  : 'Sanani tanlang')

function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- } else viewMonth.value--
}
function nextMonth() {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ } else viewMonth.value++
}
function pickDate(cell) { if (!cell || cell.past) return; selectedDate.value = cell.date }
function toggleCalendar() { calendarOpen.value = !calendarOpen.value }
watch(selectedDate, () => { calendarOpen.value = false })
function isSelected(cell) {
  return cell && selectedDate.value && cell.date.getTime() === selectedDate.value.getTime()
}

watch(() => props.open, async (val) => {
  if (val) {
    submitted.value = false
    errors.value = {}
    note.value = props.presetPackage ? `${t.value.booking.selectedPkg}: ${props.presetPackage}` : ''
    await nextTick()
    dialogRef.value?.querySelector('input')?.focus()
  }
})

function formatPhone(e) {
  let digits = e.target.value.replace(/\D/g, '').slice(0, 12)
  phone.value = digits
  e.target.value = digits
}
function validate() {
  const errs = {}
  if (!name.value.trim() || name.value.trim().length < 2) errs.name = t.value.booking.errName
  if (!phone.value || phone.value.replace(/\D/g, '').length < 9) errs.phone = t.value.booking.errPhone
  errors.value = errs
  return Object.keys(errs).length === 0
}
async function submit() {
  if (!validate()) return
  submitError.value = ''
  submitting.value = true
  try {
    const res = await fetch(`${API_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value.trim(),
        phone: phone.value,
        date: selectedDateLabel.value !== 'Sanani tanlang' ? selectedDateLabel.value : '',
        time: selectedTime.value,
        note: note.value,
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.ok) {
      throw new Error(data.error || 'Yuborishda xatolik yuz berdi.')
    }
    submitted.value = true
  } catch (err) {
    submitError.value = err.message || 'Server bilan bog\'lanib bo\'lmadi. Birozdan so\'ng qayta urinib ko\'ring.'
  } finally {
    submitting.value = false
  }
}
function close() {
  emit('close')
  name.value = ''; phone.value = ''; selectedDate.value = null; note.value = ''
  submitted.value = false
  submitError.value = ''
}
function onKeydown(e) { if (e.key === 'Escape') close() }
</script>

<template>
  <Teleport to="body">
    <Transition enter-active-class="transition-opacity duration-200" leave-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div v-if="open" class="fixed inset-0 z-[200] bg-[rgba(15,42,74,0.55)] flex items-center justify-center p-4 sm:p-5 backdrop-blur-[2px]" @click.self="close" @keydown="onKeydown">
        <div class="relative w-full max-w-[520px] max-h-[94vh] overflow-y-auto bg-white rounded-[22px] px-6 sm:px-8 pt-7 pb-7 shadow-[0_30px_70px_-20px_rgba(15,42,74,0.45)] animate-fade-up" ref="dialogRef" role="dialog" aria-modal="true" aria-labelledby="booking-title">
          <button class="absolute top-4 right-4 w-8 h-8 rounded-full bg-blue-mist border-none flex items-center justify-center text-ink-soft hover:bg-blue-soft hover:text-navy" @click="close" :aria-label="t.booking.close">
            <AppIcon name="close" :size="18" />
          </button>

          <template v-if="!submitted">
            <div class="text-center mb-5">
              <span class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-line mb-3 overflow-hidden">
                <img :src="logoIcon" alt="Bekzod Abdiev" class="w-9 h-9 object-contain" />
              </span>
              <h3 id="booking-title" class="text-[22px] font-bold text-navy">{{ t.booking.title }}</h3>
              <p class="text-ink-soft text-[13.5px] mt-2 leading-[1.5]">Ma'lumotlaringizni qoldiring, administratorimiz tez orada bog'lanadi.</p>
            </div>

            <form class="flex flex-col gap-3.5" @submit.prevent="submit" novalidate>
              <label class="flex flex-col gap-1.5">
                <span class="text-[12.5px] font-semibold text-ink-soft uppercase tracking-wide">Ism va familiya</span>
                <span class="relative">
                  <AppIcon name="users" :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
                  <input v-model="name" type="text" placeholder="Bekzod Abdiev" :aria-invalid="!!errors.name"
                    class="w-full text-[14.5px] pl-10 pr-3.5 py-3 rounded-xl border-[1.5px] bg-white text-ink focus:outline-none focus:border-blue-deep"
                    :class="errors.name ? 'border-cilak' : 'border-line'" />
                </span>
                <span v-if="errors.name" class="text-cilak font-medium text-[12px]">{{ errors.name }}</span>
              </label>

              <label class="flex flex-col gap-1.5">
                <span class="text-[12.5px] font-semibold text-ink-soft uppercase tracking-wide">Telefon raqami</span>
                <span class="relative">
                  <AppIcon name="phone" :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
                  <input :value="phone" @input="formatPhone" type="tel" inputmode="numeric" placeholder="+998 90 123 45 67" :aria-invalid="!!errors.phone"
                    class="w-full text-[14.5px] pl-10 pr-3.5 py-3 rounded-xl border-[1.5px] bg-white text-ink focus:outline-none focus:border-blue-deep"
                    :class="errors.phone ? 'border-cilak' : 'border-line'" />
                </span>
                <span v-if="errors.phone" class="text-cilak font-medium text-[12px]">{{ errors.phone }}</span>
              </label>

              <div class="grid grid-cols-2 gap-3">
                <div class="flex flex-col gap-1.5">
                  <span class="text-[12.5px] font-semibold text-ink-soft uppercase tracking-wide">Ko'rishish sanasi</span>
                  <button type="button" @click="toggleCalendar" :aria-expanded="calendarOpen"
                    class="relative flex items-center w-full px-3 py-3 rounded-xl border-[1.5px] bg-white text-[14px] text-navy font-semibold focus:outline-none focus:border-blue-deep transition-colors"
                    :class="calendarOpen ? 'border-blue-deep' : 'border-line'">
                    <AppIcon name="clock" :size="15" class="mr-2 text-blue-deep flex-shrink-0" />
                    <span class="truncate flex-1 text-left">{{ selectedDateLabel }}</span>
                    <AppIcon name="chevron-down" :size="14" class="ml-2 text-ink-soft flex-shrink-0 transition-transform" :class="calendarOpen ? 'rotate-180' : ''" />
                  </button>
                </div>
                <div class="flex flex-col gap-1.5">
                  <span class="text-[12.5px] font-semibold text-ink-soft uppercase tracking-wide">Ko'rishish vaqti</span>
                  <div class="relative">
                    <AppIcon name="clock" :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-blue-deep" />
                    <select v-model="selectedTime" class="w-full appearance-none pl-9 pr-8 py-3 rounded-xl border-[1.5px] border-line bg-white text-[14px] font-semibold text-navy focus:outline-none focus:border-blue-deep">
                      <option v-for="tt in times" :key="tt" :value="tt">{{ tt }}</option>
                    </select>
                    <AppIcon name="chevron-down" :size="14" class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft pointer-events-none" />
                  </div>
                </div>
              </div>

              <!-- Calendar (toggle) -->
              <div v-if="calendarOpen" class="border-[1.5px] border-line rounded-xl p-3.5 animate-fade-up">
                <div class="flex items-center justify-between mb-2.5">
                  <div class="font-bold text-navy text-[14px]">{{ monthLabel }}</div>
                  <div class="flex gap-1.5">
                    <button type="button" @click="prevMonth" class="w-7 h-7 rounded-lg bg-blue-mist text-blue-deep flex items-center justify-center hover:bg-blue-soft">
                      <AppIcon name="chevron-down" :size="14" class="rotate-90" />
                    </button>
                    <button type="button" @click="nextMonth" class="w-7 h-7 rounded-lg bg-blue-mist text-blue-deep flex items-center justify-center hover:bg-blue-soft">
                      <AppIcon name="chevron-down" :size="14" class="-rotate-90" />
                    </button>
                  </div>
                </div>
                <div class="grid grid-cols-7 gap-1 mb-1">
                  <div v-for="d in dayShort" :key="d" class="text-center text-[11.5px] font-semibold text-ink-soft py-1">{{ d }}</div>
                </div>
                <div class="grid grid-cols-7 gap-1">
                  <template v-for="(c, i) in calendarCells" :key="i">
                    <div v-if="!c"></div>
                    <button v-else type="button" @click="pickDate(c)" :disabled="c.past"
                      class="aspect-square rounded-lg text-[13px] font-semibold transition-colors"
                      :class="isSelected(c)
                        ? 'bg-blue-deep text-white shadow-[0_8px_18px_-8px_rgba(37,99,235,0.6)]'
                        : c.past
                          ? 'text-ink-soft/50 cursor-not-allowed'
                          : 'bg-blue-mist text-navy hover:bg-blue-soft'">
                      {{ c.day }}
                    </button>
                  </template>
                </div>
                <p class="text-[11.5px] text-ink-soft mt-2">O'tgan kunlar kulrang, faqat kelayotgan kunlar tanlanadi.</p>
              </div>

              <label class="flex flex-col gap-1.5">
                <span class="text-[12.5px] font-semibold text-ink-soft uppercase tracking-wide">Izoh</span>
                <textarea v-model="note" rows="2" placeholder="Savolingiz yoki qo'shimcha ma'lumot..." class="text-[14px] px-3.5 py-3 rounded-xl border-[1.5px] border-line bg-white text-ink resize-none focus:outline-none focus:border-blue-deep"></textarea>
              </label>

              <p v-if="submitError" class="text-cilak font-medium text-[13px] bg-[#FDECEC] border border-[#F6C6C6] rounded-xl px-3.5 py-2.5">{{ submitError }}</p>

              <button type="submit" :disabled="submitting" class="mt-1 w-full inline-flex items-center justify-center gap-2 font-[var(--font-display)] font-semibold text-[15px] px-6 py-4 rounded-xl text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                style="background: #0F6B7A; box-shadow: 0 18px 30px -16px rgba(15,107,122,0.6);">
                {{ submitting ? 'Yuborilmoqda...' : 'Yuborish' }}
              </button>
            </form>
          </template>

          <template v-else>
            <div class="text-center pt-2.5">
              <span class="inline-flex items-center justify-center w-15 h-15 rounded-full bg-[#E6F9F1] text-leaf mb-3.5">
                <AppIcon name="check" :size="30" />
              </span>
              <h3 class="text-xl mb-2">{{ t.booking.okTitle }}</h3>
              <p class="text-ink-soft text-[14.5px] leading-[1.6] mb-5">{{ t.booking.okDesc1 }}, {{ name }}. {{ t.booking.okDesc2 }} <strong>{{ phone }}</strong></p>
              <button class="inline-flex items-center justify-center gap-2 font-[var(--font-display)] font-semibold text-[15px] px-6 py-3.5 rounded-full text-white bg-blue-deep shadow-[var(--shadow-soft)] transition-all duration-200 hover:bg-blue hover:-translate-y-0.5" @click="close">{{ t.booking.close }}</button>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
