// Asosiy o'zgaruvchilar
const mandatoryTasks = [
    { id: 1, name: "Erta turish (06:00-08:00)", completed: false, points: 10 },
    { id: 2, name: "Kardio mashq qilish (30 daqiqa)", completed: false, points: 15 },
    { id: 3, name: "Kitob o'qish (30 daqiqa)", completed: false, points: 10 },
    { id: 4, name: "Podkast tinglash", completed: false, points: 5 },
    { id: 5, name: "Yozish (journal yunaltirish)", completed: false, points: 10 },
    { id: 6, name: "Ijtimoiy tarmoqni cheklash (2 soatgacha)", completed: false, points: 20 },
    { id: 7, name: "23:59 gacha uxlash", completed: false, points: 15 }
];

let customTasks = [];
let userData = {};

// Telegram Web App ishga tushganda
Telegram.WebApp.ready();
Telegram.WebApp.expand();

// Foydalanuvchi ma'lumotlarini olish
function initUser() {
    const tgUser = Telegram.WebApp.initDataUnsafe.user;
    userData = {
        id: tgUser.id,
        firstName: tgUser.first_name,
        lastName: tgUser.last_name || '',
        photoUrl: tgUser.photo_url || '',
        username: tgUser.username || ''
    };
    
    document.getElementById('user-name').textContent = userData.firstName;
    if (userData.photoUrl) {
        document.getElementById('user-photo').src = userData.photoUrl;
    }
}

// Vazifalarni ekranga chiqarish
function renderTasks() {
    const mandatoryList = document.getElementById('mandatory-tasks');
    const customList = document.getElementById('custom-tasks');
    
    mandatoryList.innerHTML = '';
    customList.innerHTML = '';
    
    // Majburiy vazifalar
    mandatoryTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id}, 'mandatory')">
            <span>${task.name}</span>
            <span class="points">${task.points} ball</span>
        `;
        mandatoryList.appendChild(li);
    });
    
    // Shaxsiy vazifalar
    customTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id}, 'custom')">
            <span>${task.name}</span>
            <button onclick="removeCustomTask(${task.id})">🗑️</button>
        `;
        customList.appendChild(li);
    });
}

// Vazifani bajarilgan deb belgilash
function toggleTask(id, type) {
    if (type === 'mandatory') {
        const task = mandatoryTasks.find(t => t.id === id);
        task.completed = !task.completed;
    } else {
        const task = customTasks.find(t => t.id === id);
        task.completed = !task.completed;
    }
    renderTasks();
    updateRating();
}

// Yangi shaxsiy vazifa qo'shish
function addCustomTask() {
    const taskName = prompt("Yangi vazifa nomini kiriting:");
    if (taskName) {
        const newTask = {
            id: customTasks.length > 0 ? Math.max(...customTasks.map(t => t.id)) + 1 : 1,
            name: taskName,
            completed: false
        };
        customTasks.push(newTask);
        renderTasks();
    }
}

// Shaxsiy vazifani o'chirish
function removeCustomTask(id) {
    customTasks = customTasks.filter(task => task.id !== id);
    renderTasks();
}

// Reytingni hisoblash va yangilash
function updateRating() {
    const completedTasks = mandatoryTasks.filter(task => task.completed);
    const totalPoints = completedTasks.reduce((sum, task) => sum + task.points, 0);
    
    // Bu yerda reytingni Firebasega yozish kerak
    console.log(`Bugungi ballar: ${totalPoints}`);
}

// Tab-larni almashtirish
function openTab(tabName) {
    const tabContents = document.getElementsByClassName('tab-content');
    const tabs = document.getElementsByClassName('tab');
    
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
        tabs[i].classList.remove('active');
    }
    
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Dasturni ishga tushirish
function initApp() {
    initUser();
    renderTasks();
    
    // Vaqtni tekshirib turish (8:00 va 20:00 da yangilash)
    setInterval(checkTime, 60000); // Har minutda tekshiramiz
    checkTime();
}

// Vaqtni tekshirish
function checkTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Toshkent vaqti (UTC+5)
    const tashkentHours = (hours + 5) % 24;
    
    if ((tashkentHours === 8 && minutes === 0) || (tashkentHours === 20 && minutes === 0)) {
        updateRating();
        alert("Reyting yangilandi!");
    }
}
function saveTaskCompletion(userId, taskId, completed) {
  database.ref('users/' + userId + '/tasks/' + taskId).set({
    completed: completed,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
  // 1. Foydalanuvchi kirganda darhol qayd qilish
recordLogin(user.id);

// 2. Har soat faollikni tekshirish
setInterval(checkHourlyActivity, 60 * 60 * 1000); // Har soat

function checkHourlyActivity() {
  const now = new Date();
  const hours = now.getUTCHours() + 5; // Toshkent vaqti
  
  if (hours === 20) { // Soat 20:00
    updateDailyStats();
  }
}

// 3. Kunlik statistikani hisoblash
function updateDailyStats() {
  const today = getCurrentDate();
  
  database.ref('user_activities').once('value').then(snapshot => {
    const activities = snapshot.val() || {};
    let dailyCount = 0;
    
    Object.keys(activities).forEach(userId => {
      if (activities[userId].last_login) {
        const loginDate = new Date(activities[userId].last_login).toISOString().split('T')[0];
        if (loginDate === today) dailyCount++;
      }
    });
    
    database.ref('daily_stats/' + today).set({
      active_users: dailyCount,
      updated_at: firebase.database.ServerValue.TIMESTAMP
    });
  });
}
}
// Dasturni ishga tushiramiz
window.onload = initApp;