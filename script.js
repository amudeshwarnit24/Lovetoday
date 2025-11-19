// --- CONFIGURATION: SET YOUR CORRECT ANSWERS HERE ---
const CORRECT_ANSWERS = {
    // Level 1: Commitment Date (Format: YYYY-MM-DD)
    1: '2022-05-15', // *** CHANGE THIS ***
    
    // Level 2: First Gift (Case-insensitive match, no spaces/punctuation needed for comparison)
    2: 'watch', // *** CHANGE THIS *** (e.g., 'ring', 'bouquet', 'book')

    // Level 3: Memory Photo (The letter associated with the correct image's data-choice attribute)
    3: 'C', // *** CHANGE THIS *** (A, B, C, or D)

    // Level 4: The Whisper (Case-insensitive match, spaces and punctuation removed for cleaner comparison)
    4: 'I love you', // *** CHANGE THIS *** (e.g., 'My beautiful', 'Always', 'You are mine')
};

// --- GLOBAL VARIABLES FOR TIMER ---
const LEVEL_TIME_LIMIT = 300; // 5 minutes (300 seconds) per level
let timerSeconds = LEVEL_TIME_LIMIT;
let levelTimerInterval;

// --- TIMED GATE LOGIC ---

function calculateTargetTime(now) {
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    // If current time is past 12:00 AM, set the target to 12:00 AM tomorrow
    if (now.getHours() >= 0) {
        target.setDate(target.getDate() + 1);
    }
    return target;
}

function checkTimeAndStart() {
    const now = new Date();
    const unlockHour = 0; // 12:00 AM

    // Check if it's the unlock time
    if (now.getHours() === unlockHour) {
        startQuiz();
    } else {
        // Update the countdown
        const target = calculateTargetTime(now);
        const diff = target.getTime() - now.getTime();
        
        if (diff > 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            document.getElementById('countdown').innerHTML = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
}

// Function to bypass time check using the Go button (Testing only)
window.bypassTimeCheck = function() {
    // Stop the countdown timer interval
    if (typeof timerInterval !== 'undefined') {
        clearInterval(timerInterval);
    }
    // Remove the Go button immediately after clicking
    document.getElementById('go-button').style.display = 'none';
    startQuiz();
};

function startQuiz() {
    const timedGate = document.getElementById('timed-gate');
    const quizArea = document.getElementById('quiz-area');
    
    timedGate.classList.add('hidden');
    quizArea.classList.remove('hidden');
    
    // Start the level timer for the first time
    startLevelTimer();
}

const timerInterval = setInterval(checkTimeAndStart, 1000);
checkTimeAndStart(); // Initial check

// --- LEVEL TIMER LOGIC ---

function startLevelTimer() {
    // Clear any existing timer
    if (levelTimerInterval) {
        clearInterval(levelTimerInterval);
    }
    
    // Reset timer
    timerSeconds = LEVEL_TIME_LIMIT; 
    
    const timerDisplay = document.querySelector('#level-timer span');
    
    levelTimerInterval = setInterval(() => {
        timerSeconds--;
        
        const minutes = Math.floor(timerSeconds / 60);
        const seconds = timerSeconds % 60;
        
        timerDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
        if (timerSeconds <= 0) {
            clearInterval(levelTimerInterval);
            // Optional: Add code here to reset the level or show a time-out message
            timerDisplay.textContent = "TIME'S UP!";
        }
    }, 1000);
}


// --- QUIZ LEVEL LOGIC ---

// Function to handle image selection for Level 3
document.querySelectorAll('#level-3 .image-options img').forEach(img => {
    img.addEventListener('click', function() {
        // Deselect all images in Level 3
        document.querySelectorAll('#level-3 .image-options img').forEach(i => i.classList.remove('selected'));
        
        // Select the clicked image
        this.classList.add('selected');
        
        // Store the answer choice (e.g., 'C')
        document.getElementById('q3-selected-answer').value = this.getAttribute('data-choice');
    });
});


function checkAnswer(levelNum) {
    let userAnswer;
    let correctAnswer = CORRECT_ANSWERS[levelNum];
    const errorEl = document.getElementById('error-' + levelNum);
    errorEl.textContent = ''; 
    let isCorrect = false;

    switch (levelNum) {
        case 1: // Date 
            userAnswer = document.getElementById('q1-input').value; 
            isCorrect = (userAnswer === correctAnswer);
            break;
            
        case 2: // First Gift 
            userAnswer = document.getElementById('q2-input').value.trim().toLowerCase();
            isCorrect = (userAnswer === correctAnswer.toLowerCase());
            break;
            
        case 3: // Memory Photo 
            userAnswer = document.getElementById('q3-selected-answer').value;
            isCorrect = (userAnswer === correctAnswer);
            break;
            
        case 4: // The Whisper 
            const sanitize = (str) => str.trim().toLowerCase().replace(/[^a-z0-9]/g, ''); 
            userAnswer = sanitize(document.getElementById('q4-input').value);
            correctAnswer = sanitize(correctAnswer);
            isCorrect = (userAnswer === correctAnswer);
            break;
    }

    if (isCorrect) {
        document.getElementById('level-' + levelNum).classList.add('hidden');
        
        if (levelNum < 4) {
            // Unlock the next level AND restart the timer
            document.getElementById('level-' + (levelNum + 1)).classList.remove('hidden');
            startLevelTimer(); 
        } else {
            // All levels complete, stop timer and show final wish
            clearInterval(levelTimerInterval);
            document.getElementById('quiz-area').classList.add('hidden');
            document.getElementById('final-wish').classList.remove('hidden');
        }
    } else {
        errorEl.textContent = '❌ Oops! That doesn\'t look right. Try again!';
    }
}
