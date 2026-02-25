document.addEventListener("DOMContentLoaded", () => {

    const systemData = JSON.parse(localStorage.getItem("eduSystemData"));
    const studentName = localStorage.getItem("currentStudent");

    if (!systemData || !studentName || !systemData.students[studentName]) {
        renderEmptyState();
        return;
    }

    const student = systemData.students[studentName];

    renderSummary(student.quizAttempts);
    renderHistory(student.quizAttempts);
});

function renderEmptyState() {
    document.getElementById("summarySection").innerHTML = `
        <div class="empty-state">
            <p>No quiz history found.</p>
            <a href="quiz.html" class="btn-primary">Take a Quiz</a>
        </div>
    `;
}

function renderSummary(attempts) {

    const totalAttempts = attempts.length;
    const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
    const totalQuestions = attempts.reduce((sum, a) => sum + a.total, 0);
    const average = totalQuestions === 0 ? 0 : Math.round((totalScore / totalQuestions) * 100);

    document.getElementById("summarySection").innerHTML = `
        <div class="summary-card">
            <h3>Total Attempts</h3>
            <p>${totalAttempts}</p>
        </div>

        <div class="summary-card">
            <h3>Total Score</h3>
            <p>${totalScore}</p>
        </div>

        <div class="summary-card">
            <h3>Overall Percentage</h3>
            <p>${average}%</p>
        </div>
    `;
}

function renderHistory(attempts) {

    const rows = attempts.map(a => `
        <tr>
            <td>${a.quizId}</td>
            <td>${a.score}</td>
            <td>${a.total}</td>
            <td>${a.passed ? "PASSED" : "FAILED"}</td>
            <td>${new Date(a.date).toLocaleString()}</td>
        </tr>
    `).join("");

    document.getElementById("historyTable").innerHTML = `
        <table class="progress-table">
            <thead>
                <tr>
                    <th>Quiz ID</th>
                    <th>Score</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;
}