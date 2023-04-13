<script setup>
    import { useAuthStore } from '@/stores/storeAuth'

    const storeAuth = useAuthStore()
</script>
<template>
<section class="s-home" v-if="storeAuth.user.email">
  <div class="container">
    <h1 class="s-home__title">Vítejte v aplikaci</h1>
    <div class="row gy-4">
      <div class="col-lg-3 col-md-6 s-home__action" v-if="storeAuth.user.role === 'admin'">
        <RouterLink to="/createConference">Vytvořit konferenci</RouterLink>
      </div>
      <div class="col-lg-3 col-md-6 s-home__action">
        <RouterLink to="/conferences">Přehled konferencí</RouterLink>
      </div>
      <div class="col-lg-3 col-md-6 s-home__action" v-if="storeAuth.user.role === 'admin'">
        <RouterLink to="/statistics">Statistiky</RouterLink>
      </div>
      <div class="col-lg-3 col-md-6 s-home__action" v-if="storeAuth.user.role === 'admin'">
        <RouterLink to="/register">Zaregistrovat uživatele</RouterLink>
      </div>
      <div class="col-lg-3 col-md-6 s-home__action" v-if="storeAuth.user.role === 'reviewer'">
        <RouterLink to="/createReview">Vytvořit recenzi</RouterLink>
      </div>
      <div class="col-lg-3 col-md-6 s-home__action" v-if="storeAuth.user.role === 'admin'">
        <RouterLink to="/reviews">Přehled recenzí</RouterLink>
      </div>
    </div>
  </div>
</section>
<section class="s-welcome" v-else>
  <div class="container">
    <div class="s-welcome__wrapper">
      <h1 class="s-welcome__title">
        Vítejte v aplikaci na správu konferencí
        <small>Pro pokračování se prosím přihlašte</small>
      </h1>
      <RouterLink to="/login" class="s-welcome__button">Přihlásit se</RouterLink>
    </div>
  </div>
</section>
</template>

