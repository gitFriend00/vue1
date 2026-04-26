<script setup></script>

<template>
  <nav>
    <router-link to="/">Home</router-link>
    |
    <router-link to="/food-store">Food Store</router-link>
  </nav>

  <router-view />
</template>

<style scoped>
nav {
  margin-bottom: 1rem;
}
</style>
