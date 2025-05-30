// Telegram WebApp obyektini olish
const tg = window.Telegram.WebApp;

// Ilova ishga tushganda
tg.expand(); // Ilovani to'liq ekranga ochamiz
tg.MainButton.hide(); // Asosiy tugmani yashiramiz

// Global o'zgaruvchilar
let tasks = [];
let groups = [];
let currentGroup = null;

// DOM elementlari
const mainMenu = document.getElementById('mainMenu');
const personalTasks = document.getElementById('personalTasks');
const groupSection = document.getElementById('groupSection');
const statistics = document.getElementById('statistics');
const rating = document.getElementById('rating');
const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const groupContent = document.getElementById('groupContent');
const statsContent = document.getElementById('statsContent');
const ratingContent = document.getElementById('ratingContent');

// Asosiy menyu funksiyalari
function showPersonalTasks() {
    hideAllSections();
    personalTasks.style.display = 'block';
    loadPersonalTasks();
}

function showGroupSection() {
    hideAllSections();
    groupSection.style.display = 'block';
}

function showStatistics() {
    hideAllSections();
    statistics.style.display = 'block';
    loadStatistics();
}

function showRating() {
    hideAllSections();
    rating.style.display = 'block';
    loadRating();
}

function backToMain() {
    hideAllSections();
    mainMenu.style.display = 'block';
}

function hideAllSections() {
    mainMenu.style.display = 'none';
    personalTasks.style.display = 'none';
    groupSection.style.display = 'none';
    statistics.style.display = 'none';
    rating.style.display = 'none';
}

// Vazifalar bilan ishlash
function loadPersonalTasks() {
    // Bu yerda serverdan vazifalarni yuklab olamiz
    // Hozircha mock data bilan ishlaymiz
    tasks = [
        { id: 1, text: "Kitob o'qish", completed: false },
        { id: 2, text: "Sport bilan shug'ullanish", completed: true },
        { id: 3, text: "Ingliz tili darsi", completed: false }
    ];
    
    renderTasks();
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;
    
    if (tasks.length >= 10) {
        alert("Kuniga maksimal 10 ta vazifa qo'shish mumkin!");
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    tasks.push(newTask);
    renderTasks();
    taskInput.value = '';
    
    // Bu yerda vazifani serverga saqlash logikasi bo'ladi
}

function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        
        // Bu yerda o'zgarishni serverga yuborish kerak
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    renderTasks();
    
    // Bu yerda serverdan o'chirish logikasi bo'ladi
}

function renderTasks() {
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <span onclick="toggleTaskCompletion(${task.id})">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">×</button>
        `;
        taskList.appendChild(taskElement);
    });
}

// Guruhlar bilan ishlash
function showCreateGroup() {
    groupContent.innerHTML = `
        <div class="create-group">
            <h3>Yangi Guruh Yaratish</h3>
            <input type="text" id="groupName" placeholder="Guruh nomi">
            <button onclick="createGroup()">Yaratish</button>
        </div>
    `;
}

function createGroup() {
    const groupName = document.getElementById('groupName').value.trim();
    if (groupName === '') return;
    
    // Tasodifiy kod generatsiya qilish (faqat harflardan)
    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };
    
    const groupCode = generateCode();
    
    // Bu yerda guruhni serverga yuborish kerak
    alert(`Guruh muvaffaqiyatli yaratildi!\nGuruh kodi: ${groupCode}\nBu kodni boshqa a'zolar bilan ulashing!`);
    
    // Guruhga qo'shilish
    joinGroup(groupCode, true);
}

function showJoinGroup() {
    groupContent.innerHTML = `
        <div class="join-group">
            <h3>Guruhga Qo'shilish</h3>
            <input type="text" id="groupCode" placeholder="Guruh kodi">
            <button onclick="joinGroupFromInput()">Qo'shilish</button>
        </div>
    `;
}

function joinGroupFromInput() {
    const groupCode = document.getElementById('groupCode').value.trim().toUpperCase();
    if (groupCode === '') return;
    
    joinGroup(groupCode, false);
}

