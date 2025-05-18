console.log("Ilova ishga tushdi");
const tg = window.Telegram.WebApp;

tg.expand(); // Ilovani to‘liq ekranga ochish
document.getElementById("welcome").innerText = `Salom, ${tg.initDataUnsafe.user.first_name}!`;
