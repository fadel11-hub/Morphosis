document.addEventListener('DOMContentLoaded', function() {
    const personalInfoSection = document.getElementById('personalInfoSection');
    const questionnaireSection = document.getElementById('questionnaireSection');
    const startQuizButton = document.getElementById('startQuizButton');
    const questionContainers = document.querySelectorAll('.question-container');
    const progressBar = document.getElementById('progressBar');
    const questionStatus = document.getElementById('questionStatus');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const submitButton = document.getElementById('submitButton');

    let currentCategoryIndex = 0; // 0 = Personal Info, 1 = Organizer, 2 = Empath, dst.
    // currentQuestionInCategoryIndex tidak lagi digunakan untuk mengontrol tampilan item individu
    // tetapi bisa digunakan untuk validasi per pertanyaan saat tombol "Next" ditekan.
    let currentQuestionInCategoryIndex = 0; // Akan tetap digunakan untuk validasi saat "Next" ditekan
    let totalQuestions = 0; // Total semua pertanyaan kuesioner

    // Calculate total questions in the questionnaire (excluding personal info)
    questionContainers.forEach(container => {
        totalQuestions += container.querySelectorAll('.question-item').length;
    });

    // Initial state: show personal info, hide questionnaire
    personalInfoSection.style.display = 'block';
    questionnaireSection.style.display = 'none';

    // Function to update progress bar and question status
    function updateProgressAndStatus() {
        let currentOverallQuestionNumber = 0; // 1-based index for display

        // Calculate the current overall question number (for the first question of the current category)
        if (currentCategoryIndex > 0) { // Only calculate if we are in the questionnaire section
            let questionsBeforeCurrentCategory = 0;
            for (let i = 0; i < currentCategoryIndex - 1; i++) { // Sum questions in previous categories
                questionsBeforeCurrentCategory += questionContainers[i].querySelectorAll('.question-item').length;
            }
            // currentOverallQuestionNumber adalah nomor pertanyaan pertama di kategori saat ini
            currentOverallQuestionNumber = questionsBeforeCurrentCategory + 1;
        }

        if (currentCategoryIndex === 0) { // Personal Info section
            progressBar.style.width = '0%';
            questionStatus.textContent = 'Isi informasi pribadi Anda';
            prevButton.style.display = 'none';
            nextButton.style.display = 'none'; // No "Next" button here, only "Mulai Kuesioner"
            submitButton.style.display = 'none';
        } else { // Questionnaire sections
            // Status harusnya menunjukkan kategori, atau jika ingin tetap per nomor pertanyaan,
            // harus menyesuaikan agar nomor pertanyaan pertama di kategori yang ditampilkan yang muncul.
            // Untuk desain "daftar 5 pertanyaan", mungkin lebih cocok menampilkan status per kategori.
            const activeCategory = questionContainers[currentCategoryIndex - 1];
            const categoryTitle = activeCategory ? activeCategory.querySelector('.category-title').textContent : '';

            // Menampilkan status berdasarkan kategori
            questionStatus.textContent = `Kategori: ${categoryTitle}`;

            // Perhitungan progress bar tetap berdasarkan total pertanyaan keseluruhan
            const progressPercentage = (currentOverallQuestionNumber / totalQuestions) * 100;
            progressBar.style.width = `${progressPercentage}%`;

            prevButton.style.display = 'block'; // Show previous button

            // Check if it's the last category
            if (currentCategoryIndex === questionContainers.length) {
                nextButton.style.display = 'none'; // Hide "Next"
                submitButton.style.display = 'block'; // Show "Kirim Jawaban"
            } else {
                nextButton.style.display = 'block'; // Show "Next"
                submitButton.style.display = 'none'; // Hide "Kirim Jawaban"
            }
        }
    }

    // Function to display the current category (all questions within it)
    function displayCurrentSection() {
        // Sembunyikan semua kontainer pertanyaan
        questionContainers.forEach(container => {
            container.style.display = 'none';
            // Tidak perlu lagi menyembunyikan item individu di sini, karena kita akan menampilkan semua
            // container.querySelectorAll('.question-item').forEach(item => {
            //     item.style.display = 'none';
            // });
        });

        if (currentCategoryIndex === 0) { // Display Personal Info
            personalInfoSection.style.display = 'block';
            questionnaireSection.style.display = 'none';
        } else { // Display Questionnaire sections
            personalInfoSection.style.display = 'none';
            questionnaireSection.style.display = 'block';

            // Get the active category
            const activeCategory = questionContainers[currentCategoryIndex - 1];
            if (activeCategory) {
                activeCategory.style.display = 'block'; // Show the entire category container
                // Tidak perlu lagi menampilkan item pertanyaan satu per satu di sini,
                // karena kita ingin semua item di dalam kategori ini muncul.
                // Jika CSS default Anda sudah men-display question-item, ini cukup.
                // Jika tidak, pastikan CSS tidak menyembunyikan question-item secara default.
                // Misal: .question-item { display: block; }
            }
        }
        updateProgressAndStatus(); // Update status and progress after displaying
    }

    // Event listener for "Mulai Kuesioner" button
    startQuizButton.addEventListener('click', function() {
        // Correct way to trigger HTML5 form validation for inputs within personalInfoSection
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const birthdateInput = document.getElementById('birthdate');

        if (nameInput.checkValidity() && emailInput.checkValidity() && birthdateInput.checkValidity()) {
            currentCategoryIndex = 1; // Move to the first question category (Organizer)
            currentQuestionInCategoryIndex = 0; // Reset for the first question in the new category
            displayCurrentSection();
        } else {
            // If validation fails for any input, report validity to show browser's native messages
            if (!nameInput.checkValidity()) {
                nameInput.reportValidity();
            } else if (!emailInput.checkValidity()) {
                emailInput.reportValidity();
            } else if (!birthdateInput.checkValidity()) {
                birthdateInput.reportValidity();
            }
        }
    });

    // Event listener for "Selanjutnya" button
    nextButton.addEventListener('click', function() {
        // Validate ALL questions in the current displayed category before proceeding
        let allQuestionsInCurrentCategoryAnswered = true;
        const activeCategory = questionContainers[currentCategoryIndex - 1];

        if (activeCategory) {
            const questionItemsInCurrentCategory = activeCategory.querySelectorAll('.question-item');
            questionItemsInCurrentCategory.forEach(item => {
                const radioButtons = item.querySelectorAll('input[type="radio"]');
                let isItemAnswered = false;
                radioButtons.forEach(radio => {
                    if (radio.checked) {
                        isItemAnswered = true;
                    }
                });
                if (!isItemAnswered) {
                    allQuestionsInCurrentCategoryAnswered = false;
                    // Opsional: Anda bisa menandai pertanyaan yang belum dijawab di sini
                    item.style.border = '2px solid red'; // Beri highlight merah pada item yang belum dijawab
                } else {
                    item.style.border = '1px solid #e0e0e0'; // Kembalikan border normal jika sudah dijawab
                }
            });
        }

        if (!allQuestionsInCurrentCategoryAnswered) {
            alert('Silakan jawab semua pertanyaan di kategori ini sebelum melanjutkan.');
            return; // Hentikan jika ada yang belum dijawab
        }

        // Move to the next category
        currentCategoryIndex++;
        currentQuestionInCategoryIndex = 0; // Reset for the new category

        displayCurrentSection();
    });

    // Event listener for "Sebelumnya" button
    prevButton.addEventListener('click', function() {
        if (currentCategoryIndex === 1) { // If at the first category, go back to Personal Info
            currentCategoryIndex = 0;
            currentQuestionInCategoryIndex = 0; // Reset index
        } else if (currentCategoryIndex > 1) { // Go to previous category
            currentCategoryIndex--;
            currentQuestionInCategoryIndex = 0; // Reset index for the new category
        }
        displayCurrentSection();
    });

    // Initialize display on load
    displayCurrentSection();
});