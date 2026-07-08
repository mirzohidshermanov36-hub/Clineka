// Backend bilan ishlash uchun yagona joy.
// Bot orqali qo'shilgan ma'lumotlar (xizmatlar, natijalar, sertifikatlar,
// jadval, sozlamalar) shu funksiyalar orqali saytga tortiladi.
import { ref } from 'vue'

export const API_URL = import.meta.env.VITE_API_URL ?? ''

/** Telegram file_id -> backend orqali oqim qilinadigan to'g'ridan-to'g'ri URL */
export function fileUrl(fileId) {
  if (!fileId) return ''
  return `${API_URL}/api/file/${encodeURIComponent(fileId)}`
}

async function getJSON(path, fallback) {
  try {
    const res = await fetch(`${API_URL}${path}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    console.warn(`[api] ${path} olinmadi, standart qiymat ishlatiladi:`, err.message)
    return fallback
  }
}

export const getServices = () => getJSON('/api/services', [])
export const getVideos = () => getJSON('/api/videos', [])
export const getCertificates = () => getJSON('/api/certificates', [])
export const getSchedule = () => getJSON('/api/schedule', {})
export const getSettings = () => getJSON('/api/settings', {})

/**
 * Composable: bot ma'lumotini yuklaydi, xato bo'lsa jim tarzda bo'sh/standart
 * qiymatga qaytadi (sayt hech qachon bot bilan bog'liq xato tufayli buzilmasin).
 */
export function useRemoteData(loader, fallback) {
  const data = ref(fallback)
  const loading = ref(true)
  const loaded = ref(false)

  async function load() {
    loading.value = true
    try {
      const result = await loader()
      data.value = result
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  return { data, loading, loaded, load }
}
