<script setup>
  import { ref } from 'vue'
  import { useAuthStore } from '@/stores/storeAuth'

  const storeAuth = useAuthStore()
  const showMobileNav = ref(false)
  const logout = () => {
    storeAuth.logoutUser();
  }
</script>
<template>
  <header class="header">
    <div class="container">
      <nav class="header__navigation" :class="{ 'justify-content-between': storeAuth.user.id, active: showMobileNav }">
        <button class="header__burger" @click.prevent="showMobileNav = !showMobileNav" :class="{ active: showMobileNav }">
          <span class="line"></span>
          <span class="line"></span>
          <span class="line"></span>
        </button>
        <div class="header__user-info" v-if="storeAuth.user.email">
          <span>Přihlášený uživatel: {{ storeAuth.user.username }}</span>
          <button @click.prevent="logout">Odhlásit se</button>
        </div>
        <ul class="header__links" :class="{ 'user-active': storeAuth.user.id }">
          <li class="header__link"><RouterLink to="/" active-class="active">Domů</RouterLink></li>
          <li class="header__link"><RouterLink to="/conferences" active-class="active">Konference</RouterLink></li>
          <li v-if="storeAuth.user.role === 'reviewer'" class="header__link"><RouterLink to="/createReview" active-class="active">Vytvořit recenzi</RouterLink></li>
          <li v-if="storeAuth.user.role === 'admin'" class="header__link"><RouterLink to="/statistics" active-class="active">Statistiky</RouterLink></li>
          <li v-if="storeAuth.user.role === 'admin'" class="header__link"><RouterLink to="/reviews" active-class="active">Recenze</RouterLink></li>
          <li v-if="!storeAuth.user.email" class="header__link"><RouterLink to="/login" active-class="active">Přihlásit se</RouterLink></li>
        </ul>
      </nav>
    </div>
  </header>
</template>