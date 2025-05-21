// MongoDB bilan bog'lanish uchun konfiguratsiya
const MONGODB_CONFIG = {
    apiKey: "your-mongodb-api-key",
    cluster: "your-cluster-name",
    dbName: "habits-app",
    collection: "users"
};

// Mock database - aslida MongoDB ishlatiladi
let mockDB = {
    users: [],
    groups: [],
    habits: [],
    tasks: []
};

// Joriy foydalanuvchi
let currentUser = null;

// DOM elementlari
const loginPage = document.getElementById('login-page');
const mainPage = document.getElementById('main-page');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const userNameDisplay = document.getElementById('user-name');
const userPointsDisplay = document.getElementById('user-points');
const userAvatar = document.getElementById('user-avatar');

// Tablar
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Odatlar bo'limi
const habitsList = document.getElementById('habits-list');
const addHabitBtn = document.getElementById('add-habit-btn');
const addHabitModal = document.getElementById('add-habit-modal');
const saveHabitBtn = document.getElementById('save-habit-btn');

// Vazifalar bo'limi
const tasksList = document.getElementById('tasks-list');
const addTaskBtn = document.getElementById('add-task-btn');
const addTaskModal = document.getElementById('add-task-modal');
const saveTaskBtn = document.getElementById('save-task-btn');

// Guruhlar bo'limi
const groupsList = document.getElementById('groups-list');
const createGroupBtn = document.getElementById('create-group-btn');
const joinGroupBtn = document.getElementById('join-group-btn');
const createGroupModal = document.getElementById('create-group-modal');
const joinGroupModal = document.getElementById('join-group-modal');
const groupSearchResults = document.getElementById('group-search-results');
const saveGroupBtn = document.getElementById('save-group-btn');

// Reyting bo'limi
const rankingTabBtns = document.querySelectorAll('.ranking-tab-btn');
const rankingLists = document.querySelectorAll('.ranking-list');

// Modal oynalar
const modals = document.querySelectorAll('.modal');
const closeBtns = document.querySelectorAll('.close-btn');

// Dastur ishga tushganda
document.addEventListener('DOMContentLoaded', () => {
    // Event listenerlar
    loginBtn.addEventListener('click', handleLogin);
    registerBtn.addEventListener('click', handleRegister);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Tablar uchun event listenerlar
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Modal oynalar uchun event listenerlar
    addHabitBtn.addEventListener('click', () => showModal('add-habit-modal'));
    addTaskBtn.addEventListener('click', () => showModal('add-task-modal'));
    createGroupBtn.addEventListener('click', () => showModal('create-group-modal'));
    joinGroupBtn.addEventListener('click', () => showModal('join-group-modal'));
    
    saveHabitBtn.addEventListener('click', saveHabit);
    saveTaskBtn.addEventListener('click', saveTask);
    saveGroupBtn.addEventListener('click', createGroup);
    
    // Reyting tablari uchun event listenerlar
    rankingTabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchRankingTab(btn.dataset.rankingTab));
    });
    
    // Modal oynalarni yopish
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            modal.classList.add('hidden');
        });
    });
    
    // Modal tashqarisiga bosganda yopish
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
    
    // Dastlabki ma'lumotlarni yuklash
    initMockData();
    
    // Agar avval ro'yxatdan o'tgan bo'lsa, asosiy sahifaga o'tkazish
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainPage();
        loadUserData();
    }
});

