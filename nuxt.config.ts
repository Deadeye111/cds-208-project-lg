// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@nuxt/test-utils/module'],
  supabase: {
    redirectOptions: {
    login: '/account',
    callback: '',
    include: undefined,
    exclude: ['/'],
    cookieRedirect: false,}
  },
})
