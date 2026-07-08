<script setup>
import { ref } from 'vue'
import AppIcon from './AppIcon.vue'
import { useI18n } from '../i18n.js'

const { t } = useI18n()
const open = ref(0)
function toggle(i) { open.value = open.value === i ? null : i }
const pad = (n) => String(n + 1).padStart(2, '0')
</script>

<template>
  <section class="py-16 md:py-21" id="savol-javob">
    <div class="max-w-[820px] mx-auto px-6">
      <div v-reveal class="text-center max-w-[620px] mx-auto mb-10">
        <span class="inline-flex items-center gap-2 font-[var(--font-display)] font-semibold text-[13px] tracking-[0.03em] text-blue-deep bg-blue-soft px-3.5 py-1.5 rounded-full">
          <span class="w-1.5 h-1.5 rounded-full bg-cilak inline-block"></span> {{ t.faq.badge }}
        </span>
        <h2 class="text-[24px] sm:text-[32px] lg:text-[38px] mt-3.5">{{ t.faq.title }}</h2>
        <p class="text-ink-soft text-[14px] mt-2">Savollarga ketma-ket javoblar</p>
      </div>

      <div v-if="t.faq.items.length === 0" class="text-center text-ink-soft text-[14px] py-8">
        {{ t.faq.empty || "Hozircha ma'lumot yo'q" }}
      </div>
      <div v-else class="relative pl-14 md:pl-16">
        <!-- Vertical dashed line -->
        <span class="absolute left-6 md:left-7 top-3 bottom-3 border-l-2 border-dashed border-blue-soft" aria-hidden="true"></span>

        <div class="flex flex-col gap-4">
          <div v-for="(f, i) in t.faq.items" :key="i" v-reveal="{ delay: i * 70 }" class="relative">
            <!-- Number badge -->
            <span
              class="absolute -left-14 md:-left-16 top-3 w-11 h-11 rounded-full flex items-center justify-center font-[var(--font-display)] font-bold text-[13px] transition-colors duration-200"
              :class="open === i ? 'bg-blue-deep text-white shadow-[0_10px_20px_-8px_rgba(37,99,235,0.5)]' : 'bg-white border-2 border-blue-soft text-blue-deep'">
              {{ pad(i) }}
            </span>

            <div class="border-[1.5px] rounded-xl overflow-hidden transition-colors duration-200 bg-white"
              :class="open === i ? 'border-blue-soft shadow-[0_10px_30px_-18px_rgba(15,42,74,0.25)]' : 'border-line'">
              <button class="w-full flex items-center justify-between gap-3 bg-transparent border-none px-5 py-4 font-[var(--font-display)] font-semibold text-[14.5px] text-navy text-left"
                @click="toggle(i)" :aria-expanded="open === i">
                <span>{{ f.q }}</span>
                <AppIcon name="chevron-down" :size="18" class="text-blue-deep transition-transform duration-200 flex-shrink-0" :class="open === i ? 'rotate-180' : ''" />
              </button>
              <Transition enter-active-class="transition-all duration-200" leave-active-class="transition-all duration-200" enter-from-class="opacity-0" leave-to-class="opacity-0">
                <p v-if="open === i" class="px-5 pb-5 text-ink-soft text-[14px] leading-[1.65]">{{ f.a }}</p>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
