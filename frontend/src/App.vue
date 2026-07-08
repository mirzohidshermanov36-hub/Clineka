<script setup>
import { ref } from 'vue'
import NavBar from './components/NavBar.vue'
import Hero from './components/Hero.vue'
import Services from './components/Services.vue'
import ResultsTestimonials from './components/ResultsTestimonials.vue'
import FAQ from './components/FAQ.vue'
import Certificates from './components/Certificates.vue'
import WorkingHours from './components/WorkingHours.vue'
import Footer from './components/Footer.vue'
import BookingModal from './components/BookingModal.vue'

const bookingOpen = ref(false)
const presetPackage = ref('')

function openBooking(pkgName = '') {
  presetPackage.value = pkgName
  bookingOpen.value = true
}
function closeBooking() { bookingOpen.value = false }
</script>

<template>
  <div class="app">
    <NavBar @book="openBooking()" />
    <Hero @book="openBooking()" />
    <Services />
    <ResultsTestimonials />
    <FAQ />
    <Certificates />
    <WorkingHours />
    <Footer @book="openBooking()" />
    <BookingModal :open="bookingOpen" :preset-package="presetPackage" @close="closeBooking" />
  </div>
</template>
