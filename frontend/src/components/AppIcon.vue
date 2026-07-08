<script setup>
defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 22 },
})
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <template v-if="name === 'shield'">
      <path d="M12 2.5 4 5.5v6c0 5.2 3.6 8.6 8 10 4.4-1.4 8-4.8 8-10v-6L12 2.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M8.5 12.2 11 14.7l4.7-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </template>
    <template v-else-if="name === 'drop'">
      <path d="M12 2.8s6 6.7 6 11.2a6 6 0 1 1-12 0c0-4.5 6-11.2 6-11.2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
    </template>
    <template v-else-if="name === 'ribbon'">
      <path d="M12 3.5 15 9l5.5.4-4.2 3.6 1.5 5.4L12 15.6l-5.8 2.8 1.5-5.4L3.5 9.4 9 9l3-5.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    </template>
    <template v-else-if="name === 'kidney'">
      <path d="M9 3.5c-3 0-5 3-5 7 0 5 2.6 9.5 6.4 9.5 1.7 0 2-1.3 2-2.7 0-1.6-1.4-2.1-1.4-3.8 0-1.6 3-1.8 3-4.6 0-3.4-1.7-5.4-5-5.4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
    </template>
    <template v-else-if="name === 'star'">
      <path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7L12 3Z" fill="currentColor"/>
    </template>
    <template v-else-if="name === 'check'">
      <circle cx="12" cy="12" r="9.2" stroke="currentColor" stroke-width="1.6"/>
      <path d="M8 12.3 10.8 15l5.2-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
    </template>
    <template v-else-if="name === 'phone'">
      <path d="M6.5 3.5h3l1.3 4-2 1.6a12 12 0 0 0 6.1 6.1l1.6-2 4 1.3v3c0 1-.8 1.8-1.8 1.8C11.8 19.3 4.7 12.2 4.7 5.3c0-1 .8-1.8 1.8-1.8Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    </template>
    <template v-else-if="name === 'mail'">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <path d="M4.5 7 12 12.5 19.5 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </template>
    <template v-else-if="name === 'pin'">
      <path d="M12 21s7-6.4 7-11.5A7 7 0 0 0 5 9.5C5 14.6 12 21 12 21Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      <circle cx="12" cy="9.3" r="2.4" stroke="currentColor" stroke-width="1.5"/>
    </template>
    <template v-else-if="name === 'clock'">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/>
      <path d="M12 7v5.2l3.6 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </template>
    <template v-else-if="name === 'chevron-down'">
      <path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </template>
    <template v-else-if="name === 'arrow-left'">
      <path d="M15.5 5 8 12l7.5 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </template>
    <template v-else-if="name === 'arrow-right'">
      <path d="M8.5 5 16 12l-7.5 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </template>
    <template v-else-if="name === 'menu'">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </template>
    <template v-else-if="name === 'close'">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </template>
    <template v-else-if="name === 'users'">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" stroke-width="1.5"/>
      <path d="M3.5 19c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M15 8.2a3 3 0 0 1 0 5.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M16.5 13.7c2.4.4 4 2.3 4 5.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </template>
    <template v-else-if="name === 'calendar'">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M3.5 9.5h17" stroke="currentColor" stroke-width="1.5"/>
      <path d="M8 3v3.5M16 3v3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <circle cx="8.2" cy="13.3" r="1.1" fill="currentColor"/>
      <circle cx="12" cy="13.3" r="1.1" fill="currentColor"/>
      <circle cx="8.2" cy="16.8" r="1.1" fill="currentColor"/>
    </template>
    <template v-else-if="name === 'telegram'">
      <path d="M20.5 4.2 3.3 11c-.8.3-.8 1.4 0 1.7l4.3 1.5 1.7 5.2c.2.7 1 .9 1.5.4l2.4-2.3 4.4 3.2c.7.5 1.6.1 1.8-.7l3-14.1c.2-.9-.7-1.6-1.5-1.3Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M7.6 12.5 17 6.8l-7.4 7.6-.2 3.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    </template>
    <template v-else-if="name === 'instagram'">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="16.8" cy="7.2" r="1" fill="currentColor"/>
    </template>
    <template v-else-if="name === 'facebook'">
      <path d="M14.5 21v-7.2h2.4l.4-2.8h-2.8v-1.8c0-.8.2-1.4 1.4-1.4h1.5V5.3c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7v2H9.3v2.8h2.4V21h2.8Z" fill="currentColor"/>
    </template>
    <template v-else-if="name === 'youtube'">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" stroke="currentColor" stroke-width="1.5"/>
      <path d="M10.3 9.3v5.4l5-2.7-5-2.7Z" fill="currentColor"/>
    </template>
    <template v-else-if="name === 'bear'">
      <circle cx="7" cy="6.5" r="2" stroke="currentColor" stroke-width="1.4"/>
      <circle cx="17" cy="6.5" r="2" stroke="currentColor" stroke-width="1.4"/>
      <circle cx="12" cy="13" r="7.2" stroke="currentColor" stroke-width="1.6"/>
      <circle cx="9.3" cy="12" r=".9" fill="currentColor"/>
      <circle cx="14.7" cy="12" r=".9" fill="currentColor"/>
      <path d="M10 15.6c.6.6 1.4.9 2 .9s1.4-.3 2-.9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    </template>
    <template v-else>
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/>
    </template>
  </svg>
</template>