// Mock ma'lumotlarni yaratish (aslida MongoDBdan olinadi)
function initMockData() {
    // Foydalanuvchilar
    mockDB.users = [
        { id: 1, username: "user1", password: "pass1", name: "Foydalanuvchi 1", points: 150, avatar: "assets/images/user1.png", groups: [1] },
        { id: 2, username: "user2", password: "pass2", name: "Foydalanuvchi 2", points: 200, avatar: "assets/images/user2.png", groups: [1, 2] },
        { id: 3, username: "user3", password: "pass3", name: "Foydalanuvchi 3", points: 75, avatar: "assets/images/user3.png", groups: [2] }
    ];
    
    // Guruhlar
    mockDB.groups = [
        { id: 1, name: "Sportchilar", description: "Har kuni sport bilan shug'ullanamiz", creatorId: 1, members: [1, 2], tasks: [1] },
        { id: 2, name: "Dasturchilar", description: "Kod yozish odatini shakllantiramiz", creatorId: 2, members: [2, 3], tasks: [2, 3] }
    ];
    
    // Odatlar
    mockDB.habits = [
        { id: 1, userId: 1, name: "Har kuni 30 minut sport", frequency: "daily", points: 10, streak: 5, completedToday: false },
        { id: 2, userId: 1, name: "Haftasiga 3 marta kitob o'qish", frequency: "weekly", points: 15, streak: 2, completedThisWeek: false },
        { id: 3, userId: 2, name: "Kuniga 8 stakan suv", frequency: "daily", points: 5, streak: 10, completedToday: true }
    ];
    
    // Vazifalar
    mockDB.tasks = [
        { id: 1, userId: 1, groupId: 1, name: "30 daqiqa yugurish", description: "Bog'da yoki stadionda yugurish", deadline: "2023-06-15", points: 20, completed: false },
        { id: 2, userId: 2, groupId: 2, name: "React loyihasi", description: "Yangi React loyihasini boshlash", deadline: "2023-06-20", points: 30, completed: false },
        { id: 3, userId: 3, groupId: 2, name: "JavaScript mashqlari", description: "Kuniga 10 ta JavaScript masalasi", deadline: "2023-06-10", points: 15, completed: true }
    ];
}

// Kirish funksiyasi
function handleLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!username || !password) {
        alert("Foydalanuvchi nomi va parolni kiriting!");
        return;
    }
    
    const user = mockDB.users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMainPage();
        loadUserData();
    } else {
        alert("Noto'g'ri foydalanuvchi nomi yoki parol!");
    }
}

// Ro'yxatdan o'tish funksiyasi
function handleRegister() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!username || !password) {
        alert("Foydalanuvchi nomi va parolni kiriting!");
        return;
    }
    
    if (mockDB.users.some(u => u.username === username)) {
        alert("Bu foydalanuvchi nomi band!");
        return;
    }
    
    const newUser = {
        id: mockDB.users.length + 1,
        username,
        password,
        name: username,
        points: 0,
        avatar: `assets/images/user${Math.floor(Math.random() * 5) + 1}.png`,
        groups: []
    };
    
    mockDB.users.push(newUser);
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showMainPage();
    loadUserData();
    alert("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
}

// Chiqish funksiyasi
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLoginPage();
}

// Asosiy sahifani ko'rsatish
function showMainPage() {
    loginPage.classList.add('hidden');
    mainPage.classList.remove('hidden');
}

// Kirish sahifasini ko'rsatish
function showLoginPage() {
    loginPage.classList.remove('hidden');
    mainPage.classList.add('hidden');
    usernameInput.value = "";
    passwordInput.value = "";
}

// Foydalanuvchi ma'lumotlarini yuklash
function loadUserData() {
    if (!currentUser) return;
    
    userNameDisplay.textContent = currentUser.name;
    userPointsDisplay.textContent = `${currentUser.points} ball`;
    userAvatar.src = currentUser.avatar;
    
    loadHabits();
    loadTasks();
    loadGroups();
    loadRankings();
}

