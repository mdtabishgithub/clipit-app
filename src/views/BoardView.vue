<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabaseClient'

const content = ref('')
const copyMessage = ref('') // To show "Copied!" feedback
const route = useRoute()
const boardId = route.params.id

// --- Real-time Logic (no changes here) ---
function updateContent(payload) {
  supabase
    .from('clips')
    .update({ content: payload })
    .eq('id', boardId)
    .then()
}

onMounted(async () => {
  const { data } = await supabase
    .from('clips')
    .select('content')
    .eq('id', boardId)
    .single()

  if (data) {
    content.value = data.content
  }

  supabase
    .channel('public:clips')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'clips', filter: `id=eq.${boardId}` },
      (payload) => {
        content.value = payload.new.content
      }
    )
    .subscribe()
})

// --- NEW: Function to copy content to clipboard ---
function copyToClipboard() {
  navigator.clipboard.writeText(content.value)
  copyMessage.value = 'Copied!'
  // Hide the message after 2 seconds
  setTimeout(() => {
    copyMessage.value = ''
  }, 2000)
}
</script>

<template>
  <div class="main-container">
    <header class="header">
      <h1 class="title">ClipIt 📝</h1>
      <div class="actions">
        <span class="copy-feedback">{{ copyMessage }}</span>
        <button @click="copyToClipboard" class="copy-btn">Copy</button>
      </div>
    </header>

    <div class="editor-container">
      <textarea v-model="content" @input="updateContent($event.target.value)" class="editor-textarea"></textarea>
    </div>
  </div>
</template>

<style scoped>
/* --- NEW: General and Header Styles --- */
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #21252b; /* A slightly lighter dark color for the body */
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

.actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.copy-feedback {
  color: #61afef; /* A nice blue for feedback */
  font-weight: bold;
}

.copy-btn {
  padding: 8px 16px;
  font-size: 1rem;
  background-color: #61afef;
  color: #282c34;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.copy-btn:hover {
  opacity: 0.9;
}

/* --- Updated Editor Styles --- */
.editor-container {
  flex-grow: 1; /* Allows the editor to fill remaining space */
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