import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Supabase konfiguratsiyasi
const SUPABASE_URL = 'https://sppcxqqczppppykviqfd.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwcGN4cXFjenBwcHB5a3ZpcWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NTUwODgsImV4cCI6MjA2MzEzMTA4OH0.W-W9pxa6jmcfh_EcVu1Qcu39fFlMWkKbSGAbHRKxDtU'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const form = document.getElementById('task-form')
const statusDiv = document.getElementById('status')

// Telegramdan kelgan user ma’lumotlari (keyinchalik to‘ldiriladi)
const telegram_id = 123456789
const full_name = "Foydalanuvchi"

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const selectedTasks = Array.from(form.elements['tasks'])
    .filter(input => input.checked)
    .map(input => input.value)

  let totalPoints = 0
  const taskPoints = {
    early_wakeup: 20,
    exercise: 15,
    reading: 40,
    podcast: 15,
    writing: 50,
    limit_social: 30,
    sleep_before_midnight: 50,
  }

  selectedTasks.forEach(task => totalPoints += taskPoints[task] || 0)

  const { error } = await supabase.from('tasks').insert([{
    telegram_id,
    full_name,
    tasks: selectedTasks,
    total_points: totalPoints,
    date: new Date().toISOString().split('T')[0]
  }])

  if (error) {
    statusDiv.innerText = "❌ Xatolik: " + error.message
  } else {
    statusDiv.innerText = "✅ Ballar muvaffaqiyatli yuborildi!"
    form.reset()
  }
})
