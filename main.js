// main.js

// Telegram foydalanuvchisini aniqlash
const tg = window.Telegram.WebApp;
const user = tg.initDataUnsafe.user;

// Foydalanuvchi ismini ko‘rsatish
const userInfo = document.getElementById("user-info");
if (user && user.first_name) {
  userInfo.textContent = `👋 Salom, ${user.first_name}!`;
}

// Majburiy vazifalar
const mandatoryTasks = [
  { id: 1, title: "Erta turish", points: 20 },
  { id: 2, title: "Badan tarbiya qilish", points: 15 },
  { id: 3, title: "Kitob o‘qish", points: 40 },
  { id: 4, title: "Podkast tinglash", points: 15 },
  { id: 5, title: "Yozish", points: 50 },
  { id: 6, title: "Ijtimoiy tarmoqni cheklash", points: 30 },
  { id: 7, title: "23:59 gacha uxlash", points: 50 },
];

// Har bir vazifa uchun tugma
const taskList = document.getElementById("task-list");

mandatoryTasks.forEach(task => {
  const li = document.createElement("li");
  li.className = "bg-white p-4 rounded shadow flex justify-between items-center";

  li.innerHTML = `
    <div>
      <p class="font-semibold">${task.title}</p>
      <p class="text-sm text-gray-500">${task.points} ball</p>
    </div>
    <button class="bg-green-500 text-white px-3 py-1 rounded" onclick="submitTask(${task.id})">✅</button>
  `;

  taskList.appendChild(li);
});

// Vazifa topshirilganini ko‘rsatish (hozircha console.log orqali)
function submitTask(id) {
  const task = mandatoryTasks.find(t => t.id === id);
  alert(`✅ "${task.title}" uchun ${task.points} ball topshirildi!`);
  // Bu yerda Firebase'ga yozish bo‘ladi (keyingi bosqich)
}

// Shaxsiy vazifalar (reytingga ta’sir qilmaydi)
const customInput = document.getElementById("custom-task");
const customList = document.getElementById("custom-task-list");
const addTaskBtn = document.getElementById("add-task");

addTaskBtn.addEventListener("click", () => {
  const value = customInput.value.trim();
  if (value) {
    const li = document.createElement("li");
    li.className = "bg-yellow-100 px-3 py-2 rounded";
    li.textContent = `📝 ${value}`;
    customList.appendChild(li);
    customInput.value = "";
  }
});

