<script setup>
import { useRouter } from 'vue-router'
import ShortUniqueId from 'short-unique-id'
// *** STEP 1: Make sure supabase is imported ***
import { supabase } from '../lib/supabaseClient'

const router = useRouter()
const uid = new ShortUniqueId({ length: 8 })

async function createNewBoard() {
  const boardId = uid.rnd()

  // *** STEP 2: The FIX is here. This code inserts a new row into the database. ***
  const { error } = await supabase
    .from('clips')
    .insert({ id: boardId, content: '// Welcome to your new board!' })

  if (error) {
    alert('Error creating board. Please try again.')
    console.error(error)
  } else {
    // Only navigate if the database entry was created successfully
    router.push({ name: 'board', params: { id: boardId } })
  }
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