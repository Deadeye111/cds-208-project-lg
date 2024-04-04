export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser();
    // isAuthenticated() is an example method verifying if a user is authenticated
    if (!user.value) {
        return navigateTo('/overview')
    }
})