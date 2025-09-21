<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabaseClient'

const content = ref('')
const route = useRoute()
const boardId = route.params.id
let channel = null

// Debounce function to prevent saving on every single keystroke
let debounceTimer
function handleInput(event) {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    updateContent(event.target.value)
  }, 300) // Save after 300ms of inactivity
}

// Function to save content to Supabase
async function updateContent(newContent) {
  await supabase
    .from('clips')
    .update({ content: newContent })
    .eq('id', boardId)
}

// This code runs when the page first loads
onMounted(async () => {
  // 1. Fetch the initial content of the board first
  const { data, error } = await supabase
    .from('clips')
    .select('content')
    .eq('id', boardId)
    .single()

  if (data) {
    content.value = data.content
  } else {
    console.error('Error fetching initial content:', error)
  }

  // 2. NOW, set up the real-time listener for changes from others
  channel = supabase
    .channel(`clipit:${boardId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'clips', filter: `id=eq.${boardId}` },
      (payload) => {
        // When a change is received, update our local content
        content.value = payload.new.content
      }
    )
    .subscribe()
})

// Clean up the listener when the user leaves the page
onUnmounted(() => {
  if (channel) {
    supabase.removeChannel(channel)
  }
})
</script>

<template>
  <div class="main-container">
    <header class="header">
      <h1 class="title">ClipIt 📝</h1>
      </header>
    <div class="editor-container">
      <textarea v-model="content" @input="handleInput" class="editor-textarea" placeholder="Start typing..."></textarea>
    </div>
  </div>
</template>

<style scoped>
  /* Styles remain the same */
  .main-container, .header, .title, .editor-container, .editor-textarea {
    /* Your existing styles here */
  }
   .main-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #21252b;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #282c34;
    border-bottom: 1px solid #3a4048;
    flex-shrink: 0;
  }
  .title {
    font-size: 1.5rem;
    color: #abb2bf;
    margin: 0;
  }
  .editor-container {
    flex-grow: 1;
  }
  .editor-textarea {
    width: 100%;
    height: 100%;
    border: none;
    padding: 20px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 16px;
    background-color: #282c34;
    color: #abb2bf;
    resize: none;
  }
   .editor-textarea:focus {
    outline: none;
  }
</style>