// Tablarni almashtirish
function switchTab(tabName) {
    // Faol tabni o'zgartirish
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Kontentni o'zgartirish
    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabName}-tab`) {
            content.classList.add('active');
        }
    });
}

// Odatlarni yuklash
function loadHabits() {
    if (!currentUser) return;
    
    habitsList.innerHTML = "";
    const userHabits = mockDB.habits.filter(h => h.userId === currentUser.id);
    
    if (userHabits.length === 0) {
        habitsList.innerHTML = "<p>Sizda hali odatlar mavjud emas. Yangi odat qo'shing!</p>";
        return;
    }
    
    userHabits.forEach(habit => {
        const habitItem = document.createElement('div');
        habitItem.className = 'habit-item';
        
        const habitInfo = document.createElement('div');
        habitInfo.className = 'habit-info';
        
        const habitName = document.createElement('div');
        habitName.className = 'habit-name';
        habitName.textContent = habit.name;
        
        const habitFrequency = document.createElement('div');
        habitFrequency.className = 'habit-frequency';
        habitFrequency.textContent = getFrequencyText(habit.frequency);
        
        const habitStreak = document.createElement('div');
        habitStreak.className = 'habit-streak';
        habitStreak.textContent = `Davomiylik: ${habit.streak} kun`;
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.width = `${Math.min(habit.streak * 10, 100)}%`;
        
        progressContainer.appendChild(progressBar);
        
        habitInfo.appendChild(habitName);
        habitInfo.appendChild(habitFrequency);
        habitInfo.appendChild(habitStreak);
        habitInfo.appendChild(progressContainer);
        
        const habitActions = document.createElement('div');
        habitActions.className = 'habit-actions';
        
        const completeBtn = document.createElement('button');
        completeBtn.className = 'action-btn complete-btn';
        completeBtn.innerHTML = '<i class="fas fa-check"></i>';
        completeBtn.title = 'Bajarildi';
        completeBtn.addEventListener('click', () => completeHabit(habit.id));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'O\'chirish';
        deleteBtn.addEventListener('click', () => deleteHabit(habit.id));
        
        habitActions.appendChild(completeBtn);
        habitActions.appendChild(deleteBtn);
        
        habitItem.appendChild(habitInfo);
        habitItem.appendChild(habitActions);
        
        habitsList.appendChild(habitItem);
    });
}

// Vazifalarni yuklash
function loadTasks() {
    if (!currentUser) return;
    
    tasksList.innerHTML = "";
    const userTasks = mockDB.tasks.filter(t => t.userId === currentUser.id);
    
    if (userTasks.length === 0) {
        tasksList.innerHTML = "<p>Sizda hali vazifalar mavjud emas. Yangi vazifa qo'shing!</p>";
        return;
    }
    
    userTasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        
        const taskInfo = document.createElement('div');
        taskInfo.className = 'task-info';
        
        const taskName = document.createElement('div');
        taskName.className = 'task-name';
        taskName.textContent = task.name;
        
        const taskDescription = document.createElement('div');
        taskDescription.className = 'task-description';
        taskDescription.textContent = task.description;
        
        const taskDeadline = document.createElement('div');
        taskDeadline.className = 'task-deadline';
        taskDeadline.textContent = `Muddat: ${formatDate(task.deadline)}`;
        
        const taskPoints = document.createElement('div');
        taskPoints.className = 'task-points';
        taskPoints.textContent = `Ball: ${task.points}`;
        
        taskInfo.appendChild(taskName);
        taskInfo.appendChild(taskDescription);
        taskInfo.appendChild(taskDeadline);
        taskInfo.appendChild(taskPoints);
        
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';
        
        if (!task.completed) {
            const completeBtn = document.createElement('button');
            completeBtn.className = 'action-btn complete-btn';
            completeBtn.innerHTML = '<i class="fas fa-check"></i>';
            completeBtn.title = 'Bajarildi';
            completeBtn.addEventListener('click', () => completeTask(task.id));
            taskActions.appendChild(completeBtn);
        }
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'O\'chirish';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        taskActions.appendChild(deleteBtn);
        
        taskItem.appendChild(taskInfo);
        taskItem.appendChild(taskActions);
        
        tasksList.appendChild(taskItem);
    });
}

// Guruhlarni yuklash
function loadGroups() {
    if (!currentUser) return;
    
    groupsList.innerHTML = "";
    const userGroups = mockDB.groups.filter(g => g.members.includes(currentUser.id));
    
    if (userGroups.length === 0) {
        groupsList.innerHTML = "<p>Siz hali hech qanday guruhga a'zo emassiz. Guruh yarating yoki qidirib toping!</p>";
        return;
    }
    
    userGroups.forEach(group => {
        const groupItem = document.createElement('div');
        groupItem.className = 'group-item';
        
        const groupInfo = document.createElement('div');
        groupInfo.className = 'group-info';
        
        const groupName = document.createElement('div');
        groupName.className = 'group-name';
        groupName.textContent = group.name;
        
        const groupDescription = document.createElement('div');
        groupDescription.className = 'group-description';
        groupDescription.textContent = group.description;
        
        const groupMembers = document.createElement('div');
        groupMembers.className = 'group-members';
        groupMembers.textContent = `A'zolar: ${group.members.length} ta`;
        
        groupInfo.appendChild(groupName);
        groupInfo.appendChild(groupDescription);
        groupInfo.appendChild(groupMembers);
        
        const groupActions = document.createElement('div');
        groupActions.className = 'group-actions';
        
        const viewBtn = document.createElement('button');
        viewBtn.className = 'action-btn';
        viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
        viewBtn.title = 'Ko\'rish';
        viewBtn.addEventListener('click', () => viewGroupDetails(group.id));
        
        const leaveBtn = document.createElement('button');
        leaveBtn.className = 'action-btn delete-btn';
        leaveBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
        leaveBtn.title = 'Chiqish';
        leaveBtn.addEventListener('click', () => leaveGroup(group.id));
        
        groupActions.appendChild(viewBtn);
        groupActions.appendChild(leaveBtn);
        
        groupItem.appendChild(groupInfo);
        groupItem.appendChild(groupActions);
        
        groupsList.appendChild(groupItem);
    });
}

