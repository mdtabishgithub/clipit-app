<script setup>
import { useRouter } from 'vue-router'
import ShortUniqueId from 'short-unique-id'
// We will create the supabase client next
// import { supabase } from '../lib/supabaseClient' 

// Set up the router to navigate between pages
const router = useRouter()
// Set up the ID generator
const uid = new ShortUniqueId({ length: 8 })

async function createNewBoard() {
  // 1. Generate a new, unique ID
  const boardId = uid.rnd()

  // 2. Navigate to the new board's page
  router.push({ name: 'board', params: { id: boardId } })
}
</script>

<template>
  <main class="container">
    <h1>ClipIt 📝</h1>
    <p>A Collaborative Code Snippet Board</p>
    <button @click="createNewBoard">Create a New Board</button>
  </main>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  text-align: center;
}
button {
  padding: 12px 24px;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>