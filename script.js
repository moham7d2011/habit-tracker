const grid = document.getElementById('habitGrid');
const percentText = document.getElementById('percent');
const barFill = document.getElementById('barFill');
const totalDays = 45;

// استرجاع البيانات من ذاكرة المتصفح عند التحميل
// إذا لم توجد بيانات، ننشئ مصفوفة فارغة
let completedDays = JSON.parse(localStorage.getItem('myHabitChallenge')) || [];

function updateUI() {
  grid.innerHTML = '';
  for (let i = 1; i <= totalDays; i++) {
    const box = document.createElement('div');
    box.classList.add('day-box');
    box.innerText = i;
    
    if (completedDays.includes(i)) {
      box.classList.add('completed');
    }
    
    box.onclick = () => toggleDay(i);
    grid.appendChild(box);
  }
  
  // تحديث العداد والنسبة
  const percentage = Math.round((completedDays.length / totalDays) * 100);
  percentText.innerText = percentage + "%";
  barFill.style.width = percentage + "%";
}

function toggleDay(day) {
  if (completedDays.includes(day)) {
    completedDays = completedDays.filter(d => d !== day);
  } else {
    completedDays.push(day);
  }
  
  // حفظ المصفوفة الجديدة في ذاكرة المتصفح كـ String
  localStorage.setItem('myHabitChallenge', JSON.stringify(completedDays));
  updateUI();
}

function resetProgress() {
  if (confirm("هل أنت متأكد من مسح كل تقدمك؟")) {
    completedDays = [];
    localStorage.removeItem('myHabitChallenge');
    updateUI();
  }
}

// تشغيل الدالة لأول مرة عند فتح الصفحة
updateUI();