// Reytinglarni yuklash
function loadRankings() {
    if (!currentUser) return;
    
    // Umumiy reyting
    const globalRankingList = document.getElementById('global-ranking');
    globalRankingList.innerHTML = "";
    
    const sortedUsers = [...mockDB.users].sort((a, b) => b.points - a.points);
    
    sortedUsers.forEach((user, index) => {
        const rankingItem = document.createElement('div');
        rankingItem.className = 'ranking-item';
                const rankingPosition = document.createElement('div');
        rankingPosition.className = 'ranking-position';
        rankingPosition.textContent = `#${index + 1}`;
        
        const rankingInfo = document.createElement('div');
        rankingInfo.className = 'ranking-info';
        
        const rankingName = document.createElement('div');
        rankingName.className = 'ranking-name';
        rankingName.textContent = user.name;
        
        const rankingPoints = document.createElement('div');
        rankingPoints.className = 'ranking-points';
        rankingPoints.textContent = `${user.points} ball`;
        
        rankingInfo.appendChild(rankingName);
        rankingInfo.appendChild(rankingPoints);
        
        rankingItem.appendChild(rankingPosition);
        rankingItem.appendChild(rankingInfo);
        
        if (user.id === currentUser.id) {
            rankingItem.style.borderLeft = '4px solid var(--primary-color)';
            rankingItem.style.backgroundColor = 'rgba(0, 136, 204, 0.1)';
        }
        
        globalRankingList.appendChild(rankingItem);
    });
    
    // Guruh reytingi
    const groupRankingList = document.getElementById('group-ranking');
    groupRankingList.innerHTML = "";
    
    const userGroups = mockDB.groups.filter(g => g.members.includes(currentUser.id));
    
    if (userGroups.length > 0) {
        userGroups.forEach(group => {
            const groupTitle = document.createElement('h3');
            groupTitle.textContent = group.name;
            groupTitle.style.marginTop = '15px';
            groupTitle.style.marginBottom = '10px';
            groupTitle.style.color = 'var(--primary-color)';
            groupRankingList.appendChild(groupTitle);
            
            const groupMembers = mockDB.users.filter(u => group.members.includes(u.id));
            const sortedGroupMembers = [...groupMembers].sort((a, b) => b.points - a.points);
            
            sortedGroupMembers.forEach((member, index) => {
                const rankingItem = document.createElement('div');
                rankingItem.className = 'ranking-item';
                
                const rankingPosition = document.createElement('div');
                rankingPosition.className = 'ranking-position';
                rankingPosition.textContent = `#${index + 1}`;
                
                const rankingInfo = document.createElement('div');
                rankingInfo.className = 'ranking-info';
                
                const rankingName = document.createElement('div');
                rankingName.className = 'ranking-name';
                rankingName.textContent = member.name;
                
                const rankingPoints = document.createElement('div');
                rankingPoints.className = 'ranking-points';
                rankingPoints.textContent = `${member.points} ball`;
                
                rankingInfo.appendChild(rankingName);
                rankingInfo.appendChild(rankingPoints);
                
                rankingItem.appendChild(rankingPosition);
                rankingItem.appendChild(rankingInfo);
                
                if (member.id === currentUser.id) {
                    rankingItem.style.borderLeft = '4px solid var(--primary-color)';
                    rankingItem.style.backgroundColor = 'rgba(0, 136, 204, 0.1)';
                }
                
                groupRankingList.appendChild(rankingItem);
            });
        });
    } else {
        groupRankingList.innerHTML = "<p>Siz hech qanday guruhga a'zo emassiz. Guruhga qo'shiling yoki yangi guruh yarating!</p>";
    }
}

