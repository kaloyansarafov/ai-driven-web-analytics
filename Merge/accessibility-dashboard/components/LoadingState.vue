<template>
  <div class="loading-state">
    <div class="loading-content">
      <div class="spinner"></div>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div v-if="progress !== null" class="progress-bar">
        <div class="progress" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  message: string;
  progress?: number | null;
}>();
</script>

<style scoped>
.loading-state {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2196F3;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

h3 {
  margin: 0 0 0.5rem;
  color: #333;
}

p {
  margin: 0 0 1rem;
  color: #666;
}

.progress-bar {
  height: 4px;
  background: #f3f3f3;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 1rem;
}

.progress {
  height: 100%;
  background: #2196F3;
  transition: width 0.3s ease;
}
</style> 