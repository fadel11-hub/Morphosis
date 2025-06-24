// form.js (Versi Final yang Sudah Diperbaiki)

document.addEventListener('DOMContentLoaded', function() {
    // --- 1. Deklarasi semua elemen ---
    const personalInfoSection = document.getElementById('personalInfoSection');
    const questionnaireSection = document.getElementById('questionnaireSection');
    const introSection = document.getElementById('introSection');

    const startQuizButton = document.getElementById('startQuizButton');
    const startIntroButton = document.getElementById('startIntroButton');
    
    const questionContainers = document.querySelectorAll('.question-container');
    const progressBar = document.getElementById('progressBar');
    const questionStatus = document.getElementById('questionStatus');
    
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const submitButton = document.getElementById('submitButton');

    let currentCategoryIndex = 0; // 0: Info Pribadi/Intro, 1-5: Kategori Kuesioner
    let totalQuestions = 0;

    // Hitung total pertanyaan untuk progress bar
    questionContainers.forEach(container => {
        totalQuestions += container.querySelectorAll('.question-item').length;
    });

    // --- 2. Fungsi Utama ---

    function updateProgressAndStatus() {
        if (currentCategoryIndex === 0) { // Bagian non-kuesioner
            progressBar.style.width = '0%';
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
            submitButton.style.display = 'none';
        } else { // Bagian Kuesioner
            let questionsBeforeCurrentCategory = 0;
            for (let i = 0; i < currentCategoryIndex - 1; i++) {
                questionsBeforeCurrentCategory += questionContainers[i].querySelectorAll('.question-item').length;
            }

            const progressPercentage = (questionsBeforeCurrentCategory / totalQuestions) * 100;
            progressBar.style.width = `${progressPercentage}%`;

            // Tampilkan tombol "Sebelumnya"
            prevButton.style.display = 'block';

            // Cek apakah ini kategori terakhir untuk menampilkan tombol Kirim
            if (currentCategoryIndex === questionContainers.length) {
                nextButton.style.display = 'none';
                submitButton.style.display = 'block';
            } else {
                nextButton.style.display = 'block';
                submitButton.style.display = 'none';
            }
        }
    }

    function displayCurrentSection() {
        // Sembunyikan semua bagian utama terlebih dahulu
        personalInfoSection.style.display = 'none';
        introSection.style.display = 'none';
        questionnaireSection.style.display = 'none';
        questionContainers.forEach(container => container.style.display = 'none');

        if (currentCategoryIndex === 0) {
            // Ini ditangani oleh event listener tombol, tapi sebagai fallback
            personalInfoSection.style.display = 'block';
        } else {
            // Tampilkan bagian kuesioner dan kategori yang aktif
            questionnaireSection.style.display = 'block';
            const activeCategory = questionContainers[currentCategoryIndex - 1];
            if (activeCategory) {
                activeCategory.style.display = 'block';
            }
        }
        updateProgressAndStatus();
    }

    // --- 3. Event Listeners ---

    startQuizButton.addEventListener('click', function () {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const birthdateInput = document.getElementById('birthdate');

        if (nameInput.checkValidity() && emailInput.checkValidity() && birthdateInput.checkValidity()) {
            personalInfoSection.style.display = 'none';
            introSection.style.display = 'block';
            updateProgressAndStatus();
        } else {
            // Trigger validasi browser bawaan
            if (!nameInput.checkValidity()) nameInput.reportValidity();
            else if (!emailInput.checkValidity()) emailInput.reportValidity();
            else if (!birthdateInput.checkValidity()) birthdateInput.reportValidity();
        }
    });

    startIntroButton.addEventListener('click', function () {
        introSection.style.display = 'none';
        currentCategoryIndex = 1; // Mulai dari kategori pertama
        displayCurrentSection();
    });

    nextButton.addEventListener('click', function() {
        let allQuestionsAnswered = true;
        const activeCategory = questionContainers[currentCategoryIndex - 1];

        if (activeCategory) {
            const questionItems = activeCategory.querySelectorAll('.question-item');
            questionItems.forEach(item => {
                const radios = item.querySelectorAll('input[type="radio"]');
                const isAnswered = Array.from(radios).some(radio => radio.checked);
                
                if (!isAnswered) {
                    allQuestionsAnswered = false;
                    item.style.border = '2px solid red'; // Beri tanda
                } else {
                    item.style.border = '1px solid #e0e0e0'; // Kembalikan normal
                }
            });
        }

        if (!allQuestionsAnswered) {
            alert('Silakan jawab semua pertanyaan di kategori ini sebelum melanjutkan.');
            return;
        }

        // Pindah ke kategori berikutnya jika valid dan belum selesai
        if (currentCategoryIndex < questionContainers.length) {
            currentCategoryIndex++;
            displayCurrentSection();
        }
    });

    prevButton.addEventListener('click', function() {
        if (currentCategoryIndex > 1) {
            // Kembali ke kategori sebelumnya
            currentCategoryIndex--;
            displayCurrentSection();
        } else if (currentCategoryIndex === 1) {
            // Jika di kategori pertama, kembali ke halaman intro
            currentCategoryIndex = 0;
            questionnaireSection.style.display = 'none';
            introSection.style.display = 'block';
            updateProgressAndStatus();
        }
    });

    // Inisialisasi tampilan awal saat halaman dimuat
    personalInfoSection.style.display = 'block';
    questionnaireSection.style.display = 'none';
    introSection.style.display = 'none';
    updateProgressAndStatus();
});