// Reyting tablarini almashtirish
function switchRankingTab(tabName) {
    rankingTabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.rankingTab === tabName) {
            btn.classList.add('active');
        }
    });
    
    rankingLists.forEach(list => {
        list.classList.remove('active');
        if (list.id === `${tabName}-ranking`) {
            list.classList.add('active');
        }
    });
}

// Modal oynani ko'rsatish
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('hidden');
}

// Yangi odat qo'shish
function saveHabit() {
    const name = document.getElementById('habit-name').value.trim();
    const frequency = document.getElementById('habit-frequency').value;
    const points = parseInt(document.getElementById('habit-points').value) || 10;
    
    if (!name) {
        alert("Odat nomini kiriting!");
        return;
    }
    
    const newHabit = {
        id: mockDB.habits.length + 1,
        userId: currentUser.id,
        name,
        frequency,
        points,
        streak: 0,
        completedToday: false,
        completedThisWeek: false
    };
    
    mockDB.habits.push(newHabit);
    addHabitModal.classList.add('hidden');
    loadHabits();
    
    // Inputlarni tozalash
    document.getElementById('habit-name').value = "";
    document.getElementById('habit-points').value = "";
}

// Odatni bajarilgan deb belgilash
function completeHabit(habitId) {
    const habit = mockDB.habits.find(h => h.id === habitId && h.userId === currentUser.id);
    
    if (habit) {
        if (habit.frequency === 'daily' && !habit.completedToday) {
            habit.streak++;
            habit.completedToday = true;
            currentUser.points += habit.points;
        } else if (habit.frequency === 'weekly' && !habit.completedThisWeek) {
            habit.streak++;
            habit.completedThisWeek = true;
            currentUser.points += habit.points;
        } else if (habit.frequency === 'monthly') {
            habit.streak++;
            currentUser.points += habit.points;
        }
        
        userPointsDisplay.textContent = `${currentUser.points} ball`;
        loadHabits();
        loadRankings();
    }
}

// Odatni o'chirish
function deleteHabit(habitId) {
    if (confirm("Bu odatni rostdan ham o'chirmoqchimisiz?")) {
        mockDB.habits = mockDB.habits.filter(h => h.id !== habitId || h.userId !== currentUser.id);
        loadHabits();
    }
}

