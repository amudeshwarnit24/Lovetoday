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

// --- TIMED GATE LOGIC ---

// This function calculates the time remaining until the next 12:00 AM
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

    const timedGate = document.getElementById('timed-gate');
    const quizArea = document.getElementById('quiz-area');
    const countdownEl = document.getElementById('countdown');

    // Check if it's the unlock time (any minute in the 12 AM hour)
    if (now.getHours() === unlockHour) {
        timedGate.classList.add('hidden');
        quizArea.classList.remove('hidden');
        if (typeof timerInterval !== 'undefined') {
            clearInterval(timerInterval); // Stop the countdown
        }
    } else {
        // Update the countdown
        const target = calculateTargetTime(now);
        const diff = target.getTime() - now.getTime();
        
        if (diff > 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            countdownEl.innerHTML = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
             // This case should not be reached if logic is perfect, but ensures update
            countdownEl.innerHTML = "It's Time!"; 
        }
    }
}

// Start the timer check loop
const timerInterval = setInterval(checkTimeAndStart, 1000);
checkTimeAndStart(); // Initial check


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
    errorEl.textContent = ''; // Clear previous errors
    let isCorrect = false;

    switch (levelNum) {
        case 1: // Date (YYYY-MM-DD format)
            userAnswer = document.getElementById('q1-input').value; 
            isCorrect = (userAnswer === correctAnswer);
            break;
            
        case 2: // First Gift (Text Input)
            userAnswer = document.getElementById('q2-input').value.trim().toLowerCase();
            isCorrect = (userAnswer === correctAnswer.toLowerCase());
            break;
            
        case 3: // Memory Photo (Image Choice)
            userAnswer = document.getElementById('q3-selected-answer').value;
            isCorrect = (userAnswer === correctAnswer);
            break;
            
        case 4: // The Whisper (Text Input)
            // Sanitize both answers for comparison (remove spaces/punctuation)
            const sanitize = (str) => str.trim().toLowerCase().replace(/[^a-z0-9]/g, ''); 
            userAnswer = sanitize(document.getElementById('q4-input').value);
            correctAnswer = sanitize(correctAnswer);
            isCorrect = (userAnswer === correctAnswer);
            break;
    }

    if (isCorrect) {
        document.getElementById('level-' + levelNum).classList.add('hidden');
        
        if (levelNum < 4) {
            // Unlock the next level
            document.getElementById('level-' + (levelNum + 1)).classList.remove('hidden');
        } else {
            // All levels complete, show final wish
            document.getElementById('quiz-area').classList.add('hidden');
            document.getElementById('final-wish').classList.remove('hidden');
        }
    } else {
        errorEl.textContent = '❌ Oops! That doesn\'t look right. Try again!';
    }
              }
