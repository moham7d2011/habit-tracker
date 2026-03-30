const grid = document.getElementById('habitGrid');
const rewardMessage = document.getElementById('rewardMessage');
const totalDays = 45;
const habits = ["الصلاة والأذكار", "المذاكرة (ساعتين)", "ورد القرآن", "صلاة الفجر", "تعلم التجويد"];

let habitData = JSON.parse(localStorage.getItem('habitDetailedData')) || {};
let currentTheme = localStorage.getItem('myHabitTheme') || 'light';

document.body.className = currentTheme + '-theme';

function updateUI() {
    grid.innerHTML = '';
    let perfectDays = 0;

    for (let i = 1; i <= totalDays; i++) {
        const box = document.createElement('div');
        box.classList.add('day-box');
        box.innerText = i;
        
        const dayStats = habitData[i] || [];
        const completedCount = dayStats.filter(status => status === true).length;
        
        if (completedCount > 4) { box.classList.add('perfect'); perfectDays++; }
        else if (completedCount >= 3) box.classList.add('good');
        else if (completedCount > 0) box.classList.add('low');
        
        box.onclick = () => openModal(i);
        grid.appendChild(box);
    }

    if (perfectDays === totalDays) rewardMessage.classList.remove('hidden');
    else rewardMessage.classList.add('hidden');
    
    updateProgress();
}

function openModal(day) {
    const modal = document.getElementById('habitModal');
    const checklist = document.getElementById('checklist');
    document.getElementById('modalTitle').innerText = `يوم ${day}`;
    checklist.innerHTML = '';
    
    const dayData = habitData[day] || new Array(habits.length).fill(false);
    habits.forEach((habit, index) => {
        const div = document.createElement('div');
        div.classList.add('habit-item');
        div.innerHTML = `<input type="checkbox" ${dayData[index] ? 'checked' : ''} onchange="updateHabit(${day}, ${index}, this.checked)"><label>${habit}</label>`;
        checklist.appendChild(div);
    });
    modal.classList.remove('hidden');
}

function updateHabit(day, index, isChecked) {
    if (!habitData[day]) habitData[day] = new Array(habits.length).fill(false);
    habitData[day][index] = isChecked;
    localStorage.setItem('habitDetailedData', JSON.stringify(habitData));
    updateUI();
}

function updateProgress() {
    let totalDone = 0;
    Object.values(habitData).forEach(day => totalDone += day.filter(h => h).length);
    const percentage = Math.round((totalDone / (totalDays * habits.length)) * 100);
    document.getElementById('percent').innerText = percentage + "%";
    document.getElementById('barFill').style.width = percentage + "%";
}

function toggleTheme() {
    const isLight = document.body.classList.contains('light-theme');
    document.body.className = isLight ? 'dark-theme' : 'light-theme';
    localStorage.setItem('myHabitTheme', isLight ? 'dark' : 'light');
    document.getElementById('themeBtn').innerText = isLight ? '🌙' : '🌞';
}

function closeModal() { document.getElementById('habitModal').classList.add('hidden'); }

function resetProgress() {
    if (confirm("هل أنت متأكد من مسح كل تقدمك؟")) {
        habitData = {};
        localStorage.removeItem('habitDetailedData');
        updateUI();
    }
}

// غلق المودال عند الضغط خارجه
window.onclick = (e) => { if (e.target.id === 'habitModal') closeModal(); };

updateUI();