function joinGroup(groupCode, isAdmin) {
    // Bu yerda serverdan guruh ma'lumotlarini tekshiramiz
    // Hozircha mock data bilan ishlaymiz
    
    const group = {
        id: Date.now(),
        name: "Namuna Guruh",
        code: groupCode,
        isAdmin: isAdmin,
        tasks: [
            { id: 1, text: "Guruh vazifasi 1", completed: false },
            { id: 2, text: "Guruh vazifasi 2", completed: false }
        ],
        members: [
            { id: tg.initDataUnsafe.user.id, name: tg.initDataUnsafe.user.first_name, points: 0 }
        ]
    };
    
    currentGroup = group;
    showGroupDetails();
}

function showGroupDetails() {
    if (!currentGroup) return;
    
    let adminControls = '';
    if (currentGroup.isAdmin) {
        adminControls = `
            <div class="admin-controls">
                <h4>Admin Nazorati</h4>
                <input type="text" id="groupTaskInput" placeholder="Yangi guruh vazifasi">
                <button onclick="addGroupTask()">Vazifa Qo'shish</button>
            </div>
        `;
    }
    
    groupContent.innerHTML = `
        <div class="group-details">
            <h3>${currentGroup.name}</h3>
            <p>Guruh kodi: ${currentGroup.code}</p>
            
            <h4>Guruh Vazifalari</h4>
            <div class="group-task-list" id="groupTaskList"></div>
            
            ${adminControls}
            
            <h4>A'zolar</h4>
            <div class="members-list" id="membersList"></div>
        </div>
    `;
    
    renderGroupTasks();
    renderMembers();
}

