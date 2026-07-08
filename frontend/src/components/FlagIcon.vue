<script setup>
defineProps({
  code: { type: String, required: true },
  size: { type: [Number, String], default: 18 },
})
</script>

<template>
  <svg
    v-if="code === 'uz'"
    :width="size" :height="size * 0.7" viewBox="0 0 30 21" class="rounded-[3px] flex-shrink-0"
  >
    <rect width="30" height="21" fill="#fff" />
    <rect width="30" height="6" fill="#1EB53A" />
    <rect y="15" width="30" height="6" fill="#1EB53A" />
    <rect width="30" height="6" fill="#0099B5" />
    <rect y="15" width="30" height="6" fill="#0099B5" />
    <rect y="6" width="30" height="1.4" fill="#CE1126" />
    <rect y="13.6" width="30" height="1.4" fill="#CE1126" />
    <circle cx="6" cy="3" r="2.1" fill="#fff" />
    <circle cx="6.9" cy="3" r="1.7" fill="#0099B5" />
    <g fill="#fff">
      <circle cx="10.2" cy="1.4" r=".45" />
      <circle cx="11.6" cy="1.4" r=".45" />
      <circle cx="13" cy="1.4" r=".45" />
      <circle cx="10.2" cy="2.8" r=".45" />
      <circle cx="11.6" cy="2.8" r=".45" />
      <circle cx="13" cy="2.8" r=".45" />
      <circle cx="10.2" cy="4.2" r=".45" />
      <circle cx="11.6" cy="4.2" r=".45" />
      <circle cx="13" cy="4.2" r=".45" />
    </g>
  </svg>

  <svg
    v-else-if="code === 'ru'"
    :width="size" :height="size * 0.7" viewBox="0 0 30 21" class="rounded-[3px] flex-shrink-0"
  >
    <rect width="30" height="21" fill="#fff" />
    <rect y="7" width="30" height="7" fill="#0039A6" />
    <rect y="14" width="30" height="7" fill="#D52B1E" />
  </svg>

  <svg
    v-else
    :width="size" :height="size * 0.7" viewBox="0 0 30 21" class="rounded-[3px] flex-shrink-0"
  >
    <rect width="30" height="21" fill="#012169" />
    <path d="M0 0 30 21M30 0 0 21" stroke="#fff" stroke-width="3" />
    <path d="M0 0 30 21M30 0 0 21" stroke="#C8102E" stroke-width="1.2" />
    <path d="M15 0V21M0 10.5H30" stroke="#fff" stroke-width="5" />
    <path d="M15 0V21M0 10.5H30" stroke="#C8102E" stroke-width="2" />
  </svg>
</template>
