document.addEventListener("DOMContentLoaded", () => {

    const grid = document.getElementById("featuresGrid");
    if (!grid || typeof FEATURES === "undefined") return;

    FEATURES.forEach(feature => {
        const card = document.createElement("div");
        card.className = "feature-card";

        card.innerHTML = `
            <div class="feature-icon">${feature.icon}</div>
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
            <a href="${feature.link}" class="feature-link">Open</a>
        `;

        grid.appendChild(card);
    });

});


let currentIndex = 0;
let score = 0;
let selectedAnswer = null;

document.addEventListener("DOMContentLoaded", () => {

    if (typeof QUIZ_DATA === "undefined") return;

    document.getElementById("quizTitle").innerText = QUIZ_DATA.title;

    renderQuestion();
    document.getElementById("nextBtn").addEventListener("click", nextQuestion);
});

function renderQuestion() {
    const q = QUIZ_DATA.questions[currentIndex];
    const quizArea = document.getElementById("quizArea");

    quizArea.innerHTML = `
        <div class="question-box">
            <h2>${q.question}</h2>
            <div class="options">
                ${q.options.map((opt, i) => `
                    <div class="option" onclick="selectAnswer(${i})">${opt}</div>
                `).join("")}
            </div>
        </div>
    `;

    selectedAnswer = null;
}

function selectAnswer(index) {
    selectedAnswer = index;

    document.querySelectorAll(".option").forEach((el, i) => {
        el.classList.remove("selected");
        if (i === index) el.classList.add("selected");
    });
}

function nextQuestion() {
    if (selectedAnswer === null) {
        alert("Select an answer first.");
        return;
    }

    const correct = QUIZ_DATA.questions[currentIndex].correct;
    if (selectedAnswer === correct) score++;

    currentIndex++;

    if (currentIndex < QUIZ_DATA.questions.length) {
        renderQuestion();
    } else {
        finishQuiz();
    }
}

// function finishQuiz() {
//     const quizArea = document.getElementById("quizArea");
//     const pass = score >= QUIZ_DATA.passingScore;

//     const result = {
//         quizId: QUIZ_DATA.id,
//         score: score,
//         total: QUIZ_DATA.questions.length,
//         passed: pass,
//         date: new Date().toISOString()
//     };

//     localStorage.setItem("quizResult", JSON.stringify(result));

//     quizArea.innerHTML = `
//         <div class="result-box">
//             <h2>Quiz Completed</h2>
//             <p>Score: ${score} / ${QUIZ_DATA.questions.length}</p>
//             <p>Status: ${pass ? "PASSED" : "FAILED"}</p>
//             <a href="progress.html" class="btn-primary">View Progress</a>
//         </div>
//     `;

//     document.getElementById("nextBtn").style.display = "none";
// }


function finishQuiz() {
    const pass = score >= QUIZ_DATA.passingScore;

    const attempt = {
        quizId: QUIZ_DATA.id,
        score: score,
        total: QUIZ_DATA.questions.length,
        passed: pass,
        date: new Date().toISOString()
    };

    saveStudentAttempt(attempt);

    const quizArea = document.getElementById("quizArea");

    quizArea.innerHTML = `
        <div class="result-box">
            <h2>Quiz Completed</h2>
            <p>Score: ${score} / ${QUIZ_DATA.questions.length}</p>
            <p>Status: ${pass ? "PASSED" : "FAILED"}</p>
            <a href="progress.html" class="btn-primary">View Progress</a>
        </div>
    `;

    document.getElementById("nextBtn").style.display = "none";
}

function saveStudentAttempt(attempt) {

    let systemData = JSON.parse(localStorage.getItem("eduSystemData")) || {
        students: {}
    };

    let studentName = localStorage.getItem("currentStudent");

    if (!studentName) {
        studentName = prompt("Enter your name:");
        localStorage.setItem("currentStudent", studentName);
    }

    if (!systemData.students[studentName]) {
        systemData.students[studentName] = {
            name: studentName,
            quizAttempts: []
        };
    }

    systemData.students[studentName].quizAttempts.push(attempt);

    localStorage.setItem("eduSystemData", JSON.stringify(systemData));
}