function renderGroupTasks() {
    const groupTaskList = document.getElementById('groupTaskList');
    if (!groupTaskList) return;
    
    groupTaskList.innerHTML = '';
    
    currentGroup.tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <span onclick="toggleGroupTaskCompletion(${task.id})">${task.text}</span>
            ${currentGroup.isAdmin ? `<button class="delete-btn" onclick="deleteGroupTask(${task.id})">×</button>` : ''}
        `;
        groupTaskList.appendChild(taskElement);
    });
}

function addGroupTask() {
    if (!currentGroup || !currentGroup.isAdmin) return;
    
    const taskText = document.getElementById('groupTaskInput').value.trim();
    if (taskText === '') return;
    
    if (currentGroup.tasks.length >= 10) {
        alert("Guruhda maksimal 10 ta vazifa bo'lishi mumkin!");
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    currentGroup.tasks.push(newTask);
    renderGroupTasks();
    document.getElementById('groupTaskInput').value = '';
    
    // Bu yerda serverga yangi vazifani yuborish kerak
}

function toggleGroupTaskCompletion(taskId) {
    const task = currentGroup.tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderGroupTasks();
        
        // Bu yerda serverga yangilangan ma'lumotni yuborish kerak
        // Agar vazifa bajarilsa, foydalanuvchiga ball qo'shiladi
        if (task.completed) {
            const member = currentGroup.members.find(m => m.id === tg.initDataUnsafe.user.id);
            if (member) {
                member.points += 10;
                renderMembers();
            }
        }
    }
}

function deleteGroupTask(taskId) {
    if (!currentGroup || !currentGroup.isAdmin) return;
    
    currentGroup.tasks = currentGroup.tasks.filter(t => t.id !== taskId);
    renderGroupTasks();
    
    // Bu yerda serverdan vazifani o'chirish kerak
}

function renderMembers() {
    const membersList = document.getElementById('membersList');
    if (!membersList) return;
    
    membersList.innerHTML = '';
    
    // Ballar bo'yicha tartiblash
    currentGroup.members.sort((a, b) => b.points - a.points);
    
    currentGroup.members.forEach((member, index) => {
        const memberElement = document.createElement('div');
        memberElement.className = 'member-item';
        memberElement.innerHTML = `
            <span>${index + 1}. ${member.name}</span>
            <span class="points">${member.points} ball</span>
        `;
        membersList.appendChild(memberElement);
    });
}

// Statistika va reyting
function loadStatistics() {
    // Bu yerda serverdan statistika ma'lumotlarini yuklab olamiz
    // Hozircha mock data bilan ishlaymiz
    
    const stats = {
        personal: {
            totalTasks: 15,
            completed: 10,
            streak: 5
        },
        group: currentGroup ? {
            totalTasks: currentGroup.tasks.length,
            completed: currentGroup.tasks.filter(t => t.completed).length,
            position: 3
        } : null
    };
    
    let groupStats = '';
    if (stats.group) {
        groupStats = `
            <h3>Guruh Statistika</h3>
            <div class="stat-item">
                <span>Bajarilgan vazifalar:</span>
                <span>${stats.group.completed} / ${stats.group.totalTasks}</span>
            </div>
            <div class="stat-item">
                <span>Guruhdagi o'rningiz:</span>
                <span>${stats.group.position}</span>
            </div>
        `;
    }
    
    statsContent.innerHTML = `
        <div class="stats-container">
            <h3>Shaxsiy Statistika</h3>
            <div class="stat-item">
                <span>Bajarilgan vazifalar:</span>
                <span>${stats.personal.completed} / ${stats.personal.totalTasks}</span>
            </div>
            <div class="stat-item">
                <span>Ketma-ket kunlar:</span>
                <span>${stats.personal.streak}</span>
            </div>
            
            ${groupStats}
            
            <div class="chart-container">
                <!-- Bu yerda statistika grafiklari bo'lishi mumkin -->
                <p>Statistika grafiklar bu yerda ko'rsatiladi</p>
            </div>
        </div>
    `;
}

function loadRating() {
    // Bu yerda serverdan reyting ma'lumotlarini yuklab olamiz
    // Hozircha mock data bilan ishlaymiz
    
    const ratings = {
        daily: [
            { name: "Foydalanuvchi1", points: 100 },
            { name: "Foydalanuvchi2", points: 90 },
            { name: "Siz", points: 85 }
        ],
        weekly: [
            { name: "Foydalanuvchi3", points: 500 },
            { name: "Foydalanuvchi4", points: 450 },
            { name: "Siz", points: 420 }
        ],
        monthly: [
            { name: "Foydalanuvchi5", points: 2000 },
            { name: "Foydalanuvchi6", points: 1800 },
            { name: "Siz", points: 1500 }
        ]
    };
    
    ratingContent.innerHTML = `
        <div class="rating-container">
            <div class="rating-tabs">
                <button class="active" onclick="showRatingTab('daily')">Kunlik</button>
                <button onclick="showRatingTab('weekly')">Haftalik</button>
                <button onclick="showRatingTab('monthly')">Oylik</button>
            </div>
            
            <div class="rating-tab-content" id="dailyRating">
                ${renderRatingTable(ratings.daily)}
            </div>
            
            <div class="rating-tab-content" id="weeklyRating" style="display:none;">
                ${renderRatingTable(ratings.weekly)}
            </div>
            
            <div class="rating-tab-content" id="monthlyRating" style="display:none;">
                ${renderRatingTable(ratings.monthly)}
            </div>
        </div>
    `;
}

function showRatingTab(tabName) {
    document.querySelectorAll('.rating-tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    document.querySelectorAll('.rating-tabs button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(`${tabName}Rating`).style.display = 'block';
    document.querySelector(`.rating-tabs button[onclick="showRatingTab('${tabName}')"]`).classList.add('active');
}

function renderRatingTable(data) {
    let html = '<table class="rating-table">';
    html += '<tr><th>Oʻrin</th><th>Ism</th><th>Ball</th></tr>';
    
    data.forEach((item, index) => {
        const isYou = item.name === "Siz" ? 'you' : '';
        html += `
            <tr class="${isYou}">
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.points}</td>
            </tr>
        `;
    });
    
    html += '</table>';
    return html;
}

// Ilovani ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    // Telegram foydalanuvchi ma'lumotlarini olish
    if (tg.initDataUnsafe.user) {
        console.log("Foydalanuvchi:", tg.initDataUnsafe.user);
    }
    
    // Asosiy menyuni ko'rsatish
    backToMain();
});