// Yangi vazifa qo'shish
function saveTask() {
    const name = document.getElementById('task-name').value.trim();
    const description = document.getElementById('task-description').value.trim();
    const deadline = document.getElementById('task-deadline').value;
    const points = parseInt(document.getElementById('task-points').value) || 20;
    
    if (!name || !deadline) {
        alert("Vazifa nomi va muddatini kiriting!");
        return;
    }
    
    const newTask = {
        id: mockDB.tasks.length + 1,
        userId: currentUser.id,
        groupId: null, // Shaxsiy vazifa
        name,
        description,
        deadline,
        points,
        completed: false
    };
    
    mockDB.tasks.push(newTask);
    addTaskModal.classList.add('hidden');
    loadTasks();
    
    // Inputlarni tozalash
    document.getElementById('task-name').value = "";
    document.getElementById('task-description').value = "";
    document.getElementById('task-deadline').value = "";
    document.getElementById('task-points').value = "";
}

// Vazifani bajarilgan deb belgilash
function completeTask(taskId) {
    const task = mockDB.tasks.find(t => t.id === taskId && t.userId === currentUser.id);
    
    if (task) {
        task.completed = true;
        currentUser.points += task.points;
        userPointsDisplay.textContent = `${currentUser.points} ball`;
        loadTasks();
        loadRankings();
    }
}

// Vazifani o'chirish
function deleteTask(taskId) {
    if (confirm("Bu vazifani rostdan ham o'chirmoqchimisiz?")) {
        mockDB.tasks = mockDB.tasks.filter(t => t.id !== taskId || t.userId !== currentUser.id);
        loadTasks();
    }
}

// Yangi guruh yaratish
function createGroup() {
    const name = document.getElementById('group-name').value.trim();
    const description = document.getElementById('group-description').value.trim();
    
    if (!name) {
        alert("Guruh nomini kiriting!");
        return;
    }
    
    const newGroup = {
        id: mockDB.groups.length + 1,
        name,
        description,
        creatorId: currentUser.id,
        members: [currentUser.id],
        tasks: []
    };
    
    mockDB.groups.push(newGroup);
    currentUser.groups.push(newGroup.id);
    createGroupModal.classList.add('hidden');
    loadGroups();
    
    // Inputlarni tozalash
    document.getElementById('group-name').value = "";
    document.getElementById('group-description').value = "";
}

// Guruhga qo'shilish
function joinGroup(groupId) {
    const group = mockDB.groups.find(g => g.id === groupId);
    
    if (group && !group.members.includes(currentUser.id)) {
        group.members.push(currentUser.id);
        currentUser.groups.push(group.id);
        joinGroupModal.classList.add('hidden');
        loadGroups();
        loadRankings();
    }
}

// Guruhdan chiqish
function leaveGroup(groupId) {
    if (confirm("Bu guruhdan rostdan ham chiqmoqchimisiz?")) {
        const group = mockDB.groups.find(g => g.id === groupId);
        
        if (group) {
            group.members = group.members.filter(m => m !== currentUser.id);
            currentUser.groups = currentUser.groups.filter(g => g !== groupId);
            loadGroups();
            loadRankings();
        }
    }
}

