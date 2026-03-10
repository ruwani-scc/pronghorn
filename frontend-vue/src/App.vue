<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <header class="app-header">
      <nav class="navbar">
        <div class="container">
          <div class="navbar-brand">
            <router-link to="/" class="logo">
              <h1>VacationPlan</h1>
            </router-link>
          </div>
          <div class="navbar-menu">
            <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
            <router-link to="/itinerary/new" class="nav-link btn-primary">Create Itinerary</router-link>
          </div>
        </div>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>

    <footer class="app-footer">
      <div class="container">
        <p>&copy; 2024 VacationPlan - Trip Itinerary Manager</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-header {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar {
  padding: 1rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand .logo {
  text-decoration: none;
  color: #2c3e50;
}

.navbar-brand h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.navbar-menu {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: #2c3e50;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: #f5f5f5;
}

.nav-link.router-link-active {
  color: #42b983;
  font-weight: 600;
}

.btn-primary {
  background: #42b983;
  color: white;
}

.btn-primary:hover {
  background: #359268;
}

.app-main {
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
}

.app-footer {
  background: #2c3e50;
  color: white;
  padding: 2rem 0;
  text-align: center;
}

.app-footer p {
  margin: 0;
}
</style>
