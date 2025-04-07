const quizContainer = document.getElementById("quiz-container");
const resultContainer = document.getElementById("result-container");
const submitBtn = document.getElementById("submit-btn");
const retryBtn = document.getElementById("retry-btn");
const scoreText = document.getElementById("score");
const resultDetails = document.getElementById("result-details");

let userAnswers = [];

// Hiển thị câu hỏi
function renderQuestions() {
    quizContainer.innerHTML = "";
    questions.forEach((q, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");
        questionDiv.innerHTML = `<p>${index + 1}. ${q.question}</p>`; // Thêm số thứ tự câu hỏi
        
        q.options.forEach((option, i) => {
            const optionDiv = document.createElement("div");
            optionDiv.classList.add("option");
            
            optionDiv.innerHTML = `
                <label>
                    <input type="radio" name="question${index}" value="${i}">
                    ${String.fromCharCode(65 + i)}. ${option}
                </label>
            `;

            optionDiv.addEventListener("click", () => {
                const radio = optionDiv.querySelector("input[type='radio']");
                if (radio) radio.checked = true;
                // Lưu đáp án ngay khi chọn
                saveAnswer(index, i);
            });

            questionDiv.appendChild(optionDiv);
        });
        quizContainer.appendChild(questionDiv);
    });
}

// Lưu đáp án khi người dùng chọn
function saveAnswer(questionIndex, answerIndex) {
    userAnswers[questionIndex] = {
        question: questions[questionIndex].question,
        userAnswer: answerIndex,
        correctAnswer: questions[questionIndex].correctAnswer,
        isCorrect: answerIndex === questions[questionIndex].correctAnswer
    };
}

// Chấm điểm
function calculateScore() {
    let score = 0;
    
    // Đảm bảo mỗi câu hỏi đều có bản ghi trong userAnswers
    questions.forEach((q, index) => {
        const selectedOption = document.querySelector(
            `input[name="question${index}"]:checked`
        );
        
        if (selectedOption) {
            const userAnswer = parseInt(selectedOption.value);
            if (!userAnswers[index]) {
                saveAnswer(index, userAnswer);
            }
            if (userAnswer === q.correctAnswer) {
                score++;
            }
        } else if (!userAnswers[index]) {
            // Nếu không chọn đáp án và chưa có bản ghi
            userAnswers[index] = {
                question: q.question,
                userAnswer: null,
                correctAnswer: q.correctAnswer,
                isCorrect: false
            };
        }
    });
    
    return score;
}

// Hiển thị kết quả
function showResult(score) {
    quizContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");
    scoreText.textContent = `Bạn đã làm đúng ${score}/${questions.length} câu!`;
    resultDetails.innerHTML = "";
    
    // Hiển thị kết quả theo đúng thứ tự câu hỏi
    questions.forEach((q, index) => {
        const ans = userAnswers[index] || {
            question: q.question,
            userAnswer: null,
            correctAnswer: q.correctAnswer,
            isCorrect: false
        };
        
        const questionClass = ans.isCorrect ? "correct" : "incorrect";
        const userAnswerText = ans.userAnswer !== null ? 
            `${String.fromCharCode(65 + ans.userAnswer)}. ${q.options[ans.userAnswer]}` : 
            "Không chọn đáp án";
        const correctAnswerText = `${String.fromCharCode(65 + q.correctAnswer)}. ${q.options[q.correctAnswer]}`;
        
        resultDetails.innerHTML += `
            <div class="${questionClass}">
                <p><strong>Câu ${index + 1}:</strong> ${ans.question}</p>
                <p>Bạn chọn: ${userAnswerText}</p>
                <p>Đáp án đúng: ${correctAnswerText}</p>
            </div>
        `;
    });
}

// Reset bài thi
function resetQuiz() {
    userAnswers = [];
    resultContainer.classList.add("hidden");
    quizContainer.classList.remove("hidden");
    renderQuestions();
}

// Sự kiện nút "Hoàn thành bài thi"
submitBtn.addEventListener("click", () => {
    const score = calculateScore();
    showResult(score);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn lên đầu trang
});

// Sự kiện nút "Làm lại bài thi"
retryBtn.addEventListener("click", resetQuiz);

// Khởi tạo trang web
resetQuiz();