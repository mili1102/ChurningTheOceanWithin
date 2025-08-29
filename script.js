// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', navMenu.classList.contains('active'));
});

const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// Module Management
let currentModule = 1;
const totalModules = 10;
const progressBar = document.getElementById('progress-bar');
let moduleData = JSON.parse(localStorage.getItem('moduleData')) || {};
let moods = JSON.parse(localStorage.getItem('moods')) || [];
let streak = parseInt(localStorage.getItem('meditationStreak')) || 0;
const streakCounter = document.getElementById('streak-counter');

if (streakCounter) {
    streakCounter.textContent = `Meditation Streak: ${streak} days`;
}

function updateProgress() {
    const progress = (currentModule / totalModules) * 100;
    progressBar.textContent = `Progress: ${Math.round(progress)}%`;
}

// Timer Functionality
document.querySelectorAll('.module').forEach(module => {
    const startBtn = module.querySelector('.start-timer');
    const stopBtn = module.querySelector('.stop-timer');
    const timerDisplay = module.querySelector('.timer');
    const timeInput = module.querySelector('.meditation-time');
    const bell = module.querySelector('.bell');
    let timer, isPaused = false;

    startBtn.addEventListener('click', () => {
        if (isPaused) {
            isPaused = false;
            startBtn.textContent = 'Start Timer';
        } else {
            const time = parseInt(timeInput.value) * 60;
            let remaining = time;
            clearInterval(timer);
            timer = setInterval(() => {
                if (!isPaused) {
                    remaining--;
                    const mins = Math.floor(remaining / 60);
                    const secs = remaining % 60;
                    timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                    if (remaining <= 0) {
                        clearInterval(timer);
                        bell.play();
                        const today = new Date().toDateString();
                        if (localStorage.getItem('lastMeditation') !== today) {
                            streak++;
                            localStorage.setItem('meditationStreak', streak);
                            localStorage.setItem('lastMeditation', today);
                            streakCounter.textContent = `Meditation Streak: ${streak} days`;
                        }
                    }
                }
            }, 1000);

            if (module.id === 'module-3') {
                const breathingText = module.querySelector('.breathing-animation');
                let breathingInterval = setInterval(() => {
                    if (!isPaused) {
                        breathingText.textContent = breathingText.textContent.includes('Inhale') ? 'Exhale for 6 seconds.' : 'Inhale for 4 seconds, hold for 2.';
                    }
                }, 12000); // 12s cycle for 4-2-6 breathing
                stopBtn.addEventListener('click', () => clearInterval(breathingInterval), { once: true });
            }
        }
    });

    stopBtn.addEventListener('click', () => {
        isPaused = true;
        clearInterval(timer);
        startBtn.textContent = 'Resume Timer';
    });
});

// Module Form Submission
document.querySelectorAll('.module-form').forEach(form => {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const moduleId = form.closest('.module').id;
        const inputs = form.querySelectorAll('textarea, select');
        let data = {};
        inputs.forEach(input => {
            data[input.className] = input.value;
        });
        moduleData[moduleId] = moduleData[moduleId] || {};
        moduleData[moduleId].step1 = data;
        localStorage.setItem('moduleData', JSON.stringify(moduleData));
        form.reset();
    });
});

// Reflection Saving
document.querySelectorAll('.save-reflection').forEach(btn => {
    btn.addEventListener('click', () => {
        const moduleId = btn.closest('.module').id;
        const reflection = btn.previousElementSibling.value.trim();
        if (reflection) {
            moduleData[moduleId] = moduleData[moduleId] || {};
            moduleData[moduleId].reflection = { date: new Date().toLocaleString(), text: reflection };
            localStorage.setItem('moduleData', JSON.stringify(moduleData));
            btn.previousElementSibling.value = '';
            if (moduleId === `module-${currentModule}` && currentModule < totalModules) {
                currentModule++;
                updateProgress();
            }
        }
    });
});

// Mood Tracker
document.querySelectorAll('.moods button').forEach(btn => {
    btn.addEventListener('click', () => {
        const mood = btn.dataset.mood;
        const value = parseInt(btn.dataset.value);
        const date = new Date().toDateString();
        moods.push({ date, mood, value });
        localStorage.setItem('moods', JSON.stringify(moods));
    });
});

// Breathing Exercise
document.querySelectorAll('.complete-breathing').forEach(btn => {
    btn.addEventListener('click', () => {
        alert('Breathing exercise completed!');
    });
});

// Pause and Restart
document.querySelectorAll('.pause-module').forEach(btn => {
    btn.addEventListener('click', () => {
        alert('Progress saved. Return to this module anytime.');
    });
});

document.querySelectorAll('.restart-module').forEach(btn => {
    btn.addEventListener('click', () => {
        const moduleId = btn.closest('.module').id;
        delete moduleData[moduleId];
        localStorage.setItem('moduleData', JSON.stringify(moduleData));
        btn.closest('.module').querySelectorAll('textarea, select').forEach(input => input.value = '');
        alert('Module reset.');
    });
});

// Sharing
document.querySelectorAll('.share-x, .share-facebook, .share-linkedin').forEach(btn => {
    btn.addEventListener('click', () => {
        const platform = btn.className.includes('x') ? 'X' : btn.className.includes('facebook') ? 'Facebook' : 'LinkedIn';
        const shareText = `I completed the Samudra Manthan journey with Churning the Ocean Within! #SamudraManthan`;
        let shareUrl;
        if (platform === 'X') {
            shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        } else if (platform === 'Facebook') {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=https://example.com&quote=${encodeURIComponent(shareText)}`;
        } else {
            shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=https://example.com&title=${encodeURIComponent(shareText)}`;
        }
        window.open(shareUrl, '_blank');
    });
});

// Download Reflections
document.querySelector('.download-reflections')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(moduleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'samudra-manthan-reflections.json';
    a.click();
    URL.revokeObjectURL(url);
});

// Restart Journey
document.querySelector('.restart-journey')?.addEventListener('click', () => {
    moduleData = {};
    localStorage.setItem('moduleData', JSON.stringify(moduleData));
    currentModule = 1;
    updateProgress();
    alert('Journey restarted.');
});

// Compassion Message
const sendKindnessBtn = document.getElementById('send-kindness');
const compassionMessage = document.getElementById('compassion-message');
if (sendKindnessBtn) {
    sendKindnessBtn.addEventListener('click', () => {
        const message = compassionMessage.value.trim();
        if (message) {
            alert('Kindness sent! (Simulation)');
            compassionMessage.value = '';
        }
    });
}

updateProgress();