// Guruh tafsilotlarini ko'rsatish
function viewGroupDetails(groupId) {
    const group = mockDB.groups.find(g => g.id === groupId);
    const groupDetailsModal = document.getElementById('group-details-modal');
    
    if (group) {
        document.getElementById('group-details-title').textContent = group.name;
        document.getElementById('group-details-description').textContent = group.description;
        
        // Guruh a'zolari
        const membersList = document.getElementById('group-members-list');
        membersList.innerHTML = "<h4>Guruh a'zolari</h4>";
        
        group.members.forEach(memberId => {
            const member = mockDB.users.find(u => u.id === memberId);
            if (member) {
                const memberItem = document.createElement('div');
                memberItem.className = 'member-item';
                memberItem.textContent = member.name;
                membersList.appendChild(memberItem);
            }
        });
        
        // Guruh vazifalari
        const tasksList = document.getElementById('group-tasks-list');
        tasksList.innerHTML = "<h4>Guruh vazifalari</h4>";
        
        const groupTasks = mockDB.tasks.filter(t => t.groupId === group.id);
        
        if (groupTasks.length === 0) {
            tasksList.innerHTML += "<p>Guruhda hali vazifalar mavjud emas.</p>";
        } else {
            groupTasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = 'task-item';
                
                const taskInfo = document.createElement('div');
                taskInfo.className = 'task-info';
                
                const taskName = document.createElement('div');
                taskName.className = 'task-name';
                taskName.textContent = task.name;
                
                const taskDeadline = document.createElement('div');
                taskDeadline.className = 'task-deadline';
                taskDeadline.textContent = `Muddat: ${formatDate(task.deadline)}`;
                
                const taskPoints = document.createElement('div');
                taskPoints.className = 'task-points';
                taskPoints.textContent = `Ball: ${task.points}`;
                
                taskInfo.appendChild(taskName);
                taskInfo.appendChild(taskDeadline);
                taskInfo.appendChild(taskPoints);
                
                const taskActions = document.createElement('div');
                taskActions.className = 'task-actions';
                
                if (!task.completed && task.userId === currentUser.id) {
                    const completeBtn = document.createElement('button');
                    completeBtn.className = 'action-btn complete-btn';
                    completeBtn.innerHTML = '<i class="fas fa-check"></i>';
                    completeBtn.title = 'Bajarildi';
                    completeBtn.addEventListener('click', () => {
                        completeTask(task.id);
                        viewGroupDetails(groupId);
                    });
                    taskActions.appendChild(completeBtn);
                }
                
                taskItem.appendChild(taskInfo);
                taskItem.appendChild(taskActions);
                
                tasksList.appendChild(taskItem);
            });
        }
        
        // Guruh amallari
        const groupActions = document.getElementById('group-actions');
        groupActions.innerHTML = "";
        
        if (group.creatorId === currentUser.id) {
            const addTaskBtn = document.createElement('button');
            addTaskBtn.className = 'action-btn';
            addTaskBtn.textContent = "Vazifa qo'shish";
            addTaskBtn.addEventListener('click', () => addGroupTask(groupId));
            groupActions.appendChild(addTaskBtn);
        }
        
        showModal('group-details-modal');
    }
}

// Guruhga vazifa qo'shish
function addGroupTask(groupId) {
    const name = prompt("Vazifa nomini kiriting:");
    if (!name) return;
    
    const description = prompt("Vazifa tavsifini kiriting (ixtiyoriy):");
    const deadline = prompt("Muddatni kiriting (YYYY-MM-DD formatida):");
    if (!deadline) return;
    
    const points = parseInt(prompt("Ball miqdorini kiriting (default: 20):")) || 20;
    
    const newTask = {
        id: mockDB.tasks.length + 1,
        userId: currentUser.id,
        groupId,
        name,
        description: description || "",
        deadline,
        points,
        completed: false
    };
    
    mockDB.tasks.push(newTask);
    viewGroupDetails(groupId);
    loadTasks();
}

