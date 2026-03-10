<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="not-found">
    <div class="container">
      <div class="content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <button @click="goHome" class="btn btn-primary btn-lg">
          Go to Dashboard
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  padding: 4rem 0;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.content h1 {
  font-size: 6rem;
  color: #42b983;
  margin: 0;
  line-height: 1;
}

.content h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin: 1rem 0;
}

.content p {
  font-size: 1.125rem;
  color: #6c757d;
  margin: 1rem 0 2rem 0;
}
</style>
