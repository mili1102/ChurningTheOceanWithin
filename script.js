// Meditation Timer
const startBtn = document.getElementById('start-meditation');
const timerDisplay = document.getElementById('timer');
const bell = document.getElementById('bell');
let timer;

startBtn.addEventListener('click', () => {
    const time = parseInt(document.getElementById('meditation-time').value) * 60;
    let remaining = time;
    clearInterval(timer);
    timer = setInterval(() => {
        remaining--;
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        if (remaining <= 0) {
            clearInterval(timer);
            bell.play();
        }
    }, 1000);
});

// Journal
const journalEntry = document.getElementById('journal-entry');
const saveJournalBtn = document.getElementById('save-journal');
const entriesDiv = document.getElementById('journal-entries');
let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];

function renderEntries() {
    entriesDiv.innerHTML = entries.map(entry => `<p><strong>${entry.date}</strong>: ${entry.text}</p>`).join('');
}
renderEntries();

saveJournalBtn.addEventListener('click', () => {
    const text = journalEntry.value.trim();
    if (text) {
        const date = new Date().toLocaleString();
        entries.push({ date, text });
        localStorage.setItem('journalEntries', JSON.stringify(entries));
        renderEntries();
        journalEntry.value = '';
    }
});

// Mood Tracker
const moodBtns = document.querySelectorAll('.moods button');
const moodChartCtx = document.getElementById('mood-chart').getContext('2d');
let moods = JSON.parse(localStorage.getItem('moods')) || [];
let moodChart;

function updateChart() {
    const labels = moods.map(m => m.date);
    const data = moods.map(m => m.value);
    if (moodChart) moodChart.destroy();
    moodChart = new Chart(moodChartCtx, {
        type: 'line',
        data: { labels, datasets: [{ label: 'Mood Over Time', data, borderColor: '#0277bd' }] },
        options: { scales: { y: { min: 0, max: 5 } } }
    });
}
updateChart();

moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const mood = btn.dataset.mood;
        const value = parseInt(btn.dataset.value);
        const date = new Date().toDateString();
        moods.push({ date, mood, value });
        localStorage.setItem('moods', JSON.stringify(moods));
        updateChart();
    });
});

// Contact Form (placeholder - add real submission logic if needed)
document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    alert('Message sent! (Simulation)');
});