// Qidiruv natijalarini ko'rsatish
document.getElementById('group-search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    const resultsContainer = document.getElementById('group-search-results');
    resultsContainer.innerHTML = "";
    
    if (searchTerm.length < 2) {
        resultsContainer.innerHTML = "<p>Qidirish uchun kamida 2 ta belgi kiriting</p>";
        return;
    }
    
    const searchResults = mockDB.groups.filter(g => 
        g.name.toLowerCase().includes(searchTerm) || 
        g.description.toLowerCase().includes(searchTerm)
    ).filter(g => !g.members.includes(currentUser.id));
    
    if (searchResults.length === 0) {
        resultsContainer.innerHTML = "<p>Hech qanday natija topilmadi</p>";
        return;
    }
    
    searchResults.forEach(group => {
        const groupItem = document.createElement('div');
        groupItem.className = 'group-item';
        
        const groupInfo = document.createElement('div');
        groupInfo.className = 'group-info';
        
        const groupName = document.createElement('div');
        groupName.className = 'group-name';
        groupName.textContent = group.name;
        
        const groupDescription = document.createElement('div');
        groupDescription.className = 'group-description';
        groupDescription.textContent = group.description;
        
        const groupMembers = document.createElement('div');
        groupMembers.className = 'group-members';
        groupMembers.textContent = `A'zolar: ${group.members.length} ta`;
        
        groupInfo.appendChild(groupName);
        groupInfo.appendChild(groupDescription);
        groupInfo.appendChild(groupMembers);
        
        const joinBtn = document.createElement('button');
        joinBtn.className = 'action-btn';
        joinBtn.textContent = "Qo'shilish";
        joinBtn.addEventListener('click', () => joinGroup(group.id));
        
        groupItem.appendChild(groupInfo);
        groupItem.appendChild(joinBtn);
        
        resultsContainer.appendChild(groupItem);
    });
});

// Yordamchi funksiyalar
function getFrequencyText(frequency) {
    switch (frequency) {
        case 'daily': return 'Har kuni';
        case 'weekly': return 'Haftasiga';
        case 'monthly': return 'Oygina';
        default: return frequency;
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('uz-UZ', options);
}

// Har kuni odatlarni yangilash
function resetDailyHabits() {
    mockDB.habits.forEach(habit => {
        if (habit.frequency === 'daily') {
            habit.completedToday = false;
        }
    });
}

// Har hafta odatlarni yangilash
function resetWeeklyHabits() {
    mockDB.habits.forEach(habit => {
        if (habit.frequency === 'weekly') {
            habit.completedThisWeek = false;
        }
    });
}

// Kunlik va haftalik yangilashlar
function scheduleResets() {
    // Har kuni ertalab 00:00 da
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const timeToMidnight = nextMidnight - now;
    
    setTimeout(() => {
        resetDailyHabits();
        // Har yakshanba ertalab haftalik yangilash
        if (new Date().getDay() === 0) {
            resetWeeklyHabits();
        }
        // Keyingi kun uchun qayta sozlash
        scheduleResets();
    }, timeToMidnight);
}

// Dastur ishga tushganda yangilashlarni sozlash
scheduleResets();
const express = require('express');
const { connectDB } = require('./db');

const app = express();
app.use(express.json());

// MongoDB ga ulanish
let db, users, habits, tasks, groups;

(async () => {
    const dbConnection = await connectDB();
    db = dbConnection.db;
    users = dbConnection.users;
    habits = dbConnection.habits;
    tasks = dbConnection.tasks;
    groups = dbConnection.groups;
})();

// Foydalanuvchilar ro'yxati
app.get('/api/users', async (req, res) => {
    try {
        const userList = await users.find().toArray();
        res.json(userList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Yangi foydalanuvchi qo'shish
app.post('/api/users', async (req, res) => {
    try {
        const newUser = req.body;
        const result = await users.insertOne(newUser);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portida ishga tushdi`);
});
// Foydalanuvchilar ro'yxatini olish
async function getUsers() {
    try {
        const response = await fetch('/api/users');
        const data = await response.json();
        console.log("Foydalanuvchilar:", data);
        return data;
    } catch (error) {
        console.error("Xatolik:", error);
    }
}

// Yangi foydalanuvchi qo'shish
async function addUser(userData) {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        console.log("Yangi foydalanuvchi:", data);
        return data;
    } catch (error) {
        console.error("Xatolik:", error);
    }
}